import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Microscope, Droplet, FlaskConical, BookOpen, ChevronLeft, ChevronRight, Clock, Award, TrendingUp, Users, Settings, AlertTriangle, ShoppingBag, Megaphone, Croissant, Eye, Filter, GraduationCap, Target, LayoutGrid, Layers } from 'lucide-react';

type FilterType = 'tutti' | 'master' | 'gol' | 'specializzazione';
type ViewMode = 'carousel' | 'grid';

export function Courses() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('tutti');
  const [viewMode, setViewMode] = useState<ViewMode>('carousel');

  const courses = [
    // Master
    {
      id: 'tecnico-analisi-alimentari',
      title: 'Tecnico Esperto in Analisi Alimentari e Ambientali',
      description: 'Metodi e tecniche di analisi chimiche e microbiologiche per il controllo degli alimenti e monitoraggio ambientale (acqua, aria, suolo).',
      duration: 'Master Tecnico',
      type: 'Master',
      category: 'master',
      icon: Microscope,
      skills: ['Analisi chimiche', 'Microbiologia', 'Controllo qualità', 'Monitoraggio ambientale'],
      gradient: 'from-purple-600 via-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      solidColor: '#9333ea',
      gradientCSS: 'linear-gradient(90deg, #9333EA 0%, #A855F7 50%, #EC4899 100%)',
    },
    {
      id: 'master-editoria',
      title: 'Master in Editoria e Comunicazione',
      description: 'Competenze nell\'organizzazione del prodotto editoriale, management di case editrici, comunicazione, marketing e social media marketing.',
      duration: 'IV Edizione',
      type: 'Master',
      category: 'master',
      icon: BookOpen,
      skills: ['Editoria', 'Comunicazione', 'Marketing', 'Social Media'],
      gradient: 'from-blue-600 via-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      solidColor: '#2563eb',
      gradientCSS: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 50%, #06B6D4 100%)',
    },
    {
      id: 'safety-manager',
      title: 'Safety Manager: Esperto in Sicurezza e Ambiente',
      description: 'Figura trasversale per gestire il sistema di prevenzione del rischio e implementazione del piano della sicurezza ambientale ed aziendale.',
      duration: 'Master',
      type: 'Master',
      category: 'master',
      icon: Award,
      skills: ['Sicurezza sul lavoro', 'Gestione rischio', 'Normativa ambientale', 'Prevenzione'],
      gradient: 'from-emerald-600 via-emerald-500 to-green-500',
      bgGradient: 'from-emerald-50 to-green-50',
      solidColor: '#059669',
      gradientCSS: 'linear-gradient(90deg, #059669 0%, #10B981 50%, #22C55E 100%)',
    },
    {
      id: 'interior-design',
      title: 'Master Interior Design',
      description: 'Percorso formativo per diventare esperti nella progettazione e arredamento degli spazi interni, coniugando estetica e funzionalità.',
      duration: 'Master',
      type: 'Master',
      category: 'master',
      icon: TrendingUp,
      skills: ['Progettazione', 'Arredamento', 'CAD/Rendering', 'Materiali'],
      gradient: 'from-orange-600 via-orange-500 to-yellow-500',
      bgGradient: 'from-orange-50 to-yellow-50',
      solidColor: '#ea580c',
      gradientCSS: 'linear-gradient(90deg, #EA580C 0%, #F97316 50%, #EAB308 100%)',
    },
    // GOL
    {
      id: 'sviluppo-turistico',
      title: 'Tecnico Esperto per lo Sviluppo Turistico Territoriale',
      description: 'Promozione e valorizzazione delle risorse turistiche del territorio, marketing, pianificazione turistica e gestione strutture ricettive.',
      duration: '600 ore',
      type: 'Programma GOL',
      category: 'gol',
      icon: BookOpen,
      skills: ['Marketing territoriale', 'Gestione ricettiva', 'Promozione turistica', 'Pianificazione'],
      gradient: 'from-indigo-600 via-indigo-500 to-blue-500',
      bgGradient: 'from-indigo-50 to-blue-50',
      solidColor: '#4f46e5',
      gradientCSS: 'linear-gradient(90deg, #4F39F6 0%, #615FFF 50%, #2B7FFF 100%)',
    },
    {
      id: 'sistema-educativo-infanzia',
      title: 'Tecnico del Sistema Educativo per la Prima Infanzia',
      description: 'Cura ed educazione dei bambini da 0 a 36 mesi. Competenze in progettazione, gestione di attività educative, ludiche, di socializzazione e laboratoriali.',
      duration: '600 ore',
      type: 'Programma GOL',
      category: 'gol',
      icon: Users,
      skills: ['Pedagogia', 'Attività ludiche', 'Cura infanzia', 'Progettazione educativa'],
      gradient: 'from-pink-600 via-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-50',
      solidColor: '#db2777',
      gradientCSS: 'linear-gradient(90deg, #E60076 0%, #F6339A 50%, #FF2056 100%)',
    },
    {
      id: 'operatore-tornitura',
      title: 'Operatore della Tornitura',
      description: 'Lavorazione dei metalli con macchine utensili tradizionali e CNC. Lettura disegni tecnici, programmazione CNC e controllo qualità.',
      duration: '600 ore',
      type: 'Programma GOL',
      category: 'gol',
      icon: Settings,
      skills: ['Tornitura CNC', 'Disegno tecnico', 'Lavorazione metalli', 'Controllo qualità'],
      gradient: 'from-slate-600 via-slate-500 to-gray-500',
      bgGradient: 'from-slate-50 to-gray-50',
      solidColor: '#475569',
      gradientCSS: 'linear-gradient(90deg, #45556C 0%, #62748E 50%, #6A7282 100%)',
    },
    {
      id: 'operatore-h2s',
      title: 'Operatore H2S e Sicurezza',
      description: 'Gestione emergenze legate all\'idrogeno solforato (H2S). Proprietà, rischi per la salute, metodi di rilevamento e procedure di evacuazione.',
      duration: 'Sicurezza',
      type: 'Programma GOL',
      category: 'gol',
      icon: AlertTriangle,
      skills: ['Sicurezza H2S', 'Gestione emergenze', 'Rilevamento gas', 'Evacuazione'],
      gradient: 'from-red-600 via-red-500 to-orange-500',
      bgGradient: 'from-red-50 to-orange-50',
      solidColor: '#dc2626',
      gradientCSS: 'linear-gradient(90deg, #E7000B 0%, #FB2C36 50%, #FF6900 100%)',
    },
    {
      id: 'pubblicita-comunicazione',
      title: 'Pubblicità e Comunicazione Digitale',
      description: 'Upskilling per sviluppare competenze in comunicazione d\'impresa, marketing digitale, content creation e gestione social media.',
      duration: '100 ore',
      type: 'GOL Upskilling',
      category: 'gol',
      icon: Megaphone,
      skills: ['Social Media', 'Content Creation', 'Digital Marketing', 'Analisi Dati'],
      gradient: 'from-purple-700 via-purple-600 to-indigo-700',
      bgGradient: 'from-purple-50 to-indigo-50',
      solidColor: '#7c3aed',
      gradientCSS: 'linear-gradient(90deg, #7F22FE 0%, #AD46FF 50%, #615FFF 100%)',
    },
    {
      id: 'operatore-panificazione',
      title: 'Operatore di Panificazione e Produzione di Paste',
      description: 'Preparazione di impasti, lievitazione, cottura e confezionamento nell\'ambito della produzione di pasta e prodotti da forno.',
      duration: '600 ore',
      type: 'GOL Reskilling',
      category: 'gol',
      icon: Croissant,
      skills: ['Lavorazione Impasti', 'Lievitazione', 'Cottura Prodotti', 'Confezionamento'],
      gradient: 'from-amber-600 via-orange-500 to-yellow-500',
      bgGradient: 'from-amber-50 to-yellow-50',
      solidColor: '#d97706',
      gradientCSS: 'linear-gradient(90deg, #D97706 0%, #F59E0B 50%, #FBBF24 100%)',
    },
    // Specializzazione Guide Turistiche
    {
      id: 'corso-di-specializzazione-alle-guide-turistiche',
      title: 'Corso di Specializzazione alle Guide Turistiche',
      description: 'Specializzazione per guide turistiche nell\'accompagnamento di visitatori non vedenti e ipovedenti. Tecniche di comunicazione accessibile, descrizione artistica inclusiva e esperienze multisensoriali.',
      duration: '50 ore',
      type: 'Specializzazione',
      category: 'specializzazione',
      icon: Eye,
      skills: ['Accessibilità museale', 'Comunicazione inclusiva', 'Audio-descrizione', 'Esperienze multisensoriali'],
      gradient: 'from-teal-600 via-teal-500 to-cyan-500',
      bgGradient: 'from-teal-50 to-cyan-50',
      solidColor: '#0d9488',
      gradientCSS: 'linear-gradient(90deg, #0D9488 0%, #14B8A6 50%, #06B6D4 100%)',
    },
  ];

  // Filtra i corsi in base al filtro attivo
  const filteredCourses = activeFilter === 'tutti'
    ? courses
    : courses.filter(course => course.category === activeFilter);

  // Reset slide quando cambia filtro
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeFilter]);

  useEffect(() => {
    if (isPaused || viewMode === 'grid') return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % filteredCourses.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [filteredCourses.length, isPaused, viewMode]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % filteredCourses.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + filteredCourses.length) % filteredCourses.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const filters = [
    { id: 'tutti' as FilterType, label: 'Tutti', shortLabel: 'Tutti', icon: Filter },
    { id: 'master' as FilterType, label: 'Master & Alta Formazione', shortLabel: 'Master', icon: GraduationCap },
    { id: 'gol' as FilterType, label: 'Programma GOL', shortLabel: 'GOL', icon: Target },
    { id: 'specializzazione' as FilterType, label: 'Spec.', shortLabel: 'Spec.', icon: Eye },
  ];

  return (
    <section id="corsi" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full mb-4">
            I Nostri Corsi
          </div>
          <h2 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Formazione di Eccellenza
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Certificazioni riconosciute, docenti esperti e laboratori all&apos;avanguardia
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-6 mb-12">
          {/* Filter buttons group */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.id;
              // Gradienti specifici per ogni filtro attivo (da Figma)
              const activeGradients: Record<FilterType, string> = {
                tutti: '#1E2939',
                master: 'linear-gradient(90deg, #9333EA 0%, #EC4899 100%)',
                gol: 'linear-gradient(90deg, #155DFC 0%, #0092B8 100%)',
                specializzazione: 'linear-gradient(90deg, #0D9488 0%, #06B6D4 100%)',
              };
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className="flex items-center gap-2 transition-all duration-300"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '9999px',
                    fontSize: '16px',
                    lineHeight: '24px',
                    fontWeight: 400,
                    background: isActive ? activeGradients[filter.id] : 'white',
                    color: isActive ? 'white' : '#4A5565',
                    border: isActive ? 'none' : '1px solid #E5E7EB',
                    boxShadow: isActive ? '0px 4px 6px -4px rgba(0, 0, 0, 0.10)' : 'none',
                  }}
                >
                  <Icon size={18} />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '40px', background: '#E5E7EB' }}></div>

          {/* View Toggle Button */}
          <button
            onClick={() => setViewMode(viewMode === 'carousel' ? 'grid' : 'carousel')}
            className="flex items-center gap-2 transition-all duration-300"
            style={{
              padding: '12px 24px',
              borderRadius: '9999px',
              fontSize: '16px',
              lineHeight: '24px',
              fontWeight: 400,
              background: '#1E2939',
              color: 'white',
              boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.10)',
            }}
          >
            {viewMode === 'carousel' ? (
              <>
                <LayoutGrid size={18} />
                <span>Vedi tutti</span>
              </>
            ) : (
              <>
                <Layers size={18} />
                <span>Carosello</span>
              </>
            )}
          </button>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {filteredCourses.map((course, index) => {
              const Icon = course.icon;
              return (
                <Link
                  key={course.id}
                  to={`/corsi/${course.id}`}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    boxShadow: '0px 8px 10px -6px rgba(0, 0, 0, 0.10)',
                    outline: '1px solid #F3F4F6',
                  }}
                >
                  {/* Card Header with Gradient - 184px height come Figma */}
                  <div
                    className="relative"
                    style={{
                      background: course.gradientCSS,
                      height: '184px',
                    }}
                  >
                    {/* Icona container 64x64 - posizione assoluta top-left */}
                    <div
                      className="absolute flex items-center justify-center"
                      style={{
                        top: '24px',
                        left: '24px',
                        width: '64px',
                        height: '64px',
                        background: 'rgba(255, 255, 255, 0.10)',
                        borderRadius: '16px',
                      }}
                    >
                      <Icon className="text-white" size={32} />
                    </div>

                    {/* Badge tipo corso - posizione assoluta top-right */}
                    <div
                      className="absolute"
                      style={{
                        top: '16px',
                        right: '16px',
                        background: 'rgba(255, 255, 255, 0.20)',
                        borderRadius: '9999px',
                        padding: '4px 12px',
                      }}
                    >
                      <span
                        style={{
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 700,
                          lineHeight: '16px',
                        }}
                      >
                        {course.type}
                      </span>
                    </div>

                    {/* Titolo - posizionato in basso nell'header */}
                    <div
                      className="absolute flex items-end"
                      style={{
                        left: '24px',
                        right: '24px',
                        top: '96px',
                        bottom: '24px',
                      }}
                    >
                      <h3
                        className="text-white font-bold line-clamp-2"
                        style={{ fontSize: '20px', lineHeight: '25px' }}
                      >
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '24px' }}>
                    {/* Durata */}
                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                      <Clock size={16} className="text-gray-400" />
                      <span style={{ fontSize: '14px', color: '#6A7282' }}>{course.duration}</span>
                    </div>

                    {/* Descrizione - 3 righe */}
                    <p
                      className="text-gray-600 mb-4 line-clamp-3"
                      style={{ fontSize: '14px', lineHeight: '20px', color: '#4A5565' }}
                    >
                      {course.description}
                    </p>

                    {/* Skills con bullet gradient */}
                    <div className="space-y-2 mb-4">
                      {course.skills.slice(0, 3).map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: course.gradientCSS }}
                          ></div>
                          <span style={{ fontSize: '12px', lineHeight: '16px', color: '#6A7282' }}>{skill}</span>
                        </div>
                      ))}
                      {course.skills.length > 3 && (
                        <div className="pl-4">
                          <span style={{ fontSize: '12px', color: '#99A1AF' }}>+ altre competenze</span>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      className="w-full text-white font-bold transition-all duration-300 group-hover:shadow-lg"
                      style={{
                        background: course.gradientCSS,
                        height: '44px',
                        borderRadius: '14px',
                        fontSize: '14px',
                        boxShadow: '0px 2px 4px -2px rgba(0, 0, 0, 0.10)',
                      }}
                    >
                      Scopri il corso
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Carousel View */}
        {viewMode === 'carousel' && (
          <div
            className="relative max-w-6xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Main Carousel with peek effect */}
            <div className="relative overflow-visible">
              <div
                className="flex transition-all duration-700 ease-out"
                style={{ transform: `translateX(calc((-100% + 4rem) * ${currentSlide} + 2rem))` }}
              >
                {filteredCourses.map((course, index) => {
                  const Icon = course.icon;
                  const isActive = currentSlide === index;

                  return (
                    <div
                      key={index}
                      className="flex-shrink-0 px-4 transition-all duration-700"
                      style={{
                        width: 'calc(100% - 4rem)',
                        opacity: isActive ? 1 : 0.3,
                        transform: isActive ? 'scale(1)' : 'scale(0.85)',
                      }}
                    >
                      <div className={`bg-gradient-to-br ${course.bgGradient} rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500`}>
                        <div className="bg-white/80 backdrop-blur-sm p-8 md:p-12">
                          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                            {/* Left Side - Icon & Info */}
                            <div className="text-center md:text-left">
                              <div
                                className="inline-block p-10 rounded-3xl shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300"
                                style={{ backgroundColor: course.solidColor }}
                              >
                                <Icon className="text-white" size={100} />
                              </div>

                              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                                  <Award size={18} className="text-purple-600" />
                                  <span className="text-sm">{course.type}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md">
                                  <Clock size={18} className="text-pink-600" />
                                  <span className="text-sm">{course.duration}</span>
                                </div>
                              </div>

                              <div className="hidden md:block">
                                <div className="flex items-center gap-2 text-purple-600 mb-4">
                                  <TrendingUp size={20} />
                                  <span>Alta richiesta nel mercato</span>
                                </div>
                                <div className="bg-white rounded-2xl p-6 shadow-lg">
                                  <h4 className="text-lg mb-3">Competenze acquisite</h4>
                                  <div className="space-y-2">
                                    {course.skills.map((skill, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-2 text-sm"
                                      >
                                        <div
                                          className="w-2 h-2 rounded-full"
                                          style={{ backgroundColor: course.solidColor }}
                                        ></div>
                                        <span>{skill}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Side - Content */}
                            <div className="space-y-6">
                              <div>
                                <h3 className="text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight">
                                  {course.title}
                                </h3>
                                <div
                                  className="h-1 w-24 rounded-full mb-6"
                                  style={{ backgroundColor: course.solidColor }}
                                ></div>
                              </div>

                              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                                {course.description}
                              </p>

                              {/* Mobile Skills */}
                              <div className="md:hidden">
                                <h4 className="mb-3">Competenze acquisite:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {course.skills.map((skill, idx) => (
                                    <span
                                      key={idx}
                                      className="text-white px-4 py-2 rounded-lg text-sm shadow-lg"
                                      style={{ backgroundColor: course.solidColor }}
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link
                                  to={`/corsi/${course.id}`}
                                  className="text-white px-8 py-4 rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg text-center"
                                  style={{ backgroundColor: course.solidColor }}
                                >
                                  Iscriviti Ora
                                </Link>
                                <Link to={`/corsi/${course.id}`} className="bg-white text-gray-800 border-2 border-gray-300 px-8 py-4 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all duration-300 text-center">
                                  Info Dettagliate
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white text-gray-800 p-4 rounded-full shadow-2xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300 z-20 items-center justify-center group"
              aria-label="Previous"
            >
              <ChevronLeft size={32} className="group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={nextSlide}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white text-gray-800 p-4 rounded-full shadow-2xl hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300 z-20 items-center justify-center group"
              aria-label="Next"
            >
              <ChevronRight size={32} className="group-hover:scale-110 transition-transform" />
            </button>

            {/* Dots Navigation with Preview */}
            <div className="flex justify-center items-center gap-3 mt-12">
              {filteredCourses.map((course, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`group relative transition-all duration-300 ${
                    currentSlide === index ? 'scale-110' : 'hover:scale-105'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  <div
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: currentSlide === index ? '3rem' : '0.75rem',
                      height: '0.75rem',
                      backgroundColor: currentSlide === index ? course.solidColor : '#d1d5db',
                    }}
                  ></div>

                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl">
                      {course.type}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${((currentSlide + 1) / filteredCourses.length) * 100}%`,
                    backgroundColor: filteredCourses[currentSlide]?.solidColor || '#9333ea',
                  }}
                ></div>
              </div>
              <div className="text-center text-sm text-gray-500 mt-2">
                {currentSlide + 1} / {filteredCourses.length}
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-16">
          <a
            href="#contatti"
            className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-5 rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Richiedi Informazioni su Tutti i Corsi
          </a>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fadeIn > * {
          opacity: 0;
          animation: fadeIn 0.4s ease-out forwards;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </section>
  );
}
