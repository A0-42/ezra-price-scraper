# Ezra Price Scraper System

Automated hotel price monitoring system for Ezra's personal business. The system scrapes prices from multiple hotel booking sites (Agoda, Booking, C-Trip, Expedia) hourly, stores data in a database, and enables intelligent analysis via PicoClaw. The system also includes a manual clock-in/out mechanism to track Ezra's work hours.

## Overview

The system scrapes hotel prices from four major booking sites (Agoda, Booking, C-Trip, Expedia) every hour, stores all price data in a persistent database, and enables intelligent analysis via PicoClaw. The system also includes a manual clock-in/out mechanism to track Ezra's work hours.

## Goals

- Monitor hotel prices across 4 major sites (Agoda, Booking, C-Trip, Expedia) hourly
- Store all price data in a persistent database
- Analyze prices with PicoClaw to detect trends and optimizations
- Allow Ezra to clock-in/out manually when working
- Send Telegram notifications on error only (on-demand)
- Enable easy data copying (web table + Excel format)
- Simple and quick to deploy MVP (Docker container)

## Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **Scraping**: Playwright
- **Database**: SQLite
- **LLM Analysis**: PicoClaw (future)
- **Notifications**: Telegram Bot API
- **Deployment**: Docker

## Project Structure

```
ezra-price-scraper/
├── src/
│   ├── scrapers/          ← Agoda, Booking, C-Trip, Expedia scrapers
│   ├── database/          ← SQLite setup
│   ├── telegram/          ← Bot notifications (errors only)
│   ├── clockin/           ← Work session tracking
│   ├── orchestrator/      ← Main entry point
│   ├── ui/               ← Simple web interface (SvelteKit)
│   └── types/            ← TypeScript types
├── scripts/              ← Setup scripts
├── docker/               ← Dockerfile + docker-compose.yml
└── package.json          ← Project configuration
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
**Location:** `src/orchestrator/index.ts` (main orchestrator)
**Status:** ✅ Active - Complete system

**Implemented features:**
- ✅ Single entry point for the entire system
- ✅ Automatic SQLite database initialization
- ✅ Automatic Telegram bot startup (notifications)
- ✅ Scheduled hourly scraping (CRON job)
- ✅ Error handling system (retry, logging, timeout)
- ✅ Configuration files generated (docker/, package.json)

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
**Location:** `src/telegram/bot.ts` (Telegram alert sending)

**Status:** ✅ Active - Notification system created

**Implemented features:**
- ✅ Integration with Telegram Bot API (stub)
- ✅ Error-only notifications (as specified in PRD)
- ✅ Error message management system
- ✅ Test notification capability
- ✅ Flexible configuration (token and chat ID in environment variables)

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

- **Technologies**: Bun (runtime), Playwright (scraping), SQLite (database), PicoClaw (LLM), Telegram Bot API
- **Architecture**: Main orchestration script + individual site scripts + analysis script + Telegram bot
- **Testing**: TDD (Test Driven Development) with Bun test
- **Deployment**: Docker for easy portability
- **Database**: SQLite for MVP (simple, easy to backup), future PostgreSQL for scaling
- **Security**: No hardcoded credentials (tokens in environment variables)

## Success Metrics

- Successful scraping on all 4 sites 95% of the time
- PicoClaw analysis successful 90% of the time
- Scraping latency < 5 min for all 4 sites
- No database data loss
- Telegram notifications received in < 30 sec after error

## Open Questions

- **Q1**: PicoClaw API key free or paid for daily data volume?
- **Q2**: Should we implement retry system with exponential backoff for scrapers?
- **Q3**: Should the copy-paste interface be scheduled (automatic) or manual (on-demand)?

---

**Created with:** AETHER PRD Generator (adapted from Agent Zero)
**Project:** Ezra Price Scraper
**For:** Ezra (Nana - Ludo's wife)
