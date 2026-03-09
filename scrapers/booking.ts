// Booking Scraper for Arzo Makati Hotel
// Scrapes page HTML for LLM analysis (no price extraction here)

import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface ScrapeResult {
  success: boolean;
  hotel: string;
  source: 'booking';
  checkIn: string;
  checkOut: string;
  scrapedAt: string;
  htmlPath?: string;
  error?: string;
}

export interface BookingConfig {
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  adults?: number;
  children?: number;
  rooms?: number;
  currency?: string;
}

const BASE_URL = 'https://www.booking.com/searchresults.html';

export async function scrapeBooking(config: BookingConfig): Promise<ScrapeResult> {
  const {
    checkIn,
    checkOut,
    adults = 1,
    children = 0,
    rooms = 1,
    currency = 'EUR'
  } = config;

  const browser: Browser = await chromium.launch({ headless: true });
  const page: Page = await browser.newPage();

  const url = `${BASE_URL}?ss=Arzo+Makati+Hotel+Manila&checkin=${checkIn}&checkout=${checkOut}&group_adults=${adults}&group_children=${children}&no_rooms=${rooms}&selected_currency=${currency}`;

  console.log(`🔍 Scraping Booking for Arzo Makati: ${checkIn} → ${checkOut}`);

  try {
    // Navigate to Booking
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for page to fully load
    await page.waitForTimeout(5000);

    // Get HTML content
    const htmlContent = await page.content();

    // Save HTML to storage
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const storageDir = 'storage/booking';

    mkdirSync(storageDir, { recursive: true });

    const filename = `arzo-makati-${timestamp}.html`;
    const htmlPath = join(storageDir, filename);

    writeFileSync(htmlPath, htmlContent, 'utf-8');
    console.log(`💾 Saved HTML to: ${htmlPath}`);

    // Take screenshot for debugging
    const screenshotPath = join(storageDir, `arzo-makati-${timestamp}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`📸 Saved screenshot to: ${screenshotPath}`);

    const result: ScrapeResult = {
      success: true,
      hotel: 'Arzo Makati',
      source: 'booking',
      checkIn,
      checkOut,
      scrapedAt: new Date().toISOString(),
      htmlPath
    };

    console.log(`✅ Booking scrape successful`);
    await browser.close();
    return result;

  } catch (error) {
    console.error(`❌ Booking scrape failed: ${error}`);

    const result: ScrapeResult = {
      success: false,
      hotel: 'Arzo Makati',
      source: 'booking',
      checkIn,
      checkOut,
      scrapedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    await browser.close();
    return result;
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node scrapers/booking.ts <checkIn> <checkOut> [adults] [children] [rooms]');
    console.log('Example: node scrapers/booking.ts 2026-03-18 2026-03-19 1 0 1');
    process.exit(1);
  }

  const config: BookingConfig = {
    checkIn: args[0],
    checkOut: args[1],
    adults: args[2] ? parseInt(args[2]) : 1,
    children: args[3] ? parseInt(args[3]) : 0,
    rooms: args[4] ? parseInt(args[4]) : 1
  };

  scrapeBooking(config)
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
