-- Create sync_logs table for tracking scraper runs
CREATE TABLE IF NOT EXISTS public.sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    status TEXT NOT NULL,
    items_found INT DEFAULT 0,
    items_added INT DEFAULT 0,
    error_message TEXT,
    http_status INT,
    response_time_ms INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_sync_logs_platform ON public.sync_logs(platform);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON public.sync_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON public.sync_logs(status);

-- Enable RLS (Row Level Security)
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access (for admin dashboard)
CREATE POLICY "Allow public read access to sync_logs"
    ON public.sync_logs
    FOR SELECT
    USING (true);

-- Create policy to allow insert from authenticated users (for scraper)
CREATE POLICY "Allow insert to sync_logs"
    ON public.sync_logs
    FOR INSERT
    WITH CHECK (true);

-- Grant permissions
GRANT SELECT ON public.sync_logs TO anon, authenticated;
GRANT INSERT ON public.sync_logs TO anon, authenticated;
