/**
 * Server-side Supabase Admin Client
 * Uses service role key for elevated privileges (INSERT, UPDATE)
 * Only use in API routes, never expose to client
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Admin Supabase client for server-side operations
 * This client bypasses Row Level Security (RLS)
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
