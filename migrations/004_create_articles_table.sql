-- Migration 004: Create articles table for "El Radar del Regalo Perfecto"
-- Content marketing section to capture SEO traffic and funnel users to quiz/products

CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    category_tag TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    related_products UUID[] DEFAULT '{}',
    view_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false
);

-- Create indexes for performance
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category_tag ON articles(category_tag);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC) WHERE is_published = true;
CREATE INDEX idx_articles_related_products ON articles USING GIN(related_products);

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Public read access for published articles
CREATE POLICY "Public read access for published articles"
ON articles FOR SELECT
USING (is_published = true);

-- Admin full access (authenticated users with admin role)
-- Note: Adjust this based on your auth setup
CREATE POLICY "Admin full access to articles"
ON articles FOR ALL
USING (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated_at
BEFORE UPDATE ON articles
FOR EACH ROW
EXECUTE FUNCTION update_articles_updated_at();

-- Add comment for documentation
COMMENT ON TABLE articles IS 'Content marketing articles for "El Radar del Regalo Perfecto" - SEO funnel to quiz and products';
