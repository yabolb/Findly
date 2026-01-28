"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { QuizAnswers, RELATIONSHIP_LABELS, CATEGORY_LABELS } from "@/types";

interface CalculationSequenceProps {
    answers: QuizAnswers;
    onComplete: () => void;
}

export default function CalculationSequence({ answers, onComplete }: CalculationSequenceProps) {
    const [step, setStep] = useState(0);

    const sequence = [
        {
            id: 0,
            text: `Analizando perfil de ${answers.relationship ? RELATIONSHIP_LABELS[answers.relationship].toLowerCase() : "esa persona"}...`,
            duration: 800,
        },
        {
            id: 1,
            text: `Buscando regalos de ${answers.interests.length > 0 ? CATEGORY_LABELS[answers.interests[0]].toLowerCase() : "tus intereses"}...`,
            duration: 800,
        },
        {
            id: 2,
            text: "Ajustando al presupuesto...",
            duration: 800,
        },
        {
            id: 3,
            text: "¡Lo tenemos! 🎁",
            duration: 600,
        }
    ];

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const runSequence = (index: number) => {
            if (index < sequence.length) {
                timeout = setTimeout(() => {
                    setStep(index + 1);
                    runSequence(index + 1);
                }, sequence[index].duration);
            } else {
                onComplete();
            }
        };

        runSequence(0);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-violet-100 max-w-md w-full"
            >
                <div className="flex flex-col items-center gap-8">
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="w-20 h-20 rounded-full border-4 border-violet-100 border-t-violet-600"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-violet-600" />
                        </div>
                    </div>

                    <div className="space-y-4 w-full">
                        {sequence.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{
                                    opacity: step >= index ? 1 : 0.3,
                                    x: 0,
                                    scale: step === index ? 1.05 : 1
                                }}
                                className="flex items-center gap-3"
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300 ${step > index ? "bg-emerald-500" : "bg-slate-100"
                                    }`}>
                                    {step > index ? (
                                        <Check className="w-4 h-4 text-white" />
                                    ) : (
                                        <div className={`w-2 h-2 rounded-full ${step === index ? "bg-violet-600 animate-pulse" : "bg-slate-300"}`} />
                                    )}
                                </div>
                                <span className={`text-sm sm:text-base font-medium transition-colors duration-300 ${step === index ? "text-violet-900" : "text-slate-500"
                                    }`}>
                                    {item.text}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
