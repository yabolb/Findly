"use client";

import Link from "next/link";
import { Gift } from "lucide-react";
import { sendEvent } from "@/lib/analytics";

export default function StartQuizButton() {
    return (
        <div className="animate-fade-in-up">
            <Link href="/quiz" onClick={() => sendEvent('quiz_start', { source: 'hero' })}>
                <button className="group relative inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white font-semibold text-lg px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    {/* Pulsing ring effect */}
                    <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />

                    <Gift className="w-6 h-6" />
                    <span>Empezar Cuestionario</span>
                </button>
            </Link>
        </div>
    );
}
