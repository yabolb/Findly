"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GiftQuiz from "@/components/GiftQuiz";
import CalculationSequence from "@/components/CalculationSequence";
import { QuizAnswers } from "@/types";

export default function QuizClient() {
    const router = useRouter();
    const [isCalculating, setIsCalculating] = useState(false);
    const [savedAnswers, setSavedAnswers] = useState<QuizAnswers | null>(null);

    const handleQuizComplete = (quizAnswers: QuizAnswers) => {
        setSavedAnswers(quizAnswers);
        setIsCalculating(true);
    };

    const navigateToResults = () => {
        if (!savedAnswers) return;

        // Build query string from quiz answers
        const params = new URLSearchParams();
        params.set("source", "quiz");

        if (savedAnswers.relationship) {
            params.set("relationship", savedAnswers.relationship);
        }
        if (savedAnswers.ageRange) {
            params.set("ageRange", savedAnswers.ageRange);
        }
        if (savedAnswers.occasion) {
            params.set("occasion", savedAnswers.occasion);
        }
        if (savedAnswers.budget) {
            params.set("budget", savedAnswers.budget);
        }
        // Add interests as array parameters
        savedAnswers.interests.forEach((interest) => {
            params.append("interests[]", interest);
        });

        // Redirect to unified results page
        router.push(`/results?${params.toString()}`);
    };

    return (
        <main className="min-h-screen pt-28 pb-16 px-6 lg:px-8 bg-slate-50/50">
            <div className="max-w-4xl mx-auto">
                {isCalculating && savedAnswers ? (
                    <CalculationSequence answers={savedAnswers} onComplete={navigateToResults} />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <GiftQuiz onComplete={handleQuizComplete} />
                    </motion.div>
                )}
            </div>
        </main>
    );
}
