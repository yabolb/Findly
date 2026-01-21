
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableExists() {
    console.log('--- Checking for sync_logs table ---');

    // Method 1: Try to insert a row
    const { error: insertError } = await supabaseAdmin
        .from('sync_logs')
        .insert([
            { platform: 'test-check', status: 'test', items_found: 0, items_added: 0 }
        ])
        .select();

    if (insertError) {
        console.log('Insert FAILED:', insertError.message);
        if (insertError.message.includes('relation "public.sync_logs" does not exist')) {
            console.log('CONFIRMED: Table sync_logs DOES NOT EXIST.');
        }
    } else {
        console.log('Insert SUCCESS. Table exists.');
        // cleanup
        await supabaseAdmin.from('sync_logs').delete().eq('platform', 'test-check');
    }

    // Method 2: Check pg_tables (requires rcp privileges usually, but let's try via admin client if possible, 
    // though supabase-js client is for data API, not schema inspection usually, unless we use rpc)
}

checkTableExists();
