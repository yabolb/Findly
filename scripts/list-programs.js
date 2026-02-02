
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const token = process.env.AWIN_API_TOKEN;
const publisherId = process.env.AWIN_PUBLISHER_ID;

async function listPrograms() {
    console.log(`Checking joined programs for Publisher ID: ${publisherId}...\n`);

    const response = await fetch(
        `https://api.awin.com/publishers/${publisherId}/programmes?relationship=joined`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        return;
    }

    const data = await response.json();
    console.log(`Found ${data.length} programs:`);
    data.forEach(p => console.log(`- ${p.name} (ID: ${p.advertiserId}) | Status: ${p.membershipStatus}`));
}

listPrograms();
