So...
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables correctly
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runSync() {
    console.log('🚀 Starting Awin Sync...');

    try {
        const { AwinService } = await import('../src/lib/awin-service');
        const service = new AwinService();

        await service.syncProducts();

        console.log('✅ Sync process finished.');
    } catch (error) {
        console.error('💥 Sync failed:', error);
        process.exit(1);
    }
}

runSync();
