/**
 * Run migration 003: Update category constraint
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
    console.log('📝 Running migration 003: Update category constraint...\n');

    const migrationPath = path.join(__dirname, '../supabase/migrations/003_update_category_constraint.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });

    if (error) {
        console.error('❌ Migration failed:', error.message);
        console.log('\n⚠️  Please run this SQL manually in Supabase Dashboard:');
        console.log('   Dashboard → SQL Editor → New Query → Paste the SQL below:\n');
        console.log('---');
        console.log(sql);
        console.log('---\n');
        process.exit(1);
    }

    console.log('✅ Migration completed successfully!');
    console.log('✅ Category constraint updated: sports-leisure → sports-outdoors');
}

runMigration();
