import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Microscope, BookOpen, ChevronLeft, ChevronRight, Award, Users, Settings, AlertTriangle, Megaphone, Croissant, Eye, GraduationCap, Target, Monitor, Loader2, Shield, ArrowUpRight, Search } from 'lucide-react';
import { useRealtimeCourses } from '../hooks/useRealtimeCourses';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import type { CoursePublicData } from '../types/courses-public';
import type { LucideIcon } from 'lucide-react';

type CategoryType = 'master' | 'gol' | 'specializzazione' | 'sicurezza';

interface CourseStyle {
  icon: LucideIcon;
  gradient: string;
  bgGradient: string;
  solidColor: string;
  gradientCSS: string;
  skills: string[];
}

const courseStylesMap: Record<string, CourseStyle> = {
  'TAA': {
    icon: Microscope,
    gradient: 'from-purple-600 via-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
    solidColor: '#9333ea',
    gradientCSS: 'linear-gradient(90deg, #9333EA 0%, #A855F7 50%, #EC4899 100%)',
    skills: ['Analisi chimiche', 'Microbiologia', 'Controllo qualità', 'Monitoraggio ambientale'],
  },
  'EEC': {
    icon: BookOpen,
    gradient: 'from-blue-600 via-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    solidColor: '#2563eb',
    gradientCSS: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 50%, #06B6D4 100%)',
    skills: ['Editoria', 'Comunicazione', 'Marketing', 'Social Media'],
  },
  'MASSAF': {
    icon: Award,
    gradient: 'from-emerald-600 via-emerald-500 to-green-500',
    bgGradient: 'from-emerald-50 to-green-50',
    solidColor: '#059669',
    gradientCSS: 'linear-gradient(90deg, #059669 0%, #10B981 50%, #22C55E 100%)',
    skills: ['Sicurezza sul lavoro', 'Gestione rischio', 'Normativa ambientale', 'Prevenzione'],
  },
  'Tor': {
    icon: Settings,
    gradient: 'from-slate-600 via-slate-500 to-gray-500',
    bgGradient: 'from-slate-50 to-gray-50',
    solidColor: '#475569',
    gradientCSS: 'linear-gradient(90deg, #45556C 0%, #62748E 50%, #6A7282 100%)',
    skills: ['Tornitura CNC', 'Disegno tecnico', 'Lavorazione metalli', 'Controllo qualità'],
  },
  'GOL-ODPE': {
    icon: Croissant,
    gradient: 'from-amber-600 via-orange-500 to-yellow-500',
    bgGradient: 'from-amber-50 to-yellow-50',
    solidColor: '#d97706',
    gradientCSS: 'linear-gradient(90deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)',
    skills: ['Lavorazione Impasti', 'Lievitazione', 'Cottura Prodotti', 'Confezionamento'],
  },
  'GOL-COMDIG': {
    icon: Monitor,
    gradient: 'from-blue-600 via-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    solidColor: '#2563eb',
    gradientCSS: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 50%, #06B6D4 100%)',
    skills: ['Utilizzo PC', 'Navigazione Web', 'Office', 'Comunicazione Digitale'],
  },
  'Upskilling-CDP1': {
    icon: Megaphone,
    gradient: 'from-purple-700 via-purple-600 to-indigo-700',
    bgGradient: 'from-purple-50 to-indigo-50',
    solidColor: '#7c3aed',
    gradientCSS: 'linear-gradient(90deg, #7F22FE 0%, #AD46FF 50%, #615FFF 100%)',
    skills: ['Social Media', 'Content Creation', 'Digital Marketing', 'Analisi Dati'],
  },
  'OTDS': {
    icon: Users,
    gradient: 'from-pink-600 via-pink-500 to-rose-500',
    bgGradient: 'from-pink-50 to-rose-50',
    solidColor: '#db2777',
    gradientCSS: 'linear-gradient(90deg, #E60076 0%, #F6339A 50%, #FF2056 100%)',
    skills: ['Pedagogia', 'Attività ludiche', 'Cura infanzia', 'Progettazione educativa'],
  },
  'CDSA': {
    icon: Eye,
    gradient: 'from-teal-600 via-teal-500 to-cyan-500',
    bgGradient: 'from-teal-50 to-cyan-50',
    solidColor: '#0d9488',
    gradientCSS: 'linear-gradient(90deg, #0D9488 0%, #14B8A6 50%, #06B6D4 100%)',
    skills: ['Accessibilità museale', 'Comunicazione inclusiva', 'Audio-descrizione', 'Esperienze multisensoriali'],
  },
  'GOL-TEPL': {
    icon: BookOpen,
    gradient: 'from-indigo-600 via-indigo-500 to-blue-500',
    bgGradient: 'from-indigo-50 to-blue-50',
    solidColor: '#4f46e5',
    gradientCSS: 'linear-gradient(90deg, #4F39F6 0%, #615FFF 50%, #2B7FFF 100%)',
    skills: ['Marketing territoriale', 'Gestione ricettiva', 'Promozione turistica', 'Pianificazione'],
  },
  'GOL-OHES': {
    icon: AlertTriangle,
    gradient: 'from-red-600 via-red-500 to-orange-500',
    bgGradient: 'from-red-50 to-orange-50',
    solidColor: '#dc2626',
    gradientCSS: 'linear-gradient(90deg, #E7000B 0%, #FB2C36 50%, #FF6900 100%)',
    skills: ['Sicurezza H2S', 'Gestione emergenze', 'Rilevamento gas', 'Evacuazione'],
  },
  'CS-CORAI': {
    icon: Monitor,
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-500',
    bgGradient: 'from-violet-50 to-fuchsia-50',
    solidColor: '#7c3aed',
    gradientCSS: 'linear-gradient(90deg, #7C3AED 0%, #A855F7 50%, #D946EF 100%)',
    skills: ['Intelligenza Artificiale', 'Machine Learning', 'Data Analysis', 'Automazione'],
  },
};

const defaultStyle: CourseStyle = {
  icon: GraduationCap,
  gradient: 'from-indigo-600 via-indigo-500 to-blue-500',
  bgGradient: 'from-indigo-50 to-blue-50',
  solidColor: '#4f46e5',
  gradientCSS: 'linear-gradient(90deg, #4F39F6 0%, #615FFF 50%, #2B7FFF 100%)',
  skills: ['Formazione professionale', 'Competenze specialistiche', 'Certificazione', 'Pratica'],
};

const sicurezzaDefaultStyle: CourseStyle = {
  icon: Shield,
  gradient: 'from-red-600 via-orange-500 to-amber-500',
  bgGradient: 'from-red-50 to-orange-50',
  solidColor: '#dc2626',
  gradientCSS: 'linear-gradient(90deg, #DC2626 0%, #EA580C 50%, #D97706 100%)',
  skills: ['Sicurezza sul lavoro', 'D.Lgs. 81/08', 'Prevenzione rischi', 'Formazione obbligatoria'],
};

function getCourseCategory(course: CoursePublicData): CategoryType {
  const code = course.code.toLowerCase();
  if (code.startsWith('gol') || code.startsWith('tor') || code.startsWith('upskilling') || code === 'otds') return 'gol';
  if (code.startsWith('ms') || code === 'taa' || code === 'eec' || code === 'massaf') return 'master';
  if (code.startsWith('cdsa') || code.includes('spec')) return 'specializzazione';
  if (code.startsWith('sicurezza')) return 'sicurezza';
  return 'gol';
}

function getCourseType(course: CoursePublicData): string {
  const code = course.code.toLowerCase();
  // GOL: use category from DB to distinguish Reskilling/Upskilling/Riqualificazione
  if (code.startsWith('upskilling') || code === 'gol-comdig') return 'Upskilling';
  if (code.startsWith('gol') || code.startsWith('tor') || code === 'otds') {
    // Try to infer from category field
    const cat = (course.category || '').toLowerCase();
    if (cat.includes('reskilling')) return 'Reskilling';
    if (cat.includes('upskilling')) return 'Upskilling';
    if (cat.includes('riqualificazione')) return 'Riqualificazione';
    return 'Reskilling';
  }
  if (code.startsWith('ms') || code === 'taa' || code === 'eec' || code === 'massaf') return 'Master';
  if (code.startsWith('cdsa') || code.includes('spec')) return 'Specializzazione';
  if (code.startsWith('sicurezza')) return 'Sicurezza';
  return 'Corso';
}

function getCourseStyle(code: string): CourseStyle {
  if (courseStylesMap[code]) return courseStylesMap[code];
  if (code.startsWith('SICUREZZA--') || code.startsWith('SICUREZZA-')) return sicurezzaDefaultStyle;
  return defaultStyle;
}

// Category slide config
const categoryConfig: { id: CategoryType; label: string; color: string }[] = [
  { id: 'master', label: 'Alta Formazione', color: '#FFCCD3' },
  { id: 'gol', label: 'Programma GOL', color: '#B8E6FE' },
  { id: 'sicurezza', label: 'Sicurezza', color: '#FFEDD4' },
  { id: 'specializzazione', label: 'Specializzazione', color: '#A4F4CF' },
];

// Static Sicurezza course — always shown as fallback when API has no Sicurezza courses
const staticSicurezzaCourses: CourseCardData[] = [
  {
    id: 'formazione-generale-sicurezza',
    title: 'Formazione Generale Sicurezza',
    description: 'Formazione base obbligatoria per tutti i lavoratori. Riferimento normativo: Art. 37 D.Lgs. 81/08 — Accordo Stato Regioni 21/12/2011. Concetti di rischio, danno, prevenzione e protezione, organizzazione della sicurezza aziendale. Il corso affronta i diritti e doveri dei lavoratori, la gestione delle emergenze e l\'uso dei dispositivi di protezione individuale. Attestato valido su tutto il territorio nazionale con validità quinquennale.',
    type: 'Sicurezza',
    category: 'sicurezza',
    code: 'SICUREZZA--079',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=75&auto=format',
  },
];

interface CourseCardData {
  id: string;
  title: string;
  description: string;
  type: string;
  category: CategoryType;
  code: string;
  image?: string;
}

// Decorative images mapped by course code keyword
const courseImages: Record<string, string> = {
  'TAA': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=75&auto=format',
  'EEC': 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=600&q=75&auto=format',
  'MASSAF': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=75&auto=format',
  'Tor': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=75&auto=format',
  'GOL-ODPE': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=75&auto=format',
  'GOL-COMDIG': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=75&auto=format',
  'Upskilling-CDP1': 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=75&auto=format',
  'OTDS': 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600&q=75&auto=format',
  'CDSA': 'https://images.unsplash.com/photo-1574607383077-47ddc2dc51c4?w=600&q=75&auto=format',
  'GOL-TEPL': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=75&auto=format',
  'GOL-OHES': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=75&auto=format',
  'CS-CORAI': 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=75&auto=format',
};

const fallbackImages = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=75&auto=format',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=75&auto=format',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=75&auto=format',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=75&auto=format',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=75&auto=format',
];

function getCourseImage(code: string, index: number): string {
  if (courseImages[code]) return courseImages[code];
  return fallbackImages[index % fallbackImages.length];
}

function BentoCard({
  course,
  color,
  variant = 'standard',
}: {
  course: CourseCardData;
  color: string;
  variant?: 'standard' | 'featured';
}) {
  const isFeatured = variant === 'featured';

  return (
    <Link
      to={`/corsi/${course.id}`}
      className="group relative rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      style={{ background: color }}
    >
      {/* Decorative background image */}
      {course.image && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${course.image})`,
            opacity: 0.12,
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* Content — 32px padding matching Figma */}
      <div className="relative z-10 flex flex-col justify-between h-full" style={{ padding: 32 }}>
        {/* Top: badge */}
        <div>
          <span
            className="inline-block rounded-full font-semibold"
            style={{
              background: 'rgba(5, 47, 74, 0.08)',
              color: '#052F4A',
              fontSize: 13,
              lineHeight: '18px',
              padding: '5px 14px',
            }}
          >
            {course.type}
          </span>
        </div>

        {/* Bottom: title + description + arrow row */}
        <div>
          <h3
            className="font-bold leading-tight"
            style={{
              color: '#052F4A',
              fontSize: isFeatured ? 28 : 22,
              lineHeight: isFeatured ? '34px' : '28px',
            }}
          >
            {course.title}
          </h3>
          {isFeatured && course.description && (
            <p
              className="line-clamp-5"
              style={{
                color: '#1B6B93',
                opacity: 0.7,
                fontSize: 16,
                lineHeight: '22px',
                marginTop: 8,
              }}
            >
              {course.description}
            </p>
          )}
          {/* Arrow bottom-right */}
          <div className="flex justify-end" style={{ marginTop: 12 }}>
            <div
              className="flex-shrink-0 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              style={{
                width: 40,
                height: 40,
                background: 'rgba(5, 47, 74, 0.08)',
              }}
            >
              <ArrowUpRight size={18} style={{ color: '#052F4A' }} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Pastel colors for Sicurezza "a breve" cards
const sicurezzaComingSoonCards = [
  {
    label: 'A breve',
    title: 'Formazione Specifica Rischio Medio',
    description: 'Corso di 8 ore per lavoratori esposti a rischio medio. Rischi specifici di settore, uso corretto dei DPI, procedure di emergenza e prevenzione incendi. Attestato conforme D.Lgs. 81/08.',
    color: '#e0e7ff',       // Glicine
    accentColor: '#4f46e5', // indigo-600
    link: '/programmi/sicurezza',
  },
  {
    label: 'A breve',
    title: 'Formazione Specifica Rischio Alto',
    description: 'Percorso di 12 ore per lavoratori esposti a rischio alto. Gestione emergenze, uso corretto dei DPI, prevenzione incendi, primo soccorso e procedure di evacuazione. Attestato valido nazionale.',
    color: '#fed7aa',       // Albicocca
    accentColor: '#ea580c', // orange-600
    link: '/programmi/sicurezza',
  },
];

function BentoGrid({ courses, color, categoryId }: { courses: CourseCardData[]; color: string; categoryId?: CategoryType }) {
  if (courses.length === 0) return null;

  // Figma gap = 24px
  const GAP = 24;
  const ROW_H = 280; // Single row height
  const SMALL_ROW_H = 240; // Remaining grid row height

  // Cell wrapper: prevents content from overflowing grid cell boundaries
  const Cell = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
    <div className="overflow-hidden min-h-0 min-w-0 rounded-2xl" style={style}>
      {children}
    </div>
  );

  // ── SICUREZZA: special layout — featured card left + 2 "coming soon" right ──
  if (categoryId === 'sicurezza') {
    // Use the first real course as the big featured card
    const featuredCourse = courses[0];
    return (
      <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: GAP, height: ROW_H * 2 + GAP }}>
        {/* Featured course — left (tall) — Menta chiaro */}
        <Cell style={{ gridRow: '1 / 3' }}>
          <BentoCard course={featuredCourse} color="#ccfbf1" variant="featured" />
        </Cell>

        {/* "A breve" cards — right */}
        {sicurezzaComingSoonCards.map((card, idx) => (
          <Cell key={idx}>
            <Link
              to={card.link}
              className="h-full flex flex-col justify-between group transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{ borderRadius: 28, padding: 32, background: card.color }}
            >
              <div>
                <span
                  className="inline-block rounded-full font-semibold uppercase"
                  style={{
                    fontSize: 11,
                    letterSpacing: 0.8,
                    color: card.accentColor,
                    background: `${card.accentColor}12`,
                    padding: '4px 12px',
                    marginBottom: 12,
                  }}
                >
                  {card.label}
                </span>
                <h4
                  className="font-bold"
                  style={{ fontSize: 22, lineHeight: '28px', color: '#0f172a' }}
                >
                  {card.title}
                </h4>
                <p className="line-clamp-4" style={{ fontSize: 16, lineHeight: '22px', color: '#475569', marginTop: 8 }}>
                  {card.description}
                </p>
              </div>
              <div className="flex justify-end">
                <div
                  className="rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ width: 40, height: 40, background: `${card.accentColor}15` }}
                >
                  <ArrowUpRight size={16} style={{ color: card.accentColor }} />
                </div>
              </div>
            </Link>
          </Cell>
        ))}
      </div>
    );
  }

  // 6+ courses: bento top section (tall + wide + 2 small) + uniform grid for remaining
  if (courses.length >= 6) {
    const topCourses = courses.slice(0, 4);
    const remaining = courses.slice(4);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
        {/* Top bento section */}
        <div className="grid" style={{
          gridTemplateColumns: '1.2fr 1fr 1fr',
          gridTemplateRows: `${ROW_H}px ${ROW_H}px`,
          gap: GAP,
        }}>
          <Cell style={{ gridColumn: '1', gridRow: '1 / 3' }}>
            <BentoCard course={topCourses[0]} color={color} variant="featured" />
          </Cell>
          <Cell style={{ gridColumn: '2 / 4', gridRow: '1' }}>
            <BentoCard course={topCourses[1]} color={color} variant="featured" />
          </Cell>
          <Cell style={{ gridColumn: '2', gridRow: '2' }}>
            <BentoCard course={topCourses[2]} color={color} />
          </Cell>
          <Cell style={{ gridColumn: '3', gridRow: '2' }}>
            <BentoCard course={topCourses[3]} color={color} />
          </Cell>
        </div>
        {/* Remaining courses in uniform 3-col grid */}
        <div className="grid grid-cols-3" style={{ gap: GAP, gridAutoRows: SMALL_ROW_H }}>
          {remaining.map((course) => (
            <Cell key={course.id}>
              <BentoCard course={course} color={color} />
            </Cell>
          ))}
        </div>
      </div>
    );
  }

  // 5 courses: bento top + 1 extra
  if (courses.length === 5) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
        <div className="grid" style={{
          gridTemplateColumns: '1.2fr 1fr 1fr',
          gridTemplateRows: `${ROW_H}px ${ROW_H}px`,
          gap: GAP,
        }}>
          <Cell style={{ gridColumn: '1', gridRow: '1 / 3' }}>
            <BentoCard course={courses[0]} color={color} variant="featured" />
          </Cell>
          <Cell style={{ gridColumn: '2 / 4', gridRow: '1' }}>
            <BentoCard course={courses[1]} color={color} variant="featured" />
          </Cell>
          <Cell style={{ gridColumn: '2', gridRow: '2' }}>
            <BentoCard course={courses[2]} color={color} />
          </Cell>
          <Cell style={{ gridColumn: '3', gridRow: '2' }}>
            <BentoCard course={courses[3]} color={color} />
          </Cell>
        </div>
        <div className="grid grid-cols-3" style={{ gap: GAP, gridAutoRows: SMALL_ROW_H }}>
          <Cell>
            <BentoCard course={courses[4]} color={color} />
          </Cell>
        </div>
      </div>
    );
  }

  // 4 courses: tall left + wide right + 2 small bottom-right
  if (courses.length === 4) {
    return (
      <div className="grid" style={{
        gridTemplateColumns: '1.2fr 1fr 1fr',
        gridTemplateRows: `${ROW_H}px ${ROW_H}px`,
        gap: GAP,
      }}>
        <Cell style={{ gridColumn: '1', gridRow: '1 / 3' }}>
          <BentoCard course={courses[0]} color={color} variant="featured" />
        </Cell>
        <Cell style={{ gridColumn: '2 / 4', gridRow: '1' }}>
          <BentoCard course={courses[1]} color={color} variant="featured" />
        </Cell>
        <Cell style={{ gridColumn: '2', gridRow: '2' }}>
          <BentoCard course={courses[2]} color={color} />
        </Cell>
        <Cell style={{ gridColumn: '3', gridRow: '2' }}>
          <BentoCard course={courses[3]} color={color} />
        </Cell>
      </div>
    );
  }

  // 3 courses: tall left + 2 stacked right
  if (courses.length === 3) {
    return (
      <div className="grid" style={{
        gridTemplateColumns: '1.2fr 1fr',
        gridTemplateRows: `${ROW_H}px ${ROW_H}px`,
        gap: GAP,
      }}>
        <Cell style={{ gridColumn: '1', gridRow: '1 / 3' }}>
          <BentoCard course={courses[0]} color={color} variant="featured" />
        </Cell>
        <Cell style={{ gridColumn: '2', gridRow: '1' }}>
          <BentoCard course={courses[1]} color={color} variant="featured" />
        </Cell>
        <Cell style={{ gridColumn: '2', gridRow: '2' }}>
          <BentoCard course={courses[2]} color={color} />
        </Cell>
      </div>
    );
  }

  // 2 courses: side by side
  if (courses.length === 2) {
    return (
      <div className="grid grid-cols-2" style={{ gap: GAP, gridAutoRows: 360 }}>
        <Cell>
          <BentoCard course={courses[0]} color={color} variant="featured" />
        </Cell>
        <Cell>
          <BentoCard course={courses[1]} color={color} variant="featured" />
        </Cell>
      </div>
    );
  }

  // 1 course: dark CTA left + course card + teaser card right
  return (
    <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: GAP, height: ROW_H * 2 + GAP }}>
      {/* Dark gradient block — left */}
      <Cell style={{ gridRow: '1 / 3' }}>
        <div
          className="relative h-full overflow-hidden flex flex-col justify-between"
          style={{
            borderRadius: 28,
            padding: 40,
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e1b4b 100%)',
          }}
        >
          {/* Decorative purple glow */}
          <div
            className="absolute rounded-full"
            style={{
              top: -60,
              right: -60,
              width: 240,
              height: 240,
              background: 'rgba(168, 85, 247, 0.1)',
              filter: 'blur(64px)',
            }}
          />
          {/* Search icon */}
          <div
            className="flex items-center justify-center"
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(4px)',
              marginBottom: 32,
            }}
          >
            <Search size={20} color="#ffffff" />
          </div>
          {/* Title */}
          <div>
            <h3
              className="font-bold"
              style={{
                color: '#ffffff',
                fontSize: 'clamp(30px, 3vw, 40px)',
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                marginBottom: 16,
              }}
            >
              Non hai trovato quello che cerchi?
            </h3>
            <p style={{ color: '#9ca3af', fontSize: 16, lineHeight: 1.625, maxWidth: 448, marginBottom: 24 }}>
              Abbiamo oltre 50 corsi disponibili nel nostro catalogo completo.
            </p>
            <Link
              to="/programmi/master"
              className="inline-flex items-center font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                padding: '12px 24px',
                borderRadius: 9999,
                background: '#ffffff',
                color: '#0f172a',
                fontSize: 14,
                gap: 8,
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              }}
            >
              Vedi tutto il Catalogo
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </Cell>

      {/* Course card — top right */}
      <Cell>
        <BentoCard course={courses[0]} color={color} variant="featured" />
      </Cell>

      {/* Teaser card — bottom right */}
      <Cell>
        <div
          className="h-full flex flex-col justify-between"
          style={{ borderRadius: 28, padding: 24, background: '#ffedd5' }}
        >
          <div>
            <span
              className="font-bold uppercase"
              style={{ fontSize: 12, letterSpacing: 0.8, color: '#b45309', marginBottom: 6, display: 'block' }}
            >
              Coming Soon
            </span>
            <h4
              className="font-bold"
              style={{ fontSize: 20, lineHeight: 1.25, color: '#0f172a' }}
            >
              Digital Export
            </h4>
          </div>
          <div className="flex justify-end">
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 40, height: 40, background: 'rgba(253, 230, 138, 0.7)' }}
            >
              <ArrowUpRight size={16} style={{ color: '#b45309' }} />
            </div>
          </div>
        </div>
      </Cell>
    </div>
  );
}

export function Courses() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { courses: apiCourses, loading, error, connectionStatus } = useRealtimeCourses();
  const [dotsParent] = useAutoAnimate();
  const { ref: headerRef, revealed: headerRevealed } = useScrollReveal();

  const coursesByCategory = useMemo(() => {
    const grouped: Record<CategoryType, CourseCardData[]> = {
      master: [],
      gol: [],
      specializzazione: [],
      sicurezza: [],
    };

    apiCourses.forEach((course, idx) => {
      const category = getCourseCategory(course);
      const type = getCourseType(course);
      grouped[category].push({
        id: course.website_slug,
        title: course.title,
        description: course.description || `Corso di formazione professionale: ${course.title}`,
        type,
        category,
        code: course.code,
        image: getCourseImage(course.code, idx),
      });
    });

    // Sicurezza: ensure at least 1 course exists (coming soon cards are in BentoGrid)
    if (grouped.sicurezza.length === 0) {
      grouped.sicurezza = [...staticSicurezzaCourses];
    }

    return grouped;
  }, [apiCourses]);

  // Show categories that have courses — Sicurezza always shown (has static fallbacks)
  const activeCategories = categoryConfig.filter(
    cat => cat.id === 'sicurezza' || (coursesByCategory[cat.id] && coursesByCategory[cat.id].length > 0)
  );

  const currentCategory = activeCategories[currentSlide] || activeCategories[0];
  const currentCourses = currentCategory ? (coursesByCategory[currentCategory.id] || []) : [];

  // Progress bar width per slide
  const progressWidth = activeCategories.length > 0
    ? ((currentSlide + 1) / activeCategories.length) * 100
    : 0;

  const nextSlide = () => {
    if (activeCategories.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % activeCategories.length);
    }
  };

  const prevSlide = () => {
    if (activeCategories.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + activeCategories.length) % activeCategories.length);
    }
  };

  // Reset if currentSlide out of bounds
  useEffect(() => {
    if (currentSlide >= activeCategories.length && activeCategories.length > 0) {
      setCurrentSlide(0);
    }
  }, [activeCategories.length, currentSlide]);


  return (
    <section id="corsi" className="py-24 relative overflow-hidden bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className={`flex items-end justify-between mb-8 reveal-up ${headerRevealed ? 'revealed' : ''}`}
        >
          <div>
            <span className="text-sm font-bold uppercase tracking-wider block mb-2 text-purple-600">
              {currentCategory?.label || 'Alta Formazione'}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Scegli il percorso perfetto<br />per te
            </h2>
          </div>

          {/* Navigation Arrows */}
          {activeCategories.length > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={prevSlide}
                className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Categoria precedente"
              >
                <ChevronLeft size={24} className="text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Categoria successiva"
              >
                <ChevronRight size={24} className="text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="h-1 rounded-full bg-gray-200">
            <div
              className="h-full rounded-full transition-all duration-500 bg-purple-600"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
            <p className="text-gray-500">Caricamento corsi...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">Errore nel caricamento dei corsi</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && activeCategories.length === 0 && (
          <div className="text-center py-20">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nessun corso disponibile al momento</p>
          </div>
        )}

        {/* Bento Grid Carousel */}
        {!loading && !error && activeCategories.length > 0 && (
          <div className="relative">
            {activeCategories.map((cat, idx) => (
              <div
                key={cat.id}
                className="transition-opacity duration-500"
                style={{
                  opacity: currentSlide === idx ? 1 : 0,
                  pointerEvents: currentSlide === idx ? 'auto' : 'none',
                  position: currentSlide === idx ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                }}
              >
                <BentoGrid
                  courses={coursesByCategory[cat.id] || []}
                  color={cat.color}
                  categoryId={cat.id}
                />
              </div>
            ))}
          </div>
        )}

        {/* Category dots */}
        {activeCategories.length > 1 && (
          <div ref={dotsParent} className="flex justify-center gap-2 mt-8">
            {activeCategories.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full h-3 ${
                  currentSlide === idx ? 'w-12 bg-purple-600' : 'w-3 bg-gray-300'
                }`}
                aria-label={cat.label}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
