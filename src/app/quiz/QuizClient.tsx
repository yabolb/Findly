"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GiftQuiz from "@/components/GiftQuiz";
import { QuizAnswers } from "@/types";

export default function QuizClient() {
    const router = useRouter();

    const handleQuizComplete = (quizAnswers: QuizAnswers) => {
        // Build query string from quiz answers
        const params = new URLSearchParams();
        params.set("source", "quiz");

        if (quizAnswers.relationship) {
            params.set("relationship", quizAnswers.relationship);
        }
        if (quizAnswers.ageRange) {
            params.set("ageRange", quizAnswers.ageRange);
        }
        if (quizAnswers.occasion) {
            params.set("occasion", quizAnswers.occasion);
        }
        if (quizAnswers.budget) {
            params.set("budget", quizAnswers.budget);
        }
        // Add interests as array parameters
        quizAnswers.interests.forEach((interest) => {
            params.append("interests[]", interest);
        });

        // Redirect to unified results page
        router.push(`/results?${params.toString()}`);
    };

    return (
        <main className="min-h-screen pt-28 pb-16 px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <GiftQuiz onComplete={handleQuizComplete} />
                </motion.div>
            </div>
        </main>
    );
}
