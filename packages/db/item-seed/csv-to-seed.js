#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function parseCSV(content) {
    const lines = content.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, idx) => {
            row[header] = values[idx] || '';
        });
        rows.push(row);
    }
    
    return { headers, rows };
}

function cleanValue(val) {
    if (!val || val.trim() === '') return null;
    const cleaned = val.trim().replace('%', '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
}

function escapeSql(text) {
    if (!text) return '';
    return text.replace(/'/g, "''");
}

function generateSeedSQL(csvFile, outputFile, defaultRarity = 'rarity1') {
    const content = fs.readFileSync(csvFile, 'utf-8');
    const { headers, rows } = parseCSV(content);
    
    // Extract attribute columns
    const exclude = new Set(['Item Type', 'Component Name', 'Notes']);
    const attributeColumns = headers.filter(h => !exclude.has(h));
    
    // Collect data
    const items = [];
    const itemTypesSet = new Set();
    
    rows.forEach(row => {
        const itemType = row['Item Type']?.trim();
        const itemName = row['Component Name']?.trim();
        const notes = row['Notes']?.trim() || '';
        
        if (!itemType || !itemName) return;
        
        itemTypesSet.add(itemType);
        
        const attributes = {};
        attributeColumns.forEach(attr => {
            const val = cleanValue(row[attr]);
            if (val !== null) attributes[attr] = val;
        });
        
        items.push({ type: itemType, name: itemName, description: notes, attributes });
    });
    
    // Generate SQL
    let sql = `-- # AUTO-GENERATED SEED FILE\n`;
    sql += `-- Generated from: ${csvFile}\n\n`;
    
    // 1. Item Types
    sql += `-- ####################\n`;
    sql += `-- # ITEM TYPES\n`;
    sql += `-- ####################\n\n`;
    
    const sortedTypes = Array.from(itemTypesSet).sort();
    const typeToCode = {};
    sortedTypes.forEach((itemType, idx) => {
        const code = `type${idx + 1}`;
        typeToCode[itemType] = code;
        sql += `INSERT INTO item_types (type_code, type_display_name, type_description)\n`;
        sql += `VALUES ('${code}', '${escapeSql(itemType)}', '${escapeSql(itemType)} equipment slot');\n\n`;
    });
    
    // 2. Item Attributes
    sql += `-- ####################\n`;
    sql += `-- # ITEM ATTRIBUTES\n`;
    sql += `-- ####################\n\n`;
    
    const attrToCode = {};
    attributeColumns.forEach((attr, idx) => {
        const code = `attribute${idx + 1}`;
        attrToCode[attr] = code;
        sql += `INSERT INTO item_attributes (attribute_code, attribute_display_name, attribute_description)\n`;
        sql += `VALUES ('${code}', '${escapeSql(attr)}', '${escapeSql(attr)} stat');\n\n`;
    });
    
    // 3. Default Rarity
    sql += `-- ####################\n`;
    sql += `-- # ITEM RARITY (default)\n`;
    sql += `-- ####################\n\n`;
    sql += `INSERT INTO item_rarity (rarity_code, rarity_display_name, rarity_stat_multiplier_percentage, rarity_drop_chance)\n`;
    sql += `VALUES ('rarity1', 'Common', 100, 100)\n`;
    sql += `ON CONFLICT (rarity_code) DO NOTHING;\n\n`;
    
    // 4. Items
    sql += `-- ####################\n`;
    sql += `-- # ITEMS\n`;
    sql += `-- ####################\n\n`;
    
    items.forEach(item => {
        const typeCode = typeToCode[item.type];
        const desc = escapeSql(item.description);
        
        sql += `-- ${item.name}\n`;
        sql += `INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)\n`;
        sql += `VALUES (\n`;
        sql += `    '${escapeSql(item.name)}',\n`;
        sql += `    '${desc}',\n`;
        sql += `    (SELECT id FROM item_types WHERE type_code = '${typeCode}'),\n`;
        sql += `    (SELECT id FROM item_rarity WHERE rarity_code = '${defaultRarity}')\n`;
        sql += `);\n\n`;
    });
    
    // 5. Item Attribute Values
    sql += `-- ####################\n`;
    sql += `-- # ITEM ATTRIBUTE VALUES\n`;
    sql += `-- ####################\n\n`;
    
    items.forEach(item => {
        if (Object.keys(item.attributes).length === 0) return;
        
        sql += `-- ${item.name} attributes\n`;
        Object.entries(item.attributes).forEach(([attrName, attrValue]) => {
            const attrCode = attrToCode[attrName];
            sql += `INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)\n`;
            sql += `VALUES (\n`;
            sql += `    (SELECT id FROM item_list WHERE item_name = '${escapeSql(item.name)}' LIMIT 1),\n`;
            sql += `    (SELECT id FROM item_attributes WHERE attribute_code = '${attrCode}'),\n`;
            sql += `    ${attrValue}\n`;
            sql += `);\n`;
        });
        sql += `\n`;
    });
    
    fs.writeFileSync(outputFile, sql);
    
    console.log(`✅ Generated seed file: ${outputFile}`);
    console.log(`   - ${itemTypesSet.size} item types`);
    console.log(`   - ${attributeColumns.length} attributes`);
    console.log(`   - ${items.length} items`);
}

// CLI
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.log('Usage: node csv-to-seed.js <input.csv> [output.sql]');
        process.exit(1);
    }
    
    const inputCsv = args[0];
    const outputSql = args[1] || 'item-seed.sql';
    
    generateSeedSQL(inputCsv, outputSql);
}

module.exports = { generateSeedSQL };