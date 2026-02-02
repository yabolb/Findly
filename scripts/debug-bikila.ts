
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const { AwinService } = require('../src/lib/awin-service');

async function debugBikilaSync() {
    console.log('🐞 Starting Debug Sync for BIKILA...');
    const service = new AwinService();

    // 1. Check Joined Programs
    const partners = await service.fetchJoinedProgrammes();
    const bikila = partners.find(p => p.name.includes('BIKILA'));

    if (!bikila) {
        console.error('❌ BIKILA not found in Joined Programs list.');
        // Log all names to see what's there
        partners.forEach(p => console.log(`- ${p.name} (${p.id})`));
        return;
    }

    console.log(`✅ Found BIKILA: ${bikila.name} (ID: ${bikila.id})`);

    // 2. Check Feed ID
    const feedId = await service.getFeedId(bikila.id);
    if (!feedId) {
        console.error('❌ No Feed ID found for BIKILA.');
        return;
    }

    console.log(`✅ Found Feed ID: ${feedId}`);

    // 3. Dry Run Feed Processing (simulated)
    const feedUrl = service.getFeedUrl(feedId);
    console.log(`✅ Generated Feed URL: ${feedUrl}`);
    console.log('Ready to sync (Dry run complete).');
}

// Mock Supabase to avoid errors during import if needed, 
// but run-awin-sync imports src/lib/awin-service which uses 'supabase-admin'
// We might need to handle the import via tsx
debugBikilaSync().catch(console.error);
