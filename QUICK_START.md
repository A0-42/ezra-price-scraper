# Quick Start

## 1. Git Setup (Choose One)

### Option A: SSH Push (Recommended)

```bash
cd /data/workspace/ezra-price-scraper
# Remote already set to SSH format
git push -u origin main
```

### Option B: Credential Helper

```bash
cd /data/workspace/ezra-price-scraper
git config credential.helper store
git push -u origin main
```

## 2. Install Dependencies

```bash
cd /data/workspace/ezra-price-scraper
bun install
```

## 3. Install Playwright Browsers

```bash
cd /data/workspace/ezra-price-scraper
bunx playwright install chromium
```

## 4. Initialize Database

```bash
cd /data/workspace/ezra-price-scraper
bun run setup-db
```

## 5. Start Development

```bash
cd /data/workspace/ezra-price-scraper
bun run dev
```

## 6. Type Checking

```bash
bun run typecheck
```

## 7. Linting

```bash
bun run lint
```

## 8. Docker Build & Run

```bash
cd /data/workspace/ezra-price-scraper
bun run docker:build
docker-compose up -d
```

---

**Note:** Make sure to choose ONE Git setup option (SSH or credential helper) before pushing.
