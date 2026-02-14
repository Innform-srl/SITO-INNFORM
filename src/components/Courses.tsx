import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Microscope, BookOpen, ChevronLeft, ChevronRight, Award, Users, Settings, AlertTriangle, Megaphone, Croissant, Eye, GraduationCap, Monitor, Loader2, Shield, ArrowUpRight } from 'lucide-react';
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
  if (code.startsWith('cdsa') || code.includes('spec') || code.startsWith('cs-')) return 'specializzazione';
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
  if (code.startsWith('cdsa') || code.includes('spec') || code.startsWith('cs-')) return 'Specializzazione';
  if (code.startsWith('sicurezza')) return 'Sicurezza';
  return 'Corso';
}

function getCourseBadge(course: CourseCardData): string {
  if (course.type === 'Master') return 'Alta Formazione';
  return course.type;
}


function isCourseGratis(course: CourseCardData): boolean {
  const cat = course.category;
  return cat === 'gol' || cat === 'sicurezza';
}

function getCourseStyle(code: string): CourseStyle {
  if (courseStylesMap[code]) return courseStylesMap[code];
  if (code.startsWith('SICUREZZA--') || code.startsWith('SICUREZZA-')) return sicurezzaDefaultStyle;
  return defaultStyle;
}

// Category slide config — each category has a palette of pastel shades for card variety
const categoryPalettes: Record<CategoryType, string[]> = {
  master: ['#E8F5E9', '#C8E6C9', '#A5D6A7', '#81C784'],        // Mint / green pastels
  gol: ['#E0F2F1', '#B2DFDB', '#80CBC4', '#4DB6AC'],            // Teal pastels
  sicurezza: ['#FFF3E0', '#FFE0B2', '#FFCC80', '#FFB74D'],      // Warm peach / amber
  specializzazione: ['#EDE7F6', '#D1C4E9', '#B39DDB', '#9575CD'], // Lavender pastels
};

const categoryConfig: { id: CategoryType; label: string; color: string }[] = [
  { id: 'master', label: 'Alta Formazione', color: '#E8F5E9' },
  { id: 'gol', label: 'Programma GOL', color: '#E0F2F1' },
  { id: 'sicurezza', label: 'Sicurezza', color: '#FFF3E0' },
  { id: 'specializzazione', label: 'Specializzazione', color: '#EDE7F6' },
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
  isMobile = false,
  wide = false,
}: {
  course: CourseCardData;
  color: string;
  isMobile?: boolean;
  wide?: boolean;
}) {
  const style = getCourseStyle(course.code);
  const CourseIcon = style.icon;
  const gratis = isCourseGratis(course);

  return (
    <Link
      to={`/corsi/${course.id}`}
      className="group relative overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      style={{
        background: color,
        borderRadius: isMobile ? 24 : 32,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Content */}
      <div
        className="relative z-10 flex flex-col justify-between h-full"
        style={{ padding: isMobile ? 20 : 32 }}
      >
        {/* Top: badges row */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: icon + type + program */}
          <div className="flex items-center min-w-0" style={{ gap: isMobile ? 10 : 12 }}>
            <div
              className="flex-shrink-0 flex items-center justify-center"
              style={{
                width: isMobile ? 34 : 40,
                height: isMobile ? 34 : 40,
                borderRadius: 10,
                background: 'rgba(0, 44, 34, 0.10)',
              }}
            >
              <CourseIcon size={isMobile ? 16 : 20} style={{ color: '#002C22' }} />
            </div>
            <span
              className="font-bold uppercase truncate"
              style={{
                color: '#002C22',
                fontSize: isMobile ? 12 : 13,
                lineHeight: isMobile ? '16px' : '18px',
                letterSpacing: '0.04em',
              }}
            >
              {getCourseBadge(course)}
            </span>
          </div>

          {/* Right: GRATIS badge */}
          {gratis && (
            <div
              className="flex-shrink-0 flex items-center rounded-full"
              style={{
                background: 'rgba(0, 44, 34, 0.10)',
                padding: isMobile ? '5px 12px' : '6px 14px',
                gap: isMobile ? 7 : 8,
              }}
            >
              <div
                className="rounded-full gratis-dot-glow"
                style={{
                  width: isMobile ? 7 : 8,
                  height: isMobile ? 7 : 8,
                  background: '#22c55e',
                  boxShadow: '0 0 6px 2px rgba(34, 197, 94, 0.5)',
                }}
              />
              <span
                className="font-bold uppercase"
                style={{
                  color: '#002C22',
                  fontSize: isMobile ? 11 : 13,
                  letterSpacing: '0.04em',
                }}
              >
                Gratis
              </span>
            </div>
          )}
        </div>

        {/* Bottom: title + description + arrow */}
        <div>
          <h3
            className={`font-bold leading-tight ${wide ? 'line-clamp-4' : 'line-clamp-3'}`}
            style={{
              color: '#002C22',
              fontSize: isMobile ? 18 : 20,
              lineHeight: isMobile ? '22px' : '26px',
            }}
          >
            {course.title}
          </h3>
          {course.description && (
            <p
              className={wide ? 'line-clamp-4' : 'line-clamp-2'}
              style={{
                color: 'rgba(0, 44, 34, 0.6)',
                fontSize: isMobile ? 12 : 13,
                lineHeight: isMobile ? '16px' : '18px',
                marginTop: isMobile ? 4 : 6,
              }}
            >
              {course.description}
            </p>
          )}
          {/* Arrow bottom-right */}
          <div className="flex justify-end" style={{ marginTop: isMobile ? 10 : 16 }}>
            <div
              className="flex-shrink-0 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              style={{
                width: isMobile ? 36 : 40,
                height: isMobile ? 36 : 40,
                background: 'rgba(0, 44, 34, 0.10)',
              }}
            >
              <ArrowUpRight size={isMobile ? 16 : 20} style={{ color: '#002C22' }} />
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

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handler(mq);
    mq.addEventListener('change', handler as (e: MediaQueryListEvent) => void);
    return () => mq.removeEventListener('change', handler as (e: MediaQueryListEvent) => void);
  }, [breakpoint]);
  return isMobile;
}

function getCardColor(categoryId: CategoryType, index: number): string {
  const palette = categoryPalettes[categoryId];
  return palette[index % palette.length];
}

type CardItem =
  | { kind: 'course'; course: CourseCardData; idx: number }
  | { kind: 'soon'; card: typeof sicurezzaComingSoonCards[0]; idx: number };

/** Get text length score for a card item (used to decide which cards get span-2). */
function getTextScore(item: CardItem): number {
  if (item.kind === 'course') {
    return item.course.title.length + (item.course.description?.length || 0);
  }
  return item.card.title.length + item.card.description.length;
}

/**
 * Build a mixed-size layout where some cards span 2 columns and others span 1.
 * - Longest-text courses get span-2 (wide)
 * - Each row must sum to exactly `cols` columns (no empty space)
 * - Returns array of rows, each row is an array of { item, span }
 */
function buildMixedLayout(items: CardItem[], cols: number): { item: CardItem; span: number }[][] {
  if (items.length === 0) return [];

  // Score all items by text length and sort descending
  const scored = items.map((item, i) => ({ item, score: getTextScore(item), origIdx: i }));
  scored.sort((a, b) => b.score - a.score);

  // Decide how many wide cards to have: roughly 1 wide per 3 items, max half
  const maxWide = Math.min(Math.floor(items.length / 3), Math.floor(items.length / 2));
  const wideSet = new Set<number>();
  for (let i = 0; i < maxWide; i++) {
    wideSet.add(scored[i].origIdx);
  }

  // Build rows by consuming items in original order, fitting into rows of `cols` columns
  const rows: { item: CardItem; span: number }[][] = [];
  let currentRow: { item: CardItem; span: number }[] = [];
  let currentCols = 0;

  for (let i = 0; i < items.length; i++) {
    const isWide = wideSet.has(i);
    const span = isWide ? 2 : 1;

    // Check if this card fits in the current row
    if (currentCols + span > cols) {
      // Current row is full — pad or push
      if (currentCols < cols && currentRow.length > 0) {
        // Expand the last card to fill remaining space
        currentRow[currentRow.length - 1].span += (cols - currentCols);
      }
      rows.push(currentRow);
      currentRow = [];
      currentCols = 0;
    }

    currentRow.push({ item: items[i], span });
    currentCols += span;

    if (currentCols === cols) {
      rows.push(currentRow);
      currentRow = [];
      currentCols = 0;
    }
  }

  // Handle the last incomplete row
  if (currentRow.length > 0) {
    // Distribute remaining columns evenly across cards in the last row
    const remaining = cols - currentCols;
    if (remaining > 0) {
      // Spread extra columns: give 1 extra to each card from the left
      let extra = remaining;
      for (let j = 0; j < currentRow.length && extra > 0; j++) {
        currentRow[j].span += 1;
        extra--;
      }
      // If still extra, keep distributing
      while (extra > 0) {
        for (let j = 0; j < currentRow.length && extra > 0; j++) {
          currentRow[j].span += 1;
          extra--;
        }
      }
    }
    rows.push(currentRow);
  }

  return rows;
}

function CourseGrid({ courses, color, categoryId }: { courses: CourseCardData[]; color: string; categoryId?: CategoryType }) {
  const isMobile = useIsMobile();
  const isTablet = useIsMobile(1024);
  if (courses.length === 0) return null;

  const GAP = isMobile ? 16 : 20;
  const ROW = 300;
  const catId = categoryId || 'gol';

  // Build unified list
  const items: CardItem[] = [
    ...courses.map((c, i) => ({ kind: 'course' as const, course: c, idx: i })),
    ...(categoryId === 'sicurezza'
      ? sicurezzaComingSoonCards.map((c, i) => ({ kind: 'soon' as const, card: c, idx: i }))
      : []),
  ];

  // ── MOBILE: 1 column ──
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
        {items.map((item) => (
          <div key={item.kind === 'course' ? item.course.id : `soon-${item.idx}`} style={{ minHeight: 240 }}>
            {item.kind === 'course'
              ? <BentoCard course={item.course} color={getCardColor(catId, item.idx)} isMobile />
              : <ComingSoonCard card={item.card} isMobile />
            }
          </div>
        ))}
      </div>
    );
  }

  const COLS = isTablet ? 2 : 4;
  const rows = buildMixedLayout(items, COLS);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="grid"
          style={{
            gridTemplateColumns: row.map(cell => `${cell.span}fr`).join(' '),
            gap: GAP,
            height: ROW,
          }}
        >
          {row.map((cell) => {
            const { item, span } = cell;
            const isWide = span >= 2;
            return (
              <div key={item.kind === 'course' ? item.course.id : `soon-${item.idx}`} style={{ minWidth: 0 }}>
                {item.kind === 'course'
                  ? <BentoCard course={item.course} color={getCardColor(catId, item.idx)} wide={isWide} />
                  : <ComingSoonCard card={item.card} />
                }
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ComingSoonCard({ card, isMobile = false }: { card: typeof sicurezzaComingSoonCards[0]; isMobile?: boolean }) {
  return (
    <Link
      to={card.link}
      className="h-full flex flex-col justify-between group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      style={{
        borderRadius: isMobile ? 24 : 32,
        padding: isMobile ? 20 : 32,
        background: card.color,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.06)',
      }}
    >
      <div>
        <span
          className="inline-block rounded-full font-bold uppercase"
          style={{
            fontSize: isMobile ? 10 : 11,
            letterSpacing: '0.05em',
            color: card.accentColor,
            background: `${card.accentColor}15`,
            padding: isMobile ? '4px 10px' : '5px 12px',
            marginBottom: isMobile ? 10 : 16,
          }}
        >
          {card.label}
        </span>
        <h4
          className="font-bold line-clamp-3"
          style={{
            fontSize: isMobile ? 18 : 20,
            lineHeight: isMobile ? '22px' : '26px',
            color: '#002C22',
          }}
        >
          {card.title}
        </h4>
        <p
          className="line-clamp-2"
          style={{
            fontSize: isMobile ? 12 : 13,
            lineHeight: isMobile ? '16px' : '18px',
            color: 'rgba(0, 44, 34, 0.6)',
            marginTop: isMobile ? 4 : 6,
          }}
        >
          {card.description}
        </p>
      </div>
      <div className="flex justify-end" style={{ marginTop: isMobile ? 10 : 16 }}>
        <div
          className="rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
          style={{
            width: isMobile ? 36 : 40,
            height: isMobile ? 36 : 40,
            background: `${card.accentColor}15`,
          }}
        >
          <ArrowUpRight size={isMobile ? 16 : 20} style={{ color: card.accentColor }} />
        </div>
      </div>
    </Link>
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

    // Sicurezza: ensure at least 1 course exists (coming soon cards are in CourseGrid)
    if (grouped.sicurezza.length === 0) {
      grouped.sicurezza = [...staticSicurezzaCourses];
    }

    // Sort each category so courses with the same type are grouped together
    for (const key of Object.keys(grouped) as CategoryType[]) {
      grouped[key].sort((a, b) => a.type.localeCompare(b.type));
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
          className={`flex items-end justify-between gap-4 mb-8 reveal-up ${headerRevealed ? 'revealed' : ''}`}
        >
          <div className="min-w-0">
            <span className="text-sm font-bold uppercase tracking-wider block mb-2" style={{ color: '#002C22' }}>
              {currentCategory?.label || 'Alta Formazione'}
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Scegli il percorso<br />perfetto per te
            </h2>
          </div>

          {/* Navigation Arrows */}
          {activeCategories.length > 1 && (
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={prevSlide}
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Categoria precedente"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Categoria successiva"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="h-1 rounded-full bg-gray-200">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ background: '#002C22', width: `${progressWidth}%` }}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: '#002C22' }} />
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
                <CourseGrid
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
                className="transition-all duration-300 rounded-full h-3"
                style={{
                  width: currentSlide === idx ? 48 : 12,
                  background: currentSlide === idx ? '#002C22' : '#d1d5db',
                }}
                aria-label={cat.label}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
