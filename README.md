# Ezra Price Scraper System

Automated hotel price monitoring system for Ezra's personal business. The system scrapes prices from multiple hotel booking sites (Agoda, Booking, C-Trip, Expedia) hourly, stores data in a database, and enables intelligent analysis via PicoClaw. The system also includes a manual clock-in/out mechanism to track Ezra's work hours.

## Overview

The system uses PicoClaw as the central orchestrator. Every hour, PicoClaw launches Playwright scripts to scrape hotel prices from four major booking sites (Agoda, Booking, C-Trip, Expedia), stores page copies for reference, extracts prices using LLM analysis, and saves data to SQLite. Ezra can access the data via Telegram bot or a SvelteKit dashboard for easy copy-paste to Excel. The system also includes a manual clock-in/out mechanism to track Ezra's work hours.

## Goals

- Monitor hotel prices across 4 major sites (Agoda, Booking, C-Trip, Expedia) hourly
- Store all price data in a persistent database
- Analyze prices with PicoClaw to detect trends and optimizations
- Allow Ezra to clock-in/out manually when working
- Send Telegram notifications on error only (on-demand)
- Enable easy data copying (web table + Excel format)
- Simple and quick to deploy MVP (Docker container)

## Tech Stack

- **Orchestrator**: PicoClaw (Go-based AI agent system)
- **Runtime**: Bun
- **Language**: TypeScript
- **Scraping**: Playwright
- **Database**: SQLite
- **LLM Analysis**: PicoClaw (integrated)
- **Notifications**: PicoClaw Telegram channel
- **Dashboard**: SvelteKit
- **Deployment**: Docker

## Project Structure

```
ezra-price-scraper/
├── .picoclaw/              ← PicoClaw workspace & config
│   ├── config.json        ← PicoClaw configuration (agents, channels, cron)
│   ├── workspace/
│   │   ├── cron/          ← Scheduled jobs (hourly scraping)
│   │   ├── memory/        ← Long-term memory
│   │   └── sessions/      ← Chat sessions
├── scrapers/              ← Playwright scrapers (TypeScript/Node.js)
│   ├── agoda.ts         ← Agoda scraper (active)
│   ├── booking.ts       ← Booking.com scraper (TODO)
│   ├── ctrip.ts         ← C-Trip scraper (TODO)
│   └── expedia.ts       ← Expedia scraper (TODO)
├── database/              ← SQLite schema & setup
│   └── schema.sql       ← Database schema
├── scripts/               ← Setup & utility scripts
│   ├── init-db.sh       ← Initialize SQLite database
│   └── scrape-all.sh    ← Run all scrapers
├── storage/               ← Raw page copies (for debugging)
│   ├── agoda/
│   ├── booking/
│   ├── ctrip/
│   └── expedia/
├── data/                  ← SQLite database file
│   └── prices.db        ← Generated database
├── docs/                  ← Documentation
│   ├── PRD.md           ← Complete PRD
│   └── URLS.md          ← Test URLs and parameters
├── docker/                ← Docker configuration
├── AGENTS.md             ← Agent guide for LLM developers
├── package.json           ← Node dependencies
└── README.md             ← This file
```

## Getting Started

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium

# Initialize database
npm run init-db

# Run Agoda scraper (manual test)
node scrapers/agoda.ts 2026-03-18 2026-03-19 1 0 1

# Run all scrapers
npm run scrape:all
```

## Development

```bash
# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run specific scraper
npm run scrape:agoda <checkIn> <checkOut>
```

## Production (PicoClaw)

```bash
# Initialize PicoClaw
picoclaw onboard

# Configure PicoClaw
# Edit ~/.picoclaw/config.json with:
# - Telegram bot token
# - Ezra's user ID
# - LLM API keys

# Start PicoClaw gateway (orchestration + Telegram bot)
picoclaw gateway

# Cron jobs will run automatically every hour
# Use: picoclaw cron list to view scheduled jobs
```

## User Stories Implementation

For complete user stories, acceptance criteria, and implementation status, see `docs/PRD.md`.

### Current Status

**Implemented (MVP):**
- ✅ Project structure with PicoClaw architecture
- ✅ Database schema and initialization script
- ✅ Agoda scraper (first scraper active)
- ✅ PicoClaw configuration template
- ✅ Documentation (PRD, URLs, AGENTS.md)

**Pending (Next Steps):**
- ⏳ Complete remaining scrapers (Booking, C-Trip, Expedia)
- ⏳ PicoClaw cron job setup for hourly execution
- ⏳ PicoClaw LLM price extraction from scraped pages
- ⏳ SQLite database integration with PicoClaw
- ⏳ Telegram bot commands implementation
- ⏳ Clock-in/out control logic

**Out of Scope (Future):**
- ❌ Web dashboard (Telegram bot only for MVP)
- ❌ Multi-hotel support (Arzo Makati only)
- ❌ Automatic price trend analysis
- ❌ Historical data cleanup policy

## PicoClaw Architecture

PicoClaw serves as the central orchestrator and AI agent system for the Ezra Price Scraper:

### Hourly Automation Workflow

1. **Cron Job** (every hour)
   ```
   PicoClaw cron triggers → Launch scraping job
   ```

2. **Scraping Phase**
   ```
   PicoClaw → exec tool → bun run scrapers/agoda.ts
   PicoClaw → exec tool → bun run scrapers/booking.ts
   PicoClaw → exec tool → bun run scrapers/ctrip.ts
   PicoClaw → exec tool → bun run scrapers/expedia.ts
   ```

3. **Data Storage**
   ```
   Playwright scrapers → Save HTML/JSON copies to storage/
   PicoClaw → LLM analysis → Extract prices from stored pages
   PicoClaw → SQLite → Insert price records
   ```

4. **User Access**
   ```
   Ezra → Telegram bot → Query latest prices
   Ezra → SvelteKit dashboard → View trends & copy to Excel
   ```

### PicoClaw Configuration

```json
{
  "agents": {
    "defaults": {
      "workspace": "/path/to/ezra-price-scraper/.picoclaw/workspace",
      "model": "openai/gpt-4o-mini"
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "YOUR_BOT_TOKEN",
      "allow_from": ["EZRA_USER_ID"]
    }
  },
  "tools": {
    "web": {
      "duckduckgo": { "enabled": true }
    }
  },
  "heartbeat": {
    "enabled": false
  }
}
```

### Benefits of PicoClaw Architecture

- ✅ **Ultra-lightweight**: Runs on minimal hardware (<10MB RAM)
- ✅ **Built-in scheduling**: Cron jobs for hourly automation
- ✅ **Native Telegram**: No external bot management needed
- ✅ **LLM-powered**: Intelligent price extraction and analysis
- ✅ **Easy configuration**: Single config.json for entire system
- ✅ **Docker-ready**: Deploy as container with single binary

## Quality Gates

These commands must pass for each user story:
- `bun typecheck` - Type checking
- `bun lint` - Linting

**Note:** Automated TDD tests required for MVP.

## Functional Requirements

- **FR-1**: System must scrape 4 hotel sites (Agoda, Booking, C-Trip, Expedia) hourly
- **FR-2**: System must store all data in a persistent SQLite database
- **FR-3**: System must analyze prices with PicoClaw after each scraping
- **FR-4**: System must allow Ezra to clock-in/out manually
- **FR-5**: System must send Telegram notifications on error only
- **FR-6**: System must enable easy data copying (web table + Excel format)
- **FR-7**: System must have a simple status web page
- **FR-8**: System must be deployed as Docker container

## Non-Goals (Out of Scope)

- Automatic clock-in/out (detected by location/activity) - MVP = manual
- Automatic pause of notifications during work (Ezra will handle this herself)
- Real-time price comparison with automatic alerts (too complex for MVP)
- Complex web dashboard (MVP = simple status page)
- Scraping more than 4 hotel sites (future enhancement)
- Scraping hotel detail pages (future enhancement)

## Technical Considerations

- **Orchestrator**: PicoClaw (Go-based AI agent system, <10MB RAM)
- **Scraping Runtime**: Bun (for Playwright scripts)
- **Scraping Framework**: Playwright (headless browser automation)
- **Database**: SQLite (simple, portable, easy backup)
- **Web Dashboard**: SvelteKit (fast, reactive, TypeScript)
- **Notifications**: PicoClaw native Telegram channel
- **Architecture**: PicoClaw central orchestrator + TypeScript scrapers + SQLite + SvelteKit UI
- **Testing**: TDD (Test Driven Development) with Bun test for scrapers
- **Deployment**: Docker compose (PicoClaw + scrapers + SQLite + SvelteKit)
- **Data Storage**: SQLite for MVP, future PostgreSQL for scaling
- **Security**: Credentials in PicoClaw config.json and environment variables, no hardcoded secrets

## Success Metrics

- Successful scraping on all 4 sites 95% of the time
- PicoClaw LLM analysis successful 90% of the time
- End-to-end workflow (scrape → analyze → store) < 5 min
- No database data loss
- Telegram bot response time < 2 seconds
- Dashboard load time < 1 second

## Open Questions

- **Q1**: Should PicoClaw store full page copies (HTML/JSON) for reference, or just extracted prices?
- **Q2**: Should we implement retry system with exponential backoff for Playwright scrapers?
- **Q3**: Dashboard refresh: automatic (real-time via polling) or manual (refresh button)?
- **Q4**: How long to keep historical price data in SQLite? (cleanup policy)

---

**Created with:** PicoClaw-inspired architecture (updated 2026-03-09)
**Project:** Ezra Price Scraper
**For:** Ezra (Nana - Ludo's wife)
**Architecture:** PicoClaw Orchestrator + Playwright Scrapers + SQLite + SvelteKit
