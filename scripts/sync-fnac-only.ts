
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const { AwinService } = require('../src/lib/awin-service');
const { supabaseAdmin: supabase } = require('../src/lib/supabase-admin');

async function syncFnacOnly() {
    console.log('📚 Starting FNAC-only Sync...');
    const service = new AwinService();

    // 1. Get Fnac Partner
    const partners = await service.fetchJoinedProgrammes();
    const fnac = partners.find(p => p.name.includes('Fnac'));

    if (!fnac) {
        console.error('❌ Fnac not found in joined programs.');
        return;
    }

    console.log(`✅ Found Fnac: ${fnac.name} (ID: ${fnac.id})`);

    // 2. Get Feed IDs
    const feedIds = await service.getFeedIds(fnac.id);
    if (!feedIds || feedIds.length === 0) {
        console.error('❌ No Feeds found.');
        return;
    }

    console.log(`✅ Found ${feedIds.length} target feeds.`);

    // 3. Process Loops
    const platformName = `awin-${fnac.name}`;
    await service.cleanupStaleLogs(platformName);

    let totalStats = { processed: 0, added: 0, errors: 0 };

    for (const feedId of feedIds) {
        console.log(`\n⬇️ Processing Feed ID: ${feedId}...`);
        const feedUrl = service.getFeedUrl(feedId);

        // Create Log (One per feed to match service logic style, 
        // essentially mimic the internal loop but controlled here)
        // Actually, let's keep it simple and just use the service helpers if possible?
        // But the internal loop inside service is private/monolithic.
        // We will manually invoke downloadAndProcessFeed.

        const { data: logEntry } = await supabase
            .from('sync_logs')
            .insert({
                platform: platformName, // Or appending feed ID? Keep standard for now.
                status: 'running',
                items_found: 0,
                items_added: 0
            })
            .select()
            .single();

        const logId = logEntry?.id;

        const stats = await service.downloadAndProcessFeed(feedUrl, fnac.id, fnac.name, logId);

        // Update Log
        if (logId) {
            await supabase
                .from('sync_logs')
                .update({
                    status: 'success',
                    items_found: stats.processed,
                    items_added: stats.added,
                    error_message: stats.errors > 0 ? `${stats.errors} row errors` : null
                })
                .eq('id', logId);
        }

        totalStats.processed += stats.processed;
        totalStats.added += stats.added;
        totalStats.errors += stats.errors;
    }

    console.log('\n✅ FNAC Sync Complete!');
    console.log(`- Processed: ${totalStats.processed}`);
    console.log(`- Added/Updated: ${totalStats.added}`);
    console.log(`- Errors: ${totalStats.errors}`);
}

syncFnacOnly().catch(console.error);
