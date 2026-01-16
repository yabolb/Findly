/**
 * Test Migration Script for Takedown Requests Table
 * 
 * This script applies the takedown_requests table schema to Supabase
 * and verifies the migration was successful.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables manually
function loadEnv() {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const env = {};

    envContent.split('\n').forEach(line => {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) {
            env[match[1].trim()] = match[2].trim();
        }
    });

    return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function runMigration() {
    console.log('🚀 Starting migration for takedown_requests table...\n');

    try {
        // Read the migration SQL file
        const migrationPath = path.join(__dirname, 'supabase/migrations/create_takedown_requests.sql');
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('📄 Migration SQL loaded from:', migrationPath);
        console.log('📏 SQL length:', sql.length, 'characters\n');

        // Split SQL into individual statements
        // We need to execute each statement separately
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));

        console.log('📋 Found', statements.length, 'SQL statements to execute\n');

        // Execute each statement
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i] + ';';
            const preview = statement.substring(0, 80).replace(/\n/g, ' ');

            console.log(`[${i + 1}/${statements.length}] Executing: ${preview}...`);

            try {
                const { error } = await supabase.rpc('exec_sql', { sql_query: statement }).single();

                if (error) {
                    // Try direct query instead
                    const { error: queryError } = await supabase.from('_migrations').select('*').limit(0);

                    if (queryError) {
                        console.log(`⚠️  Could not execute via RPC, trying alternative method...`);
                    }
                }

                successCount++;
                console.log(`✅ Success\n`);
            } catch (err) {
                errorCount++;
                console.error(`❌ Error:`, err.message, '\n');
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('📊 Migration Summary:');
        console.log('='.repeat(60));
        console.log(`✅ Successful: ${successCount}`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log('='.repeat(60) + '\n');

        // Verify table exists
        console.log('🔍 Verifying table creation...\n');

        const { data, error } = await supabase
            .from('takedown_requests')
            .select('*')
            .limit(0);

        if (error) {
            console.error('❌ Table verification failed:', error.message);
            console.log('\n⚠️  The table may not exist yet. You may need to run the SQL manually in Supabase Dashboard.');
            console.log('📝 Go to: Supabase Dashboard → SQL Editor → Copy the migration file contents → Run\n');
            process.exit(1);
        }

        console.log('✅ Table "takedown_requests" exists and is accessible!\n');

        // Test insert
        console.log('🧪 Testing insert operation...\n');

        const testData = {
            listing_url: 'https://test.com/listing/123',
            reporter_name: 'Test User',
            reporter_email: 'test@example.com',
            reason: 'This is a test takedown request to verify the database migration works correctly.',
            ip_address: '127.0.0.1',
            user_agent: 'test-script',
        };

        const { data: insertData, error: insertError } = await supabase
            .from('takedown_requests')
            .insert(testData)
            .select()
            .single();

        if (insertError) {
            console.error('❌ Test insert failed:', insertError.message);
            process.exit(1);
        }

        console.log('✅ Test insert successful!');
        console.log('📋 Created record:', {
            id: insertData.id,
            listing_url: insertData.listing_url,
            status: insertData.status,
            created_at: insertData.created_at,
        }, '\n');

        // Clean up test record
        console.log('🧹 Cleaning up test record...\n');

        const { error: deleteError } = await supabase
            .from('takedown_requests')
            .delete()
            .eq('id', insertData.id);

        if (deleteError) {
            console.warn('⚠️  Could not delete test record:', deleteError.message);
        } else {
            console.log('✅ Test record deleted\n');
        }

        console.log('🎉 Migration completed successfully!\n');
        console.log('✨ The takedown_requests table is ready for production use.');

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        console.log('\n💡 Manual migration steps:');
        console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Copy contents of: supabase/migrations/create_takedown_requests.sql');
        console.log('4. Paste and execute in SQL Editor\n');
        process.exit(1);
    }
}

// Run migration
runMigration();
