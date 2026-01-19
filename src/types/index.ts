// ========================================
// FINDLY - SMART GIFT ADVISOR (PRD v12.0)
// Market: Spain | Language: Spanish | Currency: EUR
// ========================================

// 13 Gift Categories (Updated for better granularity)
export type Category =
    | "tech-electronics"       // Tecnología
    | "fashion"                // Moda y Accesorios
    | "sports-outdoors"        // Deporte y Aire Libre
    | "home-garden"            // Hogar y Decoración
    | "movies"                 // Películas y Series
    | "books"                  // Libros y Literatura
    | "music"                  // Música y Audio
    | "baby-kids"              // Bebés y Niños
    | "collectibles-art"       // Coleccionismo y Arte
    | "diy"                    // Bricolaje y Manualidades
    | "motor-accessories"      // Motor y Accesorios
    | "beauty-personal-care"   // Belleza y Cuidado Personal
    | "travel-experiences";    // Viajes y Experiencias

// Platform Sources (Affiliate Partners - PRD v12.0 Section 3)
export type Platform =
    | "amazon"         // Amazon Associates (Generalist)
    | "etsy"           // Etsy via Awin (Handmade/Craft)
    | "elcorteingles"  // El Corte Inglés via Awin (Premium)
    | "fnac"           // Fnac via Awin (Culture & Tech)
    | "decathlon";     // Decathlon via Awin (Sports)

// ============================================
// GIFT QUIZ TYPES
// ============================================

// Recipient age ranges
export type AgeRange =
    | "child"      // Niño (0-12)
    | "teen"       // Adolescente (13-17)
    | "young"      // Joven (18-30)
    | "adult"      // Adulto (31-60)
    | "senior";    // Mayor (+60)

// Recipient relationships
export type Relationship =
    | "partner"    // Pareja
    | "friend"     // Amigo/a
    | "mother"     // Madre
    | "father"     // Padre
    | "sibling"    // Hermano/a
    | "teacher"    // Profesor/a
    | "colleague"  // Colega
    | "boss";      // Jefe/a

// Gift occasions
export type Occasion =
    | "birthday"       // Cumpleaños
    | "christmas"      // Navidad
    | "wedding"        // Boda
    | "anniversary"    // Aniversario
    | "gratitude"      // Agradecimiento
    | "valentines"     // San Valentín
    | "fathers-day"    // Día del Padre
    | "mothers-day";   // Día de la Madre

// Budget ranges in EUR
export type BudgetRange =
    | "under-20"       // < 20€
    | "20-50"          // 20€ - 50€
    | "50-100"         // 50€ - 100€
    | "over-100";      // + 100€

// Quiz answers collected from user
export interface QuizAnswers {
    ageRange: AgeRange | null;
    relationship: Relationship | null;
    occasion: Occasion | null;
    interests: Category[];
    budget: BudgetRange | null;
}

// ============================================
// PRODUCT & GIFT TYPES
// ============================================

// Product from curated catalog (PRD Database Schema)
export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string; // default 'EUR'
    image_url: string;
    source_url: string; // Affiliate link
    platform: Platform;
    category: Category;
    findly_reason?: string; // Template-based justification
    recipients?: string[]; // Array of recipient tags (pareja, madre, amigos, etc.)
    occasions?: string[]; // Array of occasion tags (cumpleanos, boda, navidad, etc.)
    created_at: Date;
}

// ============================================
// UI LABELS (Spanish)
// ============================================

export const CATEGORY_LABELS: Record<Category, string> = {
    "tech-electronics": "Tecnología",
    "fashion": "Moda y Accesorios",
    "sports-outdoors": "Deporte y Aire Libre",
    "home-garden": "Hogar y Decoración",
    "movies": "Películas y Series",
    "books": "Libros y Literatura",
    "music": "Música y Audio",
    "baby-kids": "Bebés y Niños",
    "collectibles-art": "Coleccionismo y Arte",
    "diy": "Bricolaje y Manualidades",
    "motor-accessories": "Motor y Accesorios",
    "beauty-personal-care": "Belleza y Cuidado Personal",
    "travel-experiences": "Viajes y Experiencias",
};

export const AGE_RANGE_LABELS: Record<AgeRange, string> = {
    "child": "Niño (0-12)",
    "teen": "Adolescente (13-17)",
    "young": "Joven (18-30)",
    "adult": "Adulto (31-60)",
    "senior": "Mayor (+60)",
};

export const RELATIONSHIP_LABELS: Record<Relationship, string> = {
    "partner": "Pareja",
    "friend": "Amigo/a",
    "mother": "Madre",
    "father": "Padre",
    "sibling": "Hermano/a",
    "teacher": "Profesor/a",
    "colleague": "Colega",
    "boss": "Jefe/a",
};

export const OCCASION_LABELS: Record<Occasion, string> = {
    "birthday": "Cumpleaños",
    "christmas": "Navidad",
    "wedding": "Boda",
    "anniversary": "Aniversario",
    "gratitude": "Agradecimiento",
    "valentines": "San Valentín",
    "fathers-day": "Día del Padre",
    "mothers-day": "Día de la Madre",
};

export const BUDGET_LABELS: Record<BudgetRange, string> = {
    "under-20": "Menos de 20€",
    "20-50": "20€ - 50€",
    "50-100": "50€ - 100€",
    "over-100": "Más de 100€",
};

// Budget range to price limits for filtering
export const BUDGET_LIMITS: Record<BudgetRange, { min: number; max: number }> = {
    "under-20": { min: 0, max: 20 },
    "20-50": { min: 20, max: 50 },
    "50-100": { min: 50, max: 100 },
    "over-100": { min: 100, max: 999999 },
};
