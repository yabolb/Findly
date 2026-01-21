
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const AWIN_API_TOKEN = process.env.AWIN_API_TOKEN;
const advertiserId = 13075; // El Corte Ingles

// Simplest URL: No columns, no compression specified (defaults)
const url = `https://productdata.awin.com/datafeed/download/apikey/${AWIN_API_TOKEN}/language/any/fid/${advertiserId}/format/csv`;

console.log('Testing Simplest URL:', url);

async function testUrl() {
    try {
        const response = await fetch(url);
        console.log(`Status: ${response.status} ${response.statusText}`);
        if (!response.ok) {
            // console.log('Error Body:', (await response.text()).slice(0,500));
        } else {
            console.log('Success! Headers:', response.headers.get('content-type'));
        }
    } catch (e) {
        console.error('Fetch failed:', e);
    }
}

testUrl();
