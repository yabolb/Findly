-- ============================================
-- SYNC LOGS TABLE
-- ============================================
-- Stores health data for scraper monitoring
-- Used by the Health Center dashboard to track
-- ban detection, success rates, and platform health.
--
-- Created: 2026-01-16
-- Author: Senior Reliability & Data Engineer
-- ============================================

-- Create enum for sync status
CREATE TYPE sync_status AS ENUM ('success', 'error', 'banned', 'suspicious', 'timeout');

-- Create the sync_logs table
CREATE TABLE IF NOT EXISTS sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Platform identification
    platform TEXT NOT NULL,
    
    -- Sync status
    status sync_status NOT NULL DEFAULT 'error',
    
    -- HTTP response details
    error_code INTEGER,                  -- HTTP status code (e.g., 403, 429, 200)
    error_message TEXT,                  -- Detailed error message if any
    
    -- Metrics
    items_found INTEGER DEFAULT 0,       -- Number of items found in this sync
    items_inserted INTEGER DEFAULT 0,    -- Number of new items inserted
    items_updated INTEGER DEFAULT 0,     -- Number of existing items updated
    
    -- Request details
    search_query TEXT,                   -- The search query used (if applicable)
    request_duration_ms INTEGER,         -- How long the request took
    
    -- Ban detection
    ban_reason TEXT,                     -- Reason for ban if detected
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    
    -- Indexes for efficient querying
    CONSTRAINT valid_platform CHECK (platform IN ('wallapop', 'vinted', 'ebay', 'milanuncios'))
);

-- ============================================
-- INDEXES
-- ============================================

-- Index for filtering by platform
CREATE INDEX idx_sync_logs_platform ON sync_logs(platform);

-- Index for filtering by status
CREATE INDEX idx_sync_logs_status ON sync_logs(status);

-- Index for querying recent logs (most common query)
CREATE INDEX idx_sync_logs_created_at ON sync_logs(created_at DESC);

-- Composite index for platform + created_at (dashboard queries)
CREATE INDEX idx_sync_logs_platform_created ON sync_logs(platform, created_at DESC);

-- Index for error code filtering
CREATE INDEX idx_sync_logs_error_code ON sync_logs(error_code) WHERE error_code IS NOT NULL;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow the service role to insert logs
CREATE POLICY "Service role can insert sync logs"
    ON sync_logs
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Policy: Allow the service role to read logs
CREATE POLICY "Service role can read sync logs"
    ON sync_logs
    FOR SELECT
    TO service_role
    USING (true);

-- Policy: Allow authenticated users to read logs (for admin dashboard)
CREATE POLICY "Authenticated users can read sync logs"
    ON sync_logs
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow anon to read (for public dashboard if needed)
CREATE POLICY "Anon can read sync logs"
    ON sync_logs
    FOR SELECT
    TO anon
    USING (true);

-- ============================================
-- HELPER VIEWS
-- ============================================

-- View: Latest sync per platform
CREATE OR REPLACE VIEW latest_sync_per_platform AS
SELECT DISTINCT ON (platform)
    id,
    platform,
    status,
    error_code,
    error_message,
    items_found,
    created_at
FROM sync_logs
ORDER BY platform, created_at DESC;

-- View: Platform health summary (last 24 hours)
CREATE OR REPLACE VIEW platform_health_24h AS
SELECT
    platform,
    COUNT(*) AS total_syncs,
    COUNT(*) FILTER (WHERE status = 'success') AS successful_syncs,
    COUNT(*) FILTER (WHERE status IN ('banned', 'error')) AS failed_syncs,
    ROUND(
        (COUNT(*) FILTER (WHERE status = 'success')::NUMERIC / NULLIF(COUNT(*), 0)) * 100,
        2
    ) AS success_rate_percent,
    SUM(items_found) AS total_items_found,
    SUM(items_inserted) AS total_items_inserted,
    AVG(request_duration_ms)::INTEGER AS avg_request_ms,
    MAX(created_at) AS last_sync_at
FROM sync_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY platform;

-- View: Recent ban events
CREATE OR REPLACE VIEW recent_bans AS
SELECT
    id,
    platform,
    error_code,
    ban_reason,
    created_at
FROM sync_logs
WHERE status = 'banned'
  AND created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 50;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function: Get platform health stats
CREATE OR REPLACE FUNCTION get_platform_health(
    p_platform TEXT,
    p_hours INTEGER DEFAULT 24
)
RETURNS TABLE (
    total_syncs BIGINT,
    success_count BIGINT,
    error_count BIGINT,
    banned_count BIGINT,
    suspicious_count BIGINT,
    success_rate NUMERIC,
    total_items_found BIGINT,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    last_status sync_status
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT AS total_syncs,
        COUNT(*) FILTER (WHERE sl.status = 'success')::BIGINT AS success_count,
        COUNT(*) FILTER (WHERE sl.status = 'error')::BIGINT AS error_count,
        COUNT(*) FILTER (WHERE sl.status = 'banned')::BIGINT AS banned_count,
        COUNT(*) FILTER (WHERE sl.status = 'suspicious')::BIGINT AS suspicious_count,
        ROUND(
            (COUNT(*) FILTER (WHERE sl.status = 'success')::NUMERIC / NULLIF(COUNT(*), 0)) * 100,
            2
        ) AS success_rate,
        COALESCE(SUM(sl.items_found), 0)::BIGINT AS total_items_found,
        MAX(sl.created_at) AS last_sync_at,
        (
            SELECT sl2.status
            FROM sync_logs sl2
            WHERE sl2.platform = p_platform
            ORDER BY sl2.created_at DESC
            LIMIT 1
        ) AS last_status
    FROM sync_logs sl
    WHERE sl.platform = p_platform
      AND sl.created_at > NOW() - (p_hours || ' hours')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- Function: Check if platform is banned (3 consecutive failures)
CREATE OR REPLACE FUNCTION is_platform_banned(p_platform TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    ban_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO ban_count
    FROM (
        SELECT status
        FROM sync_logs
        WHERE platform = p_platform
        ORDER BY created_at DESC
        LIMIT 3
    ) recent_logs
    WHERE status IN ('banned', 'error');
    
    RETURN ban_count >= 3;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMMENT ON TABLE
-- ============================================
COMMENT ON TABLE sync_logs IS 'Stores health and monitoring data for all scraper sync operations';
COMMENT ON COLUMN sync_logs.platform IS 'Platform identifier (wallapop, vinted, ebay, milanuncios)';
COMMENT ON COLUMN sync_logs.status IS 'Sync result status (success, error, banned, suspicious, timeout)';
COMMENT ON COLUMN sync_logs.error_code IS 'HTTP status code from the scraping request';
COMMENT ON COLUMN sync_logs.items_found IS 'Number of product items found during sync';
COMMENT ON COLUMN sync_logs.ban_reason IS 'Explanation if platform detected as banned';
