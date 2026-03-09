-- Ezra Price Scraper - SQLite Database Schema
-- Tables: hotels, prices, work_sessions

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    location TEXT,
    checkin TEXT,
    checkout TEXT,
    last_scraped_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Prices table
CREATE TABLE IF NOT EXISTS prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hotel_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    source TEXT NOT NULL, -- 'agoda' | 'booking' | 'ctrip' | 'expedia'
    price REAL NOT NULL,
    currency TEXT DEFAULT 'EUR',
    scraped_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

-- Work sessions table (for clock-in/out tracking)
CREATE TABLE IF NOT EXISTS work_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hotel_id INTEGER NOT NULL,
    clock_in TEXT NOT NULL,
    clock_out TEXT,
    duration INTEGER, -- duration in minutes
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_prices_hotel_id ON prices(hotel_id);
CREATE INDEX IF NOT EXISTS idx_prices_scraped_at ON prices(scraped_at);
CREATE INDEX IF NOT EXISTS idx_prices_source ON prices(source);
CREATE INDEX IF NOT EXISTS idx_work_sessions_hotel_id ON work_sessions(hotel_id);

-- Seed data for Arzo Makati
INSERT OR IGNORE INTO hotels (name, location, checkin, checkout)
VALUES ('Arzo Makati', 'Makati, Manila, Philippines', NULL, NULL);
