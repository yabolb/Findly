# Findly – Second-Hand Product Aggregator PRD

## 1. Project Overview
- **Project Name**: Findly
- **Domain**: getfindly.com
- **Value Proposition**: A "Google-style" meta-search engine for the second-hand market
- **Target Audience**: Men and women aged 25-45 looking for efficiency and deals
- **Business Model**: Traffic provider monetized via Google AdSense

## 2. Goals & Metrics
- **North Star Metric (NSM)**: Successful Outbound Clicks
- **Business Metric (OMTM)**: Ad Revenue per 1,000 Sessions (RPM)
- **Product Health**: L7 Retention Rate + Pages per Session (Target: >3)

## 3. User Experience (UX)
- ✅ **No Registration**: Frictionless access
- **Navigation**: Global Search Bar + Classical Pagination (1, 2, 3...)
- **External Redirection**: All product clicks open in new tab (_blank)
- **Responsive Design**: Mobile-First with premium desktop experience

## 4. Functional Requirements

### 4.1. Core Search Engine
- Precision & Speed: Optimized search for instant results
- **Search Bar Features**:
  - Predictive Autocomplete
  - Recent Search History (Local Storage)
  - "Zero Results" Logic: Show similar/trending items

### 4.2. Categories & Filters
**13 Core Categories**:
1. Cars/Motorcycles
2. Fashion
3. Real Estate
4. Tech/Electronics
5. Sports/Leisure
6. Home/Garden
7. Movies/Books/Music
8. Baby/Kids
9. Collectibles/Art
10. DIY
11. Agriculture/Industrial
12. Services
13. Others

**Advanced Filters**:
- Location
- Date of Publication
- Price Range (Min/Max)
- Product Condition

### 4.3. Findly Price Score (Price Intelligence)
- **Historical Analysis**: Track prices to calculate Market Median
- **Automatic Labeling**:
  - 🟢 **Bargain** (Green): >15% below median
  - 🟡 **Fair Price** (Yellow): Within standard range
  - 🔴 **Expensive** (Red): Significantly above median

## 5. Data & Backend Strategy

### 5.1. Database (Supabase)
✅ Centralized product repository

### 5.2. Data Ingestion (Resilient Scraping)
- **Hybrid Ingest**: Official APIs (eBay) + Web Scraping (Puppeteer/Playwright)
- **Anti-Bot Protection**: Scraping APIs with residential proxies + IP rotation
- **Target Platforms**: Wallapop, Vinted, eBay, Milanuncios

### 5.3. Trust Engine & Quality Control
- **Intent Filtering**: NLP-based exclusion of "Wanted" ads
- **Price Validation**: Flag extreme price deviations
- **pHash De-duplication**: Perceptual hashing to detect identical items across platforms
  - **UI Result**: Merged cards showing all available platforms

## 6. Visual Identity (Casual-Tech)

**Concept**: "Apple-designed marketplace" – Minimalist + Friendly + Energetic

### Color Palette (Tailwind)
✅ **Background**: `bg-slate-50` / `bg-stone-50` (Soft Cream) - `#F8FAFC`
✅ **Action**: `bg-violet-600` (Electric Violet) - `#7C3AED`
✅ **Accents**: `text-orange-500` (Sunset Orange) - `#F97316`
✅ **Typography**: `text-slate-900` (Ink Blue) - `#0F172A`

### Typography
✅ **Headings**: Plus Jakarta Sans
✅ **Body**: Inter

### UI Components
✅ Extra-rounded corners (`rounded-3xl`, `rounded-4xl`)
- Soft, diffuse shadows (`shadow-xl`)
- Linear 2px icons (Lucide-style) ✅
- Glassmorphism effects on platform badges

## 7. Monetization (Google AdSense)
- **In-feed Ads**: Position #5, then every 10 products
- **Leaderboard Ad**: Below header
- **Optimization**: Lazy loading for Core Web Vitals

## 8. SEO & AISO (Organic Growth)
- **Programmatic SEO (pSEO)**: `/second-hand/[product]` URLs
- **AISO**: JSON-LD Structured Data (Product, AggregateOffer)
- **Blog & Footer**: Strategic content + internal linking

---

## Implementation Priorities

### Phase 1: Foundation ✅
- [x] Design system (Casual-Tech colors, typography)
- [x] Navbar with glassmorphism
- [x] Hero section
- [x] Supabase client setup

### Phase 2: Core Search (NEXT)
- [ ] Search UI with autocomplete
- [ ] Supabase schema for products
- [ ] 13 categories implementation
- [ ] Advanced filters UI

### Phase 3: Trust Engine
- [ ] Price Score algorithm
- [ ] pHash de-duplication
- [ ] Multi-platform card merging

### Phase 4: Scraping & Ingest
- [ ] Scraper service for Wallapop, Vinted, eBay
- [ ] Anti-bot protection
- [ ] Scheduled data updates

### Phase 5: Monetization & SEO
- [ ] Google AdSense integration
- [ ] pSEO implementation
- [ ] JSON-LD structured data
