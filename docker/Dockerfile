# Use the official Bun image
FROM oven/bun:1.3.10

# Set working directory
WORKDIR /app

# Copy package files (and lockfile)
COPY package.json bun.lock* ./

# Install dependencies
RUN bun install --production

# Install Playwright browsers
RUN bunx playwright install chromium

# Copy application code
COPY . .

# Expose port (optional - for web UI)
# EXPOSE 3000

# Set default command
CMD ["bun", "run", "src/orchestrator/index.ts"]

# Health check (optional)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 CMD bun run --eval "process.exit(0)"