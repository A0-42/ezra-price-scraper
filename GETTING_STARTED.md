# Ezra Price Scraper - Getting Started

## GitHub Setup Complete ✅

Repository created: `https://github.com/A0-42/ezra-price-scraper`

## Current Status

- ✅ Project initialized (TypeScript + Bun)
- ✅ Playwright installed
- ✅ Project structure created
- ✅ First commit done
- ✅ GitHub repo created
- ⏳ **Git push pending** - authentication issue

## Next Steps

### 1. Fix Git Push

The git push failed because HTTPS requires username authentication. Options:

**Option A: Use SSH**
```bash
cd /data/workspace/ezra-price-scraper
git remote set-url origin git@github.com:A0-42/ezra-price-scraper.git
git push -u origin main
```

**Option B: Use credential helper**
```bash
cd /data/workspace/ezra-price-scraper
git config credential.helper store
git push -u origin main
```

### 2. Start Development

Once git push is fixed:

```bash
cd /data/workspace/ezra-price-scraper

# Install browsers
bunx playwright install chromium

# Start development
bun run dev
```

### 3. Implement User Stories

Based on PRD, implement in order:

1. **US-008: Orchestration** - Create main orchestrator
2. **US-003: Database** - Setup SQLite schema
3. **US-002: Scrapers** - Implement Agoda, Booking, C-Trip, Expedia scrapers
4. **US-001: Clock-in** - Add clock-in/out functionality
5. **US-005: Telegram** - Setup notifications (errors only)
6. **US-006: UI Copy-Paste** - Simple interface
7. **US-007: Status Page** - Web status page
8. **US-004: PicoClaw** - LLM analysis (future)

### 4. Docker Deployment

Create `docker/Dockerfile` and `docker/docker-compose.yml`:

```dockerfile
FROM oven/bun:1.3.10
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --production
COPY . .
RUN bun run build
EXPOSE 3000
CMD ["bun", "run", "src/ui/server.ts"]
```

## Notes

- Git push authentication needs to be configured
- Playwright requires browser installation: `bunx playwright install chromium`
- SQLite will be created on first run
- PicoClaw integration will be added later
