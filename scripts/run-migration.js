/**
 * Run database migration to add affiliate platforms
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log('🔄 Running migration: Add affiliate platforms\n');

    const sql = `
-- Drop old constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_platform_check;

-- Add new constraint with affiliate platforms
ALTER TABLE products ADD CONSTRAINT products_platform_check 
  CHECK (platform IN (
    'wallapop', 
    'vinted', 
    'ebay', 
    'milanuncios',
    'amazon',
    'etsy',
    'elcorteingles',
    'fnac',
    'decathlon'
  ));
`;

    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
        // RPC might not exist, try direct SQL (note: this won't work with JS client)
        console.log('ℹ️  Cannot run via RPC. Please run this SQL manually in Supabase Dashboard:\n');
        console.log('---');
        console.log(sql);
        console.log('---\n');
        console.log('📍 Go to: https://supabase.com/dashboard → SQL Editor');
        process.exit(1);
    }

    console.log('✅ Migration complete!');
    console.log('Amazon is now an allowed platform.');
}

runMigration();
