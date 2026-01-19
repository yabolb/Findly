-- ========================================
-- FINDLY - UPDATE CATEGORY CONSTRAINT (FINAL)
-- ========================================
-- Migration: 004_final_category_update
-- Description: Align database categories with app TypeScript definitions
--              - Split movies-books-music into movies, books, music
--              - Change sports-leisure to sports-outdoors
--              - Remove unused categories (cars-motorcycles, real-estate, agriculture-industrial, services)
-- ========================================

-- Drop the old category constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- Add the final category constraint matching src/types/index.ts exactly
ALTER TABLE products ADD CONSTRAINT products_category_check CHECK (category IN (
  'tech-electronics',
  'fashion',
  'sports-outdoors',
  'home-garden',
  'movies',
  'books',
  'music',
  'baby-kids',
  'collectibles-art',
  'diy',
  'motor-accessories',
  'beauty-personal-care',
  'travel-experiences'
));

-- ========================================
-- NOTES
-- ========================================
-- This migration ensures perfect alignment between:
-- 1. Database schema (this SQL)
-- 2. TypeScript types (src/types/index.ts)
-- 3. Footer links (src/components/layout/Footer.tsx)
-- 4. Amazon PA-API mapping (src/lib/amazon-paapi.ts)
