-- Migration: Update platform constraint for affiliate partners
-- Date: 2026-01-18
-- Description: Add Amazon and other affiliate platforms to allowed platforms

-- Drop old constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_platform_check;

-- Add new constraint with affiliate platforms
ALTER TABLE products ADD CONSTRAINT products_platform_check 
  CHECK (platform IN (
    -- Original secondhand platforms
    'wallapop', 
    'vinted', 
    'ebay', 
    'milanuncios',
    -- New affiliate platforms (PRD v12.0)
    'amazon',
    'etsy',
    'elcorteingles',
    'fnac',
    'decathlon'
  ));
