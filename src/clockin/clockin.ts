// Clock-in Manager
// Simple clock-in/out system for Ezra's work sessions

export interface ClockInEvent {
  type: 'clock-in' | 'clock-out';
  timestamp: Date;
  hotel: string;
}

export class ClockinManager {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async clockIn(event: ClockInEvent): Promise<void> {
    await this.db.insert({
      table: 'work_sessions',
      data: {
        hotel: event.hotel,
        clock_in: event.timestamp.toISOString(),
        clock_out: null,
        duration: null,
        created_at: new Date().toISOString()
      }
    });

    console.log(`✅ Clock-in registered for ${event.hotel}`);
  }

  async clockOut(event: ClockInEvent): Promise<void> {
    // Get latest clock-in for this hotel
    const lastSession = await this.db.query<{ clock_in: string }>(`
      SELECT * FROM work_sessions
      WHERE hotel = ? AND clock_out IS NULL
      ORDER BY created_at DESC
      LIMIT 1
    `, [event.hotel]);

    if (!lastSession) {
      console.error(`❌ No active session found for ${event.hotel}`);
      return;
    }

    const duration = Math.floor((Date.now() - new Date(lastSession.clock_in).getTime()) / 1000 / 60); // in minutes

    await this.db.insert({
      table: 'work_sessions',
      data: {
        hotel: event.hotel,
        clock_in: lastSession.clock_in,
        clock_out: event.timestamp.toISOString(),
        duration,
        created_at: new Date().toISOString()
      }
    });

    // Update previous session with duration
    await this.db.run(`
      UPDATE work_sessions
      SET duration = ?
      WHERE hotel = ? AND clock_out IS NULL
      ORDER BY created_at DESC
      LIMIT 1
    `, [duration, event.hotel, lastSession.id]);

    console.log(`✅ Clock-out registered for ${event.hotel} (${duration} min)`);
  }

  async getWorkStatus(hotel: string): Promise<{ working: boolean, currentSession?: ClockInEvent }> {
    // Check if there's an active session (clocked in but not out)
    const activeSession = await this.db.query<{ clock_in: string; clock_out: string | null }>(`
      SELECT * FROM work_sessions
      WHERE hotel = ? AND clock_out IS NULL
      ORDER BY created_at DESC
      LIMIT 1
    `, [hotel]);

    if (!activeSession) {
      return { working: false };
    }

    const lastActivity = new Date(activeSession.clock_in);
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    return {
      working: lastActivity > thirtyMinutesAgo,
      currentSession: activeSession
    };
  }
}

export const clockinManager = new ClockinManager(db);