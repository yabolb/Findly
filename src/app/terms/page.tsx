import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Términos y Condiciones | Findly',
    description: 'Términos y Condiciones de Uso de Findly - Información sobre el uso del servicio, enlaces de afiliados y responsabilidades.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <article className="max-w-3xl mx-auto px-6 py-12">
                <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                    TÉRMINOS Y CONDICIONES DE USO
                </h1>
                <p className="font-body text-slate-600 mb-12">
                    Última actualización: 19 de enero de 2026
                </p>

                <div className="font-body text-slate-700 leading-relaxed space-y-8">
                    <p>
                        Bienvenido a <strong>Findly</strong>. Al acceder y utilizar <code className="bg-slate-200 px-2 py-1 rounded">getfindly.com</code>, aceptas los siguientes términos regulados por Pau Yanez.
                    </p>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                            1. Descripción del Servicio
                        </h2>
                        <p>
                            Findly es una plataforma digital que actúa como <strong>asesor de regalos</strong>. Ofrecemos recomendaciones de productos de terceros basadas en un cuestionario. <strong>Findly no es una tienda online</strong>; no vendemos ni enviamos productos.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                            2. Propiedad Intelectual
                        </h2>
                        <p>
                            El diseño, código fuente, logotipos y textos del "Gift Quiz" pertenecen a <strong>Pau Yanez</strong>. Las imágenes de productos pertenecen a sus respectivos propietarios (Amazon, etc.) y se usan bajo términos de afiliación.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                            3. Enlaces de Afiliados
                        </h2>
                        <p className="mb-3">
                            Findly participa en programas de afiliación.
                        </p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>
                                <strong>Declaración de Amazon:</strong> "En calidad de Afiliado de Amazon, Pau Yanez obtiene ingresos por las compras adscritas que cumplen los requisitos aplicables."
                            </li>
                            <li>
                                Al hacer clic en "Ver Regalo", serás redirigido a la tienda final. Findly no es responsable del precio, envío o devoluciones.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                            4. Exención de Responsabilidad
                        </h2>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>
                                No garantizamos que los precios o stock mostrados coincidan en tiempo real con el marketplace final.
                            </li>
                            <li>
                                Las recomendaciones ("Findly Reason") son sugerencias subjetivas; no garantizamos el éxito del regalo.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                            5. Uso Prohibido
                        </h2>
                        <p>
                            Queda prohibido realizar scraping, minería de datos o utilizar la web para fines ilícitos.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                            6. Ley Aplicable
                        </h2>
                        <p>
                            Estos términos se rigen por la ley española. Las partes se someten a los Juzgados y Tribunales de Barcelona.
                        </p>
                    </section>
                </div>
            </article>
        </div>
    );
}
