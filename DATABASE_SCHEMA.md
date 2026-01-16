# Database Schema Documentation

## Products Table Structure

The `products` table is the core of Findly's multi-platform aggregation system. It's designed according to the PRD specifications to support:
- Multi-platform product aggregation
-  Trust Engine (de-duplication & price scoring)
- Fast search and filtering
- Historical price analysis

### Schema Overview

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  image_url TEXT,
  source_url TEXT UNIQUE NOT NULL,
  platform TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  condition TEXT,
  phash TEXT,                    -- Trust Engine: De-duplication
  price_score TEXT,              -- Trust Engine: Bargain/Fair/Expensive
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Field Descriptions

| Field | Type | Purpose | PRD Reference |
|-------|------|---------|---------------|
| `id` | UUID | Unique identifier | Standard |
| `title` | TEXT | Product name | Core search field |
| `description` | TEXT | Product details | Full-text search |
| `price` | NUMERIC | Product price | Price Score calculation |
| `currency` | TEXT | Price currency (default EUR) | Multi-currency support |
| `image_url` | TEXT | Product image URL | Display |
| `source_url` | TEXT(UNIQUE) | External platform URL | Prevents duplicates |
| `platform` | TEXT | wallapop/vinted/ebay/milanuncios | Platform filtering |
| `category` | TEXT | One of 13 PRD categories | Category navigation |
| `location` | TEXT | Geographic location | Location filtering |
| `condition` | TEXT | new/like-new/good/fair/poor | Condition filtering |
| **`phash`** | TEXT | **Perceptual hash for de-duplication** | **Trust Engine** |
| **`price_score`** | TEXT | **bargain/fair/expensive** | **Trust Engine** |
| `created_at` | TIMESTAMPTZ | Record creation time | Recency sorting |
| `updated_at` | TIMESTAMPTZ | Last update time | Data freshness |

### 13 Categories (PRD-Compliant)

```typescript
1. cars-motorcycles
2. fashion
3. real-estate
4. tech-electronics
5. sports-leisure
6. home-garden
7. movies-books-music
8. baby-kids
9. collectibles-art
10. diy
11. agriculture-industrial
12. services
13. others
```

### Performance Indexes

```sql
-- High-traffic query patterns
idx_products_category        -- Category filtering
idx_products_platform        -- Platform filtering
idx_products_price           -- Price range queries
idx_products_created_at      -- Recency sorting

-- Trust Engine
idx_products_phash           -- De-duplication lookups
idx_products_price_score     -- Bargain finder

-- Search
idx_products_search          -- Full-text search (GIN index)
idx_products_location        -- Location-based search
```

### Row Level Security (RLS)

- **Public READ**: All products are publicly readable
- **Authenticated INSERT/UPDATE/DELETE**: Only authenticated users (scrapers) can modify data

### Migration Location

```
/supabase/migrations/001_products_table.sql
```

Apply with:
```bash
supabase db push
```

---

## Trust Engine Support

### pHash (De-duplication)
- Stores perceptual hash of product images
- Enables detection of identical products across platforms
- UI merges duplicate listings into single cards

### Price Score
- **bargain**: Price >15% below market median (green indicator)
- **fair**: Price within normal range (yellow indicator)
- **expensive**: Price significantly above median (red indicator)
- Calculated by comparing to historical price data

---

## Next Steps

1. Run migration: `supabase db push`
2. Populate with scraped data
3. Implement price median calculation
4. Build pHash indexing for de-duplication
