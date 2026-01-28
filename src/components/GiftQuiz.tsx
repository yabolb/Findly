"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ArrowRight, Check, Sparkles } from "lucide-react";
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
    const relationshipRef = useRef<HTMLDivElement>(null);

    const handleAgeSelect = (age: AgeRange) => {
        const updated = { ...answers, ageRange: age };
        setAnswers(updated);
        sendEvent('quiz_progress', { step_name: 'recipient', detail: 'age' });
        autoAdvance(updated);

        // Task: Automate scroll to relationship section after short delay
        setTimeout(() => {
            relationshipRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    };

    // Scroll to top when step changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    const steps = [
        {
            title: "¡Vamos allá! ¿A quién vamos a sorprender hoy?",
            subtitle: "Cuéntanos sobre la persona especial",
        },
        {
            title: "¿Qué estamos celebrando?",
            subtitle: "Ayúdanos a encontrar el regalo perfecto",
        },
        {
            title: "¿Qué le apasiona? (Elige varios)",
            subtitle: "Selecciona todos los que apliquen",
        },
        {
            title: "¿Cuánto quieres invertir en el detalle?",
            subtitle: "Encontraremos opciones que encajen",
        },
    ];

    const totalSteps = steps.length;

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

    const autoAdvance = (updatedAnswers: QuizAnswers) => {
        // Step 4 (Budget) is no longer auto-advance as per Task 2 (it uses the floating button now)
        if (currentStep >= 2) return;

        let isReady = false;
        switch (currentStep) {
            case 0:
                isReady = updatedAnswers.ageRange !== null && updatedAnswers.relationship !== null;
                break;
            case 1:
                isReady = updatedAnswers.occasion !== null;
                break;
        }

        if (isReady) {
            setTimeout(() => {
                handleNext();
            }, 300);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setDirection(-1);
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
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
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

    // Determine if we should show the floating action button
    // It's for Step 3 (interests selected) or Step 4 (budget selected)
    const showFloatingButton = (currentStep === 2 && answers.interests.length > 0) ||
        (currentStep === 3 && answers.budget !== null);

    return (
        <div className="flex flex-col min-h-[80vh] relative">
            {/* Task 1: Top Back Button */}
            <div className="flex-shrink-0 pt-4 pb-6 h-12">
                {currentStep > 0 && (
                    <button
                        onClick={handleBack}
                        className="group flex items-center gap-1 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        <span className="hidden sm:inline text-sm font-medium">Atrás</span>
                    </button>
                )}
            </div>

            {/* Progress Bar - Below Back Button */}
            <div className="flex-shrink-0 mb-8">
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-violet-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <div className="mt-4 flex justify-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Paso {currentStep + 1} / {totalSteps}
                    </span>
                </div>
            </div>

            {/* Step Title */}
            <div className="flex-shrink-0 text-center mb-8">
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                    {steps[currentStep].title}
                </h2>
                <p className="text-base sm:text-lg text-slate-500 font-medium">
                    {steps[currentStep].subtitle}
                </p>
            </div>

            {/* Content Area - Task 3: pb-32 for mobile safe area */}
            <div className="flex-1 overflow-y-auto pb-32">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="w-full"
                    >
                        <div className="max-w-2xl mx-auto px-2">
                            {/* Step implementations (same as before) */}
                            {currentStep === 0 && (
                                <div className="space-y-10">
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5 text-center">
                                            Rango de edad
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                            {(Object.keys(AGE_RANGE_LABELS) as AgeRange[]).map((age) => (
                                                <button
                                                    key={age}
                                                    onClick={() => handleAgeSelect(age)}
                                                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${answers.ageRange === age
                                                        ? "border-violet-600 bg-violet-50/50 shadow-md ring-1 ring-violet-600/20"
                                                        : "border-slate-100 hover:border-violet-200 bg-white active:scale-95"
                                                        }`}
                                                >
                                                    <span className={`text-xs font-bold transition-colors ${answers.ageRange === age ? "text-violet-900" : "text-slate-600"}`}>
                                                        {AGE_RANGE_LABELS[age]}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div ref={relationshipRef}>
                                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5 text-center">
                                            Relación
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {(Object.keys(RELATIONSHIP_LABELS) as Relationship[]).map((rel) => (
                                                <button
                                                    key={rel}
                                                    onClick={() => {
                                                        const updated = { ...answers, relationship: rel };
                                                        setAnswers(updated);
                                                        sendEvent('quiz_progress', { step_name: 'recipient', detail: 'relationship' });
                                                        autoAdvance(updated);
                                                    }}
                                                    className={`p-4 rounded-2xl border-2 transition-all duration-300 ${answers.relationship === rel
                                                        ? "border-violet-600 bg-violet-50/50 shadow-md ring-1 ring-violet-600/20"
                                                        : "border-slate-100 hover:border-violet-200 bg-white active:scale-95"
                                                        }`}
                                                >
                                                    <span className={`text-xs font-bold transition-colors ${answers.relationship === rel ? "text-violet-900" : "text-slate-600"}`}>
                                                        {RELATIONSHIP_LABELS[rel]}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {(Object.keys(OCCASION_LABELS) as Occasion[]).map((occ) => (
                                        <button
                                            key={occ}
                                            onClick={() => {
                                                const updated = { ...answers, occasion: occ };
                                                setAnswers(updated);
                                                sendEvent('quiz_progress', { step_name: 'occasion', value: occ });
                                                autoAdvance(updated);
                                            }}
                                            className={`group p-6 rounded-3xl border-2 transition-all duration-300 ${answers.occasion === occ
                                                ? "border-violet-600 bg-violet-50/50 shadow-lg ring-1 ring-violet-600/20"
                                                : "border-slate-100 hover:border-violet-200 bg-white active:scale-95"
                                                }`}
                                        >
                                            <div className="text-3xl mb-3 text-center transition-transform group-hover:scale-110">
                                                {occ === "birthday" && "🎂"}
                                                {occ === "christmas" && "🎄"}
                                                {occ === "wedding" && "💒"}
                                                {occ === "anniversary" && "💍"}
                                                {occ === "gratitude" && "🙏"}
                                                {occ === "valentines" && "❤️"}
                                                {occ === "fathers-day" && "👔"}
                                                {occ === "mothers-day" && "💐"}
                                            </div>
                                            <span className={`text-sm font-bold block text-center transition-colors ${answers.occasion === occ ? "text-violet-900" : "text-slate-600"}`}>
                                                {OCCASION_LABELS[occ]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => toggleInterest(cat)}
                                            className={`group p-4 rounded-2xl border-2 transition-all duration-300 relative ${answers.interests.includes(cat)
                                                ? "border-violet-600 bg-violet-50/50 shadow-lg"
                                                : "border-slate-100 hover:border-violet-200 bg-white active:scale-95"
                                                }`}
                                        >
                                            {answers.interests.includes(cat) && (
                                                <div className="absolute top-2 right-2 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                            <div className="text-2xl mb-2 text-center transition-transform group-hover:scale-110">
                                                {CATEGORY_ICONS[cat]}
                                            </div>
                                            <span className={`text-[11px] font-bold block text-center leading-tight transition-colors ${answers.interests.includes(cat) ? "text-violet-900" : "text-slate-600"}`}>
                                                {CATEGORY_LABELS[cat]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(Object.keys(BUDGET_LABELS) as BudgetRange[]).map((budget) => (
                                        <button
                                            key={budget}
                                            onClick={() => {
                                                const updated = { ...answers, budget };
                                                setAnswers(updated);
                                                sendEvent('quiz_progress', { step_name: 'budget', value: budget });
                                            }}
                                            className={`group p-8 rounded-3xl border-2 transition-all duration-300 ${answers.budget === budget
                                                ? "border-violet-600 bg-violet-50/50 shadow-lg"
                                                : "border-slate-100 hover:border-violet-200 bg-white active:scale-95 text-center"
                                                }`}
                                        >
                                            <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform">💰</div>
                                            <span className={`text-xl font-black block text-center transition-colors ${answers.budget === budget ? "text-violet-900" : "text-slate-600"}`}>
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

            {/* Task 2: Floating Next Button (Conditional Slide-Up) */}
            <AnimatePresence>
                {showFloatingButton && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 px-6 pb-6 sm:pb-8 z-[100] flex justify-center pointer-events-none"
                        style={{ paddingBottom: 'calc(max(1.5rem, env(safe-area-inset-bottom)))' }}
                    >
                        <button
                            onClick={() => paginate(1)}
                            className="pointer-events-auto w-full max-w-md h-16 bg-violet-600 hover:bg-violet-700 text-white font-black text-lg rounded-full shadow-[0_20px_50px_rgba(124,58,237,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <span>
                                {currentStep === totalSteps - 1 ? "Ver Regalos" : "Continuar"}
                            </span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
