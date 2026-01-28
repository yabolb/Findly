"use client";

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { sendEvent } from '@/lib/analytics';

/**
 * QuizMagnet Component
 * Sticky floating banner to funnel blog readers to the Gift Quiz
 * Positioned at bottom on mobile, right sidebar on desktop
 */
export default function QuizMagnet() {
    return (
        <>
            {/* Desktop: Right sidebar sticky */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 z-40"
            >
                <div className="w-64 bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 shadow-2xl border border-white/20">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-white" />
                        <h3 className="font-heading text-white font-bold text-lg">
                            ¿No encuentras lo que buscas?
                        </h3>
                    </div>
                    <p className="text-white/90 text-sm mb-4">
                        Deja que nuestro asesor inteligente te ayude a encontrar el regalo perfecto.
                    </p>
                    <Link href="/quiz" onClick={() => sendEvent('quiz_start', { source: 'magnet_desktop' })}>
                        <button className="w-full bg-white hover:bg-gray-50 text-primary font-semibold px-4 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                            Usar el Asesor Inteligente
                        </button>
                    </Link>
                </div>
            </motion.div>

            {/* Mobile: Bottom sticky banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-primary/90 backdrop-blur-md shadow-2xl border-t border-white/20"
            >
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-4 h-4 text-white" />
                                <p className="font-heading text-white font-semibold text-sm">
                                    ¿No encuentras lo que buscas?
                                </p>
                            </div>
                            <p className="text-white/80 text-xs">
                                Prueba nuestro asesor inteligente
                            </p>
                        </div>
                        <Link href="/quiz" onClick={() => sendEvent('quiz_start', { source: 'magnet_mobile' })}>
                            <button className="bg-white hover:bg-gray-50 text-primary font-semibold px-5 py-2.5 rounded-full transition-all duration-200 shadow-lg whitespace-nowrap text-sm">
                                Empezar Quiz
                            </button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
