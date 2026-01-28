"use client";

import { useState, useEffect } from "react";
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
import { sendEvent } from "@/lib/analytics";

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

    // Scroll to top when step changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    const totalSteps = 4;

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
        const stepNames = ['recipient', 'occasion', 'interests', 'budget'];
        sendEvent('quiz_progress', { step_name: stepNames[currentStep], action: 'next' });

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
        sendEvent('quiz_progress', { step_name: 'interests', value: category });
        setAnswers((prev) => ({
            ...prev,
            interests: prev.interests.includes(category)
                ? prev.interests.filter((c) => c !== category)
                : [...prev.interests, category],
        }));
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0,
        }),
    };

    const [direction, setDirection] = useState(0);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        if (newDirection > 0 && canProceed()) {
            handleNext();
        } else if (newDirection < 0) {
            handleBack();
        }
    };

    return (
        <div className="flex flex-col min-h-[70vh]">
            {/* Progress Bar - Fixed at top */}
            <div className="flex-shrink-0 mb-4">
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <div className="text-center mt-3">
                    <span className="text-sm text-text-main/50">
                        Paso {currentStep + 1} de {totalSteps}
                    </span>
                </div>
            </div>

            {/* Step Title */}
            <div className="flex-shrink-0 text-center mb-6">
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-text-main mb-2">
                    {steps[currentStep].title}
                </h2>
                <p className="text-sm sm:text-base text-text-main/60">
                    {steps[currentStep].subtitle}
                </p>
            </div>

            {/* Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto pb-4">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="w-full"
                    >
                        <div className="max-w-2xl mx-auto px-2">
                            {/* Step 1: Recipient */}
                            {currentStep === 0 && (
                                <div className="space-y-6">
                                    {/* Age Range */}
                                    <div>
                                        <h3 className="text-sm font-medium text-text-main/70 mb-3">
                                            Rango de edad
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                                            {(Object.keys(AGE_RANGE_LABELS) as AgeRange[]).map((age) => (
                                                <button
                                                    key={age}
                                                    onClick={() => {
                                                        setAnswers({ ...answers, ageRange: age });
                                                        sendEvent('quiz_progress', { step_name: 'recipient', detail: 'age' });
                                                    }}
                                                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ${answers.ageRange === age
                                                        ? "border-primary bg-primary/10 shadow-md"
                                                        : "border-gray-200 hover:border-primary/50 bg-white active:bg-gray-50"
                                                        }`}
                                                >
                                                    <span className="text-xs sm:text-sm font-medium text-text-main block text-center">
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
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                                            {(Object.keys(RELATIONSHIP_LABELS) as Relationship[]).map((rel) => (
                                                <button
                                                    key={rel}
                                                    onClick={() => {
                                                        setAnswers({ ...answers, relationship: rel });
                                                        sendEvent('quiz_progress', { step_name: 'recipient', detail: 'relationship' });
                                                    }}
                                                    className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 ${answers.relationship === rel
                                                        ? "border-primary bg-primary/10 shadow-md"
                                                        : "border-gray-200 hover:border-primary/50 bg-white active:bg-gray-50"
                                                        }`}
                                                >
                                                    <span className="text-xs sm:text-sm font-medium text-text-main block text-center">
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
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                    {(Object.keys(OCCASION_LABELS) as Occasion[]).map((occ) => (
                                        <button
                                            key={occ}
                                            onClick={() => {
                                                setAnswers({ ...answers, occasion: occ });
                                                sendEvent('quiz_progress', { step_name: 'occasion', value: occ });
                                            }}
                                            className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 ${answers.occasion === occ
                                                ? "border-primary bg-primary/10 shadow-md scale-[1.02]"
                                                : "border-gray-200 hover:border-primary/50 bg-white active:bg-gray-50"
                                                }`}
                                        >
                                            <div className="text-2xl sm:text-3xl mb-2 text-center">
                                                {occ === "birthday" && "🎂"}
                                                {occ === "christmas" && "🎄"}
                                                {occ === "wedding" && "💒"}
                                                {occ === "anniversary" && "💍"}
                                                {occ === "gratitude" && "🙏"}
                                                {occ === "valentines" && "❤️"}
                                                {occ === "fathers-day" && "👔"}
                                                {occ === "mothers-day" && "💐"}
                                            </div>
                                            <span className="text-xs sm:text-sm font-medium text-text-main block text-center">
                                                {OCCASION_LABELS[occ]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Step 3: Interests */}
                            {currentStep === 2 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                                    {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => toggleInterest(cat)}
                                            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-200 relative ${answers.interests.includes(cat)
                                                ? "border-primary bg-primary/10 shadow-md"
                                                : "border-gray-200 hover:border-primary/50 bg-white active:bg-gray-50"
                                                }`}
                                        >
                                            {answers.interests.includes(cat) && (
                                                <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full flex items-center justify-center">
                                                    <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                                                </div>
                                            )}
                                            <div className="text-xl sm:text-2xl mb-1 sm:mb-2 text-center">
                                                {CATEGORY_ICONS[cat]}
                                            </div>
                                            <span className="text-[10px] sm:text-xs font-medium text-text-main block text-center leading-tight">
                                                {CATEGORY_LABELS[cat]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Step 4: Budget */}
                            {currentStep === 3 && (
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    {(Object.keys(BUDGET_LABELS) as BudgetRange[]).map((budget) => (
                                        <button
                                            key={budget}
                                            onClick={() => {
                                                setAnswers({ ...answers, budget });
                                                sendEvent('quiz_progress', { step_name: 'budget', value: budget });
                                            }}
                                            className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 ${answers.budget === budget
                                                ? "border-primary bg-primary/10 shadow-md scale-[1.02]"
                                                : "border-gray-200 hover:border-primary/50 bg-white active:bg-gray-50"
                                                }`}
                                        >
                                            <div className="text-2xl sm:text-3xl mb-2 text-center">💰</div>
                                            <span className="text-sm sm:text-lg font-bold text-text-main block text-center">
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

            {/* Navigation Buttons - Fixed at bottom */}
            <div className="flex-shrink-0 flex justify-between items-center pt-4 mt-4 border-t border-gray-100 bg-background">
                <button
                    onClick={() => paginate(-1)}
                    className="flex items-center gap-1 sm:gap-2 text-text-main/60 hover:text-text-main transition-colors px-3 sm:px-4 py-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
                >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">{currentStep === 0 ? "Inicio" : "Anterior"}</span>
                </button>

                <button
                    onClick={() => paginate(1)}
                    disabled={!canProceed()}
                    className={`flex items-center gap-1 sm:gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-200 ${canProceed()
                        ? "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl active:scale-95"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                >
                    <span>
                        {currentStep === totalSteps - 1 ? "Ver Regalos" : "Siguiente"}
                    </span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>
        </div>
    );
}
