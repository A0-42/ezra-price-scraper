// Booking Scraper
// Playwright-based scraper for Booking.com hotel prices

export class BookingScraper {
  private browser: Browser | null;
  private siteUrl: string;

  constructor(browser: Browser, siteUrl: string) {
    this.browser = browser;
    this.siteUrl = siteUrl;
  }

  async scrape(hotelName: string, checkin: string, checkout: string): Promise<any> {
    try {
      const page = await this.browser.newPage();
      
      // Navigate to Booking.com hotel
      await page.goto(`${this.siteUrl}/search?q=${encodeURIComponent(hotelName)}`);
      
      // Wait for results
      await page.waitForSelector('.hotel-header', { timeout: 5000 });
      
      // Extract price
      const price = await page.$eval('.hotel-header .price-value', (el: any) => el.textContent);
      
      // Save to database via API (placeholder)
      return {
        hotel: hotelName,
        price: price,
        checkin: checkin,
        checkout: checkout,
        scrapedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`❌ Booking scraping failed for ${hotelName}:`, error.message);
      throw error;
    }
  }

  async initialize(): Promise<void> {
    // Initialize Playwright browser if not already initialized
    if (!this.browser) {
      // Placeholder - will be initialized in orchestrator
      console.log("BookingScraper: Browser placeholder initialized");
    }
  }

  async finalize(): Promise<void> {
    // Cleanup
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}