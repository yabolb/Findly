-- ========================================
-- FINDLY - PRODUCTS TABLE SCHEMA (PRD-Compliant)
-- ========================================
-- Migration: 001_products_table
-- Description: Core products table for multi-platform aggregation with Trust Engine support
-- ========================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Product Information
  title TEXT NOT NULL,
  description TEXT,
  
  -- Pricing
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  currency TEXT DEFAULT 'EUR' NOT NULL,
  
  -- Media
  image_url TEXT,
  
  -- Source Information
  source_url TEXT UNIQUE NOT NULL, -- External URL (must be unique)
  platform TEXT NOT NULL CHECK (platform IN ('wallapop', 'vinted', 'ebay', 'milanuncios')),
  
  -- Classification
  category TEXT NOT NULL CHECK (category IN (
    'cars-motorcycles',
    'fashion',
    'real-estate',
    'tech-electronics',
    'sports-leisure',
    'home-garden',
    'movies-books-music',
    'baby-kids',
    'collectibles-art',
    'diy',
    'agriculture-industrial',
    'services',
    'others'
  )),
  
  -- Location
  location TEXT,
  
  -- Condition
  condition TEXT CHECK (condition IN ('new', 'like-new', 'good', 'fair', 'poor')),
  
  -- Trust Engine Fields
  phash TEXT, -- Perceptual hash for image de-duplication
  price_score TEXT CHECK (price_score IN ('bargain', 'fair', 'expensive') OR price_score IS NULL),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================
-- INDEXES (Performance Optimization)
-- ========================================

-- Category filtering (most common query)
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Platform filtering
CREATE INDEX IF NOT EXISTS idx_products_platform ON products(platform);

-- Price range queries
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- De-duplication lookups (Trust Engine)
CREATE INDEX IF NOT EXISTS idx_products_phash ON products(phash) WHERE phash IS NOT NULL;

-- Price score filtering (Bargain finder)
CREATE INDEX IF NOT EXISTS idx_products_price_score ON products(price_score) WHERE price_score IS NOT NULL;

-- Recency sorting (most common sort)
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Location search
CREATE INDEX IF NOT EXISTS idx_products_location ON products(location) WHERE location IS NOT NULL;

-- Full-text search on title and description
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- ========================================
-- FUNCTIONS & TRIGGERS
-- ========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS (products are public read, admin write)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public can read all products
CREATE POLICY "Products are publicly readable"
  ON products
  FOR SELECT
  USING (true);

-- Only authenticated users can insert (for future scraper auth)
CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update/delete
CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- ========================================
-- SAMPLE DATA (For Testing)
-- ========================================

-- Uncomment to insert sample products
/*
INSERT INTO products (title, price, currency, image_url, source_url, platform, category, location, condition, price_score) VALUES
  ('iPhone 13 Pro 128GB', 599.99, 'EUR', 'https://example.com/iphone.jpg', 'https://wallapop.com/item/123', 'wallapop', 'tech-electronics', 'Madrid, Spain', 'good', 'bargain'),
  ('Vintage Leather Jacket', 89.50, 'EUR', 'https://example.com/jacket.jpg', 'https://vinted.com/item/456', 'vinted', 'fashion', 'Barcelona, Spain', 'like-new', 'fair'),
  ('Mountain Bike Trek', 450.00, 'EUR', 'https://example.com/bike.jpg', 'https://wallapop.com/item/789', 'wallapop', 'sports-leisure', 'Valencia, Spain', 'good', 'expensive');
*/
