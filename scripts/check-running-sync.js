
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key);

async function checkRunningSyncs() {
    console.log('Checking for running syncs...');

    const { data: runningSyncs, error } = await supabase
        .from('sync_logs')
        .select('*')
        .eq('status', 'running');

    if (error) {
        console.error('Error fetching running syncs:', error);
        return;
    }

    if (runningSyncs.length > 0) {
        console.log(`⚠️ Found ${runningSyncs.length} running sync(s):`);
        runningSyncs.forEach(sync => {
            console.log(`- ID: ${sync.id}`);
            console.log(`  Platform: ${sync.platform}`);
            console.log(`  Started: ${sync.created_at}`);
            console.log(`  Items Found: ${sync.items_found}`);
            console.log(`  Items Added: ${sync.items_added}`);
            console.log('-------------------');
        });
    } else {
        console.log('✅ No syncs are currently running.');
    }
}

checkRunningSyncs();
