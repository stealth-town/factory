#!/bin/bash

# Quick seed generator wrapper

CSV_FILE="${1:-items.csv}"
OUTPUT_FILE="${2:-item-seed.sql}"

if [ ! -f "$CSV_FILE" ]; then
    echo "Error: CSV file '$CSV_FILE' not found"
    echo "Usage: ./generate-seed.sh <input.csv> [output.sql]"
    exit 1
fi

echo "Generating seed from $CSV_FILE..."
python3 csv_to_seed.py "$CSV_FILE" "$OUTPUT_FILE"

if [ $? -eq 0 ]; then
    echo "Success! Run with:"
fi