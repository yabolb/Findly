-- Add recipients and occasions columns to products table for multi-dimensional tagging

-- Add recipients column (array of recipient tags)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS recipients text[];

-- Add occasions column (array of occasion tags)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS occasions text[];

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_recipients ON products USING GIN(recipients);
CREATE INDEX IF NOT EXISTS idx_products_occasions ON products USING GIN(occasions);

-- Add comments for documentation
COMMENT ON COLUMN products.recipients IS 'Array of recipient tags: pareja, madre, padre, amigos, profesor, ninos, colegas';
COMMENT ON COLUMN products.occasions IS 'Array of occasion tags: cumpleanos, boda, navidad, aniversario, san-valentin, graduacion';
