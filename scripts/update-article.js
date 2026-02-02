
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function updateArticle(draftPath) {
    const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
    console.log(`🔄 Updating article: ${draft.title}`);

    const { data, error } = await supabase
        .from('articles')
        .update({
            title: draft.title,
            content: draft.content,
            excerpt: draft.excerpt,
            // We usually don't update slug or related products unless requested, but here we just want to fix title/content
        })
        .eq('slug', draft.slug)
        .select();

    if (error) {
        console.error('❌ Error updating:', error.message);
    } else if (data.length === 0) {
        console.error('❌ Article not found with slug:', draft.slug);
    } else {
        console.log('✅ Article updated successfully!');
        console.log(`🔗 http://localhost:3000/radar/${draft.slug}`);
    }
}

const draftPath = process.argv[2];
if (!draftPath) {
    console.error('Please provide a draft JSON path');
    process.exit(1);
}
updateArticle(draftPath);
