
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const corrections = {
    'guia-regalos-moda-mujer-san-valentin': {
        title: "San Valentín 2026: guía de moda y accesorios para sorprenderla"
    },
    'guia-regalos-moda-hombre-san-valentin': {
        title: "San Valentín para él: regalos de moda y estilo que no fallan"
    },
    'regalos-tecnologicos-menos-50-euros-2026': {
        title: "5 regalos tecnológicos por menos de 50€ que parecen más caros"
    },
    'kit-gimnasio-casa-regalos-fitness': {
        title: "Regalos para montar un gimnasio en casa por menos de lo que crees"
    },
    'gimnasio-casa-barato-kit-iniciacion-2026': {
        title: "Gimnasio en casa por menos de 60€: tu kit de iniciación 2026"
    }
};

const properNouns = [
    "San Valentín", "Michael Kors", "Fossil", "Parfois", "Hawkers", "Sony", "Xiaomi", "Cecotec", "Philips",
    "Bering", "Victorinox", "Billabong", "Nike", "Amazon", "Smart Band", "Active", "Cecofry", "Bombastik",
    "Quitapelusas", "Smartband", "Classic", "MacBook", "iPhone", "iPad", "AirPods", "Galaxy", "Pixel",
    "PlayStation", "Xbox", "Nintendo", "Switch", "Kindle", "Echo", "Garmin", "Fitbit", "GoPro", "Dyson", "Roomba",
    "WH-CH520", "I.N.O.X.", "Journey", "Arch", "Court Lite", "Clay Court", "Zoom Vapor", "Pro",
    "Pure Plump", "HA4", "Eclat Minute", "The Mini Tint Matte Dúo", "Multiactive Serum Foundation", "Face D"
];

function fixText(text) {
    if (!text) return text;
    // 1. Lowercase everything to start fresh
    let lower = text.toLowerCase();

    // 2. Capitalize the very first character
    let fixed = lower.charAt(0).toUpperCase() + lower.slice(1);

    // 3. Fix "1. el" -> "1. El" (Captialize word after "Number. ")
    fixed = fixed.replace(/^(\d+\.\s*)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());

    // REMOVED: Force capitalization after Colon. We want lowercase by default unless proper noun.

    // 5. Restore proper nouns
    properNouns.forEach(noun => {
        // Create regex that matches the noun case-insensitively
        // We use \b to ensure we match whole words
        // We also escape special characters in the noun just in case (e.g. dots)
        const escapedNoun = noun.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedNoun}\\b`, 'gi');
        fixed = fixed.replace(regex, noun);
    });

    return fixed;
}

async function run() {
    const slugs = Object.keys(corrections);
    const { data: articles } = await supabase.from('articles').select('*').in('slug', slugs);

    if (!articles) {
        console.log("No articles found.");
        return;
    }

    for (const article of articles) {
        console.log(`\n\nPROCESSING: ${article.slug}`);

        let newTitle = corrections[article.slug].title;
        console.log(`TITLE: "${article.title}" -> "${newTitle}"`);

        // Fix Content Headers
        let newContent = article.content.replace(/<(h[1-6])>(.*?)<\/\1>/g, (match, tag, text) => {
            const fixed = fixText(text);
            console.log(`  HEADER: "${text}" -> "${fixed}"`);
            return `<${tag}>${fixed}</${tag}>`;
        });

        const { error } = await supabase
            .from('articles')
            .update({ title: newTitle, content: newContent })
            .eq('id', article.id);

        if (error) console.error('Error updating:', error);
        else console.log('✅ Updated successfully');
    }
}

run();
