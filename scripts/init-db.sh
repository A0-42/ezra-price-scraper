#!/bin/bash
# Initialize SQLite database for Ezra Price Scraper

DB_PATH="./data/prices.db"
SCHEMA_FILE="./database/schema.sql"

echo "🗄️ Initializing database..."

# Create data directory if it doesn't exist
mkdir -p "$(dirname "$DB_PATH")"

# Load schema into database
sqlite3 "$DB_PATH" < "$SCHEMA_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Database initialized successfully: $DB_PATH"
else
    echo "❌ Failed to initialize database"
    exit 1
fi
