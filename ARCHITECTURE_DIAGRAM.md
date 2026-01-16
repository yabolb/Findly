# Business Logic Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FINDLY APPLICATION                               │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────┐      ┌──────────────────┐                      │
│  │  SearchResults     │◄─────┤ FilterSidebar    │                      │
│  │  (Component)       │      │ (Component)      │                      │
│  └────────┬───────────┘      └──────────────────┘                      │
│           │                           ▲                                  │
│           │                           │                                  │
│           │                  ┌────────┴─────────┐                       │
│           │                  │  SortDropdown    │                       │
│           │                  │  (Component)     │                       │
│           │                  └──────────────────┘                       │
│           │                                                             │
│           │  Uses                                                       │
│           ▼                                                             │
│  ┌────────────────────┐                                                │
│  │ useSearchFilters   │  ◄── State Management Hook                     │
│  │ (Hook)             │                                                │
│  └────────┬───────────┘                                                │
│           │                                                             │
└───────────┼─────────────────────────────────────────────────────────────┘
            │
            │ Calls
            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BUSINESS LOGIC LAYER                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │              ProductService.searchProducts()                │        │
│  │              (src/services/productService.ts)               │        │
│  └───────────┬──────────────────────────────┬─────────────────┘        │
│              │                               │                           │
│              │ 1. Query DB                   │ 3. Filter Results        │
│              ▼                               ▼                           │
│  ┌──────────────────────┐      ┌───────────────────────────┐           │
│  │   Supabase Query     │      │   Trust Engine            │           │
│  ├──────────────────────┤      ├───────────────────────────┤           │
│  │ • Full-text search   │      │ • hasWantedIntent()       │           │
│  │ • Category filter    │      │ • isNoise()               │           │
│  │ • Price range        │      │ • filterTrustedProducts() │           │
│  │ • Condition          │      │ • calculatePriceScore()   │           │
│  │ • Location           │      │ • getPriceScoreForProduct│           │
│  │ • Platform           │      └───────────────────────────┘           │
│  │ • Price score        │                                              │
│  │ • Date filter        │                                              │
│  │ • Sorting            │                                              │
│  │ • Pagination         │                                              │
│  └──────────────────────┘                                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
            │
            │ Returns filtered products
            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │                    Supabase Database                        │        │
│  ├────────────────────────────────────────────────────────────┤        │
│  │                    products table                           │        │
│  │  ┌────────────────────────────────────────────────┐        │        │
│  │  │ • id                  (uuid)                    │        │        │
│  │  │ • title               (text) ─────► Searched   │        │        │
│  │  │ • description         (text) ─────► Searched   │        │        │
│  │  │ • price               (numeric) ──► Filtered   │        │        │
│  │  │ • category            (text) ─────► Filtered   │        │        │
│  │  │ • condition           (text) ─────► Filtered   │        │        │
│  │  │ • location            (text) ─────► Filtered   │        │        │
│  │  │ • platform            (text) ─────► Filtered   │        │        │
│  │  │ • price_score         (text) ─────► Filtered   │        │        │
│  │  │ • created_at          (timestamp)──► Sorted    │        │        │
│  │  │ • phash               (text) ─────► Future     │        │        │
│  │  └────────────────────────────────────────────────┘        │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                          SEO & METADATA LAYER                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌────────────────────────────────────────────────────────────┐        │
│  │                  SEO Utilities (src/lib/seo.ts)             │        │
│  ├────────────────────────────────────────────────────────────┤        │
│  │                                                             │        │
│  │  generatePageTitle()           ─────► <title> tag          │        │
│  │  generateMetaDescription()     ─────► <meta description>   │        │
│  │  generateMetaKeywords()        ─────► <meta keywords>      │        │
│  │  generateProductJsonLd()       ─────► JSON-LD Product      │        │
│  │  generateSearchResultsJsonLd() ─────► JSON-LD ItemList     │        │
│  │  generateCanonicalUrl()        ─────► <link canonical>     │        │
│  │                                                             │        │
│  └────────────────────────────────────────────────────────────┘        │
│                    ▲                                                     │
│                    │                                                     │
│                    │ Used by                                            │
│                    │                                                     │
│  ┌────────────────┴───────────────────────────────────────┐            │
│  │         app/search/page.tsx                             │            │
│  │         (Next.js Metadata API)                          │            │
│  │  ┌──────────────────────────────────────────┐          │            │
│  │  │ generateMetadata()                        │          │            │
│  │  │  • Open Graph tags                        │          │            │
│  │  │  • Twitter Card tags                      │          │            │
│  │  │  • Dynamic titles based on context        │          │            │
│  │  └──────────────────────────────────────────┘          │            │
│  └─────────────────────────────────────────────────────────┘            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════
                           DATA FLOW EXAMPLE
═══════════════════════════════════════════════════════════════════════════

User Action: Search for "laptop" with filters
├─ 1. User types "laptop" in SearchBar
├─ 2. User opens FilterSidebar
├─ 3. User selects:
│    ├─ Category: "Tech & Electronics"
│    ├─ Price: 200€ - 800€
│    ├─ Condition: ["like-new", "good"]
│    ├─ Location: "Barcelona"
│    └─ Sort: "Price: Low to High"
├─ 4. SearchResults component calls ProductService.searchProducts()
├─ 5. ProductService builds Supabase query:
│    ├─ .or('title.ilike.%laptop%, description.ilike.%laptop%')
│    ├─ .eq('category', 'tech-electronics')
│    ├─ .gte('price', 200)
│    ├─ .lte('price', 800)
│    ├─ .in('condition', ['like-new', 'good'])
│    ├─ .ilike('location', '%Barcelona%')
│    └─ .order('price', { ascending: true })
├─ 6. Supabase returns 50 products
├─ 7. Trust Engine filters:
│    ├─ Removes 3 "Wanted" posts (hasWantedIntent)
│    ├─ Removes 2 accessories (isNoise)
│    └─ Returns 45 trusted products
├─ 8. Price scores calculated for each:
│    ├─ 15 products: "bargain" (green dot)
│    ├─ 25 products: "fair" (yellow dot)
│    └─ 5 products: "expensive" (red dot)
├─ 9. ProductGrid renders 20 products (page 1)
└─ 10. SEO metadata generated:
     ├─ Title: "Find laptop second-hand in Barcelona on Wallapop..."
     ├─ Description: "Discover 45 second-hand laptop in Barcelona..."
     └─ JSON-LD: ItemList schema with product aggregates


═══════════════════════════════════════════════════════════════════════════
                        TRUST ENGINE WORKFLOW
═══════════════════════════════════════════════════════════════════════════

Raw Product from Database
         │
         ▼
┌─────────────────────┐
│ hasWantedIntent()   │ ──► "Busco iPhone" → EXCLUDE ❌
└─────────┬───────────┘
          │ Pass ✓
          ▼
┌─────────────────────┐
│ isNoise()           │ ──► "Funda iPhone 15€" → EXCLUDE ❌
└─────────┬───────────┘
          │ Pass ✓
          ▼
┌─────────────────────┐
│ isValidProduct()    │ ──► Missing price → EXCLUDE ❌
└─────────┬───────────┘
          │ Pass ✓
          ▼
┌─────────────────────┐
│ sanitizeProduct()   │ ──► Trim whitespace, normalize data
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│ getPriceScoreFor    │ ──► Calculate bargain/fair/expensive
│ Product()           │
└─────────┬───────────┘
          │
          ▼
    Trusted Product ✅
    Ready for Display


═══════════════════════════════════════════════════════════════════════════
                      KEY DESIGN DECISIONS
═══════════════════════════════════════════════════════════════════════════

1. Trust Engine (Client-side for now)
   • Why: Easier to test and iterate
   • Future: Move to database triggers/views for performance

2. Price Score Calculation
   • 15% threshold chosen per PRD requirements
   • Category-specific medians for accuracy
   • Fallback values prevent null scores

3. Filter Architecture
   • Responsive-first (mobile drawer, desktop sidebar)
   • State managed locally in component
   • Applied on "Apply" button click (not live)

4. Sorting Strategy
   • Relevance = newest first (can be enhanced with scoring)
   • Simple, predictable sorting for v1

5. SEO Approach
   • Dynamic generation based on search context
   • JSON-LD for AI search optimization
   • Open Graph for social sharing

═══════════════════════════════════════════════════════════════════════════
