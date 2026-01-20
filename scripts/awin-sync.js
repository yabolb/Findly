
const { AwinService } = require('../src/lib/awin-service');

// Mock environment variables availability if not loaded purely by node
require('dotenv').config({ path: '.env.local' });

async function run() {
    console.log('Starting Awin Sync Script...');
    const service = new AwinService();
    try {
        await service.syncProducts();
        console.log('Sync completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Sync failed:', error);
        process.exit(1);
    }
}

run();
