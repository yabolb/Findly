
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = process.env.AWIN_FEED_KEY || process.env.AWIN_API_TOKEN;
const listUrl = `https://productdata.awin.com/datafeed/list/apikey/${apiKey}`;

async function checkFeedList() {
    console.log(`Fetching feed list from: ${listUrl}...\n`);

    const response = await fetch(listUrl);
    if (!response.ok) {
        console.error('Error:', response.status, response.statusText);
        return;
    }

    const text = await response.text();
    const lines = text.split('\n');
    console.log(`Total lines in feed list: ${lines.length}`);

    // Header check
    console.log('Header:', lines[0]);

    const bikilaLines = lines.filter(l => l.includes('"75838"')); // 75838 is BIKILA ID

    if (bikilaLines.length > 0) {
        console.log(`\n✅ Found ${bikilaLines.length} feeds for BIKILA (75838):`);
        bikilaLines.forEach(l => console.log(l));
    } else {
        console.log('\n❌ No feeds found for BIKILA (75838) in the master feed list.');
        console.log('\nSample lines (ECI):');
        lines.filter(l => l.includes('"13075"')).slice(0, 3).forEach(l => console.log(l));
    }
}

checkFeedList();
