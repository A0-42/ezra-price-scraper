# Ezra Price Scraper System

Système de surveillance automatique des prix d'hôtel pour Ezra (business personnel).

## Overview

Le système scrape les prix de plusieurs sites d'hôtel (Agoda, Booking, C-Trip, Expedia) toutes les heures, stocke les données dans une BDD, et permet l'analyse intelligente via PicoClaw. Le système inclut aussi un mécanisme de clock-in/out manuel pour suivre les heures de travail d'Ezra.

## Tech Stack

- **Runtime** : Bun
- **Language** : TypeScript
- **Scraping** : Playwright
- **Database** : SQLite
- **LLM Analysis** : PicoClaw (future)
- **Notifications** : Telegram Bot API
- **Deployment** : Docker

## Project Structure

```
ezra-price-scraper/
├── src/
│   ├── scrapers/
│   │   ├── agoda.ts
│   │   ├── booking.ts
│   │   ├── ctrip.ts
│   │   └── expedia.ts
│   ├── database/
│   │   ├── db.ts
│   │   └── schema.sql
│   ├── telegram/
│   │   ├── bot.ts
│   │   └── notifications.ts
│   ├── clockin/
│   │   ├── clockin.ts
│   │   └── sessions.ts
│   ├── orchestrator/
│   │   └── index.ts
│   ├── ui/
│   │   ├── server.ts (SvelteKit)
│   │   └── pages/
│   └── types/
├── scripts/
│   ├── install-browsers.sh
│   └── setup-db.sh
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
└── package.json
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

## PRD (Product Requirements Document)

Le PRD complet est disponible dans [docs/PRD.md](docs/PRD.md).

### Overview du PRD

- **8 User Stories** : De US-001 à US-008
- **Tech Stack** : TypeScript, Playwright, SQLite, PicoClaw, Telegram, Docker
- **Architecture** : Orchestrator + Scrapers multi-sites + BDD + Notifications + UI
- **Déploiement** : Docker avec docker-compose

### Points clés du PRD

- **Sites à scraper** : Agoda, Booking, C-Trip, Expedia (4 sites)
- **Surveillance** : Toutes les heures (cron job)
- **Storage** : SQLite avec backup quotidien
- **LLM Analysis** : PicoClaw (future)
- **Notifications** : Telegram (erreurs uniquement)
- **Clock-in/Out** : Manuel pour MVP
- **Interface** : Copy-paste simple + format Excel

## User Stories Implementation

Based on the PRD, we have 8 user stories:

### ✅ US-001: Clock-in/out manuel
- Location: `src/clockin/`
- Status: ⏳ Not started

### ✅ US-002: Scraper multi-sites
- Location: `src/scrapers/`
- Status: ⏳ Not started
- Sites: Agoda, Booking, C-Trip, Expedia

### ✅ US-003: BDD SQLite
- Location: `src/database/`
- Status: ⏳ Not started

### ✅ US-004: Analyse LLM avec PicoClaw
- Location: `src/` (to be created)
- Status: ⏳ Future (not implemented yet)

### ✅ US-005: Notifications Telegram
- Location: `src/telegram/`
- Status: ⏳ Not started

### ✅ US-006: Interface simple pour copier-coller
- Location: `src/ui/`
- Status: ⏳ Not started

### ✅ US-007: Page web simple pour statut
- Location: `src/ui/` (same as US-006)
- Status: ⏳ Not started

### ✅ US-008: Orchestration et déploiement Docker
- Location: `docker/`
- Status: ⏳ Not started

---

**Project Status** : Initial setup phase - Playwright installed, structure planned.
