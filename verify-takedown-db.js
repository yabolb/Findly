/**
 * Verify Takedown Requests in Database
 * 
 * This script queries the database to verify takedown requests are being stored correctly
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

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function verifyDatabaseRecords() {
    console.log('🔍 Verifying Takedown Requests in Database\n');
    console.log('='.repeat(60));

    // Query all takedown requests
    const { data, error, count } = await supabase
        .from('takedown_requests')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('❌ Query failed:', error.message);
        return;
    }

    console.log(`\n📊 Found ${count} total takedown request(s)\n`);

    if (data && data.length > 0) {
        console.log('📋 Most Recent Requests:\n');

        data.forEach((request, index) => {
            console.log(`[${index + 1}] Request ID: ${request.id}`);
            console.log(`    URL: ${request.listing_url}`);
            console.log(`    Reporter: ${request.reporter_name} (${request.reporter_email})`);
            console.log(`    Status: ${request.status}`);
            console.log(`    Reason: ${request.reason.substring(0, 80)}...`);
            console.log(`    IP: ${request.ip_address}`);
            console.log(`    Created: ${new Date(request.created_at).toLocaleString()}`);
            console.log('');
        });
    } else {
        console.log('ℹ️  No takedown requests found in database');
    }

    // Query by status
    const { data: pendingRequests } = await supabase
        .from('takedown_requests')
        .select('*')
        .eq('status', 'pending');

    console.log('='.repeat(60));
    console.log(`\n📌 Status Summary:`);
    console.log(`   Pending: ${pendingRequests?.length || 0}`);

    console.log('\n✅ Database verification complete!\n');
}

verifyDatabaseRecords();
