import React, { useState } from 'react';
import { SEOHead, FAQSchema } from './SEOHead';
import { ChevronDown, HelpCircle, GraduationCap, Euro, Calendar, FileCheck, Users, Briefcase } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Corsi e Formazione
  {
    category: 'Corsi e Formazione',
    question: 'Quali tipi di corsi offre Innform?',
    answer: 'Innform offre Master di alta formazione, corsi di qualifica professionale, formazione continua per lavoratori, certificazioni informatiche (PEKIT), e programmi speciali come GOL (Garanzia Occupabilità Lavoratori). I nostri corsi spaziano da settori come l\'interior design, l\'analisi alimentare, l\'amministrazione aziendale, fino al turismo accessibile.'
  },
  {
    category: 'Corsi e Formazione',
    question: 'I corsi sono riconosciuti e certificati?',
    answer: 'Sì, tutti i nostri corsi sono erogati da un ente accreditato dalla Regione Basilicata dal 2007. Le qualifiche rilasciate sono riconosciute a livello nazionale e spendibili nel mercato del lavoro. Inoltre, siamo certificati ISO 9001:2015 per la qualità dei servizi formativi.'
  },
  {
    category: 'Corsi e Formazione',
    question: 'Come si svolgono le lezioni?',
    answer: 'Offriamo formazione in diverse modalità: in presenza presso la nostra sede di Potenza, in e-learning attraverso la nostra piattaforma digitale, o in modalità blended (mista). La modalità dipende dal tipo di corso e dalle esigenze didattiche specifiche.'
  },
  {
    category: 'Corsi e Formazione',
    question: 'Qual è la durata media dei corsi?',
    answer: 'La durata varia in base al tipo di corso: i Master vanno da 300 a 600 ore, i corsi di qualifica professionale da 200 a 500 ore, mentre i corsi di aggiornamento e specializzazione possono durare da 20 a 100 ore. Ogni corso ha un calendario specifico indicato nella scheda del corso.'
  },
  // Iscrizioni e Costi
  {
    category: 'Iscrizioni e Costi',
    question: 'Come posso iscrivermi a un corso?',
    answer: 'Puoi iscriverti compilando il modulo di pre-iscrizione online sul nostro sito, contattandoci telefonicamente al 0971.473968, inviando una email a formazione@innform.eu, o venendo direttamente presso la nostra sede in Via della Chimica 87 a Potenza.'
  },
  {
    category: 'Iscrizioni e Costi',
    question: 'Ci sono corsi gratuiti?',
    answer: 'Sì, molti dei nostri corsi sono completamente gratuiti grazie a finanziamenti regionali, europei o nazionali. In particolare, i corsi del Programma GOL e i progetti speciali come T.I. ABILITO sono totalmente gratuiti per i partecipanti che soddisfano i requisiti di accesso.'
  },
  {
    category: 'Iscrizioni e Costi',
    question: 'Sono previste agevolazioni per i pagamenti?',
    answer: 'Sì, per i corsi a pagamento offriamo la possibilità di rateizzazione senza interessi. Inoltre, periodicamente attiviamo promozioni e sconti per iscrizioni anticipate o di gruppo. Contattaci per conoscere le opzioni disponibili per il corso di tuo interesse.'
  },
  {
    category: 'Iscrizioni e Costi',
    question: 'Quali documenti servono per l\'iscrizione?',
    answer: 'Generalmente sono richiesti: documento d\'identità valido, codice fiscale, titolo di studio (diploma o laurea a seconda del corso), curriculum vitae. Per i corsi finanziati potrebbero essere richiesti documenti aggiuntivi come ISEE o stato di disoccupazione.'
  },
  // Programma GOL
  {
    category: 'Programma GOL',
    question: 'Cos\'è il Programma GOL?',
    answer: 'GOL (Garanzia di Occupabilità dei Lavoratori) è un programma nazionale finanziato dal PNRR che offre percorsi di formazione gratuiti per disoccupati, percettori di NASpI, beneficiari di Reddito di Cittadinanza e altri soggetti vulnerabili. L\'obiettivo è favorire il reinserimento lavorativo attraverso upskilling e reskilling.'
  },
  {
    category: 'Programma GOL',
    question: 'Chi può accedere al Programma GOL?',
    answer: 'Possono accedere: disoccupati (anche di lunga durata), percettori di NASpI o DIS-COLL, beneficiari di ammortizzatori sociali, lavoratori fragili o vulnerabili, NEET (giovani che non studiano e non lavorano), donne in condizioni di svantaggio, persone con disabilità, lavoratori over 55.'
  },
  {
    category: 'Programma GOL',
    question: 'Come mi iscrivo al Programma GOL?',
    answer: 'Per accedere al GOL devi prima recarti al Centro per l\'Impiego della tua zona per un colloquio di orientamento e la definizione del tuo percorso. Successivamente potrai scegliere Innform come ente di formazione per frequentare i corsi previsti dal tuo piano personalizzato.'
  },
  // Stage e Lavoro
  {
    category: 'Stage e Lavoro',
    question: 'I corsi prevedono uno stage in azienda?',
    answer: 'Molti dei nostri corsi di qualifica includono un periodo di stage obbligatorio presso aziende partner del nostro network. Lo stage permette di applicare le competenze acquisite in un contesto lavorativo reale e spesso si trasforma in un\'opportunità di assunzione.'
  },
  {
    category: 'Stage e Lavoro',
    question: 'Qual è il tasso di occupazione dopo i corsi?',
    answer: 'Il nostro tasso di placement (inserimento lavorativo) medio è del 78% entro 6 mesi dalla fine del corso. Per alcuni settori come l\'analisi alimentare e l\'interior design, il tasso supera l\'85%. Forniamo supporto attivo nella ricerca del lavoro con CV, preparazione ai colloqui e matching con aziende.'
  },
  {
    category: 'Stage e Lavoro',
    question: 'Offrite supporto per trovare lavoro?',
    answer: 'Sì, il nostro servizio di Job Placement include: revisione e ottimizzazione del CV, preparazione ai colloqui di lavoro, segnalazione a aziende partner, accesso a offerte di lavoro riservate, supporto nella creazione del profilo LinkedIn professionale.'
  },
  // Sede e Contatti
  {
    category: 'Sede e Contatti',
    question: 'Dove si trova la sede di Innform?',
    answer: 'La nostra sede principale si trova in Via della Chimica 87, 85100 Potenza (PZ). Siamo facilmente raggiungibili in auto (uscita Potenza Centro) e a piedi dalla stazione ferroviaria centrale (5 minuti). Disponiamo di aule moderne, laboratori attrezzati e spazi per lo studio.'
  },
  {
    category: 'Sede e Contatti',
    question: 'Quali sono gli orari di apertura?',
    answer: 'La segreteria è aperta dal Lunedì al Venerdì dalle 9:00 alle 13:30 e dalle 15:30 alle 19:00, il Sabato dalle 10:00 alle 13:00. Per informazioni puoi chiamare lo 0971.473968 o scrivere a formazione@innform.eu.'
  },
  // SEO FAQ aggiuntive
  {
    category: 'Iscrizioni e Costi',
    question: 'Quanto costano i corsi di formazione?',
    answer: 'I costi variano in base al tipo di corso: i corsi finanziati dal Programma GOL o da fondi regionali sono completamente gratuiti. I Master a pagamento partono da €1.500, i corsi di qualifica da €800. Offriamo sempre la possibilità di rateizzazione senza interessi e periodicamente attiviamo promozioni speciali.'
  },
  {
    category: 'Corsi e Formazione',
    question: 'I corsi sono online o in presenza?',
    answer: 'Offriamo entrambe le modalità a seconda del corso. La formazione può essere in presenza presso la nostra sede di Potenza, completamente online tramite la nostra piattaforma e-learning, o in modalità blended (mista). Ogni scheda corso indica chiaramente la modalità di erogazione prevista.'
  },
  {
    category: 'Corsi e Formazione',
    question: 'Come ottenere una qualifica professionale riconosciuta?',
    answer: 'Per ottenere una qualifica professionale riconosciuta dalla Regione Basilicata devi completare un corso di qualifica accreditato, frequentare almeno il 70% delle ore previste e superare l\'esame finale. Le qualifiche rilasciate da Innform sono valide su tutto il territorio nazionale e riconosciute nel Repertorio Nazionale delle Qualificazioni.'
  },
  {
    category: 'Corsi e Formazione',
    question: 'Qual è la differenza tra corso e master?',
    answer: 'I corsi di qualifica professionale sono destinati a chi cerca una prima formazione o riqualificazione (diploma richiesto), durano 200-500 ore e rilasciano una qualifica regionale. I Master sono percorsi post-laurea (laurea richiesta), durano 300-600 ore, includono project work e stage, e sono orientati a ruoli manageriali e specialistici.'
  },
  {
    category: 'Programma GOL',
    question: 'Quali sono i requisiti per accedere al Programma GOL?',
    answer: 'Per accedere al Programma GOL devi essere in una di queste condizioni: disoccupato, percettore di NASpI/DIS-COLL, beneficiario di ammortizzatori sociali, lavoratore fragile o vulnerabile, NEET under 30, donna in condizione di svantaggio, persona con disabilità, o lavoratore over 55. È necessario recarsi al Centro per l\'Impiego per la presa in carico.'
  },
  {
    category: 'Corsi e Formazione',
    question: 'A cosa serve la certificazione PEKIT?',
    answer: 'La certificazione PEKIT (Permanent Education and Knowledge on Information Technology) è una certificazione informatica riconosciuta dal MIUR, valida per concorsi pubblici e graduatorie scolastiche. Attesta competenze digitali a livello europeo ed è utile per aumentare il punteggio nelle graduatorie docenti, nei concorsi pubblici e per migliorare il proprio curriculum professionale.'
  },
  {
    category: 'Stage e Lavoro',
    question: 'Lo stage è retribuito?',
    answer: 'Gli stage curriculari inclusi nei corsi di qualifica generalmente prevedono un\'indennità di partecipazione o un rimborso spese, variabile in base al progetto e ai finanziamenti disponibili. Per i corsi GOL è spesso prevista un\'indennità di frequenza. Gli stage extra-curriculari attivati dopo il corso seguono la normativa regionale che prevede un\'indennità minima mensile.'
  }
];

const categories = [
  { id: 'all', label: 'Tutte le domande', icon: HelpCircle },
  { id: 'Corsi e Formazione', label: 'Corsi e Formazione', icon: GraduationCap },
  { id: 'Iscrizioni e Costi', label: 'Iscrizioni e Costi', icon: Euro },
  { id: 'Programma GOL', label: 'Programma GOL', icon: FileCheck },
  { id: 'Stage e Lavoro', label: 'Stage e Lavoro', icon: Briefcase },
  { id: 'Sede e Contatti', label: 'Sede e Contatti', icon: Users }
];

export function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFAQ = activeCategory === 'all'
    ? faqData
    : faqData.filter(item => item.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Prepara i dati per FAQSchema
  const faqSchemaItems = faqData.map(item => ({
    question: item.question,
    answer: item.answer
  }));

  return (
    <>
      <SEOHead
        title="Domande Frequenti (FAQ) - Corsi e Formazione"
        description="Trova risposte alle domande più frequenti su corsi, iscrizioni, Programma GOL, stage e opportunità di lavoro presso Innform, centro formazione accreditato in Basilicata."
        url="/faq"
      />
      <FAQSchema items={faqSchemaItems} />

      <div className="bg-white pt-24">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-overlay filter blur-3xl"></div>
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
              <HelpCircle className="text-purple-300" size={20} />
              <span className="text-sm font-medium">Centro Assistenza</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Domande Frequenti</h1>
            <p className="text-lg text-purple-100 max-w-2xl mx-auto">
              Trova rapidamente le risposte alle domande più comuni su corsi, iscrizioni, finanziamenti e opportunità di carriera.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-gray-50 border-b border-gray-200 sticky top-20 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat.id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600 border border-gray-200'
                    }`}
                  >
                    <Icon size={16} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              {filteredFAQ.map((item, index) => {
                const isOpen = openItems.includes(index);
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full px-6 py-5 text-left flex items-start justify-between gap-4"
                    >
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full mb-2 inline-block">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 mt-2">
                          {item.question}
                        </h3>
                      </div>
                      <ChevronDown
                        size={24}
                        className={`text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredFAQ.length === 0 && (
              <div className="text-center py-12">
                <HelpCircle size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Nessuna domanda trovata in questa categoria.</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Non hai trovato la risposta che cercavi?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Il nostro team è a disposizione per rispondere a tutte le tue domande sui corsi, le iscrizioni e le opportunità formative.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:0971473968"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                <Calendar size={20} />
                Chiama 0971.473968
              </a>
              <a
                href="mailto:formazione@innform.eu"
                className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold border-2 border-purple-600 hover:bg-purple-50 transition-colors"
              >
                Scrivi una Email
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
