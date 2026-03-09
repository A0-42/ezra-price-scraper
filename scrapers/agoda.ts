// Agoda Scraper for Arzo Makati Hotel
// Scrapes page HTML for LLM analysis (no price extraction here)

import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface ScrapeResult {
  success: boolean;
  hotel: string;
  source: 'agoda';
  checkIn: string;
  checkOut: string;
  scrapedAt: string;
  htmlPath?: string;
  error?: string;
}

export interface AgodaConfig {
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  adults?: number;
  children?: number;
  rooms?: number;
  currency?: string;
}

const BASE_URL = 'https://www.agoda.com/oyo-737-arzo-hotel-makati/hotel/manila-ph.html';

export async function scrapeAgoda(config: AgodaConfig): Promise<ScrapeResult> {
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

  const url = `${BASE_URL}?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}&rooms=${rooms}&currencyCode=${currency}`;

  console.log(`🔍 Scraping Agoda for Arzo Makati: ${checkIn} → ${checkOut}`);

  try {
    // Navigate to Agoda
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for page to fully load
    await page.waitForTimeout(5000);

    // Wait for calendar prices to load dynamically
    console.log('⏳ Waiting for calendar prices to load...');
    await page.waitForTimeout(10000);

    // Try to scroll to calendar to trigger lazy loading
    try {
      await page.evaluate(() => {
        window.scrollBy(0, 500);
      });
      await page.waitForTimeout(3000);
    } catch (e) {
      console.log('⚠️ Scroll failed, continuing...');
    }

    // Final wait for prices
    await page.waitForTimeout(5000);

    // Get HTML content
    const htmlContent = await page.content();

    // Save HTML to storage
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const storageDir = 'storage/agoda';

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
      source: 'agoda',
      checkIn,
      checkOut,
      scrapedAt: new Date().toISOString(),
      htmlPath
    };

    console.log(`✅ Agoda scrape successful`);
    await browser.close();
    return result;

  } catch (error) {
    console.error(`❌ Agoda scrape failed: ${error}`);

    const result: ScrapeResult = {
      success: false,
      hotel: 'Arzo Makati',
      source: 'agoda',
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
    console.log('Usage: node scrapers/agoda.ts <checkIn> <checkOut> [adults] [children] [rooms]');
    console.log('Example: node scrapers/agoda.ts 2026-03-18 2026-03-19 1 0 1');
    process.exit(1);
  }

  const config: AgodaConfig = {
    checkIn: args[0],
    checkOut: args[1],
    adults: args[2] ? parseInt(args[2]) : 1,
    children: args[3] ? parseInt(args[3]) : 0,
    rooms: args[4] ? parseInt(args[4]) : 1
  };

  scrapeAgoda(config)
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
