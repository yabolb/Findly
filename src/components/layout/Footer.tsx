import Link from "next/link";
import { Gift } from "lucide-react";

/**
 * Footer - Gift Advisor Hub (Spanish)
 * 
 * A comprehensive footer designed for the Findly Gift Advisor.
 * Includes 4 columns: Interests, Occasions, Recipients, and Legal/About.
 * 
 * SEO Benefits:
 * - Internal linking to boost discoverability
 * - Spanish keyword-rich anchor text for gift searches
 * - Clear legal compliance and affiliate disclosures
 */
export default function Footer() {
    // Column 1: Regalos por Interés
    const interestLinks = [
        { label: "Tecnología", href: "/results?category=tech-electronics" },
        { label: "Moda y Estilo", href: "/results?category=fashion" },
        { label: "Deporte y Aire Libre", href: "/results?category=sports-leisure" },
        { label: "Hogar y Decoración", href: "/results?category=home-garden" },
        { label: "Lectura y Cultura", href: "/results?category=movies-books-music" },
        { label: "Viajes y Experiencias", href: "/results?category=travel-experiences" },
    ];

    // Column 2: Ideas por Ocasión
    const occasionLinks = [
        { label: "Regalos de Cumpleaños", href: "/results?occasion=cumpleanos" },
        { label: "Detalles de Boda", href: "/results?occasion=boda" },
        { label: "Ideas para Navidad", href: "/results?occasion=navidad" },
        { label: "Aniversarios", href: "/results?occasion=aniversario" },
        { label: "San Valentín", href: "/results?occasion=san-valentin" },
        { label: "Regalos de Graduación", href: "/results?occasion=graduacion" },
    ];

    // Column 3: ¿Para quién buscas?
    const recipientLinks = [
        { label: "Regalos para Parejas", href: "/results?recipient=pareja" },
        { label: "Regalos para Padres/Madres", href: "/results?recipient=padres" },
        { label: "Detalles para Amigos", href: "/results?recipient=amigos" },
        { label: "Regalos para Profesores", href: "/results?recipient=profesores" },
        { label: "Regalos para Niños", href: "/results?recipient=ninos" },
        { label: "Regalos para Colegas", href: "/results?recipient=colegas" },
    ];

    // Column 4: Legal y Findly
    const legalLinks = [
        { label: "Sobre Findly", href: "/about" },
        { label: "Política de Privacidad", href: "/privacy" },
        { label: "Términos de Servicio", href: "/terms" },
        { label: "Aviso de Cookies", href: "/cookies" },
        { label: "Contacto / Takedown", href: "/takedown" },
    ];

    return (
        <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                {/* 4-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Column 1: Regalos por Interés */}
                    <div>
                        <h3 className="font-heading font-bold text-slate-900 text-sm mb-4 uppercase tracking-wide">
                            Regalos por Interés
                        </h3>
                        <ul className="space-y-2">
                            {interestLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-600 hover:text-primary transition-colors duration-150"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Ideas por Ocasión */}
                    <div>
                        <h3 className="font-heading font-bold text-slate-900 text-sm mb-4 uppercase tracking-wide">
                            Ideas por Ocasión
                        </h3>
                        <ul className="space-y-2">
                            {occasionLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-600 hover:text-primary transition-colors duration-150"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: ¿Para quién buscas? */}
                    <div>
                        <h3 className="font-heading font-bold text-slate-900 text-sm mb-4 uppercase tracking-wide">
                            ¿Para quién buscas?
                        </h3>
                        <ul className="space-y-2">
                            {recipientLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-600 hover:text-primary transition-colors duration-150"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Legal y Findly */}
                    <div>
                        <h3 className="font-heading font-bold text-slate-900 text-sm mb-4 uppercase tracking-wide">
                            Legal y Findly
                        </h3>
                        <ul className="space-y-2">
                            {legalLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-600 hover:text-primary transition-colors duration-150"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Legal & Affiliate Disclosures */}
                <div className="border-t border-slate-200 pt-6 space-y-3">
                    {/* Affiliate Disclosure */}
                    <p className="text-xs text-slate-500 text-center leading-relaxed max-w-3xl mx-auto">
                        <strong>Aviso de Afiliación:</strong> Findly participa en varios programas de afiliación.
                        Podemos recibir una comisión por las compras realizadas a través de nuestros enlaces,
                        sin coste adicional para ti.
                    </p>

                    {/* Source Attribution */}
                    <p className="text-xs text-slate-500 text-center">
                        Todas las marcas y logotipos de terceros (Amazon, Etsy, El Corte Inglés, Fnac, Decathlon)
                        pertenecen a sus respectivos dueños.
                    </p>

                    {/* Copyright with Icon */}
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                        <Gift className="w-4 h-4 text-primary" />
                        <span>© {new Date().getFullYear()} Findly. Todos los derechos reservados.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
