# Agoda URLs for Testing

## Arzo Makati Hotel

**Base URL:** https://www.agoda.com/oyo-737-arzo-hotel-makati/hotel/manila-ph.html

### Test URL (2026-03-18)
```
https://www.agoda.com/oyo-737-arzo-hotel-makati/hotel/manila-ph.html?countryId=70&finalPriceView=2&isShowMobileAppPrice=false&cid=1844104&numberOfBedrooms=&familyMode=false&adults=1&children=0&rooms=1&maxRooms=0&checkIn=2026-03-18&isCalendarCallout=false&childAges=&numberOfGuest=0&missingChildAges=false&travellerType=0&showReviewSubmissionEntry=false&currencyCode=EUR&isFreeOccSearch=false&tspTypes=16&los=1&searchrequestid=10071be8-7bf6-46f6-9731-23bc203b93dd
```

### Important Parameters
- `checkIn=YYYY-MM-DD` - Check-in date
- `checkOut=YYYY-MM-DD` - Check-out date (can be derived from `checkIn` + `los`)
- `adults=1` - Number of adults
- `children=0` - Number of children
- `rooms=1` - Number of rooms
- `currencyCode=EUR` - Currency (EUR, PHP, USD, etc.)
- `los=1` - Length of stay in nights

### Usage Example
```bash
node scrapers/agoda.ts 2026-03-18 2026-03-19 1 0 1
```
