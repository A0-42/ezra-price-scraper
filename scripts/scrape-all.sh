#!/bin/bash
# Run all scrapers for Arzo Makati

CHECK_IN=${1:-$(date +%Y-%m-%d)}
CHECK_OUT=${2:-$(date -d "$CHECK_IN +1 day" +%Y-%m-%d)}

echo "🔍 Scraping all sites for Arzo Makati: $CHECK_IN → $CHECK_OUT"
echo ""

# Run each scraper
echo "--- Agoda ---"
node scrapers/agoda.ts "$CHECK_IN" "$CHECK_OUT" 1 0 1
echo ""

echo "--- Booking ---"
# node scrapers/booking.ts "$CHECK_IN" "$CHECK_OUT" 1 0 1
echo "⏳ Not implemented yet"
echo ""

echo "--- C-Trip ---"
# node scrapers/ctrip.ts "$CHECK_IN" "$CHECK_OUT" 1 0 1
echo "⏳ Not implemented yet"
echo ""

echo "--- Expedia ---"
# node scrapers/expedia.ts "$CHECK_IN" "$CHECK_OUT" 1 0 1
echo "⏳ Not implemented yet"
echo ""

echo "✅ Scraping complete"
