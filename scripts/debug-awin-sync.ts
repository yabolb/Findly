
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local BEFORE importing other modules
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Verify env vars are loaded
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('Failed to load NEXT_PUBLIC_SUPABASE_URL from .env.local');
    process.exit(1);
}

async function runDebug() {
    console.log('--- Starting Debug Manual Sync ---');

    // Dynamic import to ensure env vars are ready before module init
    const { AwinService } = await import('@/lib/awin-service');

    const service = new AwinService();
    try {
        await service.syncProducts();
        console.log('--- Sync Function Completed (Check for inner errors) ---');
    } catch (err) {
        console.error('--- External Crash ---', err);
    }
}

runDebug();
