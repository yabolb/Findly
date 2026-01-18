"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Sparkles } from "lucide-react";
import {
    QuizAnswers,
    Product,
    RELATIONSHIP_LABELS,
    OCCASION_LABELS,
    BUDGET_LABELS,
    BUDGET_LIMITS,
} from "@/types";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import ProductGrid from "./ProductGrid";

interface QuizResultsProps {
    answers: QuizAnswers;
    onStartOver: () => void;
}

export default function QuizResults({ answers, onStartOver }: QuizResultsProps) {
    // Filter products based on quiz answers
    const recommendedProducts = useMemo(() => {
        const budgetLimits = answers.budget ? BUDGET_LIMITS[answers.budget] : { min: 0, max: 999999 };

        // Filter by interests and budget
        let filtered = MOCK_PRODUCTS.filter((product) => {
            // Check if product category matches any selected interest
            const matchesInterest = answers.interests.includes(product.category);

            // Check if price is within budget
            const matchesBudget =
                product.price >= budgetLimits.min && product.price <= budgetLimits.max;

            return matchesInterest && matchesBudget;
        });

        // If no exact matches, relax filters
        if (filtered.length === 0) {
            filtered = MOCK_PRODUCTS.filter((product) => {
                return product.price >= budgetLimits.min && product.price <= budgetLimits.max;
            });
        }

        // Still no matches? Show some products
        if (filtered.length === 0) {
            filtered = MOCK_PRODUCTS.slice(0, 5);
        }

        // Limit to 3-5 products
        return filtered.slice(0, 5);
    }, [answers]);

    // Generate personalized reason based on answers
    const generateFindlyReason = (product: Product): string => {
        const relationship = answers.relationship
            ? RELATIONSHIP_LABELS[answers.relationship].toLowerCase()
            : "esa persona especial";
        const occasion = answers.occasion
            ? OCCASION_LABELS[answers.occasion].toLowerCase()
            : "esta ocasión";
        const budget = answers.budget
            ? BUDGET_LABELS[answers.budget].toLowerCase()
            : "";

        // Use product's base reason or generate one
        if (product.findly_reason) {
            return product.findly_reason;
        }

        return `Elegimos este regalo porque es perfecto para tu ${relationship} y encaja en tu presupuesto de ${budget}. Ideal para ${occasion}.`;
    };


    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4"
                >
                    <Sparkles className="w-8 h-8 text-primary" />
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-heading text-3xl md:text-4xl font-bold text-text-main mb-2"
                >
                    ¡Hemos encontrado tus regalos!
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-text-main/60 max-w-md mx-auto"
                >
                    {recommendedProducts.length} ideas personalizadas para{" "}
                    {answers.relationship
                        ? RELATIONSHIP_LABELS[answers.relationship].toLowerCase()
                        : "esa persona especial"}
                </motion.p>
            </div>

            {/* Quiz Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-3"
            >
                {answers.occasion && (
                    <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        🎉 {OCCASION_LABELS[answers.occasion]}
                    </span>
                )}
                {answers.budget && (
                    <span className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                        💰 {BUDGET_LABELS[answers.budget]}
                    </span>
                )}
                {answers.interests.length > 0 && (
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium">
                        ✨ {answers.interests.length} interés{answers.interests.length > 1 ? "es" : ""}
                    </span>
                )}
            </motion.div>

            {/* Products Grid */}
            <div className="mt-8">
                <ProductGrid
                    products={recommendedProducts.map((product) => ({
                        ...product,
                        findly_reason: generateFindlyReason(product),
                    }))}
                    hideResultsCount
                />
            </div>

            {/* Start Over Button */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center pt-8"
            >
                <button
                    onClick={onStartOver}
                    className="inline-flex items-center gap-2 text-text-main/60 hover:text-primary transition-colors px-6 py-3 rounded-full border border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Buscar otro regalo</span>
                </button>
            </motion.div>
        </div>
    );
}
