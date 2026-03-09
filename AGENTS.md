# AGENTS.md - Ezra Price Scraper

## Context

This is the Ezra Price Scraper system - automated hotel price monitoring for Arzo Makati hotel in Manila, Philippines.

## Architecture

**PicoClaw Orchestrator + Playwright Scrapers + SQLite + Telegram**

### Components

1. **PicoClaw**: Central AI orchestrator that:
   - Runs hourly cron jobs
   - Launches Playwright scrapers via `exec` tool
   - Analyzes extracted data with LLM
   - Manages Telegram bot communications
   - Stores data to SQLite database

2. **Playwright Scrapers**: TypeScript scripts (`scrapers/`):
   - `agoda.ts`: Scrape Agoda prices
   - `booking.ts`: Scrape Booking.com prices (TODO)
   - `ctrip.ts`: Scrape C-Trip prices (TODO)
   - `expedia.ts`: Scrape Expedia prices (TODO)

3. **SQLite Database**: `data/prices.db` with tables:
   - `hotels`: Hotel metadata
   - `prices`: Price history
   - `work_sessions`: Clock-in/out tracking

4. **Telegram Bot**: Commands for Ezra:
   - `/prices`: Latest prices from all sites
   - `/latest`: Most recent price
   - `/history`: Last 24 hours
   - `/clockin`: Start monitoring
   - `/clockout`: Stop monitoring
   - `/status`: Current monitoring state

## User

**Ezra (Nana - Ludo's wife)**: Business owner who needs to monitor Arzo Makati hotel prices manually (currently done by hand each night).

## Development

### Running Scrapers

```bash
# Initialize database
npm run init-db

# Run Agoda scraper
npm run scrape:agoda 2026-03-18 2026-03-19

# Run all scrapers
npm run scrape:all
```

### Quality Gates

These commands must pass for any changes:

```bash
npm run typecheck  # TypeScript type checking
npm run lint       # ESLint linting
```

### File Structure

```
ezra-price-scraper/
├── .picoclaw/          # PicoClaw workspace
├── scrapers/           # Playwright scrapers (TypeScript)
├── database/           # SQLite schema
├── scripts/            # Setup and utility scripts
├── storage/            # Raw page copies (for debugging)
├── data/               # SQLite database
├── ui/                # SvelteKit dashboard (future)
├── docs/               # Documentation (PRD, URLs, etc.)
└── package.json
```

## Important Notes

- **Only Arzo Makati hotel** in MVP (multi-hotel is future feature)
- **Hourly scraping** via PicoClaw cron
- **Error notifications only** to Telegram (no success spam)
- **Clock-in/out control**: Scraping only happens when Ezra is "working"
- **Price extraction**: Uses PicoClaw LLM to parse raw HTML from scrapers

## Working with This Project

### For Scrapers (Kagu/Code Agents)

- Scrapers return structured JSON: `{ success, hotel, source, price, scrapedAt, error? }`
- Save raw HTML to `storage/[source]/` with timestamp
- Use multiple selectors for price extraction (sites change DOM)
- Handle errors gracefully (continue, don't crash)
- Return `success: false` on failure with error message

### For PicoClaw Configuration (Clawdia/Odin)

- Configure in `.picoclaw/config.json`
- Set up Telegram bot token and Ezra's user ID
- Configure LLM model for price extraction
- Set up hourly cron job for scraping

### For Database (Any Agent)

- Use `database/schema.sql` for initialization
- Tables are normalized with foreign keys
- Indexes on `hotel_id`, `scraped_at`, and `source`
- Arzo Makati is seeded in `hotels` table (id = 1)

## References

- **PRD**: `docs/PRD.md` (Complete requirements)
- **Agoda URL**: `docs/URLS.md` (Test URL and parameters)
- **Project README**: `README.md` (Overview and getting started)
