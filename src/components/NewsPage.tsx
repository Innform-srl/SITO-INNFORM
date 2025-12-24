import React, { useState, useMemo } from 'react';
import { Calendar, Tag, ArrowRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsItems } from '../utils/newsData';

const categories = ['Tutti', 'Corsi', 'Bandi', 'Avvisi', 'Graduatorie'];

export function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('Tutti');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = useMemo(() => {
    return newsItems.filter((item) => {
      const matchesCategory = activeCategory === 'Tutti' || item.category === activeCategory;
      const matchesSearch = searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            News & Eventi
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tutte le novita, gli aggiornamenti e le opportunita dal mondo della formazione Innform
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                    activeCategory === category
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cerca news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item) => (
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
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nessun risultato trovato</h3>
            <p className="text-gray-500">
              Prova a modificare i filtri o la ricerca per trovare le news che cerchi.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
