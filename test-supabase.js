// Test script to verify Supabase connection
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually load .env.local file
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
            envVars[key.trim()] = valueParts.join('=').trim();
        }
    }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...\n');

// Check if credentials are loaded
console.log('1️⃣ Checking environment variables:');
console.log(`   URL: ${supabaseUrl ? '✅ Loaded' : '❌ Missing'}`);
console.log(`   Anon Key: ${supabaseAnonKey ? '✅ Loaded (${supabaseAnonKey.substring(0, 20)}...)' : '❌ Missing'}\n`);

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing credentials. Please check your .env.local file.');
    process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        console.log('2️⃣ Testing connection to Supabase...');

        // Try to fetch from products table
        const { data, error, count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.log(`   ⚠️  Query error: ${error.message}`);
            console.log(`   Code: ${error.code}`);
            console.log(`   Details: ${error.details || 'N/A'}`);

            if (error.code === '42P01') {
                console.log('\n📝 Note: Table "products" does not exist yet.');
                console.log('   This is expected if you haven\'t created the table.');
                console.log('   The connection to Supabase is working! ✅\n');
            } else {
                console.log('\n❌ Connection test failed.\n');
            }
        } else {
            console.log('   ✅ Successfully connected to Supabase!');
            console.log(`   📊 Products table has ${count || 0} rows\n`);
        }

        // Test basic query to verify connection works
        console.log('3️⃣ Verifying authentication...');
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError && authError.message !== 'Auth session missing!') {
            console.log(`   ⚠️  Auth error: ${authError.message}`);
        } else {
            console.log('   ✅ Authentication configured correctly\n');
        }

        console.log('✨ Connection test complete!\n');

    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
        process.exit(1);
    }
}

testConnection();
