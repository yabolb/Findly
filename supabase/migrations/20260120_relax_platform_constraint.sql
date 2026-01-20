-- Migration: 20260120_relax_platform_constraint
-- Description: Relax platform constraint to allow dynamic values and add source_network column

-- 1. Drop the existing check constraint on platform safely
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_platform_check') THEN 
        ALTER TABLE products DROP CONSTRAINT products_platform_check; 
    END IF; 
END $$;

-- 2. Add the source_network column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'source_network') THEN 
        ALTER TABLE products ADD COLUMN source_network TEXT; 
    END IF; 
END $$;

-- 3. Create an index on source_network for filtering
CREATE INDEX IF NOT EXISTS idx_products_source_network ON products(source_network);
