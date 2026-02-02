
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const token = process.env.AWIN_API_TOKEN;
const advertiserId = 13075; // El Corte Ingles

async function checkFeeds() {
    console.log(`Checking feeds for Advertiser ID: ${advertiserId}...\n`);

    const response = await fetch(
        `https://api.awin.com/advertisers/${advertiserId}/feeds`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        // It might be 404 if no feeds or 401 if unauthorized
        const text = await response.text();
        console.error('Body:', text);
        return;
    }

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

checkFeeds();
