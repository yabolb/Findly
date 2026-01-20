
import dotenv from 'dotenv';
import path from 'path';

// Load env vars BEFORE importing modules that use them
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testConnection() {
    console.log('Testing Awin API Connection...');

    // Dynamic import to ensure env vars are loaded first
    const { AwinService } = await import('../src/lib/awin-service');

    const service = new AwinService();
    try {
        const partners = await service.fetchJoinedProgrammes();
        console.log(`SUCCESS: Authenticated and found ${partners.length} partners.`);
        partners.forEach((p: any) => console.log(`- ${p.name} (ID: ${p.id})`));
    } catch (error: any) {
        console.error('CONNECTION FAILED:', error.message);
    }
}

testConnection();

