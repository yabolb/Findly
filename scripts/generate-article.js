/**
 * generate-article.js
 * 
 * Generic entry point to publish articles using the ArticlePublisher class.
 * Usage: node scripts/generate-article.js <config-file-path>
 * 
 * Config file should be a JS/JSON module exporting the article details.
 */
const ArticlePublisher = require('./lib/ArticlePublisher');
const path = require('path');

async function run() {
    // 1. Get config file from args
    const configPath = process.argv[2];
    if (!configPath) {
        console.error("Usage: node scripts/generate-article.js <path-to-article-config.js>");
        process.exit(1);
    }

    try {
        // 2. Load Config
        const absolutePath = path.resolve(configPath);
        console.log(`📂 Loading config from: ${absolutePath}`);
        const articleConfig = require(absolutePath);

        // 3. Initialize Publisher
        const publisher = new ArticlePublisher();

        // 4. Publish
        await publisher.publish(articleConfig);

    } catch (err) {
        console.error("💥 Error:", err.message);
        process.exit(1);
    }
}

run();
