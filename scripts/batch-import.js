/**
 * Batch import multiple Amazon products
 * 
 * Usage: node scripts/batch-import.js
 */

const urls = [
    'https://amzn.to/4pLCRQU',
    'https://amzn.to/49XoV1n',
    'https://amzn.to/4jK2kbP',
    'https://amzn.to/4qugxwn',
    'https://amzn.to/49JRFt8',
    'https://amzn.to/4sRwcaA',
    'https://amzn.to/4sNMxgc',
    'https://amzn.to/3NAI28F',
    'https://amzn.to/4jNcJni',
    'https://amzn.to/3ZfRFfE'
];

console.log('📦 BATCH IMPORT: Processing', urls.length, 'products...\n');
console.log('URLs to process:');
urls.forEach((url, i) => console.log(`${i + 1}. ${url}`));
console.log('\n⏳ This will be processed by the browser subagent...\n');

// Export for use by the agent
module.exports = { urls };
