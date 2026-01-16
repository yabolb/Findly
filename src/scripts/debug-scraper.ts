
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
console.log(`Loading env from: ${envPath}`);
dotenv.config({ path: envPath });

async function main() {
    // Dynamic import to ensure env vars are loaded BEFORE modules that use them
    const { multiPlatformScraper } = await import('../services/multi-platform-scraper');

    console.log('🚀 Starting Debug Scraper...');
    console.log('Checking Environment Variables:');
    console.log('- INGEST_SECRET_KEY:', process.env.INGEST_SECRET_KEY ? '✅ Found' : '❌ Missing');
    console.log('- WEBSCRAPINGAI_API_KEY:', process.env.WEBSCRAPINGAI_API_KEY ? '✅ Found' : '❌ Missing');
    console.log('- SCRAPERAPI_API_KEY:', process.env.SCRAPERAPI_API_KEY ? '✅ Found' : '❌ Missing');

    const query = 'iPhone';
    console.log(`\nTesting search for query: "${query}"`);

    // Test individual platforms sequentially to identify blockers
    const platforms = ['ebay', 'vinted'] as const;

    for (const platform of platforms) {
        console.log(`\n-----------------------------------`);
        console.log(`🔍 Testing Platform: ${platform.toUpperCase()}`);
        console.log(`-----------------------------------`);

        const start = Date.now();
        try {
            const result = await multiPlatformScraper.searchPlatform(platform, query);
            const duration = Date.now() - start;

            console.log(`Result: ${result.success ? '✅ Success' : '❌ Failed'}`);
            console.log(`Status: ${result.status}`);
            console.log(`Duration: ${duration}ms`);
            console.log(`Items Found: ${result.itemsFound}`);
            if (result.errorMessage) {
                console.log(`Error Message: ${result.errorMessage}`);
            }
            if (result.banReason) {
                console.log(`Ban Reason: ${result.banReason}`);
            }
            if (result.items.length > 0) {
                console.log(`First Item: ${result.items[0].title} - ${result.items[0].price} EUR`);
            }

        } catch (error) {
            console.error(`💥 Exception testing ${platform}:`, error);
        }
    }

    console.log('\n✅ Debug Complete');
}

main().catch(console.error);
