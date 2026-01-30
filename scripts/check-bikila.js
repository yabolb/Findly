const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const token = process.env.AWIN_API_TOKEN;
const publisherId = process.env.AWIN_PUBLISHER_ID;

async function checkBikila() {
    console.log('🔍 Checking for BIKILA in joined programs...\n');

    const response = await fetch(
        `https://api.awin.com/publishers/${publisherId}/programmes?relationship=joined`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    );

    const data = await response.json();
    const bikila = data.find(p => p.advertiserId === 75838);

    if (bikila) {
        console.log('✅ BIKILA ES Found:');
        console.log(JSON.stringify(bikila, null, 2));
    } else {
        console.log('❌ BIKILA ES (ID: 75838) not found in joined programs');
        console.log(`Total joined programs: ${data.length}`);
    }
}

checkBikila();
