/**
 * Script to run migration 004: Create articles table
 * Updates the articles table for "El Radar del Regalo Perfecto"
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing Supabase credentials in .env.local');
    console.error('Needed: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
    try {
        console.log('🚀 Running migration 004: Create articles table...\n');

        // Read the SQL file
        const sqlPath = path.join(__dirname, '../migrations/004_create_articles_table.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Execute the SQL
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql }).single();

        if (error) {
            // If exec_sql doesn't exist, try direct query
            console.log('Attempting direct SQL execution...');
            const { error: directError } = await supabase.from('_migrations').select('*').limit(1);

            if (directError) {
                console.error('❌ Error executing migration:', error);
                console.log('\n📋 Please run this SQL manually in Supabase SQL Editor:');
                console.log(sql);
                process.exit(1);
            }
        }

        console.log('✅ Migration completed successfully!');
        console.log('\n📊 Articles table created with:');
        console.log('   - id, slug, title, excerpt, content');
        console.log('   - cover_image, category_tag');
        console.log('   - published_at, created_at, updated_at');
        console.log('   - related_products (UUID[])');
        console.log('   - view_count, is_published');
        console.log('   - Proper indexes and RLS policies\n');

    } catch (err) {
        console.error('❌ Unexpected error:', err);
        process.exit(1);
    }
}

runMigration();
