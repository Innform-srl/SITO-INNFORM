import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Search, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { newsItems } from '../utils/newsData';
import { OptimizedImage } from './OptimizedImage';

/* ─── Card data for the interactive row ─── */
interface CardData {
  id: string;
  label: string;
  color: string;
  link: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  ctaColor: string;
  textColor: string;
}

const cardsData: CardData[] = [
  {
    id: 'corsi',
    label: "Corsi &\nMaster",
    color: '#ede9fe', // violet-100
    link: '#corsi',
    category: 'FORMAZIONE',
    title: 'Corsi & Master',
    description: 'Master tecnici, corsi di specializzazione e percorsi qualificanti accreditati dalla Regione Basilicata.',
    tags: ['Master', 'Corsi', 'Certificati'],
    ctaColor: '#7c3aed', // violet-600
    textColor: '#2e1065', // violet-950
  },
  {
    id: 'tiabilito',
    label: "Progetto\nTI Abilito",
    color: '#e0f2fe', // sky-100
    link: '/progetti/ti-abilito',
    category: 'INCLUSIONE',
    title: 'Progetto TI Abilito',
    description: 'Corsi gratuiti di tecnologie assistive e alfabetizzazione digitale per famiglie con disabilità.',
    tags: ['Gratuito', 'ASACOM', 'Tech'],
    ctaColor: '#0ea5e9', // sky-500
    textColor: '#082f49', // sky-950
  },
  {
    id: 'gol',
    label: "Percorso\nGOL",
    color: '#d1fae5', // emerald-100
    link: '/programmi/gol',
    category: 'PROGRAMMA GOL',
    title: 'Percorsi Finanziati',
    description: 'Reskilling e upskilling gratuiti per il reinserimento lavorativo: dal digitale alla panificazione.',
    tags: ['Gratuito', 'Lavoro', 'Stage'],
    ctaColor: '#10b981', // emerald-500
    textColor: '#022c22', // emerald-950
  },
];

/* ─── Interactive cards row ─── */
function InteractiveCardsRow() {
  const [activeId, setActiveId] = useState<string>('corsi');

  return (
    <div
      className="flex items-stretch"
      style={{ height: 176, gap: 12 }}
      onMouseLeave={() => {/* keep last hovered card open */}}
    >
      {cardsData.map((card) => {
        const isExpanded = activeId === card.id;

        return (
          <motion.div
            key={card.id}
            layout
            onMouseEnter={() => setActiveId(card.id)}
            animate={{ flex: isExpanded ? 3 : 0.7 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative overflow-hidden cursor-pointer"
            style={{ minWidth: 0, borderRadius: 32 }}
          >
            <Link to={card.link} className="block w-full h-full">
              {/* Background layer */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  backgroundColor: isExpanded ? 'rgba(255,255,255,0.90)' : card.color,
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  borderRadius: 32,
                  backdropFilter: isExpanded ? 'blur(8px)' : 'none',
                  border: isExpanded ? '1px solid #f3f4f6' : '1px solid transparent',
                  boxShadow: isExpanded
                    ? '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)'
                    : '0 1px 3px rgba(0,0,0,0.05)',
                }}
              />

              {/* Collapsed content */}
              <AnimatePresence>
                {!isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="relative z-10 flex flex-col items-center justify-between h-full"
                    style={{ padding: 12, paddingTop: 24, paddingBottom: 24 }}
                  >
                    <div className="text-center flex-1 flex items-center">
                      <span
                        className="font-bold leading-tight whitespace-pre-line"
                        style={{ fontSize: 14, color: card.textColor }}
                      >
                        {card.label}
                      </span>
                    </div>
                    <div
                      className="rounded-full flex items-center justify-center shadow-sm"
                      style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.8)' }}
                    >
                      <Search size={14} className="text-gray-700" strokeWidth={2} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="relative z-10 h-full flex flex-col justify-between"
                    style={{ padding: 20 }}
                  >
                    {/* Text group */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span
                        className="font-bold uppercase"
                        style={{
                          color: card.ctaColor,
                          fontSize: 10,
                          lineHeight: '14px',
                          letterSpacing: 0.8,
                        }}
                      >
                        {card.category}
                      </span>
                      <h4
                        className="font-bold"
                        style={{ color: '#111827', fontSize: 18, lineHeight: '24px' }}
                      >
                        {card.title}
                      </h4>
                      <p
                        className="line-clamp-2"
                        style={{ color: '#6b7280', fontSize: 12, lineHeight: '18px', fontWeight: 400 }}
                      >
                        {card.description}
                      </p>
                    </div>

                    {/* Footer: tags + button */}
                    <div className="flex justify-between items-center">
                      <div className="flex overflow-hidden" style={{ gap: 5 }}>
                        {card.tags.map((tag) => (
                          <div
                            key={tag}
                            className="flex items-center justify-center"
                            style={{
                              padding: '4px 8px',
                              background: '#f9fafb',
                              borderRadius: 8,
                              border: '1px solid #f3f4f6',
                            }}
                          >
                            <span style={{ color: '#6b7280', fontSize: 10, fontWeight: 700, lineHeight: '14px' }}>
                              {tag}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div
                        className="flex-shrink-0 flex items-center justify-center"
                        style={{
                          height: 32,
                          paddingLeft: 16,
                          paddingRight: 16,
                          background: card.ctaColor,
                          borderRadius: 9999,
                          gap: 5,
                          boxShadow: '0 2px 4px -2px rgba(0,0,0,0.1), 0 4px 6px -1px rgba(0,0,0,0.1)',
                        }}
                      >
                        <span className="font-bold text-white" style={{ fontSize: 12, lineHeight: '16px' }}>
                          Apri
                        </span>
                        <ArrowRight size={12} className="text-white" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Hero Section ─── */
export function Hero() {
  const recentNews = newsItems.slice(0, 3);

  return (
    <section
      id="hero"
      aria-label="Innform - Centro Formazione Accreditato"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#f8fafc' }}
    >
      {/* Decorative Blobs — Figma: 40% w/h, blur-3xl, opacity-70 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute animate-blob rounded-full"
          style={{
            top: '5%',
            left: '3%',
            width: '40%',
            height: '40%',
            background: '#e9d5ff', // purple-200
            opacity: 0.7,
            filter: 'blur(64px)',
          }}
        />
        <div
          className="absolute animate-blob animation-delay-2000 rounded-full"
          style={{
            top: '10%',
            right: '5%',
            width: '40%',
            height: '40%',
            background: '#bfdbfe', // blue-200
            opacity: 0.7,
            filter: 'blur(64px)',
          }}
        />
        <div
          className="absolute animate-blob animation-delay-4000 rounded-full"
          style={{
            bottom: '15%',
            left: '30%',
            width: '40%',
            height: '40%',
            background: '#fbcfe8', // pink-200
            opacity: 0.7,
            filter: 'blur(64px)',
          }}
        />
        <div
          className="absolute animate-blob animation-delay-2000 rounded-full"
          style={{
            bottom: '5%',
            right: '10%',
            width: '40%',
            height: '40%',
            background: '#c7d2fe', // indigo-200
            opacity: 0.7,
            filter: 'blur(64px)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full" style={{ paddingTop: 128, paddingBottom: 80 }}>
        <div className="grid lg:grid-cols-2 items-center" style={{ gap: 48 }}>
          {/* ─── Left Content ─── */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center rounded-full"
              style={{
                gap: 8,
                padding: '8px 16px',
                background: '#faf5ff', // purple-50
                border: '1px solid #f3e8ff', // purple-100
                marginBottom: 32,
              }}
            >
              <div
                className="rounded-full animate-pulse"
                style={{ width: 8, height: 8, background: '#a855f7' }}
              />
              <span className="font-semibold" style={{ fontSize: 14, color: '#7e22ce' }}>
                Il Futuro si Forma Qui
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-bold"
              style={{
                fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
                color: '#111827',
                marginBottom: 24,
              }}
            >
              Il tuo futuro inizia{' '}
              <span className="block">con la</span>
              <span
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(to right, #9333ea, #db2777)',
                }}
              >
                Formazione Giusta.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                fontSize: 20,
                lineHeight: 1.625,
                color: '#4b5563', // gray-600
                maxWidth: 576,
                marginBottom: 40,
              }}
            >
              Dal 2007, Innform è il punto di riferimento in Basilicata per la formazione professionale. Master, corsi qualificanti e progetti finanziati per trasformare il tuo talento in una carriera di successo.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row"
              style={{ gap: 16, marginBottom: 48 }}
            >
              <a
                href="#corsi"
                className="group inline-flex items-center justify-center text-white font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  padding: '16px 32px',
                  borderRadius: 16,
                  fontSize: 18,
                  background: '#111827',
                  gap: 8,
                }}
              >
                Scopri i Corsi
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </a>
              <a
                href="#chi-siamo"
                className="inline-flex items-center justify-center font-bold transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md"
                style={{
                  padding: '16px 32px',
                  borderRadius: 16,
                  fontSize: 18,
                  background: '#ffffff',
                  border: '2px solid #f3f4f6',
                  color: '#374151',
                }}
              >
                Chi Siamo
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-wrap items-center"
              style={{ gap: 32 }}
            >
              <div className="flex items-center" style={{ gap: 8 }}>
                <CheckCircle2 size={20} style={{ color: '#22c55e' }} />
                <span className="font-medium" style={{ fontSize: 14, color: '#6b7280' }}>
                  Accreditato Regione Basilicata
                </span>
              </div>
              <div className="flex items-center" style={{ gap: 8 }}>
                <CheckCircle2 size={20} style={{ color: '#22c55e' }} />
                <span className="font-medium" style={{ fontSize: 14, color: '#6b7280' }}>
                  Docenti Esperti
                </span>
              </div>
            </motion.div>
          </div>

          {/* ─── Right Content ─── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:flex flex-col"
            style={{ gap: 16, paddingTop: 48, paddingBottom: 48 }}
          >
            {/* Ultime News Header */}
            <div className="flex items-center justify-between" style={{ paddingLeft: 8, paddingRight: 8, marginBottom: 8 }}>
              <div className="flex items-center" style={{ gap: 8 }}>
                <div className="rounded-full" style={{ width: 8, height: 8, background: '#111827' }} />
                <span className="font-bold" style={{ fontSize: 18, color: '#111827' }}>Ultime News</span>
              </div>
              <Link
                to="/news"
                className="font-semibold transition-colors hover:text-purple-700"
                style={{ fontSize: 14, color: '#9333ea' }}
              >
                Vedi tutte
              </Link>
            </div>

            {/* News Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentNews.map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
                >
                  <Link
                    to={`/news/${news.id}`}
                    className="group flex transition-all duration-300 hover:shadow-xl"
                    style={{
                      gap: 16,
                      padding: 16,
                      background: '#ffffff',
                      borderRadius: 16,
                      border: '1px solid #f3f4f6',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                    }}
                  >
                    <OptimizedImage
                      src={news.image}
                      alt={news.title}
                      className="w-20 h-20 rounded-xl flex-shrink-0 object-cover"
                      width={80}
                      height={80}
                      priority={index === 0}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center" style={{ gap: 8, marginBottom: 4 }}>
                        <span
                          className="font-bold uppercase"
                          style={{
                            fontSize: 10,
                            letterSpacing: 0.8,
                            color: '#9333ea',
                            background: '#faf5ff',
                            padding: '2px 8px',
                            borderRadius: 9999,
                          }}
                        >
                          {news.category}
                        </span>
                        <span className="flex items-center" style={{ fontSize: 12, color: '#9ca3af', gap: 4 }}>
                          <Calendar size={10} />
                          {news.date}
                        </span>
                      </div>
                      <h3
                        className="font-bold line-clamp-2 group-hover:text-purple-600 transition-colors"
                        style={{ color: '#111827', lineHeight: 1.375, marginBottom: 4 }}
                      >
                        {news.title}
                      </h3>
                      <span
                        className="inline-flex items-center font-medium group-hover:text-purple-500 transition-colors"
                        style={{ fontSize: 12, color: '#6b7280', gap: 4, marginTop: 4 }}
                      >
                        Leggi articolo <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Interactive Cards Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              style={{ marginTop: 8 }}
            >
              <InteractiveCardsRow />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
