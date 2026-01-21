
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const AWIN_API_TOKEN = process.env.AWIN_API_TOKEN;
const advertiserId = 13075; // El Corte Ingles

// Minimal set of columns
const minimalColumns = [
    'product_name',
    'search_price'
].join(',');

const url = `https://productdata.awin.com/datafeed/download/apikey/${AWIN_API_TOKEN}/language/any/fid/${advertiserId}/columns/${minimalColumns}/format/csv/compression/zip`;

console.log('Testing Minimal URL:', url);

async function testUrl() {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`Status: ${response.status} ${response.statusText}`);
    } catch (e) {
        console.error('Fetch failed:', e);
    }
}

testUrl();
