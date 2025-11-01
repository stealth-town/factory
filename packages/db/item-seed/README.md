# Item Seed Generator

Converts CSV item data into SQL seed migration file.

## Quick usage guide

```sh
python3 csv_to_seed.py items.csv item-seed.sql

# or

./generate-seed.sh items.csv

# or

node csv-to-seed.js items.csv

# or 

./csv-to-seed.js items.csv item-seed.sql

```

## Setup

1. Ensure Python 3 is installed:
```bash
python3 --version
```

2. Make script executable:
```bash
chmod +x csv_to_seed.py
```

## CSV Format

Your CSV must have this structure:

| Item Type | Component Name | Attribute1 | Attribute2 | ... | Notes |
|-----------|---------------|------------|------------|-----|-------|
| Interface | Item Name | 10 | 5% | ... | Description |

**Required columns:**
- `Item Type` - Equipment category (Interface, Module, etc.)
- `Component Name` - Item name
- `Notes` - Item description (optional)

**Attribute columns:**
- All other columns become item attributes
- Empty values are skipped
- Percentage signs (%) are stripped automatically

## Usage

### Basic usage:
```bash
python3 csv_to_seed.py items.csv
```

This generates `item-seed.sql` in the current directory.

### Custom output file:
```bash
python3 csv_to_seed.py items.csv output/my-seed.sql
```

## Example

Given `items.csv`:
```csv
Item Type,Component Name,Power Output (MW),Cycle Rate (Hz),Notes
Interface,Control Node,12,0.05,Basic interface
Module,Sync Relay,5,0.07,Regulation module
```

Run:
```bash
python3 csv_to_seed.py items.csv
```

Generates `item-seed.sql` with:
- 2 item types (Interface, Module)
- 2 attributes (Power Output, Cycle Rate)
- 2 items with their attribute values
- 1 default rarity (Common)

## Running the Seed

After generating, run the seed file:
```bash
# PostgreSQL
psql -U your_user -d your_database -f item-seed.sql

# or via migration tool
npm run migrate:seed
```

## Notes

- Script uses `rarity1` (Common, 100% multiplier) by default
- Add more rarities manually to `item_rarity` table before seeding if needed
- Item types are mapped to `type1`, `type2`, etc.
- Attributes are mapped to `attribute1`, `attribute2`, etc.
- Duplicate item names will cause conflicts - ensure uniqueness

## Troubleshooting

**"No such file"**: Check CSV file path
```bash
ls -l items.csv
```

**SQL errors**: Ensure tables exist before running seed:
```bash
# Run migrations first
npm run migrate:up
```

**Encoding issues**: Save CSV as UTF-8