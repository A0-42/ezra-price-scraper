// Database schema and connection

import Database from 'better-sqlite3';

export const DB_PATH = "./data/prices.db";

export interface HotelPrice {
  id?: number;
  hotel: string;
  date: string;
  source: string; // 'agoda' | 'booking' | 'ctrip' | 'expedia'
  price: number;
  scrapedAt: string;
}

export interface WorkSession {
  id?: number;
  hotel: string;
  clockIn: string;
  clockOut: string | null;
  duration: number | null; // in minutes
}

export interface ClockInRequest {
  hotel: string;
}

export class PriceDatabase {
  private db: Database;

  async initialize(dbPath: string): Promise<void> {
    this.db = new Database(dbPath);
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS hotels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        location TEXT
        checkin TEXT,
        checkout TEXT
        last_scraped_at TEXT
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hotel_id INTEGER,
        date TEXT,
        source TEXT,
        price REAL,
        scraped_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS work_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hotel_id INTEGER,
        clock_in TEXT,
        clock_out TEXT,
        duration INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
      );
    `);
    
    console.log("✅ Database initialized:", dbPath);
  }

  async getHotelId(hotelName: string): Promise<number> {
    const rows = await this.db.query<HotelPrice[]>(`
      SELECT id FROM hotels WHERE name = ? LIMIT 1
    `, [hotelName]);
    
    if (rows.length === 0) {
      const result = await this.db.insert<HotelPrice>({
        table: 'hotels',
        data: { name: hotelName }
      });
      return result;
    }
    
    return rows[0].id;
  }

  async savePrice(hotelId: number, price: number, source: string): Promise<void> {
    await this.db.insert({
      table: 'prices',
      data: {
        hotel_id,
        date: new Date().toISOString().split('T')[0],
        source,
        price,
        scraped_at: new Date().toISOString()
      }
    });
    
    // Update last scraped timestamp
    await this.db.run(`
      UPDATE hotels
      SET last_scraped_at = ?
      WHERE id = ?
    `, [new Date().toISOString(), hotelId]);
  }

  async saveWorkSession(hotelId: number, clockIn: string, clockOut: string | null, duration: number | null): Promise<number> {
    const result = await this.db.insert<WorkSession>({
      table: 'work_sessions',
      data: {
        hotel_id,
        clock_in,
        clock_out,
        duration,
        created_at: new Date().toISOString()
      }
    });
    
    return result;
  }

  async getLatestPrices(hotelId: number, limit: number = 50): Promise<HotelPrice[]> {
    return this.db.query<HotelPrice[]>(`
      SELECT * FROM prices
      WHERE hotel_id = ?
      ORDER BY scraped_at DESC
      LIMIT ?
    `, [hotelId, limit]);
  }

  async getWorkSessions(hotelId: number, limit: number = 50): Promise<WorkSession[]> {
    return this.db.query<WorkSession[]>(`
      SELECT * FROM work_sessions
      WHERE hotel_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `, [hotelId, limit]);
  }

  async close(): Promise<void> {
    await this.db.close();
  }
}

export const db = new PriceDatabase();