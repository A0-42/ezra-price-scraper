// Agoda Scraper for Arzo Makati Hotel
// Scrapes price from Agoda for a given date range

import { chromium } from 'playwright';
import type { Browser, Page, BrowserContext } from 'playwright';

export interface ScrapeResult {
  success: boolean;
  hotel: string;
  source: 'agoda';
  price: number | null;
  currency: string;
  checkIn: string;
  checkOut: string;
  scrapedAt: string;
  error?: string;
  savedPath?: string;
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
  const context: BrowserContext = await browser.newContext();
  const page: Page = await context.newPage();

  const url = `${BASE_URL}?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}&rooms=${rooms}&currencyCode=${currency}`;

  console.log(`🔍 Scraping Agoda for Arzo Makati: ${checkIn} → ${checkOut}`);

  try {
    // Navigate to Agoda
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for price to load
    await page.waitForTimeout(5000);

    // Save HTML for reference
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const htmlContent = await page.content();
    const savedPath = `storage/agoda/arzo-makati-${timestamp}.html`;
    await page.screenshot({ path: `storage/agoda/arzo-makati-${timestamp}.png`, fullPage: false });

    // Multiple selectors to try for price extraction
    const priceSelectors = [
      '.FinalPriceValue', // Main price
      '.price-block', // Price block
      '[data-selenium="display-price"]', // Selenium attribute
      '.PriceValue', // Alternative price class
      '.MasterPrice', // Master price
    ];

    let price: number | null = null;
    let priceText: string | null = null;

    for (const selector of priceSelectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          priceText = await element.textContent();
          console.log(`📊 Found price element with selector: ${selector}`);
          console.log(`   Raw text: ${priceText}`);
          break;
        }
      } catch (e) {
        continue;
      }
    }

    // If no specific selector found, try to extract from page text
    if (!priceText) {
      console.log('⚠️ No price element found, trying to extract from page...');
      // Try to find price pattern in page content
      const priceMatch = htmlContent.match(/€[\s\d,]+/g) || htmlContent.match(/[₱$]\s*[\d,]+/g);
      if (priceMatch && priceMatch.length > 0) {
        priceText = priceMatch[0];
        console.log(`📊 Found price in page text: ${priceText}`);
      }
    }

    // Parse price
    if (priceText) {
      // Remove currency symbols and commas, extract numbers
      const cleanPrice = priceText.replace(/[€₱$,\s]/g, '');
      const parsedPrice = parseFloat(cleanPrice);

      if (!isNaN(parsedPrice)) {
        price = parsedPrice;
      } else {
        console.error(`❌ Failed to parse price: ${priceText}`);
      }
    }

    if (price === null) {
      throw new Error('Could not extract price from page');
    }

    const result: ScrapeResult = {
      success: true,
      hotel: 'Arzo Makati',
      source: 'agoda',
      price,
      currency,
      checkIn,
      checkOut,
      scrapedAt: new Date().toISOString(),
      savedPath
    };

    console.log(`✅ Agoda scrape successful: €${price}`);
    await browser.close();
    return result;

  } catch (error) {
    console.error(`❌ Agoda scrape failed: ${error}`);

    // Save screenshot even on failure for debugging
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await page.screenshot({ path: `storage/agoda/arzo-makati-error-${timestamp}.png`, fullPage: true });
      console.log(`📸 Error screenshot saved`);
    } catch (screenshotError) {
      console.error(`Could not save error screenshot: ${screenshotError}`);
    }

    const result: ScrapeResult = {
      success: false,
      hotel: 'Arzo Makati',
      source: 'agoda',
      price: null,
      currency,
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
    console.log('Usage: bun run scrapers/agoda.ts <checkIn> <checkOut> [adults] [children] [rooms]');
    console.log('Example: bun run scrapers/agoda.ts 2026-03-18 2026-03-19 1 0 1');
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
