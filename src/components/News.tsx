import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsItems } from '../utils/newsData';

export function News() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // Filtra le news degli ultimi 2 mesi (o mostra tutte se meno di 2 mesi)
  const recentNews = newsItems.slice(0, 4);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % recentNews.length);
        setIsFlipping(false);
      }, 400);
    }, 5000); // Cambia ogni 5 secondi

    return () => clearInterval(interval);
  }, [recentNews.length]);

  const currentNews = recentNews[currentIndex];

  return (
    <section id="news" className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500"></div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-4 h-4 bg-white/20 rounded-full"></div>
      <div className="absolute bottom-40 left-20 w-3 h-3 bg-white/20 rounded-full"></div>
      <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-white/30 rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-semibold mb-6">
              Blog & Eventi
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ultime Novita
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-lg">
              Resta aggiornato su corsi, eventi e opportunita dal mondo Innform. Scopri tutte le news e gli avvisi importanti.
            </p>

            {/* News indicators */}
            <div className="flex gap-2 mb-8">
              {recentNews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsFlipping(true);
                    setTimeout(() => {
                      setCurrentIndex(index);
                      setIsFlipping(false);
                    }, 400);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            <Link
              to="/news"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Vedi tutte le News
              <ArrowRight size={20} />
            </Link>
          </div>

          {/* Right Card - Animated */}
          <div className="relative flex justify-center lg:justify-end">
            {/* Background cards for depth effect */}
            <div className="absolute top-4 right-4 lg:right-0 w-80 md:w-96 h-[420px] bg-purple-400/30 rounded-3xl transform rotate-3"></div>
            <div className="absolute top-2 right-2 lg:right-2 w-80 md:w-96 h-[420px] bg-purple-300/20 rounded-3xl transform rotate-1"></div>

            {/* Main Card */}
            <div
              className={`relative w-80 md:w-96 bg-white/95 rounded-3xl shadow-2xl p-8 transform transition-all duration-400 ${
                isFlipping ? 'scale-95 opacity-0 rotate-y-90' : 'scale-100 opacity-100 rotate-y-0'
              }`}
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg flex items-center justify-center">
                  <Newspaper size={32} className="text-white" />
                </div>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight border border-gray-200">
                  {currentNews?.category}
                </span>
              </div>

              {/* Card Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight line-clamp-2">
                {currentNews?.title}
              </h3>

              {/* Card Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                {currentNews?.excerpt}
              </p>

              {/* Card Info */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-purple-600" />
                  <span className="text-gray-700 text-sm">{currentNews?.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-purple-600" />
                  <span className="text-gray-700 text-sm">News</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-purple-600" />
                  <span className="text-gray-700 text-sm">Leggi</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-center">
                <Link
                  to={`/news/${currentNews?.id}`}
                  className="text-purple-600 text-xs font-bold uppercase tracking-tight hover:text-purple-700 transition-colors"
                >
                  Leggi Articolo
                </Link>
                <Link
                  to={`/news/${currentNews?.id}`}
                  className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-110 transition-all duration-300"
                >
                  <ArrowRight size={24} className="text-white" />
                </Link>
              </div>
            </div>

            {/* Floating action button */}
            <div className="absolute -bottom-4 right-1/4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center">
              <ArrowRight size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
