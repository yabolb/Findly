"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { sendEvent } from "@/lib/analytics";

interface QuizUpsellProps {
    knownParams: {
        category?: string;
        recipient?: string;
        occasion?: string;
    };
}

export default function QuizUpsell({ knownParams }: QuizUpsellProps) {
    // Build quiz URL with pre-filled data
    const quizUrl = `/quiz?${new URLSearchParams(
        Object.entries(knownParams).filter(([_, v]) => v)
    ).toString()}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="col-span-full mb-4"
        >
            <div className="bg-gradient-to-br from-primary via-primary/95 to-violet-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-violet-400/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    {/* Content */}
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-300" />
                            <h3 className="font-heading font-bold text-lg sm:text-xl">
                                ¿Buscas algo más específico?
                            </h3>
                        </div>
                        <p className="text-white/90 text-sm sm:text-base">
                            Personaliza estas ideas respondiendo 2 preguntas más y recibe
                            recomendaciones únicas con nuestra "Razón Findly".
                        </p>
                    </div>

                    {/* CTA Button */}
                    <Link href={quizUrl} onClick={() => sendEvent('quiz_start', { source: 'upsell' })}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap"
                        >
                            <span>Afinar Búsqueda</span>
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
