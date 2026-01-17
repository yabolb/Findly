"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    QuizAnswers,
    AgeRange,
    Relationship,
    Occasion,
    Category,
    BudgetRange,
    AGE_RANGE_LABELS,
    RELATIONSHIP_LABELS,
    OCCASION_LABELS,
    CATEGORY_LABELS,
    BUDGET_LABELS,
} from "@/types";
import { CATEGORY_ICONS } from "@/lib/mock-data";

interface GiftQuizProps {
    onComplete: (answers: QuizAnswers) => void;
}

export default function GiftQuiz({ onComplete }: GiftQuizProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswers>({
        ageRange: null,
        relationship: null,
        occasion: null,
        interests: [],
        budget: null,
    });

    const totalSteps = 4;

    // Step configurations
    const steps = [
        {
            title: "¿Para quién es el regalo?",
            subtitle: "Cuéntanos sobre la persona especial",
        },
        {
            title: "¿Cuál es la ocasión?",
            subtitle: "Ayúdanos a encontrar el regalo perfecto",
        },
        {
            title: "¿Qué le interesa?",
            subtitle: "Selecciona todos los que apliquen",
        },
        {
            title: "¿Cuál es tu presupuesto?",
            subtitle: "Encontraremos opciones que encajen",
        },
    ];

    const canProceed = () => {
        switch (currentStep) {
            case 0:
                return answers.ageRange !== null && answers.relationship !== null;
            case 1:
                return answers.occasion !== null;
            case 2:
                return answers.interests.length > 0;
            case 3:
                return answers.budget !== null;
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete(answers);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            router.push("/");
        }
    };

    const toggleInterest = (category: Category) => {
        setAnswers((prev) => ({
            ...prev,
            interests: prev.interests.includes(category)
                ? prev.interests.filter((c) => c !== category)
                : [...prev.interests, category],
        }));
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 300 : -300,
            opacity: 0,
        }),
    };

    const [direction, setDirection] = useState(0);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        if (newDirection > 0) {
            handleNext();
        } else {
            handleBack();
        }
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex flex-col">
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-8">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Step Indicator */}
            <div className="text-center mb-8">
                <span className="text-sm text-text-main/50">
                    Paso {currentStep + 1} de {totalSteps}
                </span>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        {/* Step Title */}
                        <div className="text-center mb-8">
                            <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-main mb-2">
                                {steps[currentStep].title}
                            </h2>
                            <p className="text-text-main/60">
                                {steps[currentStep].subtitle}
                            </p>
                        </div>

                        {/* Step Content */}
                        <div className="max-w-2xl mx-auto">
                            {/* Step 1: Recipient */}
                            {currentStep === 0 && (
                                <div className="space-y-8">
                                    {/* Age Range */}
                                    <div>
                                        <h3 className="text-sm font-medium text-text-main/70 mb-3">
                                            Rango de edad
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                            {(Object.keys(AGE_RANGE_LABELS) as AgeRange[]).map((age) => (
                                                <button
                                                    key={age}
                                                    onClick={() => setAnswers({ ...answers, ageRange: age })}
                                                    className={`p-4 rounded-2xl border-2 transition-all duration-200 ${answers.ageRange === age
                                                        ? "border-primary bg-primary/10 shadow-lg"
                                                        : "border-gray-200 hover:border-primary/50 bg-white"
                                                        }`}
                                                >
                                                    <span className="text-sm font-medium text-text-main">
                                                        {AGE_RANGE_LABELS[age]}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Relationship */}
                                    <div>
                                        <h3 className="text-sm font-medium text-text-main/70 mb-3">
                                            Relación
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {(Object.keys(RELATIONSHIP_LABELS) as Relationship[]).map((rel) => (
                                                <button
                                                    key={rel}
                                                    onClick={() => setAnswers({ ...answers, relationship: rel })}
                                                    className={`p-4 rounded-2xl border-2 transition-all duration-200 ${answers.relationship === rel
                                                        ? "border-primary bg-primary/10 shadow-lg"
                                                        : "border-gray-200 hover:border-primary/50 bg-white"
                                                        }`}
                                                >
                                                    <span className="text-sm font-medium text-text-main">
                                                        {RELATIONSHIP_LABELS[rel]}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Occasion */}
                            {currentStep === 1 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {(Object.keys(OCCASION_LABELS) as Occasion[]).map((occ) => (
                                        <button
                                            key={occ}
                                            onClick={() => setAnswers({ ...answers, occasion: occ })}
                                            className={`p-6 rounded-3xl border-2 transition-all duration-200 ${answers.occasion === occ
                                                ? "border-primary bg-primary/10 shadow-lg scale-105"
                                                : "border-gray-200 hover:border-primary/50 bg-white hover:scale-102"
                                                }`}
                                        >
                                            <div className="text-3xl mb-2">
                                                {occ === "birthday" && "🎂"}
                                                {occ === "christmas" && "🎄"}
                                                {occ === "wedding" && "💒"}
                                                {occ === "anniversary" && "💍"}
                                                {occ === "gratitude" && "🙏"}
                                                {occ === "valentines" && "❤️"}
                                                {occ === "fathers-day" && "👔"}
                                                {occ === "mothers-day" && "💐"}
                                            </div>
                                            <span className="text-sm font-medium text-text-main">
                                                {OCCASION_LABELS[occ]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Step 3: Interests */}
                            {currentStep === 2 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => toggleInterest(cat)}
                                            className={`p-4 rounded-2xl border-2 transition-all duration-200 relative ${answers.interests.includes(cat)
                                                ? "border-primary bg-primary/10 shadow-lg"
                                                : "border-gray-200 hover:border-primary/50 bg-white"
                                                }`}
                                        >
                                            {answers.interests.includes(cat) && (
                                                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                            <div className="text-2xl mb-2">
                                                {CATEGORY_ICONS[cat]}
                                            </div>
                                            <span className="text-xs font-medium text-text-main">
                                                {CATEGORY_LABELS[cat]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Step 4: Budget */}
                            {currentStep === 3 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {(Object.keys(BUDGET_LABELS) as BudgetRange[]).map((budget) => (
                                        <button
                                            key={budget}
                                            onClick={() => setAnswers({ ...answers, budget })}
                                            className={`p-8 rounded-3xl border-2 transition-all duration-200 ${answers.budget === budget
                                                ? "border-primary bg-primary/10 shadow-lg scale-105"
                                                : "border-gray-200 hover:border-primary/50 bg-white"
                                                }`}
                                        >
                                            <div className="text-3xl mb-2">💰</div>
                                            <span className="text-lg font-bold text-text-main">
                                                {BUDGET_LABELS[budget]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                <button
                    onClick={() => paginate(-1)}
                    className="flex items-center gap-2 text-text-main/60 hover:text-text-main transition-colors px-4 py-2 rounded-full hover:bg-gray-100"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>{currentStep === 0 ? "Inicio" : "Anterior"}</span>
                </button>

                <button
                    onClick={() => paginate(1)}
                    disabled={!canProceed()}
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all duration-200 ${canProceed()
                        ? "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                >
                    <span>
                        {currentStep === totalSteps - 1 ? "Ver Regalos" : "Siguiente"}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
