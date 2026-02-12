import React from 'react';
import { Calendar, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsItems } from '../utils/newsData';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { OptimizedImage } from './OptimizedImage';

export function NewsSection() {
  const latestNews = newsItems.slice(0, 3);
  const { ref: sectionRef, revealed: sectionRevealed } = useScrollReveal();

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-white relative overflow-hidden">
      {/* Background blur effect */}
      <div
        className="absolute left-1/2 top-0 w-[562px] h-[689px] opacity-50 blur-[40px] pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, rgba(243, 232, 255, 0.50) 0%, rgba(252, 231, 243, 0.50) 100%)',
          transform: 'rotate(3deg) translateX(-50%)',
        }}
      />

      <div
        ref={sectionRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 reveal-up ${sectionRevealed ? 'revealed' : ''}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-9">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 opacity-50" />
            <h2 className="text-lg font-bold text-gray-900">Ultime News</h2>
          </div>
          <Link
            to="/news"
            className="text-sm font-bold text-purple-600 hover:text-purple-700 transition-colors"
          >
            Vedi tutte
          </Link>
        </div>

        {/* News Cards */}
        <div className="space-y-4 mb-12">
          {latestNews.map((news) => (
            <Link
              key={news.id}
              to={`/news/${news.id}`}
              className="block bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-4 group"
            >
              <div className="flex gap-4">
                {/* Image */}
                <div className="relative w-20 h-20 rounded-[14px] overflow-hidden flex-shrink-0">
                  <OptimizedImage
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  {/* Category and Date */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-wide">
                      {news.category}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Calendar size={10} strokeWidth={2} />
                      <span className="text-xs">{news.date}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-purple-600 transition-colors">
                    {news.title}
                  </h3>

                  {/* Read more link */}
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-xs text-gray-500">Leggi articolo</span>
                    <ArrowRight size={12} className="text-gray-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Interactive Sections */}
        <div className="flex gap-3 justify-center items-stretch">
          {/* Offerte Lavoro */}
          <div className="w-[85px] flex-shrink-0 rounded-[32px] bg-rose-100 overflow-hidden p-6 flex flex-col items-center justify-between">
            <div className="text-center">
              <div className="text-sm font-bold text-rose-900 leading-tight">Offerte</div>
              <div className="text-sm font-bold text-rose-900 leading-tight">Lavoro</div>
            </div>

            <button className="w-8 h-8 rounded-full bg-white/80 shadow-sm flex items-center justify-center hover:scale-110 transition-transform">
              <Search size={14} className="text-gray-900" strokeWidth={2} />
            </button>
          </div>

          {/* Consigli & News - Main Card */}
          <div className="flex-1 max-w-[255px] rounded-[32px] border border-gray-100 bg-white/90 shadow-xl overflow-hidden">
            <div className="p-5 flex flex-col justify-between h-full">
              {/* Content */}
              <div className="space-y-2 mb-10">
                <div className="text-[10px] font-bold uppercase tracking-wide text-sky-600">
                  Da non perdere
                </div>
                <h3 className="text-lg font-bold leading-snug text-gray-900">
                  Consigli & News
                </h3>
                <p className="text-xs leading-relaxed text-gray-500">
                  Guide pratiche per migliorare il tuo CV e affrontare i colloqui.
                </p>
              </div>

              {/* Tags and Button */}
              <div className="flex justify-between items-center gap-2">
                <div className="flex gap-1 flex-wrap">
                  {['CV', 'Colloquio', 'Skills'].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 text-[10px] font-bold rounded-[10px] border border-gray-100 bg-gray-50 text-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="flex items-center gap-1 px-4 py-2 rounded-full bg-sky-500 hover:scale-105 transition-all shadow-md">
                  <span className="text-xs font-bold text-white">Apri</span>
                  <ArrowRight size={12} className="text-white" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
