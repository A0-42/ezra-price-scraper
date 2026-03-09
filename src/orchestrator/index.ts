// Main entry point for Ezra Price Scraper orchestrator

/**
 * Main entry point - Orchestrates all components
 * Handles initialization, scheduling, and error recovery
 */

// Environment
const SITE_A = "https://agoda.com";
const SITE_B = "https://booking.com";
const SITE_C = "https://www.ctrip.com";
const SITE_E = "https://www.expedia.com";

// Import database and scrapers
import { db } from './database/db.js';
import { agodaScraper } from './scrapers/agoda.js';
import { bookingScraper } from './scrapers/booking.js';
import { ctripScraper } from './scrapers/ctrip.js';
import { expediaScraper } from './scrapers/expedia.js';

// Import telegram and clock-in
import { telegramBot } from './telegram/bot.js';
import { clockinManager } from './clockin/clockin.js';

// Configuration
const CRON_SCHEDULE = "0 * * * *"; // Every hour
const DB_PATH = "./data/prices.db";

/**
 * Main orchestrator entry point
 */
export async function main() {
  console.log("🚀 Starting Ezra Price Scraper Orchestrator...");
  
  try {
    // Step 1: Initialize database
    await db.initialize(DB_PATH);
    console.log("✅ Database initialized:", DB_PATH);

    // Step 2: Start Telegram bot
    await telegramBot.start();
    console.log("✅ Telegram bot started");

    // Step 3: Start scrapers
    const scrapers = [
      agodaScraper,
      bookingScraper,
      ctripScraper,
      expediaScraper
    ];

    for (const scraper of scrapers) {
      await scraper.initialize();
      console.log(`✅ ${scraper.name} initialized`);
    }

    // Step 4: Schedule hourly scraping
    setInterval(async () => {
      console.log("⏰ Starting scheduled scraping...");
      
      for (const scraper of scrapers) {
        try {
          await scraper.scrape();
          console.log(`✅ ${scraper.name} scraped successfully`);
        } catch (error) {
          console.error(`❌ ${scraper.name} failed:`, error.message);
          
          // Send error to Telegram
          await telegramBot.sendError(`❌ Scraping failed for ${scraper.name}`, error);
        }
      }

      // Clock-in check (optional for work hours)
      // await clockinManager.checkWorkHours();

    }, 60 * 60 * 1000); // Every hour

    console.log("🎯 Orchestrator running successfully!");
    console.log("⏰ Scraping scheduled: every hour");
    console.log("💾 Database path:", DB_PATH);
    
  } catch (error) {
    console.error("🚨 Orchestrator failed to start:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}