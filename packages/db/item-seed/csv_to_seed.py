#!/usr/bin/env python3
import csv
import sys
from collections import OrderedDict

def clean_value(val):
    """Clean and convert attribute values"""
    if not val or val.strip() == '':
        return None
    val = val.strip().replace('%', '')
    try:
        return float(val)
    except:
        return None

def escape_sql(text):
    """Escape single quotes for SQL"""
    if not text:
        return ''
    return text.replace("'", "''")

def generate_seed_sql(csv_file, output_file, default_rarity='rarity1'):
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        
        # Extract attribute columns (exclude Item Type, Component Name, Notes)
        exclude = {'Item Type', 'Component Name', 'Notes'}
        attribute_columns = [h for h in headers if h not in exclude]
        
        # Collect data
        items = []
        item_types_set = set()
        
        for row in reader:
            item_type = row['Item Type'].strip()
            item_name = row['Component Name'].strip()
            notes = row.get('Notes', '').strip()
            
            if not item_type or not item_name:
                continue
                
            item_types_set.add(item_type)
            
            # Collect attribute values
            attributes = {}
            for attr_col in attribute_columns:
                val = clean_value(row.get(attr_col, ''))
                if val is not None:
                    attributes[attr_col] = val
            
            items.append({
                'type': item_type,
                'name': item_name,
                'description': notes,
                'attributes': attributes
            })
        
        # Generate SQL
        with open(output_file, 'w', encoding='utf-8') as out:
            out.write("-- # AUTO-GENERATED SEED FILE\n")
            out.write("-- Generated from: {}\n\n".format(csv_file))
            
            # 1. Insert item types
            out.write("-- ####################\n")
            out.write("-- # ITEM TYPES\n")
            out.write("-- ####################\n\n")
            
            for idx, item_type in enumerate(sorted(item_types_set), start=1):
                out.write(f"INSERT INTO item_types (type_code, type_display_name, type_description)\n")
                out.write(f"VALUES ('type{idx}', '{escape_sql(item_type)}', '{escape_sql(item_type)} equipment slot');\n\n")
            
            # 2. Insert item attributes
            out.write("-- ####################\n")
            out.write("-- # ITEM ATTRIBUTES\n")
            out.write("-- ####################\n\n")
            
            for idx, attr_name in enumerate(attribute_columns, start=1):
                out.write(f"INSERT INTO item_attributes (attribute_code, attribute_display_name, attribute_description)\n")
                out.write(f"VALUES ('attribute{idx}', '{escape_sql(attr_name)}', '{escape_sql(attr_name)} stat');\n\n")
            
            # 3. Insert default rarity if needed
            out.write("-- ####################\n")
            out.write("-- # ITEM RARITY (default)\n")
            out.write("-- ####################\n\n")
            out.write("INSERT INTO item_rarity (rarity_code, rarity_display_name, rarity_stat_multiplier_percentage, rarity_drop_chance)\n")
            out.write("VALUES ('rarity1', 'Common', 100, 100)\n")
            out.write("ON CONFLICT (rarity_code) DO NOTHING;\n\n")
            
            # 4. Insert items
            out.write("-- ####################\n")
            out.write("-- # ITEMS\n")
            out.write("-- ####################\n\n")
            
            type_to_code = {t: f"type{i+1}" for i, t in enumerate(sorted(item_types_set))}
            
            for item in items:
                type_code = type_to_code[item['type']]
                desc = escape_sql(item['description']) if item['description'] else ''
                
                out.write(f"-- {item['name']}\n")
                out.write(f"INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)\n")
                out.write(f"VALUES (\n")
                out.write(f"    '{escape_sql(item['name'])}',\n")
                out.write(f"    '{desc}',\n")
                out.write(f"    (SELECT id FROM item_types WHERE type_code = '{type_code}'),\n")
                out.write(f"    (SELECT id FROM item_rarity WHERE rarity_code = '{default_rarity}')\n")
                out.write(f");\n\n")
            
            # 5. Insert item attribute values
            out.write("-- ####################\n")
            out.write("-- # ITEM ATTRIBUTE VALUES\n")
            out.write("-- ####################\n\n")
            
            attr_to_code = {attr: f"attribute{i+1}" for i, attr in enumerate(attribute_columns)}
            
            for item in items:
                if not item['attributes']:
                    continue
                    
                out.write(f"-- {item['name']} attributes\n")
                for attr_name, attr_value in item['attributes'].items():
                    attr_code = attr_to_code[attr_name]
                    out.write(f"INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)\n")
                    out.write(f"VALUES (\n")
                    out.write(f"    (SELECT id FROM item_list WHERE item_name = '{escape_sql(item['name'])}' LIMIT 1),\n")
                    out.write(f"    (SELECT id FROM item_attributes WHERE attribute_code = '{attr_code}'),\n")
                    out.write(f"    {attr_value}\n")
                    out.write(f");\n")
                out.write("\n")
        
        print(f"✅ Generated seed file: {output_file}")
        print(f"   - {len(item_types_set)} item types")
        print(f"   - {len(attribute_columns)} attributes")
        print(f"   - {len(items)} items")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 csv_to_seed.py <input.csv> [output.sql]")
        sys.exit(1)
    
    input_csv = sys.argv[1]
    output_sql = sys.argv[2] if len(sys.argv) > 2 else 'item-seed.sql'
    
    generate_seed_sql(input_csv, output_sql)