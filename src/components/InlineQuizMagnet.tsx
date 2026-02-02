"use client";

import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { sendEvent } from '@/lib/analytics';

export default function InlineQuizMagnet() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-1 sm:col-span-2 lg:col-span-3 w-full my-8"
        >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 shadow-xl">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
                    <div className="flex-1 text-center md:text-left text-white">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-4 border border-white/10">
                            <Sparkles className="w-4 h-4" />
                            <span>Asesor de Regalos IA</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 leading-tight">
                            ¿Indeciso? Déjanos ayudarte.
                        </h2>
                        <p className="text-lg text-white/90 max-w-xl">
                            Responde 4 preguntas simples y nuestra IA encontrará los regalos perfectos para esa persona especial.
                        </p>
                    </div>

                    <Link
                        href="/quiz"
                        className="flex-shrink-0"
                        onClick={() => sendEvent('quiz_start', { source: 'inline_magnet' })}
                    >
                        <button className="group flex items-center gap-3 bg-white text-primary font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <span>Encontrar el regalo ideal</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
