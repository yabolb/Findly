-- ============================================
-- TAKEDOWN REQUESTS TABLE
-- Legal Safe Harbor Protection
-- ============================================

-- Create takedown_requests table
CREATE TABLE IF NOT EXISTS takedown_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_url TEXT NOT NULL,
    reporter_name TEXT NOT NULL,
    reporter_email TEXT NOT NULL,
    reason TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_takedown_requests_status ON takedown_requests(status);
CREATE INDEX IF NOT EXISTS idx_takedown_requests_created_at ON takedown_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_takedown_requests_listing_url ON takedown_requests(listing_url);

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE takedown_requests ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for form submissions)
CREATE POLICY "Allow public insert takedown requests"
    ON takedown_requests
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Only authenticated service role can read/update
CREATE POLICY "Service role can read all takedown requests"
    ON takedown_requests
    FOR SELECT
    TO service_role
    USING (true);

CREATE POLICY "Service role can update takedown requests"
    ON takedown_requests
    FOR UPDATE
    TO service_role
    USING (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_takedown_requests_updated_at
    BEFORE UPDATE ON takedown_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE takedown_requests IS 'Stores DMCA and legal takedown requests for Safe Harbor protection';
