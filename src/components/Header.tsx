import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import logoInnform from "figma:asset/257bd345173d057a2c6124b55493bdfdbcf0c984.png";
import { usePublicPaths } from "../hooks/usePublicPaths";
import { usePublicCourses } from "../hooks/usePublicCourses";

// Helper per determinare il badge di un corso GOL
function getGolBadge(courseCode: string): string | undefined {
  // I corsi con durata <= 100 ore sono tipicamente Upskilling
  // I corsi GOL-COMDIG (Competenze Digitali) sono Upskilling
  // I corsi Upskilling-* sono Upskilling
  if (courseCode.startsWith('Upskilling') || courseCode === 'GOL-COMDIG') {
    return 'Upskilling';
  }
  return 'Reskilling';
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const location = useLocation();

  // Fetch percorsi e corsi dalle API
  const { paths, loading: pathsLoading } = usePublicPaths();
  const { courses, loading: coursesLoading } = usePublicCourses();

  const getHref = (path: string) => {
    if (location.pathname === '/' && path.startsWith('/#')) {
      return path.substring(1);
    }
    return path;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  // Genera il dropdown Percorsi dinamicamente
  const percorsiDropdown = useMemo(() => {
    if (pathsLoading || coursesLoading || !paths.length) {
      // Fallback statico durante il caricamento
      return [
        { label: "Caricamento...", href: "/#corsi" }
      ];
    }

    // Mappa ID corso -> website_slug dai corsi API
    const courseSlugMap = new Map<string, string>();
    courses.forEach(c => {
      courseSlugMap.set(c.id, c.website_slug);
    });

    // Genera dropdown da paths
    return paths.map(path => {
      // Determina il label user-friendly e l'href alla pagina programma
      let label = path.title;
      let programHref = "/#corsi";

      if (path.code === 'GOL') {
        label = 'Programma GOL';
        programHref = '/programmi/gol';
      } else if (path.code === 'MS') {
        label = 'Master';
        programHref = '/programmi/master';
      } else if (path.code === 'SPEC' || path.title.toLowerCase().includes('specializzazione')) {
        label = 'Corsi di Specializzazione';
        programHref = '/programmi/specializzazione';
      }

      // Genera i children (corsi nel percorso)
      const children = path.courses
        .filter(c => c.status === 'published')
        .map(c => {
          const slug = courseSlugMap.get(c.id);
          const href = slug ? `/corsi/${slug}` : `/#corsi`;

          // Aggiungi badge per corsi GOL
          const badge = path.code === 'GOL' ? getGolBadge(c.code) : undefined;

          return {
            label: c.title,
            href,
            badge
          };
        });

      return {
        label,
        href: programHref,
        children: children.length > 0 ? children : undefined
      };
    }).filter(item => item.children && item.children.length > 0); // Rimuovi percorsi senza corsi
  }, [paths, courses, pathsLoading, coursesLoading]);

  const menuItems = [
    { label: "Home", href: "/" },
    {
      label: "Percorsi",
      href: "/#corsi",
      dropdown: percorsiDropdown
    },
    {
      label: "Progetti",
      href: "#",
      dropdown: [
        { label: "Progetto Ti Abilito", href: "/progetti/ti-abilito" },
        { label: "Progetto Segni", href: "/progetti/segni" }
      ]
    },
    { label: "Certificazioni", href: "/chi-siamo/qualita" },
    {
      label: "Chi Siamo",
      href: "/chi-siamo/panoramica",
      dropdown: [
        { label: "Panoramica", href: "/chi-siamo/panoramica" },
        { label: "Visione e Missione", href: "/chi-siamo/visione-missione" },
        { label: "Dove Siamo", href: "/chi-siamo/dove-siamo" },
        { label: "Qualità Certificata", href: "/chi-siamo/qualita" }
      ]
    },
    { label: "News", href: "/news" },
    { label: "Contatti", href: "/#contatti" },
  ];

  const handleMobileDropdown = (label: string) => {
    if (activeDropdown === label) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(label);
    }
  };

  return (
    <header
      className="fixed top-0 w-full z-50 bg-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4">
            <img 
              src={logoInnform} 
              alt="Innform - Innovazione Formazione" 
              className="h-16 w-auto hover:scale-105 transition-transform duration-300 rounded-[16px]"
            />
            <div className="hidden lg:flex flex-col">
              
              
              
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-[rgba(255,34,34,0)]">
            {menuItems.map((item) => {
              if (item.dropdown) {
                return (
                  <div key={item.label} className="relative group">
                    <button className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors">
                      {item.label}
                      <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
                    </button>
                    <div
                      className="absolute left-0 mt-0 w-64 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 py-2"
                    >
                      {item.dropdown.map((subItem) => (
                        <div
                          key={subItem.label}
                          className="relative"
                          onMouseEnter={() => subItem.children && setActiveSubmenu(subItem.label)}
                          onMouseLeave={(e) => {
                            const relatedTarget = e.relatedTarget as HTMLElement;
                            if (!relatedTarget?.closest('.submenu-panel')) {
                              setActiveSubmenu(null);
                            }
                          }}
                        >
                          {subItem.children ? (
                            <Link
                              to={subItem.href}
                              className={`flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors ${activeSubmenu === subItem.label ? 'bg-purple-50 text-purple-600' : ''}`}
                            >
                              <span className="font-semibold">{subItem.label}</span>
                              <ChevronRight size={14} />
                            </Link>
                          ) : (
                            <Link
                              to={subItem.href}
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                            >
                              <span className="font-semibold">{subItem.label}</span>
                            </Link>
                          )}
                          {subItem.children && activeSubmenu === subItem.label && (
                            <div
                              className="submenu-panel absolute left-full top-0 -ml-1 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                              onMouseLeave={() => setActiveSubmenu(null)}
                            >
                              <div className="absolute left-0 top-0 w-2 h-full -translate-x-full" />
                              {subItem.children.map((childItem) => (
                                <Link
                                  key={childItem.label}
                                  to={childItem.href}
                                  className="flex items-center justify-between px-4 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                                >
                                  <span>{childItem.label}</span>
                                  {'badge' in childItem && childItem.badge && (
                                    <span
                                      className="ml-1.5 px-2 py-0.5 text-[10px] font-medium rounded-full whitespace-nowrap"
                                      style={{
                                        backgroundColor: childItem.badge === 'Upskilling' ? '#eff6ff' : '#fefce8',
                                        color: childItem.badge === 'Upskilling' ? '#3b82f6' : '#ca8a04'
                                      }}
                                    >
                                      {childItem.badge}
                                    </span>
                                  )}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              if (item.href.startsWith('/') && !item.href.includes('#')) {
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="relative px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
                );
              }

              return (
                <a
                  key={item.label}
                  href={getHref(item.href)}
                  className="relative px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </a>
              );
            })}
            <a
              href="#contatti"
              className="ml-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Inizia Ora
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 max-h-[80vh] overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={() => handleMobileDropdown(item.label)}
                      className="w-full flex justify-between items-center py-2 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      {item.label}
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                      />
                    </button>
                    
                    {activeDropdown === item.label && (
                      <div className="pl-4 space-y-2 mt-2 bg-gray-50 rounded-lg mx-2 py-2">
                        {item.dropdown.map((subItem) => (
                          <div key={subItem.label}>
                            {subItem.children ? (
                              <>
                                <div className="px-4 py-2 font-semibold text-gray-800 text-sm">
                                  {subItem.label}
                                </div>
                                <div className="pl-4 space-y-1 border-l-2 border-purple-100 ml-4">
                                  {subItem.children.map((childItem) => (
                                    <Link
                                      key={childItem.label}
                                      to={childItem.href}
                                      className="flex items-center justify-between py-2 px-4 text-sm text-gray-600 hover:text-purple-600"
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      <span>{childItem.label}</span>
                                      {'badge' in childItem && childItem.badge && (
                                        <span
                                          className="ml-1.5 px-2 py-0.5 text-[6px] font-medium rounded-full whitespace-nowrap"
                                          style={{
                                            backgroundColor: childItem.badge === 'Upskilling' ? '#eff6ff' : '#fefce8',
                                            color: childItem.badge === 'Upskilling' ? '#3b82f6' : '#ca8a04'
                                          }}
                                        >
                                          {childItem.badge}
                                        </span>
                                      )}
                                    </Link>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <Link
                                to={subItem.href}
                                className="block px-4 py-2 font-semibold text-gray-800 text-sm hover:text-purple-600"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subItem.label}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {item.href.startsWith('/') && !item.href.includes('#') ? (
                      <Link
                        to={item.href}
                        className="block py-2 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={getHref(item.href)}
                        className="block py-2 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    )}
                  </>
                )}
              </div>
            ))}
            <a
              href="#contatti"
              className="block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg text-center mt-4 mx-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inizia Ora
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}