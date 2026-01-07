import React, { useState } from 'react';
import { Quote, ChevronDown, ChevronUp, Star, User } from 'lucide-react';
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
      "sameAs": "https://www.innfrm.it"
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

// Card singola testimonianza
function TestimonialCard({
  testimonial,
  gradient = 'from-purple-600 to-pink-600',
  isExpanded,
  onToggle
}: {
  testimonial: CourseTestimonial;
  gradient?: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const displayText = isExpanded ? testimonial.fullText : testimonial.excerpt;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
      {/* Header con icona quote */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10`}>
          <Quote className="text-purple-600" size={24} />
        </div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
          ))}
        </div>
      </div>

      {/* Testo testimonianza */}
      <div className="flex-grow">
        <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
          {displayText}
        </p>
      </div>

      {/* Bottone espandi/comprimi se il testo e' lungo */}
      {testimonial.fullText.length > testimonial.excerpt.length && (
        <button
          onClick={onToggle}
          className="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          {isExpanded ? (
            <>
              Mostra meno <ChevronUp size={16} />
            </>
          ) : (
            <>
              Leggi tutto <ChevronDown size={16} />
            </>
          )}
        </button>
      )}

      {/* Footer con info autore */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}>
            <User size={18} />
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
            <div className="text-xs text-gray-500">{testimonial.date}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CourseTestimonials({
  courseCode,
  courseName,
  gradient = 'from-purple-600 to-pink-600'
}: CourseTestimonialsProps) {
  const testimonials = getTestimonialsForCourse(courseCode);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  // Se non ci sono testimonianze per questo corso, non mostrare nulla
  if (testimonials.length === 0) {
    return null;
  }

  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, 3);

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <>
      <CourseReviewsSchema testimonials={testimonials} courseName={courseName} />

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        {/* Header sezione */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Quote className="text-purple-600" size={24} />
              Testimonianze degli Studenti
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {testimonials.length} recension{testimonials.length === 1 ? 'e' : 'i'} verificat{testimonials.length === 1 ? 'a' : 'e'}
            </p>
          </div>

          {/* Rating medio */}
          <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="font-bold text-purple-700">4.9</span>
          </div>
        </div>

        {/* Grid testimonianze */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              gradient={gradient}
              isExpanded={expandedCards.has(testimonial.id)}
              onToggle={() => toggleCard(testimonial.id)}
            />
          ))}
        </div>

        {/* Bottone mostra piu' testimonianze */}
        {testimonials.length > 3 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all bg-gradient-to-r ${gradient} text-white hover:shadow-lg hover:scale-105`}
            >
              {showAll ? (
                <>
                  Mostra meno <ChevronUp size={18} />
                </>
              ) : (
                <>
                  Mostra tutte le {testimonials.length} testimonianze <ChevronDown size={18} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
