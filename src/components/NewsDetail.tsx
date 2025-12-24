import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Tag, ArrowLeft, Share2, ArrowRight } from 'lucide-react';
import { newsItems } from '../utils/newsData';

export function NewsDetail() {
  const { newsId } = useParams();
  const currentId = Number(newsId);
  const newsItem = newsItems.find(item => item.id === currentId);
  
  const currentIndex = newsItems.findIndex(item => item.id === currentId);
  const prevItem = currentIndex < newsItems.length - 1 ? newsItems[currentIndex + 1] : null; 
  const nextItem = currentIndex > 0 ? newsItems[currentIndex - 1] : null; 
  
  const otherNews = newsItems.filter(item => item.id !== currentId).slice(0, 4);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [newsId]);

  if (!newsItem) {
    return (
      <div className="pt-32 pb-16 min-h-screen text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Articolo non trovato</h2>
        <Link to="/news" className="text-purple-600 hover:underline">Torna alle News</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/news" className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-8 transition-colors font-medium">
          <ArrowLeft size={20} />
          Torna all'archivio
        </Link>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Content Column */}
          <article className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10 border border-gray-100">
              <header className="mb-8">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Tag size={14} />
                    {newsItem.category}
                  </span>
                  <span className="text-gray-500 flex items-center gap-1 text-sm font-medium">
                    <Calendar size={16} />
                    {newsItem.date}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {newsItem.title}
                </h1>
              </header>

              <div className="rounded-2xl overflow-hidden shadow-md mb-10 aspect-video">
                <img 
                  src={newsItem.image} 
                  alt={newsItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div
                className="prose prose-lg max-w-none
                  text-gray-700
                  prose-headings:text-gray-900
                  prose-headings:font-bold
                  prose-headings:mt-10
                  prose-headings:mb-4
                  prose-h3:text-2xl
                  prose-h3:border-l-4
                  prose-h3:border-purple-500
                  prose-h3:pl-4
                  prose-p:leading-relaxed
                  prose-p:mb-6
                  prose-p:text-[17px]
                  prose-a:text-purple-600
                  prose-a:font-semibold
                  prose-a:underline
                  prose-a:underline-offset-2
                  hover:prose-a:text-purple-500
                  prose-img:rounded-xl
                  prose-ul:my-6
                  prose-ul:space-y-3
                  prose-li:text-[17px]
                  prose-li:leading-relaxed
                  prose-li:marker:text-purple-500
                  prose-li:pl-2
                  prose-strong:text-gray-900
                  prose-strong:font-semibold
                  [&_.lead]:text-xl
                  [&_.lead]:text-gray-600
                  [&_.lead]:leading-relaxed
                  [&_.lead]:mb-8
                  [&_.lead]:font-normal
                  [&_.cta-link]:inline-flex
                  [&_.cta-link]:items-center
                  [&_.cta-link]:gap-2
                  [&_.cta-link]:bg-purple-600
                  [&_.cta-link]:text-white
                  [&_.cta-link]:px-6
                  [&_.cta-link]:py-3
                  [&_.cta-link]:rounded-xl
                  [&_.cta-link]:font-semibold
                  [&_.cta-link]:no-underline
                  [&_.cta-link]:mt-6
                  [&_.cta-link]:hover:bg-purple-700
                  [&_.cta-link]:transition-colors
                "
              >
                <div dangerouslySetInnerHTML={{ __html: newsItem.content || '' }} />
              </div>

              {/* Share & Navigation */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-semibold text-gray-900">Condividi:</span>
                  <div className="flex gap-2">
                    {['Facebook', 'Twitter', 'LinkedIn'].map((platform) => (
                      <button key={platform} className="px-4 py-2 rounded-lg bg-gray-50 hover:bg-purple-50 text-gray-600 hover:text-purple-600 transition-colors text-sm font-medium">
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Article Navigation */}
                <div className="grid grid-cols-2 gap-4">
                  {prevItem ? (
                    <Link 
                      to={`/news/${prevItem.id}`}
                      className="group p-4 rounded-xl border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all text-left"
                    >
                      <div className="text-sm text-gray-500 mb-1 flex items-center gap-1 group-hover:text-purple-600">
                        <ArrowLeft size={14} />
                        Precedente
                      </div>
                      <div className="font-semibold text-gray-900 line-clamp-1 group-hover:text-purple-700">
                        {prevItem.title}
                      </div>
                    </Link>
                  ) : <div></div>}

                  {nextItem ? (
                    <Link 
                      to={`/news/${nextItem.id}`}
                      className="group p-4 rounded-xl border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all text-right"
                    >
                      <div className="text-sm text-gray-500 mb-1 flex items-center justify-end gap-1 group-hover:text-purple-600">
                        Successivo
                        <ArrowRight size={14} />
                      </div>
                      <div className="font-semibold text-gray-900 line-clamp-1 group-hover:text-purple-700">
                        {nextItem.title}
                      </div>
                    </Link>
                  ) : <div></div>}
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar - Moved to right column as requested */}
          <aside className="lg:col-span-4 h-full">
            <div className="sticky top-28 space-y-8">
              <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                  Altre News
                </h3>
                
                <div className="space-y-6">
                  {otherNews.map((item) => (
                    <Link 
                      key={item.id} 
                      to={`/news/${item.id}`}
                      className="group flex gap-4 items-start"
                    >
                      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded-full mb-2 inline-block">
                          {item.category}
                        </span>
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-purple-600 transition-colors leading-snug">
                          {item.title}
                        </h4>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          {item.date}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <Link 
                    to="/news"
                    className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all text-sm"
                  >
                    Vedi tutto l'archivio
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Newsletter Box */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl shadow-lg p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-3">Resta aggiornato</h3>
                <p className="text-purple-100 text-sm mb-6">
                  Iscriviti alla nostra newsletter per ricevere le ultime novità sui corsi.
                </p>
                <button className="w-full bg-white text-purple-600 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all text-sm">
                  Iscriviti Ora
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}