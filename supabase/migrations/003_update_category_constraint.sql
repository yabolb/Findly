-- ========================================
-- FINDLY - UPDATE CATEGORY CONSTRAINT
-- ========================================
-- Migration: 003_update_category_constraint
-- Description: Update category constraint to align with actual Findly categories (sports-outdoors instead of sports-leisure)
-- ========================================

-- Drop the old category constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- Add the updated category constraint with correct Findly categories
ALTER TABLE products ADD CONSTRAINT products_category_check CHECK (category IN (
  'cars-motorcycles',
  'fashion',
  'real-estate',
  'tech-electronics',
  'sports-outdoors',      -- Updated from 'sports-leisure'
  'home-garden',
  'movies-books-music',
  'baby-kids',
  'collectibles-art',
  'diy',
  'agriculture-industrial',
  'services',
  'others'
));

-- ========================================
-- NOTES
-- ========================================
-- This migration updates the category constraint to use 'sports-outdoors'
-- which is the actual category used in the Findly app (src/lib/constants.ts)
-- The previous schema used 'sports-leisure' which was inconsistent.
