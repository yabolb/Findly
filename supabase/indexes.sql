
-- =================================================================
-- PERFORMANCE OPTIMIZATION FOR 100k+ PRODUCTS
-- Run this in your Supabase Dashboard -> SQL Editor
-- =================================================================

-- 1. Index for Sorting (Critical for 'created_at' desc)
CREATE INDEX IF NOT EXISTS idx_products_created_at_desc ON products(created_at DESC);

-- 2. Index for Category Filtering (For Quiz Interests & Partial Search)
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- 3. Index for Price Filtering (For Budget)
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- 4. Indexes for Array Columns (Recipients & Occasions Tags)
-- Used when filtering by 'recipient' or 'occasion' URL params
CREATE INDEX IF NOT EXISTS idx_products_recipients ON products USING GIN(recipients);
CREATE INDEX IF NOT EXISTS idx_products_occasions ON products USING GIN(occasions);

-- 5. Compound Index for common Quiz patterns (Category + Price)
CREATE INDEX IF NOT EXISTS idx_products_cat_price ON products(category, price);

-- Verification:
-- After running, your query timeouts (Error 57014) should disappear immediately.
