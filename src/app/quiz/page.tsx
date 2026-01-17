"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GiftQuiz from "@/components/GiftQuiz";
import QuizResults from "@/components/QuizResults";
import { QuizAnswers } from "@/types";

export default function QuizPage() {
    const [quizComplete, setQuizComplete] = useState(false);
    const [answers, setAnswers] = useState<QuizAnswers | null>(null);

    const handleQuizComplete = (quizAnswers: QuizAnswers) => {
        setAnswers(quizAnswers);
        setQuizComplete(true);
    };

    const handleStartOver = () => {
        setQuizComplete(false);
        setAnswers(null);
    };

    return (
        <main className="min-h-screen pt-28 pb-16 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {!quizComplete ? (
                        <GiftQuiz onComplete={handleQuizComplete} />
                    ) : (
                        <QuizResults
                            answers={answers!}
                            onStartOver={handleStartOver}
                        />
                    )}
                </motion.div>
            </div>
        </main>
    );
}
