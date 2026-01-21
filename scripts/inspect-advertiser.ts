
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const AWIN_API_TOKEN = process.env.AWIN_API_TOKEN;
const AWIN_PUBLISHER_ID = process.env.AWIN_PUBLISHER_ID;

async function checkProgrammeDetails() {
    console.log('Fetching details for El Corte Ingles (13075)...');

    const response = await fetch(
        `https://api.awin.com/publishers/${AWIN_PUBLISHER_ID}/programmes?relationship=joined`,
        {
            headers: {
                'Authorization': `Bearer ${AWIN_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        }
    );

    if (!response.ok) {
        console.error('API Error:', response.status, response.statusText);
        return;
    }

    const data = await response.json();
    const advertiser = data.find((p: any) => p.id === 13075);

    if (advertiser) {
        console.log('Advertiser Details:', JSON.stringify(advertiser, null, 2));
    } else {
        console.log('Advertiser 13075 not found in joined list.');
    }
}

checkProgrammeDetails();
