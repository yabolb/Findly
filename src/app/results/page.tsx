import { Suspense } from 'react';
import { Metadata } from 'next';
import ResultsClient from './ResultsClient';
import { CATEGORY_LABELS } from '@/types';

// SEO Labels (re-declared/imported for server side)
const RECIPIENT_LABELS: Record<string, string> = {
    pareja: "tu pareja",
    padres: "padres/madres",
    amigos: "amigos",
    profesores: "profesores",
    ninos: "niños",
    colegas: "colegas",
};

const OCCASION_LABELS_SEO: Record<string, string> = {
    cumpleanos: "cumpleaños",
    boda: "bodas",
    navidad: "Navidad",
    aniversario: "aniversarios",
    "san-valentin": "San Valentín",
    graduacion: "graduaciones",
};

interface ResultsPageProps {
    searchParams: Promise<{
        source?: string;
        category?: string;
        recipient?: string;
        occasion?: string;
        relationship?: string;
    }>;
}

export async function generateMetadata({ searchParams }: ResultsPageProps): Promise<Metadata> {
    const params = await searchParams;
    const { source, category, recipient, occasion, relationship } = params;

    // If it's a quiz completion, likely dynamic/custom result
    if (source === 'quiz') {
        const title = "Tus Ideas de Regalo Personalizadas | Findly";
        return {
            title,
            description: "Descubre las ideas de regalo que hemos seleccionado especialmente para ti.",
            robots: {
                index: false, // Don't index unique quiz results heavily to save crawl budget
                follow: true,
            }
        };
    }

    // Partial Search Pages (SEO Landing Pages)
    let title = "Resultados de Búsqueda | Findly";
    let description = "Descubre regalos originales para cualquier ocasión.";
    let canonical = '/results';

    const labels: Record<string, string> = CATEGORY_LABELS;

    if (category && labels[category]) {
        title = `Regalos de ${labels[category]} | Findly`;
        description = `Explora nuestra selección de ${labels[category].toLowerCase()}. Ideas originales al mejor precio.`;
        canonical += `?category=${category}`;
    } else if (recipient && RECIPIENT_LABELS[recipient]) {
        title = `Regalos para ${RECIPIENT_LABELS[recipient]} | Findly`;
        description = `Ideas de regalo pensadas para ${RECIPIENT_LABELS[recipient]}. Acierta seguro.`;
        canonical += `?recipient=${recipient}`;
    } else if (occasion && OCCASION_LABELS_SEO[occasion]) {
        title = `Regalos para ${OCCASION_LABELS_SEO[occasion]} | Findly`;
        description = `Las mejores ideas para celebrar ${OCCASION_LABELS_SEO[occasion]}.`;
        canonical += `?occasion=${occasion}`;
    }

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            type: 'website',
        },
    };
}

export default function ResultsPage() {
    return <ResultsClient />;
}
