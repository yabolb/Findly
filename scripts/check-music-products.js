
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectMusicCategory() {
    console.log('🔍 Checking for Music Products...');

    // Check specific Music category
    const { count: musicCount, error: err1 } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category', 'movies-books-music');

    console.log(`🎵 'movies-books-music' count: ${musicCount}`);

    // Check problematic Rachmaninov items to see their current category
    const { data: rach } = await supabase
        .from('products')
        .select('title, category, updated_at')
        .ilike('title', '%Rachmaninov%')
        .limit(5);

    console.log('\n🎹 Rachmaninov Items Check:');
    if (rach && rach.length > 0) {
        rach.forEach(p => console.log(`   - [${p.category}] ${p.title.slice(0, 40)}... (Updated: ${new Date(p.updated_at).toLocaleTimeString()})`));
    } else {
        console.log('   (No Rachmaninov items found yet)');
    }
}

inspectMusicCategory();
