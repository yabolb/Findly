
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRealtimeProgress() {
    console.log(`--- Real-time Sync Progress [${new Date().toLocaleTimeString()}] ---`);

    // 1. Get total product count
    const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    if (countError) console.error('Error fetching total count:', countError);
    else console.log(`📦 Total products in DB: ${count}`);

    // 2. Get latest logs
    const { data: logs, error: logsError } = await supabase
        .from('sync_logs')
        .select('*')
        .ilike('platform', 'awin-%')
        .order('created_at', { ascending: false })
        .limit(3);

    if (logsError) {
        console.error('Error fetching logs:', logsError);
    } else {
        console.log('\n--- Latest Sync Logs ---');
        logs.forEach(log => {
            const status = log.status || 'UNKNOWN';
            const added = log.items_added || 0;
            const updated = log.items_updated || 0;
            const time = new Date(log.created_at).toLocaleTimeString();
            console.log(`- ${log.platform}: ${status.toUpperCase()} | Added: ${added} | Updated: ${updated} | Time: ${time}`);
        });
    }

    // 3. Check for specific categories
    const categories = ['movies-books-music', 'baby-kids'];
    for (const cat of categories) {
        const { count: catCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category', cat);
        console.log(`📂 Products in '${cat}': ${catCount}`);
    }

    // 4. Check specific Rachmaninov items
    const { data: rach } = await supabase
        .from('products')
        .select('name, category, updated_at')
        .ilike('name', '%Rachmaninov%')
        .limit(3);

    if (rach && rach.length > 0) {
        console.log('\n🎹 Rachmaninov Items Status:');
        rach.forEach(item => {
            console.log(`   - [${item.category}] ${item.name} (Updated: ${new Date(item.updated_at).toLocaleTimeString()})`);
        });
    }
}

checkRealtimeProgress();
