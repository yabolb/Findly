
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = process.env.AWIN_FEED_KEY || process.env.AWIN_API_TOKEN;
const listUrl = `https://productdata.awin.com/datafeed/list/apikey/${apiKey}`;

async function checkFnacFeeds() {
    console.log(`Fetching feed list...`);

    const response = await fetch(listUrl);
    if (!response.ok) {
        console.error('Error:', response.status, response.statusText);
        return;
    }

    const text = await response.text();
    const lines = text.split('\n');

    // Header check
    console.log('Header:', lines[0]);

    const fnacLines = lines.filter(l => l.includes('"77630"')); // 77630 is Fnac ID

    if (fnacLines.length > 0) {
        console.log(`\n✅ Found ${fnacLines.length} feeds for Fnac (77630):`);
        const feeds = fnacLines.map(l => {
            const parts = l.split('","').map(p => p.replace(/^"|"$/g, ''));
            return {
                id: parts[4],
                name: parts[5],
                count: parseInt(parts[10]),
                lastUpdate: parts[8]
            };
        });

        // Sort by count desc
        feeds.sort((a, b) => b.count - a.count);

        feeds.forEach(f => console.log(`- [${f.id}] ${f.name}: ${f.count} items (Updated: ${f.lastUpdate})`));
    } else {
        console.log('\n❌ No feeds found for Fnac (77630).');
    }
}

checkFnacFeeds();
