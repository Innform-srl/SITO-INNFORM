import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, Award, Users, BookOpen, CheckCircle2,
  TrendingUp, Calendar, Euro, MapPin, ChevronRight, Star,
  Briefcase, GraduationCap, FileCheck, Target, BarChart3,
  Brain, Zap, Globe, Shield, Download, Microscope, PenTool, HardHat, LayoutTemplate,
  AlertCircle, User, Mail, Phone
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CourseCarousel } from './CourseCarousel';
import { EnrollmentForm, QuickContactForm } from './EduPlanForms';
import { SEOHead, CourseSchema, FAQSchema } from './SEOHead';
// Integrazione dati live EduPlan
import { useRealtimeCourse } from '../hooks/useRealtimeCourses';
import { useInvalidateCoursesCache, useCourseLessons } from '../hooks/usePublicCourses';
import { LessonCalendar } from './LessonCalendar';
import {
  CourseBadgesDisplay,
  CourseAvailability,
  DeadlineCountdown,
  LiveIndicator,
  EditionsList,
} from './CourseLiveInfo';
import { formatDateIT } from '../services/public-courses-api';
import { CourseEdition } from '../types/courses-public';
import { CourseTestimonials } from './CourseTestimonials';

interface Course {
  id: string;
  title: string;
  subtitle?: string;
  decree?: string;
  description: string;
  duration: string;
  type: string;
  gradient: string;
  bgGradient: string;
  icon: string;
  skills: string[];
  price: string;
  startDate: string;
  location: string;
  heroImage: string;
  carouselImages: string[];
  statsImage: string;
  labImage: string;
  modules: Array<{
    title: string;
    hours: string;
    topics: string[];
  }>;
  outcomes: string[];
  careers: string[];
  requirements: string[];
  certifications: string[];
  importantInfo?: string[];  // Informazioni importanti (es: obbligo formativo)
  teachers: Array<{
    name: string;
    role: string;
    description: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  stats: {
    employmentRate: string;
    satisfaction: string;
    avgSalary: string;
    partnerships: string;
  };
  internshipPartners?: string[];
}

// IMPORTANTE: Le chiavi usano il CODICE del corso (es: 'TAA', 'EEC'), NON lo slug.
// Questo permette di rinominare i corsi su EduPlan senza perdere i dati statici.
// L'URL continua a usare lo slug (SEO-friendly), ma il collegamento interno usa il code.
const coursesData: Record<string, Course> = {
  'TAA': {
    id: 'TAA',
    title: 'Tecnico Esperto in Analisi Alimentari e Ambientali',
    description: 'Il master è finalizzato a sviluppare competenze su metodi e tecniche di analisi chimiche in ambito ambientale per il monitoraggio di acqua, aria, suolo, prevenzione e gestione dei rischi dell\'ambiente, analisi chimiche e microbiologiche per il controllo degli alimenti e applicazione di sistemi di qualità nell\'agroalimentare.',
    duration: '900 ore',
    type: 'Master Tecnico per Laureati',
    gradient: 'from-purple-600 via-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
    icon: 'Microscope',
    skills: ['Analisi chimiche', 'Microbiologia', 'Controllo qualità', 'HACCP', 'ISO 9001', 'ISO 17025'],
    price: 'Contattaci',
    startDate: 'Iscrizioni aperte',
    location: 'Potenza',
    heroImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1080',
    carouselImages: [
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1080'
    ],
    statsImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=1080',
    labImage: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=1080',
    stats: {
      employmentRate: '92%',
      satisfaction: '4.8/5',
      avgSalary: '€28.000',
      partnerships: '12+'
    },
    modules: [
      {
        title: 'Aula',
        hours: '310 ore',
        topics: ['Teoria analisi chimiche', 'Microbiologia', 'Sistemi qualità']
      },
      {
        title: 'Pratica in Laboratorio',
        hours: '40 ore',
        topics: ['Analisi strumentale', 'Microbiologia pratica']
      },
      {
        title: 'Certificazioni ISO',
        hours: '88 ore',
        topics: ['ISO 9001', 'ISO 22001', 'ISO 17025']
      },
      {
        title: 'Manuale HACCP - Project Work',
        hours: '120 ore',
        topics: ['Sviluppo manuale HACCP']
      },
       {
        title: 'Applicazione ISO 9001 - Project Work',
        hours: '12 ore',
        topics: ['Applicazione pratica ISO 9001']
      },
      {
        title: 'Tirocinio',
        hours: '330 ore',
        topics: ['Stage presso aziende partner']
      }
    ],
    outcomes: ['Capacità di condurre analisi complesse', 'Uso strumentazione avanzata', 'Conoscenza normative', 'Gestione sistemi qualità'],
    careers: ['Tecnici del controllo e della bonifica ambientale (CP ISTAT 3.1.8.3)', 'Tecnici dei prodotti alimentari (CP ISTAT 3.2.2.3.2)'],
    requirements: ['Laurea in Chimica, Biologia, Biotecnologie', 'Scienze e Tecnologie degli Alimenti', 'Farmacia, Ingegneria Chimica', 'Ambiente e Territorio, Geologia, Agraria', 'Veterinaria, Tecnico della Prevenzione'],
    certifications: ['ISO 9001 - Sistema di Gestione per la Qualità', 'ISO 22001 - Sistema di Gestione per la Sicurezza Alimentare', 'ISO 17025 - Certificazione per i Laboratori'],
    teachers: [
      { name: 'Professionisti del settore', role: 'Esperti', description: 'Network di professionisti' }
    ],
    faq: [
      { question: 'A chi è rivolto?', answer: 'Disoccupati/inoccupati residenti in Basilicata con Laurea specifica.' }
    ],
    internshipPartners: [
        'ARPOR – OROGEL Policoro', 'BONASSISALAB Foggia', 'CREA Bella', 'ARA Potenza', 'LABORATORIO ANALISI CAPECE Pisticci',
        'DE SORTIS Pietragalla', 'BIOAGRITEST Potenza', 'LABORATORIO NATURA Matera', 'CUOZZO INDUSTRIAL Viggiano',
        'BIOSAFE Lavello', 'IRSAQ Potenza', 'ECOLAB Praia a mare'
    ]
  },
  'EEC': {
    id: 'EEC',
    title: 'Master in Editoria e Comunicazione',
    description: 'Acquisizione di competenze nell\'impostazione e organizzazione del ciclo di lavorazione del prodotto editoriale, funzionamento e management di una casa editrice, sviluppo competenze nel settore della comunicazione, marketing e social media marketing.',
    duration: '900 ore',
    type: 'Master per Laureati - IV Edizione',
    gradient: 'from-blue-600 via-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    icon: 'PenTool',
    skills: ['Editing', 'Management editoriale', 'Comunicazione', 'Marketing', 'Social Media', 'InDesign', 'Photoshop'],
    price: 'Contattaci',
    startDate: 'Iscrizioni aperte',
    location: 'Potenza',
    heroImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1080',
    carouselImages: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=1080'
    ],
    statsImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1080',
    labImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1080',
    stats: {
      employmentRate: '85%',
      satisfaction: '4.9/5',
      avgSalary: 'Variabile',
      partnerships: '13+'
    },
    modules: [
      {
        title: 'Aula/Laboratorio',
        hours: '350 ore',
        topics: ['Storia editoria', 'Operatività casa editrice', 'Editing', 'Grafica editoriale', 'Comunicazione', 'Marketing']
      },
      {
        title: 'MasterClass/Focus',
        hours: '50 ore',
        topics: ['Incontri con distinct professor']
      },
      {
        title: 'Project Work (Pubblicazione)',
        hours: '140 ore',
        topics: ['Pubblicazione reale']
      },
       {
        title: 'Certificazioni',
        hours: '40 ore',
        topics: ['Linguistiche', 'Informatiche']
      },
       {
        title: 'Orientamento/Placement',
        hours: '20 ore',
        topics: ['Orientamento al lavoro']
      },
      {
        title: 'Tirocinio',
        hours: '300 ore',
        topics: ['Stage in Italia e all\'estero']
      }
    ],
    outcomes: ['Gestione completa progetto editoriale', 'Competenze di editing professionale', 'Strategie di lancio libri', 'Marketing editoriale'],
    careers: ['Editor', 'Redattore', 'Ufficio stampa', 'Social Media Manager', 'Grafico editoriale'],
    requirements: ['Laurea'],
    certifications: ['Certificazione Linguistica riconosciuta MIUR (Inglese)', 'Certificazioni Informatiche PEKIT riconosciute MIUR', 'Certificazione Adobe InDesign'],
    teachers: [
      { name: 'Imprenditori e professionisti', role: 'Esperti', description: 'Network del settore editoriale' }
    ],
    faq: [
      { question: 'È previsto uno stage?', answer: 'Sì, garantito presso case editrici partner in Italia e all\'estero.' },
      { question: 'Si usa InDesign?', answer: 'Sì, certificazione Adobe InDesign inclusa.' }
    ],
    internshipPartners: [
        'Sense Buzz (Lisbona)', 'F&A Network (Dublino)', 'Miraggi Edizioni (Torino)', 'La Corte Editore (Torino)',
        'Tsunami Edizioni (Milano)', 'Alcatraz (Milano)', 'Picarona Edizioni (Bologna)', 'HACCA Edizioni',
        'Tunuè (Latina)', 'Il Mattino di Foggia', 'Universosud Basilicata', 'Lavieri Edizioni', 'EGO 55 (Matera)'
    ]
  },
  'MASSAF': {
    id: 'MASSAF',
    title: 'Safety Manager: Esperto in Sicurezza e Ambiente',
    description: 'Figura trasversale per gestire il sistema di prevenzione del rischio e implementazione del piano della sicurezza ambientale ed aziendale. Individuare i corretti DPI, implementare DVR.',
    duration: '900 ore',
    type: 'Master per Laureati',
    gradient: 'from-emerald-600 via-emerald-500 to-green-500',
    bgGradient: 'from-emerald-50 to-green-50',
    icon: 'HardHat',
    skills: ['RSPP', 'ISO 45001', 'Valutazione Rischi', 'Auditing', 'Gestione Emergenze', 'ISO 14001'],
    price: 'Contattaci',
    startDate: 'Iscrizioni aperte',
    location: 'Potenza',
    heroImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1080',
    carouselImages: [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&q=80&w=1080'
    ],
    statsImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1080',
    labImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1080',
    stats: {
      employmentRate: '95%',
      satisfaction: '4.7/5',
      avgSalary: 'Variabile',
      partnerships: '10+'
    },
    modules: [
      {
        title: 'Aula/Laboratorio/Certificazioni',
        hours: '300 ore',
        topics: ['Cultura sicurezza', 'D.Lgs. 81/08', 'DPI', 'D.Lgs. 231/2001', 'Gestione emergenze', 'WCM', 'Focus settoriali']
      },
      {
        title: 'Visite Aziendali',
        hours: '60 ore',
        topics: ['Visite didattiche']
      },
      {
        title: 'Project Work',
        hours: '140 ore',
        topics: ['Caso reale']
      },
      {
        title: 'Tirocinio',
        hours: '400 ore',
        topics: ['Stage in azienda']
      }
    ],
    outcomes: ['Gestione integrale sistema prevenzione rischio', 'Implementazione piano sicurezza ambientale e aziendale', 'Consulenza in materia di sicurezza'],
    careers: ['Safety Manager', 'RSPP', 'Consulente Sicurezza (Codice ATECO 74.90.29)', 'Auditor'],
    requirements: ['Laurea'],
    certifications: [
        'ISO 19011-17021 - Auditor Sistemi di Gestione', 
        'ISO 45001:2018 - Lead Auditor Salute e Sicurezza (AICQ SICEV)', 
        'ISO 14001:2018 - Lead Auditor Gestione Ambientale (AICQ SICEV)', 
        'Qualificazione Formatore per la Sicurezza',
        'Bonus (>10 allievi): ISO 9001:2015 e ISO 50001:2018'
    ],
    teachers: [
      { name: 'Esperti del settore', role: 'Formatori qualificati', description: 'Professionisti sicurezza e ambiente' }
    ],
    faq: [
      { question: 'Quali certificazioni rilascia?', answer: 'Diverse certificazioni Lead Auditor AICQ SICEV e Qualifica Formatore.' }
    ],
    internshipPartners: [
        'Desal Safety (Tito)', 'Studio Iota (Potenza)', 'STM srl (Tito)', 'IMPES service Spa (Ferrandina)',
        'C.E.C.A.M. Srl (Viggiano)', 'Compass Spa (Vaglio)', 'CLN Group (Atella)', 'Yanfeng Italia (Melfi)',
        'Industrial Starter (Vicenza)', 'Cofra srl (Barletta)'
    ]
  },
  'interior-design': {
    id: 'interior-design',
    title: 'Master Interior Design',
    description: 'Progetta spazi che emozionano. Un master che unisce creatività, tecnica e conoscenza dei materiali per formare i designer del futuro.',
    duration: '600 ore',
    type: 'Master',
    gradient: 'from-orange-600 via-orange-500 to-yellow-500',
    bgGradient: 'from-orange-50 to-yellow-50',
    icon: 'LayoutTemplate',
    skills: ['Progettazione 3D', 'Rendering', 'Materiali', 'Illuminotecnica'],
    price: '4.000',
    startDate: 'Settembre 2025',
    location: 'Sede di Milano',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1080',
    carouselImages: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1080'
    ],
    statsImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1080',
    labImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1080',
    stats: {
      employmentRate: '88%',
      satisfaction: '4.9/5',
      avgSalary: '€25.000',
      partnerships: '25+'
    },
    modules: [
      {
        title: 'Teoria e Storia',
        hours: '80 ore',
        topics: ['Storia del design', 'Teoria del colore', 'Percezione spaziale']
      },
      {
        title: 'Progettazione Tecnica',
        hours: '200 ore',
        topics: ['AutoCAD', 'Rilievo', 'Impianti', 'Ergonomia']
      },
      {
        title: 'Rendering e Visualizzazione',
        hours: '150 ore',
        topics: ['3D Studio Max', 'V-Ray', 'Post-produzione Photoshop']
      }
    ],
    outcomes: ['Gestione progetto d\'interni', 'Realizzazione render fotorealistici', 'Selezione materiali e arredi'],
    careers: ['Interior Designer', 'Visualizer 3D', 'Retail Designer', 'Exhibition Designer'],
    requirements: ['Diploma superiore', 'Passione per il design'],
    certifications: ['Master Interior Design', 'Certificazione Autodesk'],
    teachers: [
      { name: 'Arch. Sara Valli', role: 'Art Director', description: 'Studio Valli & Partners' }
    ],
    faq: [
      { question: 'Serve saper disegnare?', answer: 'Aiuta, ma imparerai tutto da zero.' }
    ]
  },
  'GOL-TEPL': {
    id: 'GOL-TEPL',
    title: 'Tecnico Esperto per lo Sviluppo Turistico Territoriale',
    description: 'L\'esperto svolge attività di elaborazione e progettazione di piani di sviluppo del territorio. Si occupa di definire l\'offerta turistica di una data area geografica, ideare nuovi itinerari e pacchetti, elaborare strategie e politiche di valorizzazione, curare l\'immagine e la promozione del territorio.',
    duration: '500 ore',
    type: 'Programma GOL',
    gradient: 'from-indigo-600 via-indigo-500 to-blue-500',
    bgGradient: 'from-indigo-50 to-blue-50',
    icon: 'Globe',
    skills: ['Marketing Territoriale', 'Pianificazione Turistica', 'Valorizzazione risorse', 'Promozione'],
    price: 'Gratuito (GOL)',
    startDate: 'Iscrizioni aperte',
    location: 'Potenza',
    heroImage: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&q=80&w=1080',
    carouselImages: [
      'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1080'
    ],
    statsImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1080',
    labImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1080',
    stats: {
      employmentRate: '80%',
      satisfaction: '4.6/5',
      avgSalary: 'Variabile',
      partnerships: '40+'
    },
    modules: [
      {
        title: 'Aula e Laboratorio',
        hours: '300 ore',
        topics: ['Sicurezza', 'Analisi mercato', 'Territorio', 'Offerta servizi', 'Sinergie', 'Risorse enogastronomiche', 'Promozione', 'Competenza imprenditoriale']
      },
      {
        title: 'Stage',
        hours: '200 ore',
        topics: ['Stage pratico']
      }
    ],
    outcomes: ['Creazione pacchetti turistici', 'Elaborazione strategie valorizzazione', 'Promozione territorio'],
    careers: ['Tecnico Sviluppo Turistico', 'Promotore turistico', 'Manager di rete'],
    requirements: ['Diploma di scuola superiore', 'Disoccupati iscritti GOL'],
    certifications: ['Certificato di qualificazione professionale valido a livello nazionale ed europeo'],
    teachers: [{ name: 'Esperti del settore', role: 'Formatori', description: 'Professionisti turismo' }],
    faq: [{ question: 'È gratuito?', answer: 'Sì, per gli aventi diritto GOL.' }]
  },
  'OTDS': {
    id: 'OTDS',
    title: 'Tecnico del Sistema Educativo per la Prima Infanzia',
    description: 'Progettazione di attività educative e ludiche, monitoraggio della salute e del benessere, applicazione delle procedure di cura e gestione dei rapporti con i genitori.',
    duration: '600 ore',
    type: 'Programma GOL',
    gradient: 'from-pink-600 via-pink-500 to-rose-500',
    bgGradient: 'from-pink-50 to-rose-50',
    icon: 'Users',
    skills: ['Pedagogia', 'Cura infanzia', 'Progettazione educativa', 'Laboratori creativi', 'Gestione emergenze'],
    price: 'Gratuito (GOL)',
    startDate: 'Iscrizioni aperte',
    location: 'Potenza',
    heroImage: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=1080',
    carouselImages: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1544776193-352d25ca82cd?auto=format&fit=crop&q=80&w=1080'
    ],
    statsImage: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&q=80&w=1080',
    labImage: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1080',
    stats: {
      employmentRate: '90%',
      satisfaction: '4.9/5',
      avgSalary: 'Variabile',
      partnerships: '9+'
    },
    modules: [
        { title: 'Aula e Laboratorio', hours: '360 ore', topics: ['Sicurezza', 'Progettazione attività', 'Laboratorio creativo', 'Gestione routines', 'Emergenze', 'Inglese', 'Competenza imprenditoriale'] },
        { title: 'Stage', hours: '240 ore', topics: ['Esperienza diretta'] }
    ],
    outcomes: ['Gestione attività educative', 'Cura bambini 0-36 mesi', 'Relazione con famiglie'],
    careers: ['Educatore nido', 'Operatore infanzia'],
    requirements: ['Iscrizione GOL'],
    certifications: ['Certificato di qualificazione professionale valido a livello nazionale ed europeo'],
    teachers: [{ name: 'Pedagogisti ed esperti', role: 'Formatori', description: 'Esperienza nel settore infanzia' }],
    faq: [{ question: 'Dove si svolge lo stage?', answer: 'Presso asili nido partner.' }],
    internshipPartners: [
        'Asilo nido Il Melograno', 'La Casetta Magica', 'Ambarabà Centro per l\'Infanzia', 'Il Paese delle Meraviglie',
        'Scarabocchiando a casa di Angela', 'Il Piccolo Nido (Tito)', 'Piccole Orme', 'La Giostra', 'Tribù dei Tora Tora'
    ]
  },
  'Tor': {
    id: 'Tor',
    title: 'Operatore della Tornitura',
    description: 'Il tornitore è responsabile della lavorazione dei metalli utilizzando il tornio, sia tradizionale che a controllo numerico computerizzato (CNC). È in grado di leggere il disegno meccanico, eseguire lavorazioni complesse, apportare regolazioni al tornio, utilizzare accessori in modo ottimale.',
    duration: '600 ore',
    type: 'Programma GOL',
    gradient: 'from-slate-600 via-slate-500 to-gray-500',
    bgGradient: 'from-slate-50 to-gray-50',
    icon: 'Zap',
    skills: ['Tornitura tradizionale', 'Tornitura CNC', 'Disegno meccanico', 'Controllo qualità', 'Manutenzione'],
    price: 'Gratuito (GOL)',
    startDate: 'Iscrizioni aperte',
    location: 'Potenza',
    heroImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1080',
    carouselImages: [
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1080'
    ],
    statsImage: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1080',
    labImage: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&q=80&w=1080',
    stats: {
      employmentRate: '98%',
      satisfaction: '4.5/5',
      avgSalary: 'Variabile',
      partnerships: '3+'
    },
    modules: [
        { title: 'Aula', hours: '240 ore', topics: ['Sicurezza', 'Disegno meccanico', 'Teoria tornitura'] },
        { title: 'Laboratorio', hours: '120 ore', topics: ['Approntamento macchine', 'Esecuzione operazioni', 'Controllo qualità'] },
        { title: 'Stage', hours: '240 ore', topics: ['Esperienza in officina'] }
    ],
    outcomes: ['Lettura disegno meccanico', 'Lavorazioni complesse tornio', 'Programmazione CNC base'],
    careers: ['Tornitore', 'Programmatore CNC', 'Operatore macchine utensili'],
    requirements: ['Assolvimento obbligo di istruzione', 'Iscrizione GOL'],
    certifications: ['Certificato di qualificazione professionale valido a livello nazionale ed europeo'],
    teachers: [{ name: 'Esperti meccanica', role: 'Istruttori tecnici', description: 'Professionisti del settore' }],
    faq: [{ question: 'Perché questo corso?', answer: 'Mestiere richiesto, carriera solida.' }],
    internshipPartners: [
        'C.T. Centro Tornitura SRL (Tito)', 'OCM Officina Cancellara Michele (Acerenza)', 'S.D.L. di Sabia Giovanna (Pietragalla)'
    ]
  },
  'GOL-OHES': {
    id: 'GOL-OHES',
    title: 'Operatore H2S e Sicurezza',
    description: 'La figura si occupa della sicurezza industriale con focus sulla gestione dei rischi connessi all\'esposizione all\'idrogeno solforato (H2S). Valutare potenziali effetti, implementare misure preventive, utilizzare apparecchiature rilevamento, gestire DPI, garantire vigilanza.',
    duration: '600 ore',
    type: 'Programma GOL',
    gradient: 'from-red-600 via-red-500 to-orange-500',
    bgGradient: 'from-red-50 to-orange-50',
    icon: 'Shield',
    skills: ['Gestione rischio H2S', 'Rilevamento gas', 'DPI e APVR', 'Gestione emergenze', 'Primo soccorso'],
    price: 'Gratuito (GOL)',
    startDate: 'Iscrizioni aperte',
    location: 'Potenza',
    heroImage: 'https://images.unsplash.com/photo-1585079542156-2755d9c8a094?auto=format&fit=crop&q=80&w=1080',
    carouselImages: [
      'https://images.unsplash.com/photo-1585079542156-2755d9c8a094?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1581093577421-f561a654a353?auto=format&fit=crop&q=80&w=1080'
    ],
    statsImage: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=1080',
    labImage: 'https://images.unsplash.com/photo-1605218427360-15332cc89344?auto=format&fit=crop&q=80&w=1080',
    stats: {
      employmentRate: '95%',
      satisfaction: '4.8/5',
      avgSalary: 'Variabile',
      partnerships: '10+'
    },
    modules: [
        { title: 'Aula e Laboratorio', hours: '360 ore', topics: ['Rischi petroliferi', 'Campionamento gas', 'Verifiche sicurezza', 'Emergenza H2S', 'Rilevamento gas', 'Briefing', 'Ambienti confinati', 'APVR', 'Competenze imprenditoriali'] },
        { title: 'Stage', hours: '240 ore', topics: ['Esperienza pratica'] }
    ],
    outcomes: ['Lavoro sicuro in ambienti a rischio H2S', 'Gestione emergenze gas', 'Uso DPI specifici'],
    careers: ['Operatore H2S', 'Addetto sicurezza Oil&Gas', 'Tecnico rilevamento gas'],
    requirements: ['Assolvimento obbligo di istruzione', 'Iscrizione GOL'],
    certifications: ['Certificato di qualificazione professionale valido a livello nazionale ed europeo'],
    teachers: [{ name: 'Esperti sicurezza', role: 'Istruttori qualificati', description: 'Professionisti H2S' }],
    faq: [{ question: 'È valido in Italia?', answer: 'Sì, titolo valido in Italia.' }]
  },
  'Upskilling-CDP1': {
    id: 'Upskilling-CDP1',
    title: 'Pubblicità e Comunicazione Digitale',
    description: 'Il corso offre un percorso formativo per sviluppare competenze teorico-pratiche nella comunicazione d\'impresa e pubblicità, dai fondamenti di marketing alla gestione di campagne social media e content creation.',
    duration: '100 ore',
    type: 'Programma GOL (Upskilling)',
    gradient: 'from-purple-700 via-purple-600 to-indigo-700',
    bgGradient: 'from-purple-50 to-indigo-50',
    icon: 'Megaphone',
    skills: ['Social Media Marketing', 'Digital Advertising', 'Content Creation', 'Analisi Dati', 'Project Management'],
    price: 'Gratuito (GOL)',
    startDate: 'Iscrizioni aperte',
    location: 'Potenza',
    heroImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1080',
    carouselImages: [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&q=80&w=1080'
    ],
    statsImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1080',
    labImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1080',
    stats: {
      employmentRate: 'N/A',
      satisfaction: 'N/A',
      avgSalary: 'Variabile',
      partnerships: '50+'
    },
    modules: [
      {
        title: 'Teoria e Strategia',
        hours: '60 ore',
        topics: ['Comunicazione d\'impresa', 'Budgeting e Reporting', 'Progettazione pubblicitaria', 'Social Media Strategy']
      },
      {
        title: 'Laboratorio Pratico',
        hours: '40 ore',
        topics: ['Software editing grafico/video', 'Content creation', 'Project Management (GANTT, PERT)', 'Tools digitali']
      }
    ],
    outcomes: ['Progettazione campagne pubblicitarie', 'Gestione social media', 'Analisi efficacia campagne', 'Uso software grafici'],
    careers: ['Social Media Manager', 'Digital Advertiser', 'Content Creator', 'Addetto Marketing'],
    requirements: ['Diploma', 'Disoccupati iscritti GOL (Upskilling 102)', 'Residenti in Basilicata'],
    certifications: ['Attestato di frequenza con profitto (Programma GOL)'],
    teachers: [
      { name: 'Esperti Digital Marketing', role: 'Formatori Senior', description: 'Professionisti di agenzie di comunicazione' }
    ],
    faq: [
      { question: 'Chi può partecipare?', answer: 'Diplomati disoccupati residenti in Basilicata, profilati Upskilling (102).' }
    ],
    internshipPartners: []
  },
  'GOL-ODPE': {
    id: 'GOL-ODPE',
    title: 'Operatore di Panificazione e Produzione di Paste',
    description: 'La figura professionale si occupa della preparazione di vari tipi di impasti, della lievitazione, della cottura e del confezionamento dei prodotti, nell\'ambito della produzione di pasta e di prodotti da forno. Può operare in forma dipendente o autonoma, avviando una attività imprenditoriale.',
    duration: '600 ore',
    type: 'Programma GOL (Reskilling)',
    gradient: 'from-amber-600 via-orange-500 to-yellow-500',
    bgGradient: 'from-amber-50 to-yellow-50',
    icon: 'Croissant',
    skills: ['Lavorazione Impasti', 'Gestione Lievitazione', 'Cottura Prodotti', 'Sicurezza Alimentare', 'Confezionamento'],
    price: 'Gratuito (GOL)',
    startDate: 'Iscrizioni aperte',
    location: 'Potenza',
    heroImage: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=1080',
    carouselImages: [
      'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1080'
    ],
    statsImage: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&q=80&w=1080',
    labImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1080',
    stats: {
      employmentRate: 'N/A',
      satisfaction: 'N/A',
      avgSalary: 'Variabile',
      partnerships: '10+'
    },
    modules: [
      {
        title: 'Formazione di Aula',
        hours: '267 ore',
        topics: ['Sicurezza sul lavoro', 'Lavorazione degli impasti', 'Gestione lievitazione', 'Processi di cottura', 'Inglese', 'Informatica', 'Autoimprenditorialità']
      },
      {
        title: 'Laboratorio in Azienda',
        hours: '93 ore',
        topics: ['Lavorazione sfoglia', 'Finitura e farcitura', 'Refrigerazione e surgelazione', 'Confezionamento prodotti', 'Pulizia area lavoro']
      },
      {
        title: 'Stage in Azienda',
        hours: '240 ore',
        topics: ['Esperienza pratica presso aziende di produzione pane e/o pasta']
      }
    ],
    outcomes: ['Lavorazione vari tipi di impasti', 'Gestione processi di lievitazione', 'Lavorazione sfoglia e prodotti semilavorati', 'Processi di cottura, refrigerazione e confezionamento', 'Utilizzo strumenti e tecnologie specifiche'],
    careers: ['Panificatore', 'Pastaio', 'Operatore produzione alimentare', 'Imprenditore settore alimentare'],
    requirements: ['Assolvimento obbligo di istruzione', 'Residenti in Basilicata', 'Iscrizione al Programma GOL Regione Basilicata', 'Disoccupati/inoccupati'],
    certifications: ['Certificato di qualificazione professionale valido a livello nazionale'],
    teachers: [
      { name: 'Maestri panificatori', role: 'Formatori esperti', description: 'Professionisti del settore alimentare' }
    ],
    faq: [
      { question: 'Perché scegliere questo corso?', answer: 'Gli operai specializzati delle lavorazioni alimentari sono figure molto richieste in Basilicata con alta difficoltà di reperimento.' },
      { question: 'È previsto uno stage?', answer: 'Sì, 240 ore di stage presso aziende della produzione di pane e/o pasta.' }
    ],
    internshipPartners: []
  },
  'GOL-COMDIG': {
    id: 'GOL-COMDIG',
    title: 'Competenze Digitali',
    description: 'Il corso offre un percorso formativo per acquisire competenze digitali essenziali per il mondo del lavoro moderno. I partecipanti impareranno a utilizzare il computer, navigare in internet, gestire strumenti di produttività e comunicare efficacemente tramite canali digitali.',
    duration: '60 ore',
    type: 'Programma GOL (Upskilling)',
    gradient: 'from-blue-600 via-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    icon: 'Monitor',
    skills: ['Utilizzo PC', 'Navigazione Web', 'Suite Office', 'Email e PEC', 'Comunicazione Digitale', 'Sicurezza Online'],
    price: 'Gratuito (GOL)',
    startDate: 'Iscrizioni aperte',
    location: 'Potenza',
    heroImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1080',
    carouselImages: [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1080'
    ],
    statsImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1080',
    labImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1080',
    stats: {
      employmentRate: 'N/A',
      satisfaction: 'N/A',
      avgSalary: 'Variabile',
      partnerships: '20+'
    },
    modules: [
      {
        title: 'Fondamenti Informatica',
        hours: '20 ore',
        topics: ['Uso del computer', 'Sistema operativo', 'Gestione file e cartelle', 'Sicurezza informatica di base']
      },
      {
        title: 'Produttività Digitale',
        hours: '20 ore',
        topics: ['Elaborazione testi', 'Fogli di calcolo', 'Presentazioni', 'Strumenti cloud']
      },
      {
        title: 'Comunicazione Online',
        hours: '20 ore',
        topics: ['Navigazione web', 'Email e PEC', 'Social media', 'Collaborazione digitale']
      }
    ],
    outcomes: ['Utilizzo autonomo del computer', 'Gestione documenti digitali', 'Comunicazione professionale via email', 'Navigazione sicura in internet', 'Uso strumenti di produttività'],
    careers: ['Impiegato amministrativo', 'Addetto segreteria', 'Operatore data entry', 'Assistente digitale'],
    requirements: ['Diploma', 'Disoccupati iscritti GOL (Upskilling)', 'Residenti in Basilicata'],
    certifications: ['Attestato di frequenza con profitto (Programma GOL)'],
    teachers: [
      { name: 'Esperti Informatica', role: 'Formatori Senior', description: 'Professionisti del settore IT e formazione digitale' }
    ],
    faq: [
      { question: 'Chi può partecipare?', answer: 'Diplomati disoccupati residenti in Basilicata, profilati Upskilling nel Programma GOL.' },
      { question: 'È necessaria esperienza pregressa?', answer: 'No, il corso parte dalle basi ed è adatto anche a chi ha poca familiarità con il computer.' }
    ],
    internshipPartners: []
  },
  'CDSA': {
    id: 'CDSA',
    title: 'Corso di Specializzazione alle Guide Turistiche',
    subtitle: 'Accessibilità al patrimonio museale e monumentale italiano per non vedenti',
    decree: 'Obbligo di aggiornamento per guide turistiche: 50 ore ogni 3 anni per rimanere nell\'elenco nazionale.\nAutorizzato con Decreto Ministeriale prot. n. 269540 del 02/12/2025',
    description: 'Il corso di specializzazione è pensato per guide turistiche che desiderano ampliare le proprie competenze e diventare protagoniste di un turismo davvero inclusivo. Il percorso formativo fornisce strumenti teorici e pratici per progettare e condurre esperienze culturali accessibili, significative e coinvolgenti per persone non vedenti e ipovedenti.\n\nAttraverso una modalità blended (lezioni online e laboratori esperienziali in presenza), il corso affronta temi chiave come la psicologia della disabilità visiva, la comunicazione accessibile e il sistema Braille, le tecniche di descrizione artistica, la costruzione di immagini mentali e l\'estetica multisensoriale. Un\'attenzione particolare è dedicata alla progettazione di materiali tattili e alla sperimentazione diretta, grazie a laboratori pratici e itineranti guidati anche da docenti non vedenti.\n\nAl termine del percorso, i partecipanti avranno acquisito competenze concrete per accogliere e accompagnare visitatori con disabilità visiva, progettare visite inclusive, utilizzare linguaggi descrittivi efficaci e valorizzare il patrimonio museale e monumentale attraverso un approccio multisensoriale ed empatico. Il valore aggiunto del corso risiede nell\'esperienza diretta sul campo e nella formazione olistica, che permette alle guide di diventare veri agenti di accessibilità, capaci di rendere la bellezza e la cultura fruibili da tutti, senza esclusioni.',
    duration: '50 ore',
    type: 'Corso di Specializzazione',
    gradient: 'from-teal-600 via-teal-500 to-cyan-500',
    bgGradient: 'from-teal-50 to-cyan-50',
    icon: 'Eye',
    skills: ['Psicologia disabilità visiva', 'Sistema Braille', 'Audio-descrizione', 'Comunicazione accessibile', 'Esperienze multisensoriali', 'Materiali tattili'],
    price: '€480 (IVA inclusa)',
    startDate: '23 Febbraio 2026',
    location: 'Matera (in presenza) + Online',
    heroImage: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=1080',
    carouselImages: [
      'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&q=80&w=1080'
    ],
    statsImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1080',
    labImage: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=1080',
    stats: {
      employmentRate: 'N/A',
      satisfaction: 'N/A',
      avgSalary: 'Variabile',
      partnerships: '5+'
    },
    modules: [
      {
        title: 'Psicologia della disabilità visiva',
        hours: '5 ore online',
        topics: ['Dinamica emotiva', 'Educazione senso-percettiva-motoria', 'Interiorizzazione dei concetti topologici', 'Conoscenza oggettiva del mondo sensibile']
      },
      {
        title: 'Sistema Braille e comunicazione',
        hours: '5 ore online',
        topics: ['I caratteri del braille', 'Letto-scrittura', 'Caratteristiche della comunicazione del non vedente', 'Costruzione di messaggi verbali con le regole dei 7 principi']
      },
      {
        title: 'Costruzione di immagini mentali',
        hours: '5 ore online',
        topics: ['Gusto e valori estetici del non vedente', 'Tecniche di visualizzazione mentale']
      },
      {
        title: 'Gusto e valori estetici del non vedente',
        hours: '5 ore online',
        topics: ['L\'immagine tattile e il piacere estetico', 'I valori estetici della percezione tattile']
      },
      {
        title: 'Accessibilità museale e Tecniche di descrizione',
        hours: '10 ore online',
        topics: ['I ciechi e la fruibilità della "Bellezza"', 'Il turismo per i non vedenti: condizioni necessarie', 'I pilastri della descrizione', 'Vedere con l\'udito', 'Esercizi e immagini da descrivere']
      },
      {
        title: 'Predisposizione del materiale tattile e modellazione',
        hours: '4 ore (Presenza)',
        topics: ['Costruzione di supporti tattili per l\'esperienza turistica', 'Mappe e plastici', 'Rilievi e modelli']
      },
      {
        title: 'Laboratorio Esperienziale Accoglienza e Relazione',
        hours: '4 ore (Presenza)',
        topics: ['Momento di autenticità attraverso movimento e condivisione di emozioni', 'Esperienza Bendato/Non Bendato']
      },
      {
        title: 'Laboratorio "Toccare la Bellezza"',
        hours: '4 ore (Presenza)',
        topics: ['Esperienza bendata di manipolazione con la guida di un cieco']
      },
      {
        title: 'Laboratorio Sensoriale Itinerante',
        hours: '8 ore (Presenza)',
        topics: ['Esperienza itinerante bendata presso luoghi artistici e museali con la guida di un non vedente']
      }
    ],
    outcomes: [
      'Comprendere e interpretare la disabilità visiva, riconoscendo caratteristiche psicologiche, cognitive ed emotive della cecità e dell\'ipovisione',
      'Utilizzare tecniche di comunicazione accessibile ed efficace con persone non vedenti e ipovedenti',
      'Progettare e realizzare descrizioni artistiche e culturali inclusive utilizzando tecniche di audio-descrizione strutturata',
      'Sviluppare competenze nella progettazione di esperienze multisensoriali integrando stimoli tattili, uditivi, olfattivi e corporei',
      'Realizzare e utilizzare materiali tattili (mappe, plastici, rilievi) per la fruizione culturale',
      'Gestire l\'accoglienza e la relazione con gruppi inclusivi (vedenti e non vedenti)',
      'Condurre in autonomia itinerari sensoriali accessibili presso musei e siti culturali'
    ],
    careers: ['Guida turistica specializzata in accessibilità', 'Operatore museale per visite inclusive', 'Consulente accessibilità culturale', 'Progettista itinerari sensoriali'],
    requirements: ['Abilitazione come Guida Turistica (consigliata)', 'Interesse per l\'accessibilità culturale', 'Propensione alla comunicazione empatica'],
    certifications: ['Attestato di Specializzazione in Turismo Accessibile per Non Vedenti', 'Inserimento nella pagina dedicata alle guide specializzate di Innform (previo consenso)'],
    importantInfo: [
      'Valido per adempiere all\'obbligo formativo triennale',
      '50 ore ogni 3 anni per rimanere nell\'elenco nazionale'
    ],
    teachers: [
      { name: 'Maria Sansone', role: 'Responsabile del Corso', description: 'Esperta in accessibilità culturale e turismo inclusivo' },
      { name: 'Esperti tiflologi', role: 'Formatori', description: 'Professionisti specializzati nella didattica per non vedenti' }
    ],
    faq: [
      { question: 'A chi è rivolto il corso?', answer: 'Il corso è rivolto principalmente a guide turistiche che desiderano specializzarsi nell\'accompagnamento di visitatori non vedenti e ipovedenti, ma è aperto anche a operatori museali e culturali interessati all\'accessibilità.' },
      { question: 'Qual è la modalità di frequenza?', answer: 'Il corso è in modalità mista: 30 ore online e 20 ore in presenza a Matera per i laboratori esperienziali.' },
      { question: 'Come si ottiene la certificazione?', answer: 'La certificazione è rilasciata a chi ha frequentato almeno l\'80% delle attività (online e in presenza) e ha consegnato le esercitazioni di fine corso.' },
      { question: 'Quanti partecipanti sono previsti?', answer: 'Il corso prevede un minimo di 12 e un massimo di 18 partecipanti per garantire un\'esperienza formativa di qualità.' }
    ],
    internshipPartners: []
  },
  'CS-CORAI': {
    id: 'CS-CORAI',
    title: 'Intelligenza Artificiale',
    description: 'Il corso fornisce una panoramica completa sull\'Intelligenza Artificiale, dalle basi teoriche alle applicazioni pratiche. I partecipanti acquisiranno competenze nell\'utilizzo degli strumenti AI più diffusi, nel prompt engineering e nella comprensione delle implicazioni etiche e professionali dell\'IA nel mondo del lavoro.',
    duration: '20 ore',
    type: 'Corso di Formazione',
    gradient: 'from-violet-600 via-purple-500 to-fuchsia-500',
    bgGradient: 'from-violet-50 to-fuchsia-50',
    icon: 'Brain',
    skills: ['Machine Learning', 'Prompt Engineering', 'ChatGPT', 'AI Generativa', 'Automazione', 'Analisi Dati con AI'],
    price: 'Contattaci',
    startDate: 'Iscrizioni aperte',
    location: 'Potenza / Online',
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1080',
    carouselImages: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1080'
    ],
    statsImage: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=1080',
    labImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1080',
    stats: {
      employmentRate: 'N/A',
      satisfaction: 'N/A',
      avgSalary: 'Variabile',
      partnerships: '10+'
    },
    modules: [
      {
        title: 'Fondamenti di Intelligenza Artificiale',
        hours: '4 ore',
        topics: ['Cos\'è l\'Intelligenza Artificiale', 'Storia e evoluzione dell\'AI', 'Machine Learning vs Deep Learning', 'Tipi di AI: narrow, general, superintelligence', 'Applicazioni dell\'AI nel mondo reale']
      },
      {
        title: 'AI Generativa e Large Language Models',
        hours: '4 ore',
        topics: ['Introduzione ai modelli linguistici (LLM)', 'ChatGPT, Claude, Gemini: panoramica degli strumenti', 'Generazione di testi, immagini e contenuti multimediali', 'Limiti e potenzialità dell\'AI generativa']
      },
      {
        title: 'Prompt Engineering',
        hours: '4 ore',
        topics: ['Principi del prompt engineering efficace', 'Tecniche di prompting avanzate', 'Chain-of-thought e few-shot learning', 'Creazione di prompt per casi d\'uso specifici', 'Laboratorio pratico di scrittura prompt']
      },
      {
        title: 'Applicazioni Pratiche dell\'AI',
        hours: '4 ore',
        topics: ['AI per la produttività personale e aziendale', 'Automazione di task ripetitivi', 'AI per analisi dati e reportistica', 'Strumenti AI per creatività e design', 'Integrazione AI nei flussi di lavoro']
      },
      {
        title: 'Etica, Privacy e Futuro dell\'AI',
        hours: '4 ore',
        topics: ['Implicazioni etiche dell\'Intelligenza Artificiale', 'Privacy e protezione dei dati', 'AI e mercato del lavoro: opportunità e sfide', 'Normative europee sull\'AI (AI Act)', 'Tendenze future e scenari evolutivi']
      }
    ],
    outcomes: [
      'Comprendere i concetti fondamentali dell\'Intelligenza Artificiale e del Machine Learning',
      'Utilizzare efficacemente strumenti di AI generativa come ChatGPT e Claude',
      'Padroneggiare le tecniche di prompt engineering per ottenere risultati ottimali',
      'Applicare l\'AI per aumentare la produttività personale e professionale',
      'Valutare criticamente le implicazioni etiche e sociali dell\'AI'
    ],
    careers: ['Specialista AI', 'Prompt Engineer', 'AI Trainer', 'Digital Transformation Specialist', 'Data Analyst'],
    requirements: ['Conoscenza di informatica di base'],
    certifications: ['Attestato di frequenza con profitto'],
    teachers: [
      { name: 'Esperti AI', role: 'Formatori Senior', description: 'Professionisti specializzati in Intelligenza Artificiale e Machine Learning' }
    ],
    faq: [
      { question: 'Sono necessarie competenze di programmazione?', answer: 'No, il corso è progettato per essere accessibile a tutti. È richiesta solo una conoscenza di base dell\'informatica.' },
      { question: 'Quali strumenti AI verranno utilizzati?', answer: 'Durante il corso utilizzeremo ChatGPT, Claude, e altri strumenti di AI generativa per esercitazioni pratiche.' },
      { question: 'Il corso è in presenza o online?', answer: 'Il corso è disponibile sia in modalità in presenza a Potenza che online, per garantire la massima flessibilità.' }
    ],
    internshipPartners: []
  }
};

export function CourseDetail() {
  const { courseId } = useParams();

  // Dati live da EduPlan API (cerca per slug = courseId dall'URL)
  // Lo slug e' generato automaticamente dal titolo del corso su EduPlan
  const {
    course: liveData,
    loading: liveLoading,
    lastUpdated,
    isRealtime,
  } = useRealtimeCourse({
    slug: courseId || undefined,  // Usa slug (website_slug) invece di code
    enabled: !!courseId,
  });

  // DEBUG: log quando liveData cambia
  useEffect(() => {
    console.log('[CourseDetail] liveData CAMBIATO:', {
      id: liveData?.id,
      editionsCount: liveData?.editions?.length || 0,
      editionIds: liveData?.editions?.map(e => e.id) || [],
      lastUpdated: lastUpdated?.toISOString(),
    });
  }, [liveData, lastUpdated]);

  // Dati statici del corso (cerca per CODICE corso - stabile anche se il titolo cambia)
  // Questo permette di rinominare i corsi su EduPlan senza perdere i dati presentazionali
  const staticCourse = liveData?.code ? coursesData[liveData.code] : null;

  // CORSO DINAMICO AL 100%: effectiveCourse usa API come primario, coursesData come fallback/extra
  // Se un corso esiste solo su EduPlan (non in coursesData), verrà comunque mostrato
  const course = useMemo<Course | null>(() => {
    // Se non abbiamo né dati statici né dati live, non possiamo mostrare nulla
    if (!staticCourse && !liveData) return null;

    // Se abbiamo solo dati statici, usali
    if (!liveData) return staticCourse;

    // Valori di default per campi presentazionali quando mancano da coursesData
    const defaultGradient = 'from-purple-600 to-pink-600';
    const defaultBgGradient = 'from-purple-50 to-pink-50';
    const defaultHeroImage = '/images/corso-default.jpg';
    const defaultStatsImage = '/images/stats-default.jpg';
    const defaultLabImage = '/images/lab-default.jpg';

    // Combina: dati statici come base (se esistono), poi sovrascrivi con dati API
    return {
      id: courseId || liveData.code,
      title: liveData.title || staticCourse?.title || '',
      subtitle: staticCourse?.subtitle,
      decree: staticCourse?.decree,
      description: staticCourse?.description || liveData.description || '',
      duration: liveData.duration_hours ? `${liveData.duration_hours} ore` : staticCourse?.duration || '',
      type: staticCourse?.type || liveData.category || 'Corso',
      gradient: staticCourse?.gradient || defaultGradient,
      bgGradient: staticCourse?.bgGradient || defaultBgGradient,
      icon: staticCourse?.icon || 'BookOpen',
      skills: staticCourse?.skills || [],
      price: liveData.price > 0 ? `€${liveData.price.toFixed(2)}` : (staticCourse?.price || 'Contattaci'),
      startDate: staticCourse?.startDate || (liveData.start_date ? new Date(liveData.start_date).toLocaleDateString('it-IT') : 'Da definire'),
      location: staticCourse?.location || liveData.location || 'Potenza',
      heroImage: staticCourse?.heroImage || defaultHeroImage,
      carouselImages: staticCourse?.carouselImages || [defaultHeroImage],
      statsImage: staticCourse?.statsImage || defaultStatsImage,
      labImage: staticCourse?.labImage || defaultLabImage,
      modules: staticCourse?.modules || [],
      outcomes: staticCourse?.outcomes || [],
      careers: staticCourse?.careers || [],
      requirements: staticCourse?.requirements || ['Contattaci per i requisiti'],
      certifications: staticCourse?.certifications || ['Attestato di frequenza'],
      importantInfo: staticCourse?.importantInfo,
      teachers: staticCourse?.teachers || [],
      faq: staticCourse?.faq || [],
      stats: staticCourse?.stats || {
        employmentRate: 'N/A',
        satisfaction: 'N/A',
        avgSalary: 'N/A',
        partnerships: 'N/A',
      },
      internshipPartners: staticCourse?.internshipPartners,
    };
  }, [staticCourse, liveData, courseId]);

  // Hook per invalidare cache dopo iscrizione
  const invalidateCache = useInvalidateCoursesCache();

  // Stato per l'edizione selezionata nelle tab
  const [selectedEdition, setSelectedEdition] = useState<CourseEdition | null>(null);

  // Hook per calendario lezioni - filtra per edizione selezionata
  const {
    lessons,
  } = useCourseLessons({
    courseId: liveData?.id,
    editionId: selectedEdition?.id,  // Mostra solo le lezioni dell'edizione selezionata
    pollingInterval: 60000,
    enabled: !!liveData?.id && !!selectedEdition?.id,
  });

  // Calcola edizioni ordinate (stessa logica di EditionsList)
  // NOTA: usiamo liveData come dipendenza (non solo editions) per forzare ricalcolo
  // quando il corso viene aggiornato via Realtime (structuredClone crea nuovo riferimento)
  const sortedEditions = useMemo(() => {
    console.log('[CourseDetail] useMemo sortedEditions RICALCOLO - liveData.editions:', liveData?.editions?.length || 0, '- liveData.id:', liveData?.id);
    if (!liveData?.editions || liveData.editions.length === 0) return [];
    const sorted = [...liveData.editions].sort((a, b) => {
      if (a.badges.sold_out && !b.badges.sold_out) return 1;
      if (!a.badges.sold_out && b.badges.sold_out) return -1;
      const deadlineA = a.enrollment_deadline ? new Date(a.enrollment_deadline).getTime() : Infinity;
      const deadlineB = b.enrollment_deadline ? new Date(b.enrollment_deadline).getTime() : Infinity;
      if (deadlineA !== deadlineB) return deadlineA - deadlineB;
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    });
    console.log('[CourseDetail] useMemo sortedEditions RISULTATO:', sorted.length, 'ids:', sorted.map(e => e.id.slice(0,8)));
    return sorted;
  }, [liveData]);  // Cambiato: usa liveData intero come dipendenza

  // Imposta edizione di default quando arrivano i dati
  // E aggiorna l'edizione selezionata quando i dati cambiano (es. via Realtime)
  useEffect(() => {
    console.log('[CourseDetail] sortedEditions aggiornate:', sortedEditions.length, 'edizioni');

    if (sortedEditions.length > 0) {
      if (!selectedEdition) {
        // Prima volta: seleziona l'edizione di default
        const defaultEdition = sortedEditions.find((ed: CourseEdition) => !ed.badges.sold_out && ed.is_enrollments_open) || sortedEditions[0];
        console.log('[CourseDetail] Seleziono edizione default:', defaultEdition?.id);
        setSelectedEdition(defaultEdition);
      } else {
        // Aggiornamento: sincronizza i dati dell'edizione selezionata con quelli aggiornati
        const updatedEdition = sortedEditions.find((ed: CourseEdition) => ed.id === selectedEdition.id);

        if (!updatedEdition) {
          // L'edizione selezionata è stata ELIMINATA - seleziona un'altra
          console.log('[CourseDetail] Edizione eliminata! Seleziono nuova default');
          const newDefault = sortedEditions.find((ed: CourseEdition) => !ed.badges.sold_out && ed.is_enrollments_open) || sortedEditions[0];
          setSelectedEdition(newDefault);
        } else if (JSON.stringify(updatedEdition) !== JSON.stringify(selectedEdition)) {
          // L'edizione esiste ma è stata modificata - aggiorna i dati
          console.log('[CourseDetail] Edizione aggiornata:', updatedEdition.id);
          setSelectedEdition(updatedEdition);
        }
      }
    } else if (selectedEdition) {
      // Non ci sono più edizioni - deseleziona
      console.log('[CourseDetail] Nessuna edizione disponibile, deseleziono');
      setSelectedEdition(null);
    }
  }, [sortedEditions, selectedEdition]);

  // Dati da mostrare: edizione selezionata o dati corso
  // NOTA: prezzo e altri dati vengono da EduPlan (edizione), con fallback ai dati statici
  const displayData = useMemo(() => {
    const edition = selectedEdition;

    // Calcola il prezzo: priorità edizione > corso live > statico
    let price = 'Contattaci';
    if (edition?.price !== null && edition?.price !== undefined && edition.price > 0) {
      price = `€${edition.price.toFixed(2)}`;
    } else if (liveData?.price !== undefined && liveData.price > 0) {
      price = `€${liveData.price.toFixed(2)}`;
    } else if (course?.price && course.price !== 'Contattaci') {
      price = course.price;
    }

    return {
      duration: liveData?.duration_hours ? `${liveData.duration_hours} ore` : course?.duration || '',
      price,
      availableSpots: edition ? edition.available_spots : liveData?.available_spots,
      maxParticipants: edition ? edition.max_participants : liveData?.max_participants,
      startDate: edition?.start_date || liveData?.start_date,
      location: edition?.location || liveData?.location || course?.location,
      teacher: edition?.teacher || liveData?.teacher,
      isSoldOut: edition ? edition.badges.sold_out : liveData?.badges.sold_out,
      editionName: edition?.edition_name || (edition ? `Edizione ${edition.edition_number}` : null),
    };
  }, [selectedEdition, liveData, course]);

  // Se stiamo ancora caricando e non abbiamo dati statici, mostra loading
  if (!course && liveLoading) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center text-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
        <p className="text-gray-600">Caricamento corso...</p>
      </div>
    );
  }

  // Se non abbiamo né dati statici né dati API, mostra errore
  if (!course) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Corso non trovato</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Ci dispiace, ma il corso che stai cercando non sembra esistere o è stato rimosso.
        </p>
        <Link
          to="/#corsi"
          className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold"
        >
          Torna ai Corsi
        </Link>
      </div>
    );
  }

  // Estrai prezzo numerico per schema
  const priceNumber = displayData.price
    ? parseFloat(displayData.price.replace(/[^0-9.,]/g, '').replace(',', '.'))
    : undefined;

  return (
    <>
      {/* SEO Meta Tags dinamici */}
      <SEOHead
        title={course.title}
        description={course.description.substring(0, 160)}
        image={course.heroImage}
        url={`/corsi/${courseId}`}
      />

      {/* Course Schema per Google */}
      <CourseSchema
        name={course.title}
        description={course.description}
        duration={course.duration}
        educationalLevel={course.type}
        url={`/corsi/${courseId}`}
        image={course.heroImage}
        price={priceNumber && !isNaN(priceNumber) ? priceNumber : undefined}
      />

      {/* FAQ Schema per rich snippets */}
      {course.faq && course.faq.length > 0 && (
        <FAQSchema items={course.faq} />
      )}

    <article
      className="bg-white"
      itemScope
      itemType="https://schema.org/Course"
      aria-label={`Dettaglio corso: ${course.title}`}
    >
      {/* Hero Section */}
      <section
        className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden"
        aria-labelledby="course-title"
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${course.bgGradient} opacity-50`}></div>
        
        {/* Decorative Blobs */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`flex flex-col lg:flex-row gap-12 lg:gap-20 ${liveData?.code === 'CDSA' ? 'items-start' : 'items-center'}`}>
            
            {/* Left Column: Text Info */}
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <Link 
                to="/#corsi" 
                className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors font-medium mb-4"
              >
                <ArrowLeft size={20} />
                Torna ai corsi
              </Link>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold bg-white shadow-sm text-purple-600 border border-purple-100`}>
                    {course.type}
                  </span>
                  {course.type.includes('GOL') && (
                    <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-green-100 text-green-700 border border-green-200 flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      Finanziato 100%
                    </span>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {course.title}
                </h1>

                {course.subtitle && (
                  <h2 className="text-xl md:text-2xl font-semibold text-purple-700 italic">
                    "{course.subtitle}"
                  </h2>
                )}

                {course.decree && (
                  <p className="text-sm md:text-base text-gray-500 font-medium whitespace-pre-line">
                    {course.decree}
                  </p>
                )}

                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 whitespace-pre-line">
                  {course.description}
                </p>
              </div>

              {/* Info e pulsanti per layout standard (non CDSA) */}
              {liveData?.code !== 'CDSA' && (
                <>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-gray-600">
                    <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
                      <Clock className="text-purple-600" size={20} />
                      <span className="font-semibold">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
                      <MapPin className="text-pink-600" size={20} />
                      <span className="font-semibold">{course.location}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
                      <Calendar className="text-blue-600" size={20} />
                      <span className="font-semibold">Inizio: {course.startDate}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    {course.type.includes('GOL') ? (
                      <a
                        href="#iscrizione"
                        className="px-8 py-4 rounded-xl text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all text-center"
                        style={{ backgroundColor: '#16a34a' }}
                      >
                        Pre-iscriviti Ora (Gratuito)
                      </a>
                    ) : (
                      <a
                        href="#iscrizione"
                        className={`px-8 py-4 rounded-xl text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-gradient-to-r ${course.gradient}`}
                      >
                        Iscriviti Ora
                      </a>
                    )}
                    <a
                      href="#programma"
                      className="px-8 py-4 rounded-xl bg-white text-gray-800 font-bold text-lg shadow-md border border-gray-200 hover:border-purple-300 hover:text-purple-600 transition-all"
                    >
                      Dettagli Programma
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* Right Column: Hero Image / Carousel */}
            <div className="flex-1 w-full max-w-xl lg:max-w-none">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-tr ${course.gradient} rounded-[2rem] transform rotate-3 opacity-20 blur-lg`}></div>
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                  <CourseCarousel images={course.carouselImages} alt={course.title} />

                  {/* Floating Price Tag */}
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 z-10">
                    <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Costo Corso</div>
                    <div className="text-xl font-bold text-gray-900 flex items-center gap-1">
                      {course.price === 'Gratuito (GOL)' ? (
                        <span className="text-green-600">Gratuito</span>
                      ) : (
                         <span>{course.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info e pulsanti per layout CDSA (sotto l'immagine) */}
              {liveData?.code === 'CDSA' && (
                <div className="mt-10 space-y-4">
                  <div className="flex flex-wrap justify-center gap-4 text-gray-600">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                      <Clock className="text-purple-600" size={18} />
                      <span className="font-medium text-sm">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                      <MapPin className="text-pink-600" size={18} />
                      <span className="font-medium text-sm">{course.location}</span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                      <Calendar className="text-blue-600" size={18} />
                      <span className="font-medium text-sm">Inizio: {course.startDate}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href="#iscrizione"
                      className={`px-6 py-3 rounded-xl text-white font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-gradient-to-r ${course.gradient}`}
                    >
                      Iscriviti Ora
                    </a>
                    <a
                      href="#programma"
                      className="px-6 py-3 rounded-xl bg-white text-gray-800 font-bold text-base shadow-md border border-gray-200 hover:border-purple-300 hover:text-purple-600 transition-all"
                    >
                      Dettagli Programma
                    </a>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section - Only show if stats have real values (not N/A) */}
      {course.stats.employmentRate !== 'N/A' && course.stats.satisfaction !== 'N/A' && (
        <section className="py-12 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">{course.stats.employmentRate}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Occupazione</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600 mb-2">{course.stats.satisfaction}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Soddisfazione</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{course.stats.partnerships}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Partner Aziendali</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">{course.stats.avgSalary}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Stipendio Medio</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sezione Edizioni Disponibili - Visibile nel corpo principale */}
      {liveData && liveData.editions && liveData.editions.length > 1 && (
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: '#f3e8ff' }}>
                <Calendar className="text-purple-600" size={18} />
                <span className="text-purple-700 font-semibold text-sm">{liveData.editions.length} Edizioni Disponibili</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Scegli la Tua Edizione
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Questo corso è disponibile in più edizioni con date e sedi diverse. Scegli quella più adatta alle tue esigenze.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedEditions.map((edition, index) => {
                const isSelected = edition.id === selectedEdition?.id;
                const isSoldOut = edition.badges.sold_out;
                const isAlreadyStarted = edition.badges.already_started;
                const isUnavailable = isSoldOut || isAlreadyStarted;

                // Colori alternati per le card
                const cardColors = [
                  { bg: 'bg-gradient-to-br from-sky-50 to-blue-50', border: 'border-sky-200', accent: '#0284c7' },
                  { bg: 'bg-gradient-to-br from-fuchsia-50 to-pink-50', border: 'border-fuchsia-200', accent: '#c026d3' },
                  { bg: 'bg-gradient-to-br from-emerald-50 to-green-50', border: 'border-emerald-200', accent: '#059669' },
                  { bg: 'bg-gradient-to-br from-amber-50 to-orange-50', border: 'border-amber-200', accent: '#d97706' },
                  { bg: 'bg-gradient-to-br from-violet-50 to-purple-50', border: 'border-violet-200', accent: '#7c3aed' },
                ];
                const cardColor = cardColors[index % cardColors.length];

                return (
                  <div
                    key={edition.id}
                    className={`
                      relative rounded-2xl p-6 border-2 transition-all cursor-pointer
                      ${isSelected ? 'border-purple-500 ring-2 ring-purple-200 shadow-lg' : cardColor.border}
                      ${cardColor.bg}
                      ${isUnavailable ? 'opacity-60' : 'hover:shadow-md hover:scale-[1.02]'}
                    `}
                    onClick={() => !isUnavailable && setSelectedEdition(edition)}
                  >
                    {/* Badge selezionato */}
                    {isSelected && (
                      <div className="absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#6366f1' }}>
                        Selezionata
                      </div>
                    )}

                    {/* Header card */}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        Edizione {edition.edition_number}
                      </h3>
                      {/* Badge stato */}
                      {isSoldOut ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-red-500">
                          Esaurito
                        </span>
                      ) : isAlreadyStarted ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#6b7280' }}>
                          Già iniziato
                        </span>
                      ) : edition.badges.last_spots ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-orange-500 animate-pulse">
                          Ultimi {edition.available_spots} posti!
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: cardColor.accent }}>
                          {edition.available_spots} posti
                        </span>
                      )}
                    </div>

                    {/* Dettagli edizione */}
                    <div className="space-y-3">
                      {/* Data */}
                      <div className="flex items-center gap-3 text-gray-700">
                        <Calendar size={18} style={{ color: cardColor.accent }} />
                        <span className="font-medium">
                          {formatDateIT(edition.start_date)}
                          {edition.end_date && ` - ${formatDateIT(edition.end_date)}`}
                        </span>
                      </div>

                      {/* Sede */}
                      {edition.location && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <MapPin size={18} style={{ color: cardColor.accent }} />
                          <span>{edition.location}</span>
                        </div>
                      )}

                      {/* Docente */}
                      {edition.teacher && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <Award size={18} style={{ color: cardColor.accent }} />
                          <span>{edition.teacher.name}</span>
                        </div>
                      )}

                      {/* Prezzo */}
                      {edition.price !== null && edition.price > 0 && (
                        <div className="flex items-center gap-3 text-gray-700">
                          <Euro size={18} style={{ color: cardColor.accent }} />
                          <span className="font-semibold">€{edition.price.toFixed(2)}</span>
                        </div>
                      )}

                      {/* Deadline */}
                      {edition.enrollment_deadline && edition.is_enrollments_open && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          {edition.days_until_deadline !== null && edition.days_until_deadline <= 7 ? (
                            <div className="flex items-center gap-2 text-amber-600 font-medium animate-pulse">
                              <Clock size={16} />
                              <span>Iscrizioni entro {edition.days_until_deadline} giorni!</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Clock size={16} />
                              <span>Iscrizioni entro: {formatDateIT(edition.enrollment_deadline)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Barra posti */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Posti occupati</span>
                        <span>{edition.enrolled_count}/{edition.max_participants}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min((edition.enrolled_count / edition.max_participants) * 100, 100)}%`,
                            backgroundColor: isSoldOut ? '#ef4444' : edition.badges.last_spots ? '#f97316' : cardColor.accent,
                          }}
                        />
                      </div>
                    </div>

                    {/* CTA */}
                    {!isUnavailable && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEdition(edition);
                          document.getElementById('iscrizione')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="mt-4 w-full py-2.5 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                        style={{ backgroundColor: cardColor.accent }}
                      >
                        Iscriviti a questa edizione
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}


      {/* Main Content Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* Left Content (2/3) */}
            <div className="lg:col-span-2 space-y-12">

              {/* Requirements & Certifications - SPOSTATO SOPRA */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FileCheck className="text-blue-600" size={24} />
                    Requisiti
                  </h3>
                  <ul className="space-y-3">
                    {course.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <CheckCircle2 className="text-blue-500 mt-1 flex-shrink-0" size={18} />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Award className="text-pink-600" size={24} />
                    Certificazioni
                  </h3>
                  <ul className="space-y-3">
                    {course.certifications.map((cert, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <Star className="text-pink-500 mt-1 flex-shrink-0" size={18} />
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Informazioni Importanti - NUOVO BLOCCO (solo se presente) */}
              {course.importantInfo && course.importantInfo.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 shadow-sm border border-amber-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <AlertCircle className="text-amber-600" size={24} />
                    Informazioni Importanti
                  </h3>
                  <ul className="space-y-3">
                    {course.importantInfo.map((info, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <CheckCircle2 className="text-amber-500 mt-1 flex-shrink-0" size={18} />
                        <span className="font-medium">{info}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Modules / Programma */}
              <div id="programma" className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${course.gradient} text-white`}>
                    <BookOpen size={24} />
                  </div>
                  Programma Didattico
                </h2>

                <div className="space-y-6">
                  {course.modules.map((module, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden hover:border-purple-200 transition-colors">
                      <div className="bg-gray-50 px-6 py-4 flex justify-between items-center cursor-default">
                        <h3 className="font-bold text-gray-900">{module.title}</h3>
                        <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                          {module.hours}
                        </span>
                      </div>
                      <div className="px-6 py-4 bg-white">
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {module.topics.map((topic, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendario Lezioni - mostrato solo se ci sono lezioni programmate */}
              {lessons && lessons.length > 0 && (
                <LessonCalendar
                  lessons={lessons}
                  gradient={course.gradient}
                  bgGradient={course.bgGradient}
                />
              )}

              {/* Internship Partners */}
              {course.internshipPartners && (
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Briefcase className="text-emerald-600" size={24} />
                        Aziende di Tirocinio Partner
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {course.internshipPartners.map((partner, idx) => (
                            <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100">
                                {partner}
                            </span>
                        ))}
                    </div>
                  </div>
              )}

              {/* Outcomes & Careers */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="text-emerald-600" size={24} />
                  Sbocchi Professionali
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 uppercase text-sm tracking-wider">Competenze Acquisite</h4>
                    <ul className="space-y-3">
                      {course.outcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <CheckCircle2 className="text-emerald-500 mt-1 flex-shrink-0" size={18} />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 uppercase text-sm tracking-wider">Opportunità di Carriera</h4>
                    <ul className="space-y-3">
                      {course.careers.map((career, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <Briefcase className="text-emerald-500 mt-1 flex-shrink-0" size={18} />
                          <span>{career}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Sidebar (1/3) - Sticky container unico */}
            <div className="lg:sticky lg:top-24 space-y-8">

              {/* Info Card */}
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Informazioni Rapide</h3>
                  <LiveIndicator lastUpdated={lastUpdated} loading={liveLoading} />
                </div>

                {/* Badge dinamici da dati live */}
                {liveData && liveData.badges && (
                  <div className="mb-6">
                    <CourseBadgesDisplay
                      badges={liveData.badges}
                      availableSpots={liveData.available_spots}
                      daysUntilStart={liveData.days_until_start}
                      totalEditions={liveData.total_editions}
                      size="sm"
                    />
                  </div>
                )}

                {/* Lista edizioni (v3.0) - Tab UI */}
                {liveData && liveData.editions && liveData.editions.length > 0 && (
                  <div className="mb-6">
                    <EditionsList
                      editions={liveData.editions}
                      selectedEditionId={selectedEdition?.id}
                      onSelectEdition={(edition) => {
                        setSelectedEdition(edition);
                      }}
                    />
                  </div>
                )}

                {/* Barra posti disponibili live (solo se non ci sono edizioni multiple) */}
                {liveData && liveData.max_participants > 0 && (!liveData.editions || liveData.editions.length === 0) && (
                  <div className="mb-6">
                    <CourseAvailability course={liveData} />
                  </div>
                )}

                {/* Countdown deadline (solo se non ci sono edizioni multiple) */}
                {liveData && liveData.days_until_deadline !== null && liveData.days_until_deadline >= 0 && (!liveData.editions || liveData.editions.length === 0) && (
                  <div className="mb-6">
                    <DeadlineCountdown
                      daysUntilDeadline={liveData.days_until_deadline}
                      deadlineDate={liveData.enrollment_deadline}
                    />
                  </div>
                )}

                {/* Informazioni rapide - usa edizione selezionata */}
                <div className="space-y-6">
                  {/* Indica quale edizione stiamo mostrando */}
                  {selectedEdition && (
                    <div
                      className="text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                      style={{ backgroundColor: '#f3e8ff', color: '#7c3aed' }}
                    >
                      <span>Dati riferiti a:</span>
                      <strong>{displayData.editionName}</strong>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                      <Clock size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Durata</div>
                      <div className="font-semibold text-gray-900">{displayData.duration}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-pink-50 rounded-xl text-pink-600">
                      <Euro size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Prezzo</div>
                      <div className="font-semibold text-gray-900">{displayData.price}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                      <Users size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Posti Disponibili</div>
                      <div className="font-semibold text-gray-900">
                        {displayData.isSoldOut
                          ? <span className="text-red-600">Esaurito</span>
                          : displayData.availableSpots !== undefined
                            ? `${displayData.availableSpots} su ${displayData.maxParticipants}`
                            : 'Limitati'}
                      </div>
                    </div>
                  </div>

                  {/* Data inizio */}
                  {displayData.startDate && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-50 rounded-xl text-green-600">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 font-medium">Data Inizio</div>
                        <div className="font-semibold text-gray-900">
                          {formatDateIT(displayData.startDate)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {displayData.location && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 font-medium">Sede</div>
                        <div className="font-semibold text-gray-900">{displayData.location}</div>
                      </div>
                    </div>
                  )}

                  {/* Docente */}
                  {displayData.teacher && (
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                        <Award size={24} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 font-medium">Docente</div>
                        <div className="font-semibold text-gray-900">{displayData.teacher.name}</div>
                      </div>
                    </div>
                  )}

                  {/* Coordinatore - mostrato solo se pubblicato */}
                  {liveData?.coordinator && (() => {
                    // Determina se usare "Coordinatrice" basandosi sul nome (nomi femminili italiani finiscono spesso in 'a')
                    const name = liveData.coordinator.name;
                    const firstName = name.split(' ')[0].toLowerCase();
                    const isFemale = firstName.endsWith('a') && !['luca', 'nicola', 'andrea'].includes(firstName);
                    const title = isFemale ? 'Coordinatrice' : 'Coordinatore';

                    return (
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
                          <User size={24} />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 font-medium">{title} / Contatti utili</div>
                          <div className="font-semibold text-gray-900">{liveData.coordinator.name}</div>
                          {liveData.coordinator.email && (
                            <a
                              href={`mailto:${liveData.coordinator.email}`}
                              className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 mt-1"
                            >
                              <Mail size={14} />
                              {liveData.coordinator.email}
                            </a>
                          )}
                          {liveData.coordinator.phone && (
                            <a
                              href={`tel:${liveData.coordinator.phone}`}
                              className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 mt-1"
                            >
                              <Phone size={14} />
                              {liveData.coordinator.phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  <hr className="border-gray-100" />

                  <div className="space-y-3">
                    {/* CTA dinamica in base allo stato iscrizioni */}
                    {liveData ? (
                      // Controlla se c'è almeno un'edizione disponibile (non sold_out e non already_started)
                      (() => {
                        const hasAvailableEdition = liveData.editions?.some(
                          ed => ed.is_enrollments_open && !ed.badges.sold_out && !ed.badges.already_started
                        );
                        const canEnroll = hasAvailableEdition || (liveData.is_enrollments_open && !liveData.badges.sold_out && !liveData.badges.already_started);
                        const allStarted = liveData.badges.already_started && !hasAvailableEdition;

                        if (canEnroll) {
                          return course.type.includes('GOL') ? (
                            <Link to={`/iscrizione/${course.id}`} className="w-full block text-center bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">
                              Pre-iscriviti (Gratuito)
                            </Link>
                          ) : (
                            <a href="#iscrizione" className="w-full block text-center bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">
                              Iscriviti Ora
                            </a>
                          );
                        } else if (allStarted) {
                          // Tutte le edizioni già iniziate - mostra "Chiedi info"
                          return (
                            <a
                              href="#contatti"
                              className="w-full block text-center bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors"
                              onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('contatti')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                            >
                              Chiedi informazioni
                            </a>
                          );
                        } else {
                          return (
                            <button disabled className="w-full bg-gray-300 text-gray-500 py-3 rounded-xl font-bold cursor-not-allowed">
                              {liveData.badges.sold_out ? 'Corso Esaurito' : 'Iscrizioni Chiuse'}
                            </button>
                          );
                        }
                      })()
                    ) : (
                      // Fallback se non ci sono dati live
                      course.type.includes('GOL') ? (
                        <Link to={`/iscrizione/${course.id}`} className="w-full block text-center bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors">
                          Pre-iscriviti (Gratuito)
                        </Link>
                      ) : (
                        <a href="#iscrizione" className="w-full block text-center bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">
                          Iscriviti Ora
                        </a>
                      )
                    )}
                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Hai domande?</p>
                        <p className="font-bold text-gray-900">0971.473968</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact Form */}
              <QuickContactForm
                courseId={course.id}
                courseName={course.title}
              />

              {/* FAQ Widget */}
              <div className="bg-purple-900 rounded-3xl p-6 text-white shadow-xl">
                <h3 className="font-bold text-xl mb-4">Domande Frequenti</h3>
                <div className="space-y-4">
                  {course.faq.map((item, idx) => (
                    <div key={idx} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <div className="font-semibold mb-2 text-purple-200">{item.question}</div>
                      <div className="text-sm text-gray-300">{item.answer}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Sezione Testimonianze - Full Width */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CourseTestimonials
            courseCode={liveData?.code || course.id}
            courseName={course.title}
            gradient={course.gradient}
          />
        </div>
      </section>

      {/* Sezione Iscrizione - Integrata con EduPlan */}
      <section id="iscrizione" className={`py-20 bg-gradient-to-br ${course.bgGradient}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className={`inline-block bg-gradient-to-r ${course.gradient} text-white px-6 py-2 rounded-full mb-4`}>
              Iscriviti Ora
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Inizia il Tuo Percorso
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Compila il form per informazioni sul corso. Ti contatteremo subito per tutti i dettagli.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl">
            <EnrollmentForm
              courseId={course.id}
              courseName={course.title}
              onSuccess={(result) => {
                console.log('[CourseDetail] Iscrizione completata:', result);
                // Invalida cache per aggiornare posti disponibili
                invalidateCache();
                // Analytics tracking (opzionale)
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'enrollment_submitted', {
                    course_id: course.id,
                    course_name: course.title,
                  });
                }
              }}
              onError={(error) => {
                console.error('[CourseDetail] Errore iscrizione:', error);
              }}
            />
          </div>
        </div>
      </section>
    </article>
    </>
  );
}