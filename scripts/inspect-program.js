
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const token = process.env.AWIN_API_TOKEN;
const publisherId = process.env.AWIN_PUBLISHER_ID;

async function inspectFirstProgram() {
    const response = await fetch(
        `https://api.awin.com/publishers/${publisherId}/programmes?relationship=joined`,
        { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const data = await response.json();
    console.log(JSON.stringify(data[0], null, 2));
}

inspectFirstProgram();
