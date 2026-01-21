
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Verify env vars
const AWIN_API_TOKEN = process.env.AWIN_API_TOKEN;
if (!AWIN_API_TOKEN) {
    console.error('Missing AWIN_API_TOKEN');
    process.exit(1);
}

const advertiserId = 13075; // El Corte Ingles
const columns = [
    'product_name',
    'description',
    'search_price',
    'currency',
    'merchant_image_url',
    'awin_product_id',
    'merchant_product_id',
    'merchant_category',
    'awin_deep_link',
    'merchant_deep_link'
].join(',');

const url = `https://productdata.awin.com/datafeed/download/apikey/${AWIN_API_TOKEN}/language/any/fid/${advertiserId}/columns/${columns}/format/csv/compression/zip`;

console.log('Testing URL:', url);

async function testUrl() {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`Status: ${response.status} ${response.statusText}`);
        if (!response.ok) {
            // Try GET to see body if error
            const getResp = await fetch(url);
            const text = await getResp.text();
            console.log('Error Body:', text.slice(0, 500));
        } else {
            console.log('URL is valid and accessible.');
        }
    } catch (e) {
        console.error('Fetch failed:', e);
    }
}

testUrl();
