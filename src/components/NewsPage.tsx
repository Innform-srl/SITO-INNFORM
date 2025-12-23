import React from 'react';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsItems } from '../utils/newsData';

export function NewsPage() {
  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            News & Eventi
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tutte le novità, gli aggiornamenti e le opportunità dal mondo della formazione Innform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <article 
              key={item.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
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
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar size={16} />
                  <span>{item.date}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 mb-6 line-clamp-3 flex-1">
                  {item.excerpt}
                </p>
                
                <Link 
                  to={`/news/${item.id}`}
                  className="inline-flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all mt-auto"
                >
                  Leggi tutto
                  <ArrowRight size={18} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}