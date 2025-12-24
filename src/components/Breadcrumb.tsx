import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Mappa per tradurre i path in label leggibili
const pathLabels: Record<string, string> = {
  'chi-siamo': 'Chi Siamo',
  'panoramica': 'Panoramica',
  'visione-missione': 'Visione e Missione',
  'dove-siamo': 'Dove Siamo',
  'qualita': 'Qualità',
  'news': 'News',
  'corsi': 'Corsi',
  'programmi': 'Programmi',
  'progetti': 'Progetti',
  'ti-abilito': 'Ti Abilito',
  'segni': 'Segni',
  'upskilling': 'Upskilling',
  'reskilling': 'Reskilling',
  'riqualificazione': 'Riqualificazione',
  'percorsi-completi': 'Percorsi Completi',
  'iscrizione': 'Iscrizione',
};

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const location = useLocation();

  // Se non vengono passati items, genera automaticamente dal path
  const breadcrumbItems: BreadcrumbItem[] = items || generateBreadcrumbs(location.pathname);

  // Non mostrare breadcrumb se siamo nella homepage
  if (location.pathname === '/' || breadcrumbItems.length === 0) {
    return null;
  }

  // Genera JSON-LD per SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.innform.eu/"
      },
      ...breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        ...(item.href && { "item": `https://www.innform.eu${item.href}` })
      }))
    ]
  };

  return (
    <>
      {/* JSON-LD Schema per SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb visivo */}
      <nav
        aria-label="Breadcrumb"
        className={`py-3 px-4 sm:px-6 lg:px-8 ${className}`}
      >
        <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
          {/* Home */}
          <li className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-purple-600 transition-colors"
              aria-label="Torna alla homepage"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </li>

          {/* Separator dopo Home */}
          <li aria-hidden="true">
            <ChevronRight size={14} className="text-gray-400" />
          </li>

          {/* Altri elementi */}
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;

            return (
              <React.Fragment key={index}>
                <li className="flex items-center">
                  {isLast || !item.href ? (
                    <span
                      className="text-gray-900 font-medium"
                      aria-current="page"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      to={item.href}
                      className="hover:text-purple-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>

                {!isLast && (
                  <li aria-hidden="true">
                    <ChevronRight size={14} className="text-gray-400" />
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

// Funzione helper per generare breadcrumbs dal path
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    // Salta segmenti numerici (es. /news/1) per il label
    const label = pathLabels[segment] ||
      (isNaN(Number(segment)) ? capitalizeFirst(segment.replace(/-/g, ' ')) : `#${segment}`);

    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath
    });
  });

  return breadcrumbs;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default Breadcrumb;
