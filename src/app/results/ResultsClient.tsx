"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Product, QuizAnswers, RELATIONSHIP_LABELS, OCCASION_LABELS, BUDGET_LABELS, BUDGET_LIMITS, CATEGORY_LABELS, Category, BudgetRange } from "@/types";
import { supabase } from "@/lib/supabase";
import ProductGrid from "@/components/ProductGrid";
import QuizUpsell from "@/components/QuizUpsell";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { sendEvent } from "@/lib/analytics";

// SEO Labels for metadata (kept for fallback logic)
const RECIPIENT_LABELS: Record<string, string> = {
    pareja: "tu pareja",
    padres: "padres/madres",
    amigos: "amigos",
    profesores: "profesores",
    ninos: "niños",
    colegas: "colegas",
};

const OCCASION_LABELS_SEO: Record<string, string> = {
    cumpleanos: "cumpleaños",
    boda: "bodas",
    navidad: "Navidad",
    aniversario: "aniversarios",
    "san-valentin": "San Valentín",
    graduacion: "graduaciones",
};

const CATEGORY_SEO_LABELS: Record<string, string> = {
    "tech-electronics": "tecnología",
    fashion: "moda",
    "sports-leisure": "deporte",
    "home-garden": "hogar",
    "movies-books-music": "cultura",
    "travel-experiences": "viajes",
};

function ResultsContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchType, setSearchType] = useState<{
        type: "category" | "recipient" | "occasion" | "quiz" | null;
        value: string | null;
        label: string | null;
    }>({ type: null, value: null, label: null });

    // Quiz-specific state
    const [isQuizSource, setIsQuizSource] = useState(false);
    const [quizParams, setQuizParams] = useState<Partial<QuizAnswers>>({
        relationship: null,
        occasion: null,
        budget: null,
        interests: [],
        ageRange: null,
    });

    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true);

            // Check if source is quiz
            const source = searchParams.get("source");
            const isFromQuiz = source === "quiz";
            setIsQuizSource(isFromQuiz);

            // Optimize Select: Fetch only necessary fields for the grid
            let query = supabase
                .from("products")
                .select("id, title, price, currency, image_url, source_url, platform, category, findly_reason, recipients, occasions, created_at");

            if (isFromQuiz) {
                // Quiz Results Flow
                const relationship = searchParams.get("relationship");
                const occasion = searchParams.get("occasion");
                const budget = searchParams.get("budget") as BudgetRange | null;
                const interestsParam = searchParams.getAll("interests[]");

                setQuizParams({
                    relationship: relationship as any,
                    occasion: occasion as any,
                    budget: budget,
                    interests: interestsParam as Category[],
                    ageRange: searchParams.get("ageRange") as any,
                });

                // Filter by interests (categories)
                if (interestsParam.length > 0) {
                    query = query.in("category", interestsParam);
                }

                // Filter by budget
                if (budget && BUDGET_LIMITS[budget]) {
                    const { min, max } = BUDGET_LIMITS[budget];
                    query = query.gte("price", min).lte("price", max);
                }

                setSearchType({
                    type: "quiz",
                    value: "quiz",
                    label: relationship ? RELATIONSHIP_LABELS[relationship as keyof typeof RELATIONSHIP_LABELS] : "esa persona especial",
                });
            } else {
                // Partial Search Flow (existing logic)
                const category = searchParams.get("category");
                const recipient = searchParams.get("recipient");
                const occasion = searchParams.get("occasion");

                if (category) {
                    query = query.eq("category", category);
                    setSearchType({
                        type: "category",
                        value: category,
                        label: CATEGORY_SEO_LABELS[category] || category,
                    });
                } else if (recipient) {
                    query = query.contains("recipients", [recipient]);
                    setSearchType({
                        type: "recipient",
                        value: recipient,
                        label: RECIPIENT_LABELS[recipient] || recipient,
                    });
                } else if (occasion) {
                    query = query.contains("occasions", [occasion]);
                    setSearchType({
                        type: "occasion",
                        value: occasion,
                        label: OCCASION_LABELS_SEO[occasion] || occasion,
                    });
                }
            }

            // Limit results and order by created date
            query = query.order("created_at", { ascending: false }).limit(20);

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching results:", JSON.stringify(error, null, 2));
                console.error("Error details:", error.message, error.details || '', error.hint || '', error.code || '');
                setProducts([]);
            } else {
                // Add Findly Reason based on search type
                const enhancedProducts = (data || []).map((product: any) => ({
                    ...product,
                    findly_reason:
                        product.findly_reason ||
                        generateFallbackReason(
                            isFromQuiz,
                            searchType.type,
                            searchType.label,
                            quizParams
                        ),
                }));
                setProducts(enhancedProducts);
            }

            setIsLoading(false);
        };

        fetchResults();
    }, [searchParams]);

    // Track view_results event
    useEffect(() => {
        if (!isLoading && products.length > 0) {
            const params: Record<string, any> = {
                category_filtered: searchType.type === 'category' ? searchType.value : 'all'
            };

            if (searchType.type === 'quiz') {
                params.quiz_interests = quizParams.interests;
                params.category_filtered = 'quiz_custom';
            } else if (searchType.type === 'recipient') {
                params.recipient = searchType.value;
            } else if (searchType.type === 'occasion') {
                params.occasion = searchType.value;
            }

            sendEvent('view_results', params);
        }
    }, [isLoading, products.length, searchType]);

    const generateFallbackReason = (
        isQuiz: boolean,
        type: "category" | "recipient" | "occasion" | "quiz" | null,
        label: string | null,
        quiz: Partial<QuizAnswers>
    ): string => {
        if (isQuiz && quiz.relationship) {
            const relationship = quiz.relationship ? RELATIONSHIP_LABELS[quiz.relationship].toLowerCase() : "esa persona especial";
            const occasion = quiz.occasion ? OCCASION_LABELS[quiz.occasion].toLowerCase() : "esta ocasión";
            const budget = quiz.budget ? BUDGET_LABELS[quiz.budget].toLowerCase() : "";

            return `Perfecto para tu ${relationship}${budget ? ` con presupuesto de ${budget}` : ""}. Ideal para ${occasion}.`;
        }

        if (!type || !label) return "Una gran opción seleccionada por Findly.";

        switch (type) {
            case "recipient":
                return `Elegido por nuestra comunidad como un regalo top para ${label}.`;
            case "occasion":
                return `Una idea perfecta para celebrar ${label}.`;
            case "category":
                return `Destacado en la categoría de ${label}.`;
            default:
                return "Una gran opción seleccionada por Findly.";
        }
    };

    // Build page title dynamically
    const getPageTitle = () => {
        if (searchType.type === "quiz") {
            return "¡Hemos encontrado tus regalos!";
        }
        if (searchType.type === "recipient" && searchType.label) {
            return `Ideas de regalo para ${searchType.label}`;
        }
        if (searchType.type === "occasion" && searchType.label) {
            return `Regalos para ${searchType.label}`;
        }
        if (searchType.type === "category" && searchType.label) {
            return `Regalos de ${searchType.label}`;
        }
        return "Resultados de búsqueda";
    };

    const getPageSubtitle = () => {
        if (isLoading) return "Cargando ideas...";

        if (searchType.type === "quiz" && searchType.label) {
            return `${products.length} ${products.length === 1 ? "idea personalizada" : "ideas personalizadas"} para ${searchType.label.toLowerCase()}`;
        }

        return `${products.length} ${products.length === 1 ? "idea encontrada" : "ideas encontradas"}`;
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    {/* Sparkles Icon - Quiz Only */}
                    {isQuizSource && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4"
                        >
                            <Sparkles className="w-8 h-8 text-primary" />
                        </motion.div>
                    )}

                    <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-main mb-2">
                        {getPageTitle()}
                    </h1>
                    <p className="text-text-main/60">
                        {getPageSubtitle()}
                    </p>
                </motion.div>

                {/* Filter Badges - Quiz Only */}
                {isQuizSource && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-3 mb-6"
                    >
                        {quizParams.occasion && (
                            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                🎉 {OCCASION_LABELS[quizParams.occasion as keyof typeof OCCASION_LABELS]}
                            </span>
                        )}
                        {quizParams.budget && (
                            <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                                💰 {BUDGET_LABELS[quizParams.budget]}
                            </span>
                        )}
                        {quizParams.interests && quizParams.interests.length > 0 && (
                            <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium">
                                ✨ {quizParams.interests.length} interés{quizParams.interests.length > 1 ? "es" : ""}
                            </span>
                        )}
                    </motion.div>
                )}

                {/* Results Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : products.length > 0 ? (
                    <>
                        {/* Quiz Upsell Card - Non-Quiz Only */}
                        {!isQuizSource && (
                            <div className="mb-6">
                                <QuizUpsell
                                    knownParams={{
                                        category: searchParams.get("category") || undefined,
                                        recipient: searchParams.get("recipient") || undefined,
                                        occasion: searchParams.get("occasion") || undefined,
                                    }}
                                />
                            </div>
                        )}

                        {/* Product Grid */}
                        <ProductGrid products={products} hideResultsCount showAds={true} />

                        {/* Start Over Button - Quiz Only */}
                        {isQuizSource && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-center pt-8"
                            >
                                <a
                                    href="/quiz"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        sendEvent('quiz_start', { source: 'results_restart' });
                                        window.location.href = '/quiz';
                                    }}
                                    className="inline-flex items-center gap-2 text-text-main/60 hover:text-primary transition-colors px-6 py-3 rounded-full border border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                                >
                                    <span>Buscar otro regalo</span>
                                </a>
                            </motion.div>
                        )}
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-6xl mb-4">🎁</div>
                        <h2 className="font-heading text-2xl font-bold text-text-main mb-2">
                            No encontramos resultados
                        </h2>
                        <p className="text-text-main/60 mb-6">
                            Intenta con el cuestionario para ideas personalizadas
                        </p>
                        <a
                            href="/quiz"
                            onClick={(e) => {
                                e.preventDefault();
                                sendEvent('quiz_start', { source: 'results_not_found' });
                                window.location.href = '/quiz';
                            }}
                            className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-2xl hover:bg-primary/90 transition-colors"
                        >
                            Empezar Cuestionario
                        </a>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default function ResultsClient() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        }>
            <ResultsContent />
        </Suspense>
    );
}
