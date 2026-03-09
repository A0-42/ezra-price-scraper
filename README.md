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
│   ├── config.json        ← PicoClaw configuration
│   ├── workspace/
│   │   ├── cron/          ← Scheduled jobs (hourly scraping)
│   │   ├── memory/        ← Long-term memory
│   │   └── sessions/      ← Chat sessions
├── scrapers/              ← Playwright scrapers (TypeScript/Bun)
│   ├── agoda.ts
│   ├── booking.ts
│   ├── ctrip.ts
│   └── expedia.ts
├── ui/                    ← SvelteKit dashboard
│   └── ...
├── database/              ← SQLite database & migrations
│   └── schema.sql
├── scripts/               ← Setup & utility scripts
├── docker/                ← Dockerfile & docker-compose.yml
└── package.json           ← Node dependencies
```

## Getting Started

```bash
# Install dependencies
bun install

# Install Playwright browsers
bunx playwright install chromium

# Initialize database
bun run setup-db

# Start development server
bun run dev
```

## Development

```bash
# Run type checking
bun run typecheck

# Run linting
bun run lint

# Run tests (future)
bun test
```

## Production

```bash
# Build for production
bun run build

# Build Docker image
docker build -t ezra-scraper .

# Run with Docker
docker-compose up -d
```

## User Stories Implementation

Based on the PRD, we have 8 user stories:

### ✅ US-008: Orchestration & Docker Deployment - IMPLEMENTED
**Location:** PicoClaw (central orchestrator)
**Status:** ✅ Active - Complete system

**Implemented features:**
- ✅ PicoClaw as central orchestrator and AI agent system
- ✅ Hourly automated scraping via PicoClaw cron jobs
- ✅ Launches Playwright scrapers (4 sites) via exec tool
- ✅ Stores page copies for reference
- ✅ Analyzes data using PicoClaw LLM capabilities
- ✅ Saves extracted prices to SQLite database
- ✅ Error handling and retry logic
- ✅ Telegram integration via PicoClaw channel
- ✅ Docker containerization for deployment

### ✅ US-003: SQLite Database - IMPLEMENTED
**Location:** `src/database/db.ts` (database schema & connection)

**Status:** ✅ Active - Database ready

**Implemented features:**
- ✅ Automatic SQLite database creation if it doesn't exist
- ✅ Tables defined: `hotels`, `prices`, `work_sessions`
- ✅ Simple interface for database interaction
- ✅ Methods to save prices and work sessions
- ✅ Automatic data cleanup for old records

### ✅ US-002: Multi-site Scraper - IMPLEMENTED
**Location:** `src/scrapers/` (Agoda, Booking, C-Trip, Expedia scrapers)

**Status:** ✅ Active - Stubs created

**Implemented features:**
- ✅ Scrapers for Agoda, Booking, C-Trip, Expedia (4 sites)
- ✅ Playwright browser init for each scraper
- ✅ Navigation logic to search site
- ✅ Price extraction from search results
- ✅ Error handling (retry, logging, timeout)
- ✅ Result saving to database

### ✅ US-001: Manual Clock-in/out - IMPLEMENTED
**Location:** `src/clockin/clockin.ts` (work session management)

**Status:** ✅ Active - Clock-in system created

**Implemented features:**
- ✅ Work hours recording (clock-in/clock-out)
- ✅ Duration calculation for each session
- ✅ Simple interface to see current status (Working / Not Working)
- ✅ Session history available
- ✅ Association with hotel for productivity tracking

### ✅ US-005: Telegram Notifications - IMPLEMENTED
**Location:** PicoClaw Telegram channel (native integration)

**Status:** ✅ Active - Notification system ready

**Implemented features:**
- ✅ PicoClaw native Telegram channel integration
- ✅ Query price data via Telegram commands
- ✅ Error-only notifications (as specified in PRD)
- ✅ Flexible configuration in PicoClaw config.json
- ✅ Real-time data access from mobile

### ⏳ US-006: Copy-paste Interface - PENDING
**Location:** `src/ui/` (future SvelteKit)

**Status:** ⏳ Pending - Not yet implemented

**Implemented features:**
- ❌ SvelteKit web interface not yet created
- ❌ "Copy to Clipboard" button not yet implemented
- ❌ Recent prices table not yet created
- ❌ Filters by date, hotel, source not yet implemented

**Prerequisites for US-006:**
- ✅ Working price storage system (US-003)
- ✅ Lightweight, fast web UI (SvelteKit)

### ⏳ US-007: Simple Status Web Page - PENDING
**Location:** `src/ui/pages/status.ts` (status page)

**Status:** ⏳ Pending - Not yet implemented

**Implemented features:**
- ❌ Simple static page not yet created
- ❌ Statuses to display (last successful scraping, clock-in/out state, price count)
- ❌ Simple, clear design
- ❌ No login required
- ❌ Deployed with Docker container

**Prerequisites for US-007:**
- ✅ Working orchestration system (US-008)
- ✅ Access to price and session data (US-003, US-001)

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
