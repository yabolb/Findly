import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Privacidad | Findly',
    description: 'Política de Privacidad de Findly - Información sobre cómo recopilamos, utilizamos y protegemos tus datos personales en cumplimiento con RGPD y LOPD-GDD.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <article className="max-w-3xl mx-auto px-6 py-12">
                <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                    POLÍTICA DE PRIVACIDAD
                </h1>
                <p className="font-body text-slate-600 mb-12">
                    Última actualización: 19 de enero de 2026
                </p>

                <div className="font-body text-slate-700 leading-relaxed space-y-8">
                    <p>
                        En <strong>Findly</strong> (accesible a través de <code className="bg-slate-200 px-2 py-1 rounded">getfindly.com</code>), nos tomamos muy en serio la privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos tu información personal, en cumplimiento con el Reglamento (UE) 2016/679 (RGPD), la Ley Orgánica 3/2018 (LOPD-GDD) y la Ley 34/2002 (LSSI-CE).
                    </p>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                            1. Responsable del Tratamiento
                        </h2>
                        <p className="mb-3">
                            Los datos de carácter personal que se pudieran recabar directamente del interesado serán tratados de forma confidencial y quedarán incorporados a la correspondiente actividad de tratamiento titularidad de:
                        </p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li><strong>Titular:</strong> Pau Yanez</li>
                            <li><strong>NIF:</strong> 47723658S</li>
                            <li><strong>Domicilio:</strong> Carrer de l'Historiador Maians, Barcelona (España).</li>
                            <li><strong>Email de contacto:</strong> hola@getfindly.com</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                            2. Qué datos recopilamos
                        </h2>
                        <p className="mb-3">
                            Findly está diseñado para ser utilizado sin necesidad de registro de usuario ni creación de cuentas. Sin embargo, tratamos los siguientes datos:
                        </p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>
                                <strong>Datos de Navegación:</strong> Dirección IP, tipo de navegador, ubicación aproximada y comportamiento en el sitio (a través de cookies y tecnologías similares).
                            </li>
                            <li>
                                <strong>Datos del Cuestionario (The Gift Quiz):</strong> Recopilamos las respuestas que proporcionas en nuestro asistente. Estos datos se procesan de forma <strong>anónima o pseudonimizada</strong> con el único fin de generar la recomendación. No asociamos estas respuestas a una persona física identificada.
                            </li>
                            <li>
                                <strong>Comunicaciones:</strong> Si nos escribes por correo electrónico, trataremos tu dirección de email y nombre para gestionar tu consulta.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                            3. Finalidad del tratamiento
                        </h2>
                        <p className="mb-3">Tratamos la información para:</p>
                        <ol className="list-decimal list-inside space-y-2 pl-4">
                            <li><strong>Provisión del Servicio:</strong> Generar recomendaciones de regalos personalizadas.</li>
                            <li><strong>Mejora del Servicio:</strong> Analizar estadísticas de uso para optimizar la plataforma.</li>
                            <li><strong>Publicidad y Afiliación:</strong> Gestionar el rastreo de clics en enlaces de afiliados (Amazon, Awin) y mostrar publicidad personalizada (Google Ads).</li>
                            <li><strong>Seguridad:</strong> Prevenir ataques y fraudes.</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                            4. Legitimación
                        </h2>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li><strong>Consentimiento:</strong> Para el uso de cookies analíticas y publicitarias.</li>
                            <li><strong>Interés Legítimo:</strong> Para el funcionamiento técnico, seguridad y gestión comercial.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                            5. Destinatarios de los datos
                        </h2>
                        <p className="mb-3">Compartimos datos estrictamente necesarios con:</p>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li><strong>Hosting:</strong> Vercel Inc. y Supabase.</li>
                            <li><strong>Analítica y Publicidad:</strong> Google Ireland Ltd.</li>
                            <li><strong>Afiliación:</strong> Amazon Europe Core S.à r.l. y redes como Awin AG. (Solo rastreo de clics, no datos personales).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                            6. Derechos del Usuario
                        </h2>
                        <p>
                            Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación y oposición escribiendo a <strong>hola@getfindly.com</strong>.
                        </p>
                    </section>
                </div>
            </article>
        </div>
    );
}
