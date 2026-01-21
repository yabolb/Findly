import { Metadata } from "next";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
    title: "Cuestionario de Regalos Personalizados | Findly",
    description: "Completa nuestro test rápido de 4 preguntas y recibe ideas de regalo únicas adaptadas a los gustos y presupuesto de esa persona especial.",
    alternates: {
        canonical: '/quiz',
    },
};

export default function QuizPage() {
    return <QuizClient />;
}
