
const { AwinService } = require('../src/lib/awin-service');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
    console.log('Testing Awin API Connection...');
    const service = new AwinService();
    try {
        const partners = await service.fetchJoinedProgrammes();
        console.log(`SUCCESS: Authenticated and found ${partners.length} partners.`);
        partners.forEach(p => console.log(`- ${p.name} (ID: ${p.id})`));
    } catch (error) {
        console.error('CONNECTION FAILED:', error.message);
    }
}

testConnection();
