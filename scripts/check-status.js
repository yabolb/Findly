
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkStatus() {
    console.log('--- Checking Sync Status ---');

    // Check running logs
    const { data: running } = await supabase
        .from('sync_logs')
        .select('*')
        .ilike('platform', 'awin-%')
        .eq('status', 'running');

    if (running && running.length > 0) {
        console.log('✅ YES, Awin Sync is RUNNING.');
        running.forEach(log => console.log(`   - ${log.platform} started at ${new Date(log.created_at).toLocaleTimeString()}`));
    } else {
        console.log('❌ No active sync found.');
    }

    // Check latest finished logs
    const { data: latest } = await supabase
        .from('sync_logs')
        .select('*')
        .ilike('platform', 'awin-%')
        .order('created_at', { ascending: false })
        .limit(3);

    console.log('\n--- Latest Logs ---');
    latest.forEach(log => {
        console.log(`${log.platform}: ${log.status.toUpperCase()} (${log.items_added} items added) - ${new Date(log.created_at).toLocaleTimeString()}`);
    });

    // Check product count
    const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('source_network', 'awin');

    console.log(`\n📦 Total Awin Products: ${count}`);
}

checkStatus();
