import React, { useState } from 'react';
import { Quote, X } from 'lucide-react';

interface Testimonial {
  excerpt: string;
  fullText: string;
  author: string;
  role: string;
  gradient: string;
}

// Schema JSON-LD per le recensioni aggregate
function ReviewsSchema({ testimonials }: { testimonials: Testimonial[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Innform",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": testimonials.length.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": testimonials.map((t) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": t.author
      },
      "reviewBody": t.fullText,
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
        "worstRating": "1"
      },
      "itemReviewed": {
        "@type": "Course",
        "name": t.role,
        "provider": {
          "@type": "Organization",
          "name": "Innform"
        }
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Modale per la lettura completa
function TestimonialModal({
  testimonial,
  onClose
}: {
  testimonial: Testimonial;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bottone chiudi */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Chiudi"
        >
          <X size={24} className="text-gray-500" />
        </button>

        {/* Decorazione gradient */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${testimonial.gradient} opacity-10 rounded-bl-full rounded-tr-3xl`}></div>

        {/* Contenuto */}
        <Quote className="text-purple-300 mb-6" size={48} />

        <p className="text-gray-700 leading-relaxed mb-8 text-lg whitespace-pre-line">
          "{testimonial.fullText}"
        </p>

        <div className="border-t border-gray-100 pt-6">
          <div className="font-bold text-gray-900 text-lg">{testimonial.author}</div>
          <div className={`text-sm bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent font-medium`}>
            {testimonial.role}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const testimonials: Testimonial[] = [
    {
      excerpt: "Al termine del Percorso del Master sono stato ricontattato dall'azienda presso la quale avevo svolto lo stage formativo, mi e' stato proposto di proseguire il percorso come Addetto al Servizio di Prevenzione e Protezione...",
      fullText: `Al termine del Percorso del Master sono stato ricontattato dall'azienda presso la quale avevo svolto lo stage formativo, mi e' stato proposto di proseguire il percorso che avevo intrapreso durante lo stage coadiuvando l'operato del Responsabile del Servizio di Prevenzione e Protezione in qualita' di Addetto al Servizio di Prevenzione e Protezione, ottenendo autonomia lavorativa dal primo istante.

Ho scoperto nel 2019 il Master in Safety Manager attraverso il passaparola tra i colleghi Tecnici della Prevenzione una volta laureati. Essendo la prima edizione del Master in Italia rappresentava sicuramente una opportunita' da non perdere.

Il Safety Manager puo' intervenire in maniera incisiva in quanto presenta un approccio a 360° a tutte le dinamiche legate alla sicurezza sul lavoro. Spazio per il Safety Manager ce n'e' in abbondanza in questo momento storico e potrebbe essere un'opportunita' per coloro che condividono la passione per la Sicurezza sui luoghi di lavoro.`,
      author: "Giuseppe Canio Matteo",
      role: "Master Safety Manager",
      gradient: "from-emerald-500 to-green-500"
    },
    {
      excerpt: "Ben articolato il piano di studi, tra aula, sviluppo di progetti e visite; molto utili le masterclass. Ha fatto la differenza il modulo di personal branding e orientamento. Innform e' stato attento alle nostre esigenze...",
      fullText: `Ben articolato il piano di studi, tra aula, sviluppo di progetti e visite; molto utili le masterclass. Ha fatto la differenza il modulo di personal branding e orientamento con una orientatrice qualificata Asnor, per la valorizzazione delle competenze e la scelta dello stage piu' in linea con i nostri profili. Innform e' stato attento alle nostre esigenze.

Quando mi viene chiesto come sia approdata al Master in Editoria e Comunicazione della Innform, rispondo per puro caso, per una di quelle assurde deviazioni che la vita subisce di tanto in tanto, mentre stai facendo altri programmi.

Ho avuto la fortuna di lavorare in una classe di persone collaborative e motivate e di confrontarmi con docenti che sono prima di tutto professionisti del settore, i quali ci hanno guidati nella realizzazione pratica di progetti in ambito giornalistico ed editoriale.

A conclusione, posso dire che sono felice che la vita mi abbia presentato questa opportunita'. Sto scoprendo che le professioni legate alla scrittura sono molteplici, e che scrivere per professione potrebbe essere piu' che un sogno.`,
      author: "Stefania Ianniello",
      role: "Master Editoria e Comunicazione",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      excerpt: "Gli argomenti come Certificazioni ISO, Sicurezza Alimentare, Gestione Qualita' e Sviluppo di un Manuale HACCP, proprio quelli richiesti nei tanti annunci a cui mi ero candidata. Una grande occasione per ampliare il mio bagaglio...",
      fullText: `Gli argomenti come Certificazioni ISO, Sicurezza Alimentare, Gestione Qualita' e Sviluppo di un Manuale HACCP, proprio quelli richiesti nei tanti annunci a cui mi ero candidata. Mi incuriosisco, anche gli altri argomenti trattati mi piacciono, 600 ore di formazione in aula e 300 ore di tirocinio presso un laboratorio/azienda reale, una grande occasione per ampliare il mio bagaglio personale.

Gli argomenti affrontati in questi mesi sono stati tanti, alcuni a me gia' conosciuti, dal punto di vista teorico, che ho avuto modo di approfondire e di trattare sotto un aspetto completamente diverso, di natura professionale, ed altri, del tutto nuovi, che mai avrei pensato potessero interessarmi e che, invece, mi hanno conquistata ed appassionata sempre di piu'.

Il Regista di tutto cio', colui che ci ha seguiti sin dalle prime chiacchierate informative fino alla fine del Tirocinio, e' Francesco, uno degli organizzatori del Master. Felice della scelta fatta e che rifarei ad occhi chiusi.`,
      author: "Maria Salinardi",
      role: "Master Analisi Alimentari e Ambientali",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <>
      <ReviewsSchema testimonials={testimonials} />
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Recensioni Studenti Corsi Formazione Potenza
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Scopri le esperienze di chi ha completato i nostri master e corsi professionali accreditati in Basilicata
            </p>
            <div className="h-1.5 w-24 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                onClick={() => setSelectedTestimonial(testimonial)}
                className="relative bg-gray-50 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${testimonial.gradient} opacity-10 rounded-bl-full rounded-tr-3xl`}></div>

                <Quote className="text-purple-300 mb-6" size={40} />

                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonial.excerpt}"
                </p>

                <div className="mt-auto">
                  <div className="font-bold text-gray-900">{testimonial.author}</div>
                  <div className={`text-sm bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent font-medium`}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modale */}
      {selectedTestimonial && (
        <TestimonialModal
          testimonial={selectedTestimonial}
          onClose={() => setSelectedTestimonial(null)}
        />
      )}
    </>
  );
}
