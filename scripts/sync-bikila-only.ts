
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const { AwinService } = require('../src/lib/awin-service');
const { supabaseAdmin: supabase } = require('../src/lib/supabase-admin');

async function syncBikilaOnly() {
    console.log('👟 Starting BIKILA-only Sync...');
    const service = new AwinService();

    // 1. Get BIKILA Partner
    const partners = await service.fetchJoinedProgrammes();
    const bikila = partners.find(p => p.name.includes('BIKILA'));

    if (!bikila) {
        console.error('❌ BIKILA not found in joined programs.');
        return;
    }

    console.log(`✅ Found BIKILA: ${bikila.name} (ID: ${bikila.id})`);

    // 2. Get Feed
    const feedId = await service.getFeedId(bikila.id);
    if (!feedId) {
        console.error('❌ No Feed found.');
        return;
    }

    const feedUrl = service.getFeedUrl(feedId);

    // 3. Create Log
    const platformName = `awin-${bikila.name}`;
    await service.cleanupStaleLogs(platformName);

    const { data: logEntry } = await supabase
        .from('sync_logs')
        .insert({
            platform: platformName,
            status: 'running',
            items_found: 0,
            items_added: 0
        })
        .select()
        .single();

    const logId = logEntry?.id;

    // 4. Download & Process
    const stats = await service.downloadAndProcessFeed(feedUrl, bikila.id, bikila.name, logId);

    // 5. Update Log
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

    console.log('✅ BIKILA Sync Complete!');
    console.log(`- Processed: ${stats.processed}`);
    console.log(`- Added/Updated: ${stats.added}`);
    console.log(`- Errors: ${stats.errors}`);
}

syncBikilaOnly().catch(console.error);
