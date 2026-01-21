import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Cookies | Findly',
    description: 'Política de Cookies de Findly - Información sobre el uso de cookies, tipos y cómo gestionarlas.',
    alternates: {
        canonical: '/cookies',
    },
};

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <article className="max-w-3xl mx-auto px-6 pt-24 pb-12">
                <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                    POLÍTICA DE COOKIES
                </h1>
                <p className="font-body text-slate-600 mb-12">
                    Última actualización: 19 de enero de 2026
                </p>

                <div className="font-body text-slate-700 leading-relaxed space-y-8">
                    <p>
                        En <strong>Findly</strong> utilizamos cookies propias y de terceros para mejorar tu experiencia y mostrar publicidad.
                    </p>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                            1. ¿Qué es una cookie?
                        </h2>
                        <p>
                            Un fichero de texto que se almacena en tu navegador para recordar tu visita y preferencias.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                            2. Tipos de cookies que utilizamos
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                                    A. Cookies Técnicas (Necesarias)
                                </h3>
                                <p>
                                    Permiten la navegación y el funcionamiento del Quiz. No requieren consentimiento.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                                    B. Cookies de Análisis y Publicidad
                                </h3>
                                <ul className="list-disc list-inside space-y-2 pl-4">
                                    <li><strong>Google Analytics:</strong> Estadísticas de tráfico.</li>
                                    <li><strong>Google AdSense:</strong> Publicidad personalizada basada en navegación.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">
                                    C. Cookies de Afiliación
                                </h3>
                                <ul className="list-disc list-inside space-y-2 pl-4">
                                    <li>
                                        <strong>Amazon / Awin:</strong> Cookies de seguimiento (24h habitualmente) para asignar comisiones si realizas una compra tras hacer clic en una recomendación.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                            3. Gestión del Consentimiento
                        </h2>
                        <p>
                            Utilizamos una Plataforma de Gestión (CMP) certificada. Puedes aceptar, rechazar o configurar las cookies en cualquier momento desde el icono de "Cookies" en la web.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                            4. Desactivación
                        </h2>
                        <p>
                            Puedes bloquear las cookies desde la configuración de tu navegador (Chrome, Firefox, Safari, Edge), aunque esto podría afectar al funcionamiento del Quiz.
                        </p>
                    </section>
                </div>
            </article>
        </div>
    );
}
