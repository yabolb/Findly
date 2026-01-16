# Usage Examples - Business Logic Implementation

This document provides practical examples of how to use the newly implemented features.

---

## 1. Using the Trust Engine

### Check if a product should be excluded

```typescript
import { hasWantedIntent, isNoise, filterTrustedProducts } from '@/services/trust-engine';
import { Product } from '@/types';

// Single product check
const product: Product = {
  id: '123',
  title: 'Busco iPhone 15 Pro',
  description: 'Looking to buy...',
  // ... other fields
};

if (hasWantedIntent(product)) {
  console.log('This is a "Wanted" post - exclude from feed');
}

if (isNoise(product)) {
  console.log('This is likely spam/noise - exclude');
}

// Batch filtering
const products: Product[] = [...]; // Array of products
const trustedProducts = filterTrustedProducts(products);
console.log(`Filtered ${products.length - trustedProducts.length} untrusted products`);
```

### Calculate Price Score

```typescript
import { calculatePriceScore, getPriceScoreForProduct, CATEGORY_MEDIAN_PRICES } from '@/services/trust-engine';

const product: Product = {
  id: '123',
  title: 'iPhone 15 Pro',
  price: 700,
  category: 'tech-electronics',
  // ... other fields
};

// Manual calculation with known median
const categoryMedian = 850;
const priceScore = calculatePriceScore(product, categoryMedian);
// Returns: 'bargain' (because 700 < 850 * 0.85)

// Automatic with fallback median
const autoScore = getPriceScoreForProduct(product);
// Uses CATEGORY_MEDIAN_PRICES['tech-electronics'] = 120€
```

---

## 2. Using the Enhanced Product Service

### Basic Search

```typescript
import { ProductService } from '@/services/productService';

// Simple text search
const results = await ProductService.searchProducts({
  query: 'iPhone 15',
  sortBy: 'price_asc'
}, 1, 20);

console.log(`Found ${results.pagination.total} products`);
console.log(results.data); // Array of products
```

### Advanced Filtering

```typescript
const results = await ProductService.searchProducts({
  query: 'laptop',
  category: 'tech-electronics',
  minPrice: 200,
  maxPrice: 800,
  condition: ['like-new', 'good'],
  location: 'Barcelona',
  platform: ['wallapop', 'vinted'],
  priceScore: ['bargain'],
  dateFilter: 'week',
  sortBy: 'price_asc'
}, 1, 20);
```

### Pagination

```typescript
// Page 1
const page1 = await ProductService.searchProducts({ query: 'bike' }, 1, 20);

// Page 2
const page2 = await ProductService.searchProducts({ query: 'bike' }, 2, 20);

console.log(`Total pages: ${page1.pagination.totalPages}`);
```

---

## 3. Using the Filter Sidebar Component

### In a Search Page

```tsx
'use client';

import { useState } from 'react';
import FilterSidebar from '@/components/FilterSidebar';
import { SearchFilters } from '@/types';

export default function MySearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'relevance'
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleApplyFilters = async () => {
    // Fetch products with new filters
    const results = await ProductService.searchProducts(filters);
    // Update state...
  };

  return (
    <div>
      {/* Mobile: Toggle button */}
      <button onClick={() => setIsFilterOpen(true)}>
        Show Filters
      </button>

      {/* Desktop: Always visible */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={handleApplyFilters}
      />
    </div>
  );
}
```

---

## 4. Using the SEO Helpers

### Generate Page Metadata

```typescript
import { generatePageMetadata } from '@/lib/seo';

// For a search page
const metadata = generatePageMetadata({
  query: 'vintage camera',
  location: 'Madrid'
});

console.log(metadata.title);
// "Find vintage camera second-hand in Madrid on Wallapop, Vinted & more | Findly"

console.log(metadata.description);
// "Discover second-hand vintage camera in Madrid. Compare prices..."
```

### Generate JSON-LD for SEO

```typescript
import { generateProductJsonLd, generateSearchResultsJsonLd } from '@/lib/seo';

// Single product
const productSchema = generateProductJsonLd({
  title: 'iPhone 15 Pro',
  description: 'Like new condition',
  price: 850,
  currency: 'EUR',
  image_url: 'https://...',
  source_url: 'https://wallapop.com/...',
  condition: 'like-new'
});

// Add to page
<script type="application/ld+json">
  {JSON.stringify(productSchema)}
</script>

// Search results page
const searchSchema = generateSearchResultsJsonLd({
  query: 'laptop',
  products: [...] // Array of products
});
```

### In Next.js Metadata

```typescript
// app/search/page.tsx
import { generateMetadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata({ searchParams }) {
  const metadata = generatePageMetadata({
    query: searchParams.q,
    category: searchParams.category
  });

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords
  };
}
```

---

## 5. Using the Sort Dropdown

```tsx
'use client';

import SortDropdown from '@/components/SortDropdown';
import { useState } from 'react';
import { SortOption } from '@/types';

export default function ProductList() {
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  const handleSortChange = async (newSort: SortOption) => {
    setSortBy(newSort);
    // Re-fetch products with new sort
    const results = await ProductService.searchProducts({
      sortBy: newSort
    });
  };

  return (
    <div>
      <SortDropdown value={sortBy} onChange={handleSortChange} />
      {/* Product grid */}
    </div>
  );
}
```

---

## 6. Using the Search Filters Hook

```tsx
'use client';

import { useSearchFilters } from '@/hooks/useSearchFilters';
import { ProductService } from '@/services/productService';
import { useEffect, useState } from 'react';

export default function SearchPage() {
  const {
    filters,
    updateQuery,
    updateCategory,
    updatePriceRange,
    updateSortBy,
    clearFilters,
    hasActiveFilters
  } = useSearchFilters({ sortBy: 'relevance' });

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const results = await ProductService.searchProducts(filters);
      setProducts(results.data);
    };
    fetchProducts();
  }, [filters]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => updateQuery(e.target.value)}
      />

      <button onClick={() => updateSortBy('price_asc')}>
        Sort by Price
      </button>

      {hasActiveFilters && (
        <button onClick={clearFilters}>Clear Filters</button>
      )}

      {/* Render products */}
    </div>
  );
}
```

---

## 7. Complete Search Page Example

```tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import FilterSidebar from '@/components/FilterSidebar';
import SortDropdown from '@/components/SortDropdown';
import ProductGrid from '@/components/ProductGrid';
import { useSearchFilters } from '@/hooks/useSearchFilters';
import { ProductService } from '@/services/productService';
import { Product } from '@/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    filters,
    setAllFilters,
    updateSortBy
  } = useSearchFilters({
    query: searchParams.get('q') || undefined,
    category: searchParams.get('category') || undefined
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const results = await ProductService.searchProducts(filters);
      setProducts(results.data);
      setLoading(false);
    };
    fetchData();
  }, [filters]);

  return (
    <div className="flex">
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setAllFilters}
        onApply={() => setIsFilterOpen(false)}
      />

      <div className="flex-1">
        <div className="flex justify-between mb-6">
          <h1>Search Results</h1>
          <SortDropdown
            value={filters.sortBy || 'relevance'}
            onChange={updateSortBy}
          />
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
```

---

## 8. Testing the Trust Engine

```typescript
import { test, expect } from '@jest/globals';
import { hasWantedIntent, isNoise, calculatePriceScore } from '@/services/trust-engine';

test('detects wanted intent in Spanish', () => {
  const product = {
    title: 'Busco iPhone 15',
    description: 'Necesito comprar urgente'
  };
  
  expect(hasWantedIntent(product)).toBe(true);
});

test('detects noise (phone accessory)', () => {
  const product = {
    category: 'tech-electronics',
    price: 15,
    currency: 'EUR',
    title: 'Funda para iPhone'
  };
  
  expect(isNoise(product)).toBe(true);
});

test('calculates bargain price score', () => {
  const product = { price: 100 };
  const median = 150;
  
  const score = calculatePriceScore(product, median);
  expect(score).toBe('bargain'); // 100 < 150 * 0.85 = 127.5
});
```

---

## Common Patterns

### 1. **Search with Location**
```typescript
const results = await ProductService.searchProducts({
  query: 'bike',
  location: 'Barcelona',
  sortBy: 'price_asc'
});
```

### 2. **Browse Category with Filters**
```typescript
const results = await ProductService.searchProducts({
  category: 'tech-electronics',
  priceScore: ['bargain'],
  condition: ['like-new', 'good'],
  dateFilter: '24h'
});
```

### 3. **Platform-Specific Search**
```typescript
const results = await ProductService.searchProducts({
  query: 'vintage camera',
  platform: ['wallapop'],
  sortBy: 'date_desc'
});
```

---

## Next Steps

1. **Add Autocomplete**: Use the search query to fetch suggestions
2. **Save Searches**: Store filters in localStorage for quick access
3. **Price Alerts**: Notify users when bargains appear in saved searches
4. **Advanced Analytics**: Track which filters drive the most clicks

---

For more details, see:
- `BUSINESS_LOGIC_IMPLEMENTATION.md` - Full technical documentation
- `PRD.md` - Product requirements
- `ARCHITECTURE.md` - System architecture
