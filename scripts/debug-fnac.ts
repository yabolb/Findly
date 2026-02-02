
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const { AwinService } = require('../src/lib/awin-service');

async function debugFnacSync() {
    console.log('🐞 Starting Debug Sync for Fnac...');
    const service = new AwinService();

    // 1. Check Joined Programs
    const partners = await service.fetchJoinedProgrammes();
    const fnac = partners.find(p => p.name.includes('Fnac'));

    if (!fnac) {
        console.error('❌ Fnac not found in Joined Programs list.');
        partners.forEach(p => console.log(`- ${p.name} (${p.id})`));
        return;
    }

    console.log(`✅ Found Fnac: ${fnac.name} (ID: ${fnac.id})`);

    // 2. Check Feed IDs
    const feedIds = await service.getFeedIds(fnac.id);
    if (!feedIds || feedIds.length === 0) {
        console.error('❌ No Feed IDs found for Fnac.');
        return;
    }

    console.log(`✅ Found ${feedIds.length} Feed IDs: ${feedIds.join(', ')}`);

    // 3. Dry Run logic
    feedIds.forEach(fid => {
        console.log(`- Generating URL for Feed ${fid}: ${service.getFeedUrl(fid)}`);
    });

    console.log('Ready to sync (Dry run complete).');
}

debugFnacSync().catch(console.error);
