import React from 'react';
import { SEOHead } from './SEOHead';
import { Shield, Mail, MapPin, Phone } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <>
      <SEOHead
        title="Privacy Policy - Informativa sulla Privacy"
        description="Informativa sulla privacy di Innform. Come trattiamo i tuoi dati personali nel rispetto del GDPR e della normativa italiana sulla protezione dei dati."
        url="/privacy-policy"
      />
      <div className="bg-white pt-24">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
              <Shield className="text-blue-300" size={20} />
              <span className="text-sm font-medium">Protezione Dati</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-300">
              Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR)
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none text-gray-700">

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
                <p className="font-semibold text-blue-900 mb-2">Titolare del Trattamento</p>
                <p className="text-blue-800">
                  <strong>INNFORM S.r.l.</strong><br />
                  Via della Chimica, 87 - 85100 Potenza (PZ)<br />
                  P.IVA: [Inserire P.IVA]<br />
                  Email: formazione@innform.eu<br />
                  Tel: 0971.473968
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Premessa</h2>
              <p>
                La presente informativa descrive le modalità di trattamento dei dati personali degli utenti che consultano il sito web innform.eu. L'informativa è resa ai sensi dell'art. 13 del Regolamento UE 2016/679 (GDPR) e si applica a tutti coloro che interagiscono con i servizi web di Innform.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Tipologie di Dati Raccolti</h2>
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Dati di navigazione</h3>
              <p>
                I sistemi informatici e le procedure software preposte al funzionamento di questo sito web acquisiscono, nel corso del loro normale esercizio, alcuni dati personali la cui trasmissione è implicita nell'uso dei protocolli di comunicazione di Internet.
              </p>
              <p>Questa categoria di dati include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Indirizzi IP o nomi a dominio dei computer utilizzati</li>
                <li>Gli indirizzi in notazione URI delle risorse richieste</li>
                <li>L'orario della richiesta</li>
                <li>Il metodo utilizzato nel sottoporre la richiesta al server</li>
                <li>La dimensione del file ottenuto in risposta</li>
                <li>Il codice numerico indicante lo stato della risposta data dal server</li>
                <li>Altri parametri relativi al sistema operativo e all'ambiente informatico dell'utente</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Dati forniti volontariamente</h3>
              <p>
                L'invio facoltativo, esplicito e volontario di posta elettronica agli indirizzi indicati su questo sito comporta la successiva acquisizione dell'indirizzo del mittente, necessario per rispondere alle richieste, nonché degli eventuali altri dati personali inseriti nella missiva.
              </p>
              <p>
                Inoltre, la compilazione dei form di contatto o di iscrizione ai corsi comporta l'acquisizione dei dati ivi indicati (nome, cognome, email, telefono, ecc.).
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Finalità del Trattamento</h2>
              <p>I dati personali sono trattati per le seguenti finalità:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Navigazione del sito:</strong> per consentire la corretta fruizione del sito web</li>
                <li><strong>Risposta alle richieste:</strong> per rispondere a richieste di informazioni sui corsi e servizi</li>
                <li><strong>Iscrizione ai corsi:</strong> per gestire le pre-iscrizioni e iscrizioni ai percorsi formativi</li>
                <li><strong>Adempimenti di legge:</strong> per adempiere a obblighi previsti dalla legge, da regolamenti e dalla normativa comunitaria</li>
                <li><strong>Newsletter:</strong> previo consenso, per l'invio di comunicazioni informative sui corsi e le attività formative</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Base Giuridica del Trattamento</h2>
              <p>Il trattamento dei dati personali si fonda sulle seguenti basi giuridiche:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Consenso dell'interessato</strong> (art. 6, par. 1, lett. a) GDPR)</li>
                <li><strong>Esecuzione di un contratto</strong> o misure precontrattuali (art. 6, par. 1, lett. b) GDPR)</li>
                <li><strong>Adempimento di obblighi legali</strong> (art. 6, par. 1, lett. c) GDPR)</li>
                <li><strong>Legittimo interesse</strong> del titolare (art. 6, par. 1, lett. f) GDPR)</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Modalità di Trattamento</h2>
              <p>
                I dati personali sono trattati con strumenti automatizzati per il tempo strettamente necessario a conseguire gli scopi per cui sono stati raccolti. Specifiche misure di sicurezza sono osservate per prevenire la perdita dei dati, usi illeciti o non corretti ed accessi non autorizzati.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Comunicazione e Diffusione dei Dati</h2>
              <p>
                I dati personali non saranno diffusi. Potranno essere comunicati a soggetti terzi solo per le finalità di cui sopra e in particolare a:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Enti pubblici per adempimenti di legge (Regione Basilicata, ANPAL, ecc.)</li>
                <li>Fornitori di servizi tecnici (hosting, manutenzione, ecc.)</li>
                <li>Consulenti e professionisti per adempimenti fiscali e legali</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Conservazione dei Dati</h2>
              <p>
                I dati personali saranno conservati per il tempo necessario al conseguimento delle finalità per le quali sono trattati e comunque non oltre i termini di legge. In particolare:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dati di navigazione: 12 mesi</li>
                <li>Dati dei corsisti: 10 anni dalla conclusione del corso (obblighi fiscali e di certificazione)</li>
                <li>Dati di contatto: fino a revoca del consenso o richiesta di cancellazione</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Diritti dell'Interessato</h2>
              <p>
                Ai sensi degli artt. 15-22 del GDPR, l'interessato ha diritto di:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Accesso:</strong> ottenere conferma dell'esistenza di dati che lo riguardano</li>
                <li><strong>Rettifica:</strong> ottenere la correzione di dati inesatti</li>
                <li><strong>Cancellazione:</strong> ottenere la cancellazione dei dati ("diritto all'oblio")</li>
                <li><strong>Limitazione:</strong> ottenere la limitazione del trattamento</li>
                <li><strong>Portabilità:</strong> ricevere i dati in formato strutturato</li>
                <li><strong>Opposizione:</strong> opporsi al trattamento</li>
                <li><strong>Reclamo:</strong> proporre reclamo all'Autorità Garante per la Protezione dei Dati Personali</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Cookie Policy</h2>
              <p>
                Per informazioni sull'utilizzo dei cookie, si rimanda alla specifica <a href="/cookie-policy" className="text-purple-600 hover:underline font-semibold">Cookie Policy</a>.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Modifiche alla Privacy Policy</h2>
              <p>
                Il Titolare si riserva il diritto di apportare modifiche alla presente informativa in qualunque momento, dandone pubblicità agli utenti su questa pagina. Si prega di consultare regolarmente questa pagina per verificare eventuali aggiornamenti.
              </p>

              <div className="bg-gray-100 p-6 rounded-xl mt-8">
                <p className="text-sm text-gray-600">
                  <strong>Ultimo aggiornamento:</strong> Dicembre 2025
                </p>
              </div>

              {/* Contact Box */}
              <div className="mt-12 bg-purple-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Contatta il Titolare</h3>
                <p className="text-gray-600 mb-6">
                  Per esercitare i tuoi diritti o per qualsiasi domanda relativa alla privacy, contattaci:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="text-purple-600" size={20} />
                    <a href="mailto:formazione@innform.eu" className="hover:text-purple-600">formazione@innform.eu</a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="text-purple-600" size={20} />
                    <span>0971.473968</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="text-purple-600" size={20} />
                    <span>Via della Chimica, 87 - 85100 Potenza (PZ)</span>
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
