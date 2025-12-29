import React from 'react';
import { SEOHead } from './SEOHead';
import { Cookie, Settings, BarChart3, Shield } from 'lucide-react';

export function CookiePolicy() {
  return (
    <>
      <SEOHead
        title="Cookie Policy - Informativa sui Cookie"
        description="Informativa sui cookie utilizzati dal sito innform.eu. Scopri quali cookie utilizziamo e come gestire le tue preferenze."
        url="/cookie-policy"
      />
      <div className="bg-white pt-24">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-amber-900 via-orange-800 to-amber-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
              <Cookie className="text-amber-300" size={20} />
              <span className="text-sm font-medium">Cookie</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-lg text-amber-100">
              Informativa sull'utilizzo dei cookie ai sensi dell'art. 13 del Regolamento UE 2016/679
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none text-gray-700">

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Cosa sono i Cookie</h2>
              <p>
                I cookie sono piccoli file di testo che i siti visitati dagli utenti inviano ai loro terminali, dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla visita successiva. I cookie sono utilizzati per diverse finalità, hanno caratteristiche diverse, e possono essere utilizzati sia dal titolare del sito che si sta visitando, sia da terze parti.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Tipologie di Cookie Utilizzati</h2>

              {/* Cookie Types Grid */}
              <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Settings className="text-green-600" size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900">Cookie Tecnici</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Necessari per il corretto funzionamento del sito. Non richiedono consenso preventivo.
                  </p>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="text-blue-600" size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900">Cookie Analitici</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Utilizzati per raccogliere informazioni statistiche in forma aggregata e anonima.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Cookie Tecnici (Necessari)</h3>
              <p>
                Questi cookie sono essenziali per il corretto funzionamento del sito e non possono essere disattivati. Vengono generalmente impostati solo in risposta ad azioni compiute dall'utente, come la richiesta di servizi, l'impostazione delle preferenze sulla privacy o la compilazione di form.
              </p>
              <p>Non memorizzano alcuna informazione personale identificabile.</p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Cookie Analitici</h3>
              <p>
                Questo sito potrebbe utilizzare Google Analytics per raccogliere informazioni statistiche aggregate sull'utilizzo del sito. Google Analytics utilizza cookie per raccogliere e analizzare informazioni sulle modalità di utilizzo del sito web.
              </p>
              <p>
                Per maggiori informazioni su Google Analytics, è possibile consultare la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">privacy policy di Google</a>.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Cookie di Terze Parti</h2>
              <p>
                Questo sito utilizza servizi di terze parti che potrebbero installare cookie propri:
              </p>

              <div className="bg-gray-50 rounded-xl p-6 my-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 font-semibold">Servizio</th>
                      <th className="text-left py-3 font-semibold">Fornitore</th>
                      <th className="text-left py-3 font-semibold">Finalità</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3">Google Maps</td>
                      <td className="py-3">Google LLC</td>
                      <td className="py-3">Visualizzazione mappe</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3">Google Analytics</td>
                      <td className="py-3">Google LLC</td>
                      <td className="py-3">Statistiche anonime</td>
                    </tr>
                    <tr>
                      <td className="py-3">Font Google</td>
                      <td className="py-3">Google LLC</td>
                      <td className="py-3">Caricamento font</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Gestione dei Cookie</h2>
              <p>
                L'utente può gestire le preferenze relative ai cookie direttamente dal proprio browser. Tuttavia, la disabilitazione dei cookie tecnici potrebbe compromettere l'esperienza di navigazione sul sito.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Come disabilitare i cookie dai browser</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Chrome:</strong> Impostazioni → Privacy e sicurezza → Cookie e altri dati dei siti
                </li>
                <li>
                  <strong>Firefox:</strong> Opzioni → Privacy e sicurezza → Cookie e dati dei siti web
                </li>
                <li>
                  <strong>Safari:</strong> Preferenze → Privacy → Cookie e dati di siti web
                </li>
                <li>
                  <strong>Edge:</strong> Impostazioni → Cookie e autorizzazioni sito → Cookie
                </li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Durata dei Cookie</h2>
              <p>
                I cookie hanno una durata dettata dalla data di scadenza (o da un'azione specifica come la chiusura del browser) impostata al momento dell'installazione:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cookie di sessione:</strong> vengono eliminati alla chiusura del browser</li>
                <li><strong>Cookie persistenti:</strong> rimangono sul dispositivo fino alla loro scadenza o cancellazione da parte dell'utente</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Aggiornamenti</h2>
              <p>
                La presente Cookie Policy può essere soggetta a modifiche nel tempo. Si consiglia di consultare periodicamente questa pagina per essere sempre aggiornati sulle modalità di utilizzo dei cookie.
              </p>

              <div className="bg-gray-100 p-6 rounded-xl mt-8">
                <p className="text-sm text-gray-600">
                  <strong>Ultimo aggiornamento:</strong> Dicembre 2025
                </p>
              </div>

              {/* Info Box */}
              <div className="mt-12 bg-amber-50 rounded-2xl p-8 border border-amber-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <Shield className="text-amber-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">I tuoi diritti</h3>
                    <p className="text-gray-600">
                      Per maggiori informazioni sui tuoi diritti relativi al trattamento dei dati personali, consulta la nostra <a href="/privacy-policy" className="text-purple-600 hover:underline font-semibold">Privacy Policy</a>.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
    </>
  );
}
