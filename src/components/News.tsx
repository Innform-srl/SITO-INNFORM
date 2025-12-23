import React from 'react';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsItems } from '../utils/newsData';

export function News() {
  const displayedNews = newsItems.slice(0, 3);

  return (
    <section id="news" className="py-24 bg-white relative overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
            Blog & Eventi
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Ultime Novità
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Resta aggiornato su corsi, eventi e opportunità dal mondo Innform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayedNews.map((item) => (
            <article 
              key={item.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-semibold text-purple-600 flex items-center gap-1">
                  <Tag size={14} />
                  {item.category}
                </div>
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar size={16} />
                  <span>{item.date}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {item.excerpt}
                </p>
                
                <Link to={`/news/${item.id}`} className="inline-flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                  Leggi tutto
                  <ArrowRight size={18} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/news" 
            className="inline-block border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-xl hover:bg-purple-600 hover:text-white transition-all duration-300 font-semibold"
          >
            Vedi tutte le News
          </Link>
        </div>
      </div>
    </section>
  );
}
