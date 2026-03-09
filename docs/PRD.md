# Product Requirements Document (PRD)

Generated: 2026-03-09
Architecture: PicoClaw Orchestrator + Playwright Scrapers + SQLite + Telegram

---

[PRD]
# PRD: Ezra Price Scraper System

## Overview

Automated hotel price monitoring system for Arzo Makati hotel. The system uses PicoClaw as central orchestrator to launch Playwright scrapers every hour, analyze extracted prices with LLM, and store data in SQLite. Ezra can access data via Telegram bot and manage monitoring sessions with clock-in/clock-out. Error notifications are sent via Telegram.

## Goals

- Monitor Arzo Makati hotel prices across 4 major booking sites (Agoda, Booking, C-Trip, Expedia) every hour
- Store all price data in a persistent SQLite database with timestamps
- Automatically detect and extract prices using PicoClaw LLM analysis
- Provide easy access to price data via Telegram bot
- Enable Ezra to control monitoring with clock-in/clock-out
- Send Telegram notifications on errors only
- Simple MVP with minimal complexity for rapid deployment

## Quality Gates

These commands must pass for every user story:
- `npm run typecheck` - Type checking (TypeScript scrapers)
- `npm run lint` - Linting (TypeScript scrapers)
- `npm run test` - Automated testing (when tests are implemented)

## User Stories

### US-001: PicoClaw Orchestration Setup
**Description:** As a system, I want PicoClaw configured to orchestrate the entire scraping workflow so that automation is reliable and centralized.

**Acceptance Criteria:**
- PicoClaw workspace initialized with proper structure
- Cron job configured for hourly execution
- SQLite database schema created (`hotels`, `prices`, `work_sessions` tables)
- Telegram channel configured in PicoClaw config.json
- Error handling and retry logic implemented
- Environment variables for sensitive data (Telegram token, etc.)

### US-002: Agoda Scraper Implementation
**Description:** As a system, I want to scrape Agoda prices for Arzo Makati hotel so that I can track price changes.

**Acceptance Criteria:**
- Playwright script navigates to Agoda search for "Arzo Makati"
- Extracts price from search results
- Saves raw HTML/JSON to `storage/agoda/` with timestamp
- Extracts price, date, and room type
- Returns structured data: `{ hotel: "Arzo Makati", source: "agoda", price: number, scrapedAt: string }`
- Error handling for network failures and selector changes
- Script runs as standalone: `node scrapers/agoda.ts`

### US-003: Booking Scraper Implementation
**Description:** As a system, I want to scrape Booking.com prices for Arzo Makati hotel so that I can track price changes.

**Acceptance Criteria:**
- Playwright script navigates to Booking.com search for "Arzo Makati"
- Extracts price from search results
- Saves raw HTML/JSON to `storage/booking/` with timestamp
- Extracts price, date, and room type
- Returns structured data: `{ hotel: "Arzo Makati", source: "booking", price: number, scrapedAt: string }`
- Error handling for network failures and selector changes
- Script runs as standalone: `node scrapers/booking.ts`

### US-004: C-Trip Scraper Implementation
**Description:** As a system, I want to scrape C-Trip prices for Arzo Makati hotel so that I can track price changes.

**Acceptance Criteria:**
- Playwright script navigates to C-Trip search for "Arzo Makati"
- Extracts price from search results
- Saves raw HTML/JSON to `storage/ctrip/` with timestamp
- Extracts price, date, and room type
- Returns structured data: `{ hotel: "Arzo Makati", source: "ctrip", price: number, scrapedAt: string }`
- Error handling for network failures and selector changes
- Script runs as standalone: `node scrapers/ctrip.ts`

### US-005: Expedia Scraper Implementation
**Description:** As a system, I want to scrape Expedia prices for Arzo Makati hotel so that I can track price changes.

**Acceptance Criteria:**
- Playwright script navigates to Expedia search for "Arzo Makati"
- Extracts price from search results
- Saves raw HTML/JSON to `storage/expedia/` with timestamp
- Extracts price, date, and room type
- Returns structured data: `{ hotel: "Arzo Makati", source: "expedia", price: number, scrapedAt: string }`
- Error handling for network failures and selector changes
- Script runs as standalone: `node scrapers/expedia.ts`

### US-006: PicoClaw Price Analysis & Storage
**Description:** As a system, I want PicoClaw to analyze scraped page copies and extract prices so that data is stored accurately in SQLite.

**Acceptance Criteria:**
- PicoClaw reads raw HTML/JSON from `storage/` directory
- Uses LLM to parse and extract prices from each site's format
- Validates extracted prices (sanity check for reasonable values)
- Inserts valid prices into SQLite `prices` table with hotel_id, source, price, scraped_at
- Handles failed extractions gracefully (logs error, continues with next site)
- Stores extraction metadata (confidence score if available)
- Workflow runs hourly via PicoClaw cron

### US-007: Telegram Bot - Price Query
**Description:** As Ezra, I want to query current prices via Telegram so that I can check them from my phone.

**Acceptance Criteria:**
- Telegram bot responds to `/prices` command
- Returns latest prices from all 4 sites for Arzo Makati
- Format: clear, readable message with site, price, and timestamp
- `/latest` returns the most recent price across all sites
- `/history` returns price history for last 24 hours
- Commands restricted to Ezra's Telegram user ID only

### US-008: Telegram Bot - Clock-in/Out Control
**Description:** As Ezra, I want to start/stop monitoring with clock-in/clock-out commands so that I control when the system runs.

**Acceptance Criteria:**
- `/clockin` command starts monitoring and logs work session to SQLite
- `/clockout` command stops monitoring and calculates session duration
- `/status` command shows current monitoring state (active/inactive)
- Clock-in/clock-out only allowed if monitoring is in appropriate state
- All clock events logged to SQLite `work_sessions` table
- System respects clock-out to stop future scraping until next clock-in

### US-009: Telegram Bot - Error Notifications
**Description:** As Ezra, I want to receive error notifications via Telegram so that I know when scraping fails.

**Acceptance Criteria:**
- System sends Telegram message on scraping failures (any site)
- Error message includes: site, error type, timestamp
- No notification on successful scraping (to avoid spam)
- Multiple errors aggregated into single message if occurring within same hour
- Notification includes suggested action if available

### US-010: SQLite Database Management
**Description:** As a system, I want a reliable SQLite database so that price and session data persists.

**Acceptance Criteria:**
- Database created automatically if missing: `./data/prices.db`
- Schema includes tables: `hotels`, `prices`, `work_sessions`
- `hotels` table: id, name, location, checkin, checkout, last_scraped_at, created_at
- `prices` table: id, hotel_id, date, source, price, scraped_at
- `work_sessions` table: id, hotel_id, clock_in, clock_out, duration, created_at
- Database connection pooling for concurrent access
- Automatic migration on schema changes

## Functional Requirements

- FR-1: System must scrape Agoda, Booking, C-Trip, and Expedia every hour
- FR-2: System must only scrape Arzo Makati hotel (no other hotels in MVP)
- FR-3: System must save raw page copies for debugging and reference
- FR-4: System must use PicoClaw LLM to extract prices from saved pages
- FR-5: System must store all extracted prices in SQLite with timestamps
- FR-6: System must provide a Telegram bot for price queries and monitoring control
- FR-7: System must send error notifications to Telegram only (no success notifications)
- FR-8: System must respect clock-in/clock-out to control monitoring state
- FR-9: System must log all work sessions with timestamps and durations
- FR-10: System must handle scraper failures gracefully (continue with next site)

## Non-Goals (Out of Scope)

- **Multi-hotel support** - MVP = Arzo Makati only
- **Real-time price comparison** - Hourly scraping is sufficient
- **Automatic price alerts** - Manual queries via Telegram only
- **Web dashboard** - Telegram bot only for MVP
- **Automatic clock-in/out detection** - Manual commands only
- **Price trend analysis** - Raw data storage only, analysis future feature
- **Historical data retention policy** - No cleanup in MVP
- **Multiple hotel room types** - Main room type only for MVP

## Technical Considerations

- **Orchestrator**: PicoClaw (Go-based AI agent, <10MB RAM)
- **Scraping Runtime**: Node.js for Playwright scripts
- **Scraping Framework**: Playwright (headless Chrome)
- **Database**: SQLite with better-sqlite3 driver
- **Telegram**: PicoClaw native Telegram channel
- **LLM**: PicoClaw built-in LLM for price extraction
- **Cron**: PicoClaw built-in cron for hourly execution
- **Storage**: `storage/` directory for raw page copies
- **Configuration**: PicoClaw `~/.picoclaw/config.json`
- **Security**: Credentials in PicoClaw config, no hardcoded secrets

## Success Metrics

- Successful scraping on all 4 sites 95% of the time
- Price extraction accuracy > 90% (correct values from pages)
- End-to-end workflow (scrape → analyze → store) < 5 minutes
- Telegram bot response time < 2 seconds
- Zero database data loss over 30-day period
- Error notifications sent within 1 minute of failure

## Open Questions

- Q1: Should PicoClaw store full HTML page copies or only relevant DOM snippets?
- Q2: How long to keep raw page copies in `storage/` directory? (cleanup policy)
- Q3: Should Telegram bot include price change percentage vs. previous scrape?
- Q4: Clock-in/clock-out: Should it stop only scraping or also stop Telegram queries?
[/PRD]
