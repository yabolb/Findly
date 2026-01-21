import { Gift, Sparkles, Heart, Clock } from "lucide-react";
import Link from "next/link";

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Findly | El Buscador de Regalos Inteligente",
    description: "Encuentra el regalo ideal en segundos. Nuestro asesor con IA te ayuda a elegir regalos personalizados para cualquier persona y ocasión.",
    alternates: {
        canonical: '/',
    },
};

export default function Home() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                            Tu asesor de regalos inteligente
                        </span>
                    </div>

                    <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-text-main mb-6 leading-tight">
                        Encuentra el regalo ideal
                        <br />
                        <span className="text-primary">en 30 segundos</span>
                    </h1>

                    <p className="text-lg md:text-xl text-text-main/60 mb-10 max-w-2xl mx-auto font-light">
                        Sin listas genéricas. Solo ideas pensadas para esa persona especial.
                    </p>

                    {/* CTA Button - Now static with CSS animations */}
                    <div className="animate-fade-in-up">
                        <Link href="/quiz">
                            <button className="group relative inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white font-semibold text-lg px-10 py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                                {/* Pulsing ring effect */}
                                <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />

                                <Gift className="w-6 h-6" />
                                <span>Empezar Cuestionario</span>
                            </button>
                        </Link>
                    </div>

                    {/* Trust indicators - Static */}
                    <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-text-main/50 animate-fade-in">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Solo 4 preguntas</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4" />
                            <span>Recomendaciones personalizadas</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            <span>100% gratuito</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="como-funciona" className="py-20 px-6 lg:px-8 bg-white/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-main mb-4">
                            ¿Cómo funciona?
                        </h2>
                        <p className="text-text-main/60 max-w-xl mx-auto">
                            Tres simples pasos para encontrar el regalo perfecto
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "1",
                                title: "Cuéntanos sobre la persona",
                                description: "Edad, relación y qué ocasión estás celebrando.",
                                icon: "👤",
                            },
                            {
                                step: "2",
                                title: "Selecciona sus intereses",
                                description: "Tecnología, moda, deportes, cultura y más.",
                                icon: "💡",
                            },
                            {
                                step: "3",
                                title: "Recibe ideas personalizadas",
                                description: "3-5 regalos perfectos con explicación de por qué.",
                                icon: "🎁",
                            },
                        ].map((feature) => (
                            <div
                                key={feature.step}
                                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
                                    {feature.step}
                                </div>
                                <h3 className="font-heading text-xl font-semibold text-text-main mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-text-main/60">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Affiliate Partners Section */}
            <section className="py-16 px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-sm text-text-main/40 mb-6">
                        Regalos seleccionados de las mejores tiendas
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 items-center text-2xl opacity-60">
                        <span title="Amazon">🛒 Amazon</span>
                        <span title="Etsy">🎨 Etsy</span>
                        <span title="El Corte Inglés">🏬 El Corte Inglés</span>
                        <span title="Fnac">📚 Fnac</span>
                        <span title="Decathlon">⚽ Decathlon</span>
                    </div>
                </div>
            </section>
        </main>
    );
}
