import React, { useState } from 'react';
import { Quote, X } from 'lucide-react';
import { getTestimonialsForCourse, CourseTestimonial } from '../data/courseTestimonials';

interface CourseTestimonialsProps {
  courseCode: string;
  courseName: string;
  gradient?: string;
}

// Schema JSON-LD per le recensioni del corso specifico
function CourseReviewsSchema({
  testimonials,
  courseName
}: {
  testimonials: CourseTestimonial[];
  courseName: string;
}) {
  if (testimonials.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": courseName,
    "provider": {
      "@type": "Organization",
      "name": "Innform",
      "sameAs": "https://www.innform.eu"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": testimonials.length.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": testimonials.map((t) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": t.name
      },
      "name": t.title,
      "reviewBody": t.excerpt,
      "datePublished": t.date.split('/').reverse().join('-'),
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5",
        "worstRating": "1"
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
  gradient,
  onClose
}: {
  testimonial: CourseTestimonial;
  gradient: string;
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
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${gradient} opacity-10 rounded-bl-full rounded-tr-3xl`}></div>

        {/* Contenuto */}
        <Quote className="text-purple-300 mb-6" size={48} />

        <h3 className="text-xl font-bold text-gray-900 mb-4">{testimonial.title}</h3>

        <p className="text-gray-700 leading-relaxed mb-8 text-lg whitespace-pre-line">
          "{testimonial.fullText}"
        </p>

        <div className="border-t border-gray-100 pt-6">
          <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
          <div className="text-sm text-gray-500">{testimonial.date}</div>
        </div>
      </div>
    </div>
  );
}

// Funzione per troncare il testo
function truncateText(text: string, maxLength: number = 180): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function CourseTestimonials({
  courseCode,
  courseName,
  gradient = 'from-purple-600 to-pink-600'
}: CourseTestimonialsProps) {
  const testimonials = getTestimonialsForCourse(courseCode);
  const [selectedTestimonial, setSelectedTestimonial] = useState<CourseTestimonial | null>(null);

  // Se non ci sono testimonianze per questo corso, non mostrare nulla
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <>
      <CourseReviewsSchema testimonials={testimonials} courseName={courseName} />

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        {/* Header sezione */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Testimonianze degli Studenti
          </h3>
          <p className="text-gray-500">
            {testimonials.length} recension{testimonials.length === 1 ? 'e' : 'i'} verificat{testimonials.length === 1 ? 'a' : 'e'}
          </p>
          <div className={`h-1 w-16 bg-gradient-to-r ${gradient} mx-auto rounded-full mt-4`}></div>
        </div>

        {/* Grid testimonianze - stesso layout homepage */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              onClick={() => setSelectedTestimonial(testimonial)}
              className="relative bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${gradient} opacity-10 rounded-bl-full rounded-tr-2xl`}></div>

              <Quote className="text-purple-300 mb-4" size={32} />

              <p className="text-gray-700 leading-relaxed mb-4 italic text-sm">
                "{truncateText(testimonial.excerpt)}"
              </p>

              <div className="mt-auto">
                <div className="font-bold text-gray-900 text-sm">{testimonial.name}</div>
                <div className="text-xs text-gray-500">{testimonial.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modale */}
      {selectedTestimonial && (
        <TestimonialModal
          testimonial={selectedTestimonial}
          gradient={gradient}
          onClose={() => setSelectedTestimonial(null)}
        />
      )}
    </>
  );
}
