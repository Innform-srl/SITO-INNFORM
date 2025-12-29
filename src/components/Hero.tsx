import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Award, Users, BookOpen, Newspaper, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsItems } from '../utils/newsData';

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filtra le news dell'ultimo mese
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const recentNews = newsItems.filter(item => {
    // Parsing della data italiana (es: "2 Dicembre 2025")
    const months: { [key: string]: number } = {
      'gennaio': 0, 'febbraio': 1, 'marzo': 2, 'aprile': 3,
      'maggio': 4, 'giugno': 5, 'luglio': 6, 'agosto': 7,
      'settembre': 8, 'ottobre': 9, 'novembre': 10, 'dicembre': 11
    };
    const parts = item.date.toLowerCase().split(' ');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = months[parts[1]];
      const year = parseInt(parts[2]);
      if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        const newsDate = new Date(year, month, day);
        return newsDate >= oneMonthAgo;
      }
    }
    return true; // Se non riesce a parsare, include la news
  });

  // Usa le news filtrate (minimo 1, massimo 4)
  const slides = recentNews.length > 0 ? recentNews.slice(0, 4) : newsItems.slice(0, 1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000); // 10 secondi
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{background: 'linear-gradient(135deg, #9300FF 0%, #9A05FF 50%, #FF0083 100%)'}}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[18px] left-[50px] w-[418px] h-[418px] rounded-full opacity-70 animate-blob" style={{background: '#C27AFF', filter: 'blur(64px)'}}></div>
          <div className="absolute top-[162px] right-[50px] w-[382px] h-[382px] rounded-full opacity-70 animate-blob animation-delay-2000" style={{background: '#FB64B6', filter: 'blur(64px)'}}></div>
          <div className="absolute bottom-[100px] left-1/3 w-[346px] h-[346px] rounded-full opacity-70 animate-blob animation-delay-4000" style={{background: '#51A2FF', filter: 'blur(64px)'}}></div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <Sparkles className="text-yellow-300" size={20} />
              <span className="text-sm">Centro Formazione Accreditato</span>
            </div>

            <h1 style={{width: 576, height: 195, position: 'relative'}}>
              <span style={{color: 'white', fontSize: 96, fontFamily: 'Alata', fontWeight: 400, lineHeight: '75px', wordWrap: 'break-word', textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
                Innovazione
              </span>
              <div style={{width: 576, height: 120, left: 0, top: 75, position: 'absolute'}}>
                <span style={{color: 'white', fontSize: 96, fontFamily: 'Alata', fontWeight: 400, lineHeight: '120px', wordWrap: 'break-word', textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}}>
                  Formazione
                </span>
              </div>
            </h1>

            <p className="text-lg md:text-xl text-[rgb(255,255,255)] leading-relaxed max-w-xl font-[Alata]">
              Trasforma la tua carriera con i nostri corsi certificati. Master, qualifiche professionali e programmi GOL accreditati dalla Regione Basilicata.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="text-pink-300" size={20} />
                </div>
                <div className="text-2xl mb-1 font-bold">673+</div>
                <div className="text-sm text-purple-200">Studenti</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="text-yellow-300" size={20} />
                </div>
                <div className="text-2xl mb-1 font-bold">50+</div>
                <div className="text-sm text-purple-200">Corsi</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="text-blue-300" size={20} />
                </div>
                <div className="text-2xl mb-1 font-bold">95%</div>
                <div className="text-sm text-purple-200">Successo</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="#corsi"
                className="group inline-flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 hover:scale-105"
              >
                <span className="font-medium">Esplora i Corsi</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </a>
              
              <a
                href="#contatti"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 font-medium"
              >
                Contattaci
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-xs text-purple-200 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Accreditato Regione Basilicata</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-purple-200 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Docenti Qualificati</span>
              </div>
            </div>
          </div>

          {/* Right Carousel */}
          <div className="relative flex justify-center items-center h-[500px]">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-30 transform scale-75"></div>
            
            <div className="relative w-full max-w-sm h-full max-h-[450px]">
              {slides.map((slide, index) => {
                const isActive = index === currentSlide;
                // Calculate position for stacking effect
                let positionClass = 'opacity-0 scale-90 translate-x-12 pointer-events-none';
                let zIndex = 0;

                if (isActive) {
                  positionClass = 'opacity-100 scale-100 translate-x-0 pointer-events-auto';
                  zIndex = 20;
                } else if (index === (currentSlide + 1) % slides.length) {
                   positionClass = 'opacity-40 scale-95 translate-x-8 -rotate-6 pointer-events-none';
                   zIndex = 10;
                } else if (index === (currentSlide - 1 + slides.length) % slides.length) {
                   positionClass = 'opacity-0 scale-90 -translate-x-12 pointer-events-none';
                   zIndex = 0;
                }

                return (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${positionClass}`}
                    style={{ zIndex }}
                  >
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="inline-block p-4 rounded-2xl bg-gradient-to-br from-red-600 to-red-500 shadow-lg animate-pulse">
                              <Newspaper className="text-white" size={32} />
                            </div>
                            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide animate-pulse">
                                NEWS
                            </span>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2">{slide.title}</h3>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">{slide.excerpt}</p>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircle size={16} className="text-purple-600 flex-shrink-0" />
                                <span>{slide.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircle size={16} className="text-purple-600 flex-shrink-0" />
                                <span>News</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircle size={16} className="text-purple-600 flex-shrink-0" />
                                <span>Leggi</span>
                            </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <Link
                            to={`/news/${slide.id}`}
                            className="text-xs font-semibold text-purple-600 uppercase tracking-wide hover:text-purple-700 transition-colors"
                          >
                            Leggi Articolo
                          </Link>
                          <Link
                            to={`/news/${slide.id}`}
                            className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
                          >
                            <ArrowRight size={24} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Indicators */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? 'bg-white w-8' : 'bg-white/30 hover:bg-white/50 w-2'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-white animate-bounce">
          <span className="text-sm">Scorri per scoprire</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(30px, 30px) scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}