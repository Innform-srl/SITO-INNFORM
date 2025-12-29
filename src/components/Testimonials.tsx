import React from 'react';
import { Quote, Star } from 'lucide-react';

// Schema JSON-LD per le recensioni aggregate
function ReviewsSchema({ testimonials }: { testimonials: Array<{ text: string; author: string; role: string }> }) {
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
    "review": testimonials.map((t, i) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": t.author
      },
      "reviewBody": t.text,
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

export function Testimonials() {
  const testimonials = [
    {
      text: "Grazie ad Innform, alle certificazioni che il master mi ha rilasciato e ai contatti che Innform ha con Aziende su tutto il territorio nazionale oggi lavoro presso RINA Services SpA.",
      author: "Studente Master Safety Manager",
      role: "Master Safety Manager",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      text: "Ho scelto Innform per lo spessore dei docenti e per la serietà dell'organizzazione. Professionisti di esperienza riconosciuti ed affermati nel proprio ambito. Ti aprono lo sguardo, orientano sul campo che conoscono molto bene, insegnano la pratica dettagliatamente.",
      author: "Studente Master Editoria",
      role: "Master Editoria e Comunicazione",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      text: "Il corso di alta formazione è altamente formativo, con docenti competenti, preparati e di grande esperienza, capaci di trasmettere importanti nozioni tecniche nell'ambito dell'analisi chimica e non solo.",
      author: "Studente Master Analisi Alimentari",
      role: "Master Analisi Alimentari",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <>
    <ReviewsSchema testimonials={testimonials} />
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Testimonianze dei Nostri Studenti
          </h2>
          <div className="h-1.5 w-24 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="relative bg-gray-50 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${testimonial.gradient} opacity-10 rounded-bl-full rounded-tr-3xl`}></div>
              
              <Quote className="text-purple-300 mb-6" size={40} />
              
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.text}"
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
    </>
  );
}
