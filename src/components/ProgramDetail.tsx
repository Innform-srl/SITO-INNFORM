import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Award, Users, BookOpen, CheckCircle2,
  TrendingUp, Calendar, MapPin, ChevronRight, Star,
  Briefcase, GraduationCap, Target, Sparkles, Rocket,
  Shield, Zap, Heart, Globe, Clock, Euro, Eye, Accessibility
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRealtimePaths } from '../hooks/useRealtimePaths';
import { PathCourse } from '../services/public-paths-api';
import { SEOHead, CourseSchema } from './SEOHead';

interface Program {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  bgGradient: string;
  heroImage: string;
  galleryImages: string[];
  features: string[];
  benefits: Array<{
    icon: any;
    title: string;
    description: string;
  }>;
  courses: Array<{
    title: string;
    duration: string;
    description: string;
    skills: string[];
    id?: string;
    category?: string;
  }>;
  timeline: Array<{
    phase: string;
    title: string;
    description: string;
    duration: string;
  }>;
  stats: {
    participants: string;
    satisfaction: string;
    placement: string;
    partners: string;
  };
  testimonials: Array<{
    name: string;
    role: string;
    text: string;
    rating: number;
  }>;
}

const programsData: Record<string, Program> = {
  'ti-abilito': {
    id: 'ti-abilito',
    title: 'Progetto TI.ABILITO',
    subtitle: 'Percorsi di Formazione per l\'Abilitazione Professionale',
    description: 'Un programma innovativo che ti prepara ad acquisire competenze professionali certificate, con stage garantito e supporto all\'inserimento lavorativo. Costruisci il tuo futuro con un percorso su misura.',
    gradient: 'from-purple-600 via-purple-500 to-violet-600',
    bgGradient: 'from-purple-50 to-violet-50',
    heroImage: 'https://images.unsplash.com/photo-1664382953518-4a664ab8a8c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjB0cmFpbmluZyUyMGNsYXNzcm9vbXxlbnwxfHx8fDE3NjU0Njg1NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    galleryImages: [
      'https://images.unsplash.com/photo-1664382953518-4a664ab8a8c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjB0cmFpbmluZyUyMGNsYXNzcm9vbXxlbnwxfHx8fDE3NjU0Njg1NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1664382953518-4a664ab8a8c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjB0cmFpbmluZyUyMGNsYXNzcm9vbXxlbnwxfHx8fDE3NjU0Njg1NzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1664382953518-4a664ab8a8c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjB0cmFpbmluZyUyMGNsYXNzcm9vbXxlbnwxfHx8fDE3NjU0Njg1NzB8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    features: ['Certificazione Riconosciuta', 'Stage Garantito in Azienda', 'Supporto Job Placement', 'Tutorship Personalizzata'],
    benefits: [
      {
        icon: GraduationCap,
        title: 'Formazione Certificata',
        description: 'Certificazioni riconosciute a livello nazionale e regionale, valide per l\'inserimento nel mondo del lavoro.'
      },
      {
        icon: Briefcase,
        title: 'Stage in Azienda',
        description: 'Stage garantito presso aziende partner del nostro network, per applicare subito le competenze acquisite.'
      },
      {
        icon: Users,
        title: 'Tutorship Dedicata',
        description: 'Un tutor personale ti accompagna durante tutto il percorso formativo e nella fase di inserimento lavorativo.'
      },
      {
        icon: Target,
        title: 'Obiettivo Occupazione',
        description: 'Supporto attivo nella ricerca del lavoro con CV personalizzato, preparazione colloqui e matching con aziende.'
      }
    ],
    courses: [
      {
        title: 'Operatore Amministrativo Segretariale',
        duration: '300 ore',
        description: 'Diventa un professionista della gestione amministrativa e segretariale con competenze digitali avanzate.',
        skills: ['Gestione documentale', 'Software Office', 'Comunicazione aziendale', 'Organizzazione ufficio']
      },
      {
        title: 'Addetto alla Logistica',
        duration: '250 ore',
        description: 'Specializzati nella gestione logistica, magazzino e movimentazione merci con certificazioni specifiche.',
        skills: ['Gestione magazzino', 'Sistemi WMS', 'Movimentazione merci', 'Sicurezza logistica']
      },
      {
        title: 'Operatore della Ristorazione',
        duration: '280 ore',
        description: 'Impara le tecniche professionali di cucina, sala e gestione ristorativa con focus su HACCP.',
        skills: ['Tecniche di cucina', 'Servizio sala', 'HACCP', 'Menu engineering']
      },
      {
        title: 'Tecnico del Benessere',
        duration: '320 ore',
        description: 'Formazione completa per lavorare nel settore beauty e benessere con certificazioni professionali.',
        skills: ['Trattamenti estetici', 'Massaggi base', 'Cosmetologia', 'Accoglienza cliente']
      }
    ],
    timeline: [
      {
        phase: 'Fase 1',
        title: 'Orientamento e Selezione',
        description: 'Colloquio individuale, valutazione competenze e definizione del percorso personalizzato.',
        duration: '1 settimana'
      },
      {
        phase: 'Fase 2',
        title: 'Formazione Teorica',
        description: 'Lezioni in aula con docenti esperti, materiali didattici e piattaforma e-learning.',
        duration: '8-12 settimane'
      },
      {
        phase: 'Fase 3',
        title: 'Laboratori Pratici',
        description: 'Esercitazioni pratiche in laboratori attrezzati per sviluppare competenze operative.',
        duration: '4-6 settimane'
      },
      {
        phase: 'Fase 4',
        title: 'Stage in Azienda',
        description: 'Tirocinio formativo presso aziende partner per applicare le competenze in contesto reale.',
        duration: '4-8 settimane'
      },
      {
        phase: 'Fase 5',
        title: 'Certificazione e Job Placement',
        description: 'Esame finale, rilascio certificazione e supporto attivo per l\'inserimento lavorativo.',
        duration: '2 settimane'
      }
    ],
    stats: {
      participants: '500+',
      satisfaction: '4.7/5',
      placement: '85%',
      partners: '120+'
    },
    testimonials: [
      {
        name: 'Rosa Botta',
        role: 'Master Tecnico Analisi Alimentari',
        text: 'Ho avuto modo di conoscere docenti, professionisti che hanno presentato e svelato i segreti del loro lavoro con una passione tale da trasmettertela. Il master \u00e8 stato oltre che un impegno, anche un piacere.',
        rating: 5
      },
      {
        name: 'Elvira Ciufo',
        role: 'Master Editoria e Comunicazione',
        text: 'Con i miei colleghi ho viaggiato tra le pagine dell\'editoria e volato tra visite didattiche e fiere. Ed \u00e8 stato proprio nella fiera di Roma che sono stata messa in contatto con "La Corte Editore" per uno stage a Torino.',
        rating: 5
      },
      {
        name: 'Marco Cardilli',
        role: 'Master Safety Manager',
        text: 'La cosa che mi ha incuriosito di questo master \u00e8 il taglio pratico con tante visite in azienda e numerose ore di tirocinio aziendale. Dopo una prima parte d\'aula ci siamo confrontati con la realt\u00e0 locale.',
        rating: 5
      }
    ]
  },
  'progetto-segni': {
    id: 'progetto-segni',
    title: 'Progetto Segni',
    subtitle: 'Formazione Specializzata e Certificazioni di Eccellenza',
    description: 'Percorsi formativi avanzati per acquisire competenze specialistiche certificate. Dalla teoria alla pratica, con focus sull\'eccellenza e networking professionale.',
    gradient: 'from-red-600 via-rose-500 to-pink-600',
    bgGradient: 'from-red-50 to-pink-50',
    heroImage: 'https://images.unsplash.com/photo-1755548413928-4aaeba7c740e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc2hvcCUyMHByYWN0aWNhbCUyMGxlYXJuaW5nfGVufDF8fHx8MTc2NTU1MTA0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    galleryImages: [
      'https://images.unsplash.com/photo-1755548413928-4aaeba7c740e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc2hvcCUyMHByYWN0aWNhbCUyMGxlYXJuaW5nfGVufDF8fHx8MTc2NTU1MTA0MXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1755548413928-4aaeba7c740e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc2hvcCUyMHByYWN0aWNhbCUyMGxlYXJuaW5nfGVufDF8fHx8MTc2NTU1MTA0MXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1755548413928-4aaeba7c740e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc2hvcCUyMHByYWN0aWNhbCUyMGxlYXJuaW5nfGVufDF8fHx8MTc2NTU1MTA0MXww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    features: ['Attestati Professionali', 'Focus su Pratica Operativa', 'Networking tra Professionisti', 'Aggiornamento Continuo'],
    benefits: [
      {
        icon: Award,
        title: 'Certificazioni Premium',
        description: 'Attestati professionali riconosciuti dal settore, che certificano competenze specialistiche di alto livello.'
      },
      {
        icon: Zap,
        title: 'Apprendimento Intensivo',
        description: 'Formazione concentrata ed efficace con focus su casi pratici e learning by doing.'
      },
      {
        icon: Globe,
        title: 'Network Professionale',
        description: 'Accesso a una community di professionisti del settore per scambi, collaborazioni e opportunità.'
      },
      {
        icon: Rocket,
        title: 'Accelerazione Carriera',
        description: 'Competenze avanzate che ti permettono di fare il salto di qualità nella tua carriera professionale.'
      }
    ],
    courses: [
      {
        title: 'Social Media Manager Specialist',
        duration: '120 ore',
        description: 'Diventa un esperto di social media marketing con competenze in strategia, content creation e analytics.',
        skills: ['Strategia social', 'Content creation', 'Advertising', 'Analytics e KPI']
      },
      {
        title: 'Web Design & UX/UI',
        duration: '150 ore',
        description: 'Progetta esperienze digitali efficaci con focus su user experience e interface design.',
        skills: ['Figma & Adobe XD', 'User research', 'Prototyping', 'Design systems']
      },
      {
        title: 'Digital Marketing Specialist',
        duration: '140 ore',
        description: 'Padroneggia le strategie di marketing digitale: SEO, SEM, email marketing e automation.',
        skills: ['SEO/SEM', 'Google Ads', 'Email marketing', 'Marketing automation']
      },
      {
        title: 'Project Management Agile',
        duration: '100 ore',
        description: 'Gestisci progetti complessi con metodologie agile e strumenti di project management.',
        skills: ['Scrum & Kanban', 'Jira & Trello', 'Team leadership', 'Risk management']
      }
    ],
    timeline: [
      {
        phase: 'Fase 1',
        title: 'Assessment Iniziale',
        description: 'Valutazione delle competenze di partenza e definizione degli obiettivi formativi personalizzati.',
        duration: '3 giorni'
      },
      {
        phase: 'Fase 2',
        title: 'Formazione Intensiva',
        description: 'Moduli didattici concentrati con workshop pratici e case study reali del settore.',
        duration: '6-8 settimane'
      },
      {
        phase: 'Fase 3',
        title: 'Project Work',
        description: 'Realizzazione di un progetto applicativo su brief reale per applicare le competenze.',
        duration: '3-4 settimane'
      },
      {
        phase: 'Fase 4',
        title: 'Certificazione',
        description: 'Esame di certificazione e presentazione project work davanti a una commissione di esperti.',
        duration: '1 settimana'
      },
      {
        phase: 'Fase 5',
        title: 'Follow-up e Networking',
        description: 'Eventi di networking, webinar di aggiornamento e accesso permanente alla community.',
        duration: 'Continuo'
      }
    ],
    stats: {
      participants: '350+',
      satisfaction: '4.9/5',
      placement: '78%',
      partners: '90+'
    },
    testimonials: [
      {
        name: 'Nicola Patrissi',
        role: 'Master Editoria e Comunicazione',
        text: 'Il master, caratterizzato dalla perfetta commistione tra le varie, eccezionali competenze dei docenti. La ciliegina sulla torta \u00e8 stata la creazione di gruppo del romanzo giallo "Non sar\u00e0 un\'avventura".',
        rating: 5
      },
      {
        name: 'Barbara Cecchi',
        role: 'Master Tecnico Analisi Alimentari',
        text: 'Il master \u00e8 stato il percorso giusto da intraprendere subito dopo la laurea. Le mie conoscenze astratte della chimica hanno avuto finalmente riscontro pratico grazie ad attivit\u00e0 di laboratorio.',
        rating: 5
      },
      {
        name: 'Giuseppe Canio Matteo',
        role: 'Master Safety Manager',
        text: 'Al termine del percorso sono stato ricontattato dall\'azienda presso la quale avevo svolto lo stage formativo, mi \u00e8 stato proposto di proseguire come Addetto al Servizio di Prevenzione e Protezione.',
        rating: 5
      }
    ]
  },
  'master': {
    id: 'master',
    title: 'Master Tecnici',
    subtitle: 'Alta Formazione Specialistica con Focus Tecnico-Scientifico',
    description: 'Master di alta formazione per diventare esperti in settori tecnici e scientifici. Laboratori all\'avanguardia, docenti qualificati e certificazioni professionali riconosciute.',
    gradient: 'from-pink-600 via-fuchsia-500 to-purple-600',
    bgGradient: 'from-pink-50 to-purple-50',
    heroImage: 'https://images.unsplash.com/photo-1761095596584-34731de3e568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjBlcXVpcG1lbnQlMjBsYWJvcmF0b3J5fGVufDF8fHx8MTc2NTQ3OTI1N3ww&ixlib=rb-4.1.0&q=80&w=1080',
    galleryImages: [
      'https://images.unsplash.com/photo-1761095596584-34731de3e568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjBlcXVpcG1lbnQlMjBsYWJvcmF0b3J5fGVufDF8fHx8MTc2NTQ3OTI1N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1761095596584-34731de3e568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjBlcXVpcG1lbnQlMjBsYWJvcmF0b3J5fGVufDF8fHx8MTc2NTQ3OTI1N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1761095596584-34731de3e568?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjBlcXVpcG1lbnQlMjBsYWJvcmF0b3J5fGVufDF8fHx8MTc2NTQ3OTI1N3ww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    features: ['Alta Formazione Tecnica', 'Laboratori Professionali', 'Certificazioni Nazionali', 'Docenti Qualificati'],
    benefits: [
      {
        icon: Sparkles,
        title: 'Eccellenza Tecnica',
        description: 'Formazione di alto livello con standard professionali e accademici riconosciuti nel settore.'
      },
      {
        icon: Shield,
        title: 'Laboratori Certificati',
        description: 'Accesso a laboratori professionali dotati di strumentazione all\'avanguardia e certificati ISO.'
      },
      {
        icon: BookOpen,
        title: 'Competenze Avanzate',
        description: 'Sviluppo di competenze tecniche e scientifiche di livello avanzato, immediatamente spendibili.'
      },
      {
        icon: Star,
        title: 'Riconoscimento Professionale',
        description: 'Titoli e certificazioni che aprono le porte a carriere qualificate e ben remunerate.'
      }
    ],
    courses: [
      {
        title: 'Tecnico Esperto in Analisi Alimentari e Ambientali',
        duration: '400 ore',
        description: 'Master completo per diventare esperto in analisi chimiche e microbiologiche nel settore food e ambiente.',
        skills: ['Analisi chimiche', 'Microbiologia', 'HACCP avanzato', 'Tecniche strumentali'],
        id: 'tecnico-esperto-in-analisi-alimentari-e-ambientali'
      },
      {
        title: 'Master in Editoria e Comunicazione',
        duration: '350 ore',
        description: 'Formazione completa su editoria digitale, content management e strategie di comunicazione.',
        skills: ['Editoria digitale', 'Content strategy', 'SEO copywriting', 'Publishing workflow'],
        id: 'editoria-e-comunicazione'
      },
      {
        title: 'Safety Manager',
        duration: '300 ore',
        description: 'Diventa esperto in sicurezza sul lavoro con competenze in normative, risk assessment e gestione emergenze.',
        skills: ['Normative sicurezza', 'Risk assessment', 'DVR', 'Gestione emergenze'],
        id: 'master-safety'
      }
    ],
    timeline: [
      {
        phase: 'Fase 1',
        title: 'Fondamenti Teorici',
        description: 'Acquisizione delle basi teoriche e scientifiche necessarie per la comprensione della disciplina.',
        duration: '10-12 settimane'
      },
      {
        phase: 'Fase 2',
        title: 'Formazione Avanzata',
        description: 'Approfondimento con tecniche avanzate, normative specifiche e casi applicativi complessi.',
        duration: '8-10 settimane'
      },
      {
        phase: 'Fase 3',
        title: 'Laboratorio Intensivo',
        description: 'Esercitazioni pratiche in laboratori professionali con strumentazione certificata.',
        duration: '6-8 settimane'
      },
      {
        phase: 'Fase 4',
        title: 'Stage Professionalizzante',
        description: 'Tirocinio presso enti, aziende o laboratori partner per esperienza sul campo.',
        duration: '6-8 settimane'
      },
      {
        phase: 'Fase 5',
        title: 'Esame e Certificazione',
        description: 'Esame finale con commissione di esperti e rilascio certificazione professionale.',
        duration: '2 settimane'
      }
    ],
    stats: {
      participants: '280+',
      satisfaction: '4.8/5',
      placement: '92%',
      partners: '75+'
    },
    testimonials: [
      {
        name: 'Maria Salinardi',
        role: 'Master Tecnico Analisi Alimentari',
        text: 'Gli argomenti come Certificazioni ISO, Sicurezza Alimentare, Gestione Qualit\u00e0 e Sviluppo di un Manuale HACCP, proprio quelli richiesti nei tanti annunci a cui mi ero candidata. Felice della scelta fatta e che rifarei ad occhi chiusi.',
        rating: 5
      },
      {
        name: 'Donato Galasso',
        role: 'Master Safety Manager',
        text: 'Grazie ad Innform, alle certificazioni che il master mi ha rilasciato e ai contatti che Innform ha con Aziende su tutto il territorio nazionale oggi lavoro presso RINA Services SpA.',
        rating: 5
      },
      {
        name: 'Tiziana Figliuolo',
        role: 'Master Editoria e Comunicazione',
        text: 'Master bellissimo, perfetta prosecuzione del mio percorso di studi. Ho fatto cose nuove, con piccole e grandi soddisfazioni e con incredibili possibilit\u00e0, come realizzare un inserto digitale per Il Mattino.',
        rating: 5
      }
    ]
  },
  'specializzazione': {
    id: 'specializzazione',
    title: 'Corsi di Specializzazione',
    subtitle: 'Formazione Avanzata per Professionisti del Turismo Accessibile',
    description: 'Percorsi formativi specializzati per professionisti che vogliono acquisire competenze avanzate nell\'accessibilità culturale e nel turismo inclusivo. Laboratori esperienziali e attestati di specializzazione riconosciuti.',
    gradient: 'from-teal-600 via-cyan-500 to-teal-600',
    bgGradient: 'from-teal-50 to-cyan-50',
    heroImage: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=1080',
    galleryImages: [
      'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1569930784237-ea65a528f64f?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1544979590-37e9b47eb705?auto=format&fit=crop&q=80&w=1080'
    ],
    features: ['Attestato Specializzazione', 'Laboratori Esperienziali', 'Competenze Avanzate', 'Formazione Blended'],
    benefits: [
      {
        icon: Eye,
        title: 'Accessibilità Culturale',
        description: 'Competenze per rendere l\'arte e la cultura accessibili a tutti, incluse persone con disabilità visive.'
      },
      {
        icon: Heart,
        title: 'Comunicazione Empatica',
        description: 'Tecniche di comunicazione inclusiva e costruzione di relazioni autentiche con persone non vedenti.'
      },
      {
        icon: Sparkles,
        title: 'Esperienze Multisensoriali',
        description: 'Progettazione di percorsi che coinvolgono tutti i sensi: tatto, udito, olfatto e gusto.'
      },
      {
        icon: Award,
        title: 'Certificazione Riconosciuta',
        description: 'Attestato di specializzazione che certifica le competenze acquisite nel turismo accessibile.'
      }
    ],
    courses: [
      {
        title: 'Specializzazione Guide Turistiche - Turismo Accessibile',
        duration: '50 ore',
        description: 'Corso per guide turistiche specializzate nell\'accompagnamento di visitatori non vedenti e ipovedenti presso musei, monumenti e siti culturali.',
        skills: ['Psicologia disabilità visiva', 'Sistema Braille', 'Audio-descrizione', 'Materiali tattili'],
        category: 'Specializzazione',
        id: 'corso-di-specializzazione-alle-guide-turistiche'
      },
      {
        title: 'Corso AI - Intelligenza Artificiale',
        duration: '20 ore',
        description: 'Corso di specializzazione sull\'Intelligenza Artificiale: concetti fondamentali, applicazioni pratiche e strumenti AI per il business e la produttività.',
        skills: ['Fondamenti AI', 'Prompt Engineering', 'Strumenti AI', 'Automazione'],
        category: 'Specializzazione',
        id: 'corso-ai'
      }
    ],
    timeline: [
      {
        phase: 'Fase 1',
        title: 'Formazione Online',
        description: 'Moduli teorici su psicologia della disabilità visiva, Sistema Braille, comunicazione e tecniche di descrizione.',
        duration: '30 ore'
      },
      {
        phase: 'Fase 2',
        title: 'Laboratori in Presenza',
        description: 'Workshop esperienziali a Matera: materiali tattili, accoglienza, "Toccare la Bellezza" e itinerari sensoriali.',
        duration: '20 ore'
      },
      {
        phase: 'Fase 3',
        title: 'Certificazione',
        description: 'Consegna esercitazioni finali e rilascio attestato di specializzazione in Turismo Accessibile per Non Vedenti.',
        duration: '1 settimana'
      }
    ],
    stats: {
      participants: '50+',
      satisfaction: '4.9/5',
      placement: 'N/A',
      partners: '10+'
    },
    testimonials: [
      {
        name: 'Michela Di Melfi',
        role: 'Master Editoria e Comunicazione',
        text: 'Questo master apre realmente le porte dell\'editoria e della comunicazione, facendoti toccare con mano la realt\u00e0 di questi due mondi. L\'approccio pratico ti spinge a metterti alla prova.',
        rating: 5
      },
      {
        name: 'Giovanni Lavaia',
        role: 'Master Tecnico Analisi Alimentari',
        text: 'Il master mi ha dato la possibilit\u00e0 di creare un rapporto con i docenti e professionisti del settore. Quello che inizialmente era uno stage si \u00e8 trasformato in un contratto di lavoro.',
        rating: 5
      },
      {
        name: 'Marco Cardilli',
        role: 'Master Safety Manager',
        text: 'La cosa che mi ha incuriosito di questo master \u00e8 il taglio pratico con tante visite in azienda e numerose ore di tirocinio aziendale. Esperienza che consiglio di fare.',
        rating: 5
      }
    ]
  },
  'gol': {
    id: 'gol',
    title: 'Programma GOL',
    subtitle: 'Garanzia di Occupabilità dei Lavoratori',
    description: 'Il programma nazionale per il reinserimento lavorativo e l\'upskilling professionale. Percorsi gratuiti finanziati per aumentare le tue opportunità di occupazione.',
    gradient: 'from-blue-600 via-cyan-500 to-teal-600',
    bgGradient: 'from-blue-50 to-teal-50',
    heroImage: 'https://images.unsplash.com/photo-1758518730162-09a142505bfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb2IlMjBpbnRlcnZpZXclMjBjYXJlZXJ8ZW58MXx8fHwxNzY1NTUxMDQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    galleryImages: [
      'https://images.unsplash.com/photo-1758518730162-09a142505bfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb2IlMjBpbnRlcnZpZXclMjBjYXJlZXJ8ZW58MXx8fHwxNzY1NTUxMDQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1758518730162-09a142505bfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb2IlMjBpbnRlcnZpZXclMjBjYXJlZXJ8ZW58MXx8fHwxNzY1NTUxMDQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1758518730162-09a142505bfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb2IlMjBpbnRlcnZpZXclMjBjYXJlZXJ8ZW58MXx8fHwxNzY1NTUxMDQyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    features: ['Formazione Gratuita', 'Tutorship Continua', 'Monitoraggio Personalizzato', 'Inserimento Garantito'],
    benefits: [
      {
        icon: Heart,
        title: 'Percorso Personalizzato',
        description: 'Un percorso formativo su misura basato sulle tue competenze, esperienze e obiettivi professionali.'
      },
      {
        icon: Users,
        title: 'Accompagnamento Continuo',
        description: 'Tutor dedicato che ti segue in ogni fase: dalla formazione al placement, fino all\'inserimento in azienda.'
      },
      {
        icon: TrendingUp,
        title: 'Upskilling & Reskilling',
        description: 'Acquisisci nuove competenze o riqualificati professionalmente per settori in crescita.'
      },
      {
        icon: Target,
        title: 'Obiettivo Lavoro',
        description: 'Matching con aziende del territorio, preparazione ai colloqui e supporto fino all\'assunzione.'
      }
    ],
    courses: [
      {
        title: 'Tecnico Esperto per lo Sviluppo Turistico Territoriale',
        duration: '500 ore',
        description: 'Elaborazione e progettazione di piani di sviluppo del territorio, definizione dell\'offerta turistica, ideazione itinerari e pacchetti, strategie di valorizzazione e promozione.',
        skills: ['Marketing Territoriale', 'Pianificazione Turistica', 'Valorizzazione risorse', 'Promozione'],
        category: 'Reskilling',
        id: 'tecnico-esperto-per-lo-sviluppo-turistico-territoriale'
      },
      {
        title: 'Tecnico del Sistema Educativo per la Prima Infanzia',
        duration: '600 ore',
        description: 'Progettazione di attività educative e ludiche, monitoraggio della salute e del benessere, applicazione delle procedure di cura e gestione dei rapporti con i genitori.',
        skills: ['Pedagogia', 'Cura infanzia', 'Progettazione educativa', 'Laboratori creativi'],
        category: 'Reskilling',
        id: 'tecnico-del-sistema-educativo-per-la-prima-infanzia'
      },
      {
        title: 'Operatore della Tornitura',
        duration: '600 ore',
        description: 'Lavorazione dei metalli utilizzando il tornio, sia tradizionale che a controllo numerico computerizzato (CNC). Lettura disegno meccanico, lavorazioni complesse, regolazioni.',
        skills: ['Tornitura tradizionale', 'Tornitura CNC', 'Disegno meccanico', 'Controllo qualità'],
        category: 'Reskilling',
        id: 'operatore-della-tornitura'
      },
      {
        title: 'Operatore H2S e Sicurezza',
        duration: '600 ore',
        description: 'Sicurezza industriale con focus sulla gestione dei rischi connessi all\'esposizione all\'idrogeno solforato (H2S). Misure preventive, apparecchiature rilevamento, gestione DPI.',
        skills: ['Gestione rischio H2S', 'Rilevamento gas', 'DPI e APVR', 'Gestione emergenze'],
        category: 'Reskilling',
        id: 'operatore-h2s-e-sicurezza'
      },
      {
        title: 'Operatore di Panificazione e Produzione di Paste',
        duration: '600 ore',
        description: 'Preparazione di vari tipi di impasti, lievitazione, cottura e confezionamento dei prodotti nell\'ambito della produzione di pasta e prodotti da forno.',
        skills: ['Lavorazione Impasti', 'Gestione Lievitazione', 'Cottura Prodotti', 'Confezionamento'],
        category: 'Reskilling',
        id: 'operatore-di-panificazione-e-produzione-di-paste'
      },
      {
        title: 'Competenze Digitali',
        duration: '60 ore',
        description: 'Competenze digitali essenziali per il mondo del lavoro: utilizzo computer, navigazione internet, gestione strumenti di produttività e comunicazione digitale.',
        skills: ['Utilizzo PC', 'Navigazione Web', 'Suite Office', 'Email e PEC'],
        category: 'Upskilling',
        id: 'competenze-digitali'
      },
      {
        title: 'Pubblicità e Comunicazione Digitale',
        duration: '100 ore',
        description: 'Competenze teorico-pratiche nella comunicazione d\'impresa e pubblicità, dai fondamenti di marketing alla gestione di campagne social media e content creation.',
        skills: ['Social Media Marketing', 'Digital Advertising', 'Content Creation', 'Analisi Dati'],
        category: 'Upskilling',
        id: 'pubblicita-e-comunicazione-digitale'
      }
    ],
    timeline: [
      {
        phase: 'Fase 1',
        title: 'Presa in Carico',
        description: 'Colloquio orientativo, analisi competenze e definizione del patto di servizio personalizzato.',
        duration: '1 settimana'
      },
      {
        phase: 'Fase 2',
        title: 'Orientamento Specialistico',
        description: 'Bilancio di competenze, career counseling e identificazione del percorso formativo più adatto.',
        duration: '2 settimane'
      },
      {
        phase: 'Fase 3',
        title: 'Formazione',
        description: 'Corso di formazione professionale con attività teoriche, pratiche e visite aziendali.',
        duration: '12-16 settimane'
      },
      {
        phase: 'Fase 4',
        title: 'Tirocinio Aziendale',
        description: 'Esperienza pratica in azienda con accompagnamento del tutor e monitoraggio continuo.',
        duration: '8-12 settimane'
      },
      {
        phase: 'Fase 5',
        title: 'Placement e Follow-up',
        description: 'Supporto attivo nella ricerca lavoro, matching con aziende e follow-up post inserimento.',
        duration: '4 settimane + 6 mesi'
      }
    ],
    stats: {
      participants: '650+',
      satisfaction: '4.6/5',
      placement: '87%',
      partners: '150+'
    },
    testimonials: [
      {
        name: 'Giovanni Lavaia',
        role: 'Master Tecnico Analisi Alimentari',
        text: 'Il master mi ha dato la possibilit\u00e0 di creare un rapporto con i docenti e professionisti del settore. Quello che inizialmente era uno stage si \u00e8 trasformato in un contratto di lavoro.',
        rating: 5
      },
      {
        name: 'Donato Galasso',
        role: 'Master Safety Manager',
        text: 'Grazie ad Innform, alle certificazioni che il master mi ha rilasciato e ai contatti che Innform ha con Aziende su tutto il territorio nazionale oggi lavoro presso RINA Services SpA.',
        rating: 5
      },
      {
        name: 'Stefania Ianniello',
        role: 'Master Editoria e Comunicazione',
        text: 'Ben articolato il piano di studi, tra aula, sviluppo di progetti e visite. Ha fatto la differenza il modulo di personal branding e orientamento. Innform \u00e8 stato attento alle nostre esigenze.',
        rating: 5
      }
    ]
  }
};

// Mappa programId (URL) → codice percorso API
const programIdToPathCode: Record<string, string> = {
  'master': 'MS',
  'gol': 'GOL',
  'specializzazione': 'SPEC',
};

// Funzione per generare slug dal titolo del corso (uguale a quella usata in CourseDetail)
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // rimuove accenti
    .replace(/[^a-z0-9\s-]/g, '')    // rimuove caratteri speciali
    .replace(/\s+/g, '-')            // spazi → trattini
    .replace(/-+/g, '-')             // trattini multipli → singolo
    .trim();
}

export function ProgramDetail() {
  const { programId } = useParams<{ programId: string }>();
  const program = programId ? programsData[programId] : null;
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  // Fetch percorsi dall'API con Realtime
  const { paths, loading: pathsLoading } = useRealtimePaths();

  // Trova il percorso corrispondente dall'API
  const pathCode = programId ? programIdToPathCode[programId] : null;
  const apiPath = useMemo(() => {
    if (!pathCode || !paths.length) return null;
    return paths.find(p => p.code === pathCode) || null;
  }, [pathCode, paths]);

  // Mappa codici corso -> dati statici completi per GOL
  const golCourseDataByCode: Record<string, { duration: string; description: string; skills: string[]; category: 'Upskilling' | 'Reskilling'; slug?: string }> = {
    'GOL-COMDIG': {
      duration: '60 ore',
      description: 'Competenze digitali essenziali per il mondo del lavoro: utilizzo computer, navigazione internet, gestione strumenti di produttività e comunicazione digitale.',
      skills: ['Utilizzo PC', 'Navigazione Web', 'Suite Office', 'Email e PEC'],
      category: 'Upskilling',
      slug: 'competenze-digitali'
    },
    'Upskilling-CDP1': {
      duration: '100 ore',
      description: 'Competenze teorico-pratiche nella comunicazione d\'impresa e pubblicità, dai fondamenti di marketing alla gestione di campagne social media e content creation.',
      skills: ['Social Media Marketing', 'Digital Advertising', 'Content Creation', 'Analisi Dati'],
      category: 'Upskilling',
      slug: 'pubblicita-comunicazione'
    },
    'GOL-TEPL': {
      duration: '500 ore',
      description: 'Elaborazione e progettazione di piani di sviluppo del territorio, definizione dell\'offerta turistica, ideazione itinerari e pacchetti, strategie di valorizzazione e promozione.',
      skills: ['Marketing Territoriale', 'Pianificazione Turistica', 'Valorizzazione risorse', 'Promozione'],
      category: 'Reskilling',
      slug: 'tecnico-esperto-per-lo-sviluppo-turistico-territoriale'
    },
    'OTDS': {
      duration: '600 ore',
      description: 'Progettazione di attività educative e ludiche, monitoraggio della salute e del benessere, applicazione delle procedure di cura e gestione dei rapporti con i genitori.',
      skills: ['Pedagogia', 'Cura infanzia', 'Progettazione educativa', 'Laboratori creativi'],
      category: 'Reskilling',
      slug: 'sistema-educativo-infanzia'
    },
    'Tor': {
      duration: '600 ore',
      description: 'Lavorazione dei metalli utilizzando il tornio, sia tradizionale che a controllo numerico computerizzato (CNC). Lettura disegno meccanico, lavorazioni complesse, regolazioni.',
      skills: ['Tornitura tradizionale', 'Tornitura CNC', 'Disegno meccanico', 'Controllo qualità'],
      category: 'Reskilling',
      slug: 'operatore-tornitura'
    },
    'GOL-OHES': {
      duration: '600 ore',
      description: 'Sicurezza industriale con focus sulla gestione dei rischi connessi all\'esposizione all\'idrogeno solforato (H2S). Misure preventive, apparecchiature rilevamento, gestione DPI.',
      skills: ['Gestione rischio H2S', 'Rilevamento gas', 'DPI e APVR', 'Gestione emergenze'],
      category: 'Reskilling',
      slug: 'operatore-h2s-e-sicurezza'
    },
    'GOL-ODPE': {
      duration: '600 ore',
      description: 'Preparazione di vari tipi di impasti, lievitazione, cottura e confezionamento dei prodotti nell\'ambito della produzione di pasta e prodotti da forno.',
      skills: ['Lavorazione Impasti', 'Gestione Lievitazione', 'Cottura Prodotti', 'Confezionamento'],
      category: 'Reskilling',
      slug: 'operatore-della-panificazione-e-della-produzione-di-paste'
    },
  };

  // Funzione per ottenere dati statici di un corso GOL per codice
  const getGolCourseData = (course: PathCourse) => {
    if (course.code && golCourseDataByCode[course.code]) {
      return golCourseDataByCode[course.code];
    }
    return null;
  };

  // Funzione per determinare la categoria di un corso GOL
  const getGolCourseCategory = (course: PathCourse): 'Upskilling' | 'Reskilling' => {
    const staticData = getGolCourseData(course);
    if (staticData) {
      return staticData.category;
    }
    // Fallback: corsi brevi (<=100 ore) sono Upskilling, altrimenti Reskilling
    if (course.duration_hours <= 100) {
      return 'Upskilling';
    }
    return 'Reskilling';
  };

  // Mappa slug -> dati statici per merge con API
  const staticCoursesMap = useMemo(() => {
    const map: Record<string, (typeof programsData)['gol']['courses'][0]> = {};
    if (program?.courses) {
      program.courses.forEach(c => {
        if (c.id) map[c.id] = c;
      });
    }
    return map;
  }, [program?.courses]);

  // Converti i corsi dall'API nel formato usato dalla UI, con merge dai dati statici
  const apiCourses = useMemo(() => {
    if (!apiPath?.courses) return [];

    return apiPath.courses.map((course: PathCourse) => {
      const slug = course.website_slug || generateSlug(course.title);
      const staticData = staticCoursesMap[slug];
      // Per i corsi GOL, usa lookup per codice corso
      const codeData = pathCode === 'GOL' ? getGolCourseData(course) : null;

      // Usa dati statici come fonte principale se disponibili
      return {
        title: course.title,
        // Preferisci ore dai dati per codice (GOL), poi statici, poi API
        duration: codeData?.duration || staticData?.duration || `${course.duration_hours} ore`,
        description: codeData?.description || staticData?.description || '',
        skills: codeData?.skills || staticData?.skills || [] as string[],
        id: codeData?.slug || slug,
        code: course.code,
        category: codeData?.category || staticData?.category || (pathCode === 'GOL'
          ? getGolCourseCategory(course)
          : pathCode === 'SPEC'
            ? 'Specializzazione'
            : undefined),
      };
    });
  }, [apiPath, pathCode, staticCoursesMap]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center p-12">
          <div className="text-8xl mb-6 animate-bounce-in">🎯</div>
          <h1 className="text-4xl mb-4 animate-fade-in-blur">Programma non trovato</h1>
          <p className="text-xl text-gray-600 mb-8 animate-fade-in-blur delay-200">Il programma che stai cercando non esiste.</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-slide-in-up delay-300"
          >
            <ArrowLeft size={20} />
            Torna alla home
          </Link>
        </div>
      </div>
    );
  }

  // Meta description SEO ottimizzate per programma
  const getSeoDescription = (id: string, baseDescription: string): string => {
    const seoDescriptions: Record<string, string> = {
      'master': `Master alta formazione post-laurea a Potenza con stage garantito e 92% placement. Laboratori certificati, docenti qualificati e certificazioni professionali riconosciute in Basilicata.`,
      'gol': `Corsi gratuiti per disoccupati in Basilicata con Programma GOL finanziato PNRR. Indennità di frequenza, qualifica professionale riconosciuta e supporto al reinserimento lavorativo.`,
      'specializzazione': `Corsi specializzazione turismo accessibile a Matera e Potenza. Formazione Intelligenza Artificiale, guide turistiche per non vedenti. Attestati riconosciuti Regione Basilicata.`,
      'ti-abilito': `Programma TI.ABILITO: corsi qualifica professionale gratuiti in Basilicata con stage garantito in azienda. Operatore amministrativo, logistica, ristorazione. 85% placement lavorativo.`,
      'progetto-segni': `Progetto Segni: certificazioni professionali digital marketing, UX design, data analytics a Potenza. Formazione pratica con networking e opportunità di carriera.`
    };
    return seoDescriptions[id] || baseDescription;
  };

  return (
    <>
      <SEOHead
        title={`${program.title} - Programma Formazione Professionale Potenza`}
        description={getSeoDescription(programId || '', program.description)}
        image={program.heroImage}
        url={`/programmi/${programId}`}
      />
      <CourseSchema
        name={program.title}
        description={program.description}
        provider="Innform"
        url={`/programmi/${programId}`}
        image={program.heroImage}
        educationalLevel="Formazione Professionale"
      />
    <div className="min-h-screen bg-white">
      {/* Hero Section with Advanced Animations */}
      <section className={`relative bg-gradient-to-br ${program.bgGradient} overflow-hidden min-h-[600px] flex items-center`}>
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 opacity-30">
          <div className={`absolute top-20 left-10 w-96 h-96 bg-gradient-to-br ${program.gradient} rounded-full mix-blend-multiply filter blur-3xl animate-magnetic-float`}></div>
          <div className={`absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br ${program.gradient} rounded-full mix-blend-multiply filter blur-3xl animate-float-delayed`}></div>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br ${program.gradient} rounded-full mix-blend-multiply filter blur-3xl animate-morph`}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          {/* Breadcrumb */}
          <div className="mb-8 animate-slide-in-down">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span>Torna ai programmi</span>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className={`inline-block bg-gradient-to-r ${program.gradient} text-white px-6 py-3 rounded-full animate-bounce-in shadow-lg`}>
                <span className="flex items-center gap-2">
                  <Sparkles size={20} />
                  Programma Formativo
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl leading-tight animate-slide-in-left">
                <span className="text-gradient-animate">{program.title}</span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-gray-700 animate-slide-in-left delay-200">
                {program.subtitle}
              </p>
              
              <p className="text-xl text-gray-600 leading-relaxed animate-fade-in-blur delay-300">
                {program.description}
              </p>

              {/* Features Pills */}
              <div className="flex flex-wrap gap-3 animate-slide-in-up delay-400">
                {program.features.map((feature, idx) => (
                  <div 
                    key={idx} 
                    className={`bg-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover-lift delay-${idx * 100}`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={18} className={`bg-gradient-to-r ${program.gradient} bg-clip-text text-transparent`} />
                      <span className="text-sm">{feature}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-in-up delay-500">
                <a 
                  href="#corsi"
                  className={`group bg-gradient-to-r ${program.gradient} text-white px-10 py-5 rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg text-center flex items-center justify-center gap-2 relative overflow-hidden animate-glass-reflection`}
                >
                  <Rocket size={24} className="group-hover:rotate-12 transition-transform" />
                  <span>Scopri i Corsi</span>
                </a>
                <a 
                  href="#contatti"
                  className="bg-white text-gray-800 border-2 border-gray-300 px-10 py-5 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all duration-300 text-center flex items-center justify-center gap-2 hover-lift"
                >
                  <BookOpen size={24} />
                  <span>Richiedi Info</span>
                </a>
              </div>
            </div>

            <div className="hidden lg:block animate-scale-in delay-300">
              <div className="relative animate-tilt">
                <div className={`absolute inset-0 bg-gradient-to-br ${program.gradient} rounded-3xl transform rotate-6 opacity-20 animate-pulse-glow`}></div>
                <div className={`absolute inset-0 bg-gradient-to-br ${program.gradient} rounded-3xl transform -rotate-3 opacity-10`}></div>
                <ImageWithFallback
                  src={program.heroImage}
                  alt={`${program.title} - Corso formazione professionale accreditato a Potenza, Basilicata`}
                  className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover animate-glow-pulse"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section className="py-16 bg-white" data-animate id="stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: 'Partecipanti', value: program.stats.participants, icon: Users, color: 'from-purple-600 to-purple-400' },
              { label: 'Soddisfazione', value: program.stats.satisfaction, icon: Star, color: 'from-yellow-600 to-yellow-400' },
              { label: 'Placement', value: program.stats.placement, icon: TrendingUp, color: 'from-green-600 to-green-400' },
              { label: 'Partner', value: program.stats.partners, icon: Globe, color: 'from-blue-600 to-blue-400' }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx} 
                  className={`text-center p-8 rounded-2xl bg-gradient-to-br ${program.bgGradient} transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl animate-bounce-in delay-${idx * 100}`}
                >
                  <div className={`bg-gradient-to-br ${stat.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-float`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <div className="text-5xl mb-2 text-gradient-animate">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`py-20 bg-gradient-to-br ${program.bgGradient}`} data-animate id="benefits">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-in-down">
            <div className={`inline-block bg-gradient-to-r ${program.gradient} text-white px-6 py-2 rounded-full mb-4`}>
              Vantaggi del Programma
            </div>
            <h2 className="text-4xl md:text-5xl mb-4">
              Perché Scegliere Questo Percorso
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {program.benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={idx} 
                  className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-in-up delay-${idx * 100}`}
                >
                  <div className="flex items-start gap-6">
                    <div className={`bg-gradient-to-br ${program.gradient} p-4 rounded-xl flex-shrink-0 shadow-lg animate-float`}>
                      <Icon size={32} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl mb-3">{benefit.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 bg-white" data-animate id="corsi">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Loading state per corsi da API */}
          {pathsLoading && pathCode && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Caricamento corsi...</p>
            </div>
          )}

          {/* Usa corsi dall'API se disponibili per i percorsi (master, gol, specializzazione) */}
          {(() => {
            // Per i programmi con percorso API, usa apiCourses; altrimenti usa i dati statici
            const coursesToShow = pathCode && apiCourses.length > 0 ? apiCourses : program.courses;

            return (
              <>
                {/* Corsi di Specializzazione */}
                {coursesToShow.some(c => c.category === 'Specializzazione') && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div style={{ width: '6px', height: '40px', background: 'linear-gradient(to bottom, #0d9488, #06b6d4)', borderRadius: '4px' }}></div>
                <h2 className="text-3xl font-bold text-gray-900">Corsi di Specializzazione</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {coursesToShow.filter(c => c.category === 'Specializzazione').map((course, idx) => (
                  <Link
                    key={idx}
                    to={course.id ? `/corsi/${course.id}` : '#'}
                    className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-teal-100"
                  >
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                          {course.duration}
                        </div>
                        <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-teal-600 border border-teal-200">
                          Specializzazione
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-teal-700">{course.title}</h3>
                      {course.description && (
                        <p className="text-gray-700 mb-6 leading-relaxed">{course.description}</p>
                      )}

                      {course.skills && course.skills.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm uppercase tracking-wide text-gray-500 mb-3">Competenze</div>
                          <div className="flex flex-wrap gap-2">
                            {course.skills.map((skill, skillIdx) => (
                              <span
                                key={skillIdx}
                                className="bg-white px-4 py-2 rounded-lg text-sm shadow-md border border-teal-100"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-6 text-teal-600 font-semibold">
                        <span>Scopri il corso</span>
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Percorsi Upskilling */}
          {coursesToShow.some(c => c.category === 'Upskilling') && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div style={{ width: '6px', height: '40px', background: 'linear-gradient(to bottom, #06b6d4, #0891b2)', borderRadius: '4px' }}></div>
                <h2 className="text-3xl font-bold text-gray-900">Percorsi Upskilling</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {coursesToShow.filter(c => c.category === 'Upskilling').map((course, idx) => {
                  // Trova durata dal mapping per codice se disponibile
                  const upskillDuration = course.duration ||
                    (course.code && golCourseDataByCode[course.code]?.duration) ||
                    '';
                  return (
                  <Link
                    key={idx}
                    to={course.id ? `/corsi/${course.id}` : '#'}
                    className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-cyan-100"
                  >
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        {upskillDuration && (
                        <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                          {upskillDuration}
                        </div>
                        )}
                        <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-600 border border-gray-200">
                          Upskilling
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-teal-700">{course.title}</h3>
                      {course.description && (
                        <p className="text-gray-700 mb-6 leading-relaxed">{course.description}</p>
                      )}

                      {course.skills && course.skills.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm uppercase tracking-wide text-gray-500 mb-3">Competenze</div>
                          <div className="flex flex-wrap gap-2">
                            {course.skills.map((skill, skillIdx) => (
                              <span
                                key={skillIdx}
                                className="bg-white px-4 py-2 rounded-lg text-sm shadow-md border border-gray-100"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-6 text-cyan-600 font-semibold">
                        <span>Scopri il corso</span>
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Percorsi Reskilling */}
          {coursesToShow.some(c => c.category === 'Reskilling') && (
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div style={{ width: '6px', height: '40px', background: 'linear-gradient(to bottom, #3b82f6, #1d4ed8)', borderRadius: '4px' }}></div>
                <h2 className="text-3xl font-bold text-gray-900">Percorsi Reskilling</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {coursesToShow.filter(c => c.category === 'Reskilling').map((course, idx) => (
                  <Link
                    key={idx}
                    to={course.id ? `/corsi/${course.id}` : '#'}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                  >
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                          {course.duration}
                        </div>
                        <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-600 border border-gray-200">
                          Reskilling
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">{course.title}</h3>
                      {course.description && (
                        <p className="text-gray-700 mb-6 leading-relaxed">{course.description}</p>
                      )}

                      {course.skills && course.skills.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm uppercase tracking-wide text-gray-500 mb-3">Competenze</div>
                          <div className="flex flex-wrap gap-2">
                            {course.skills.map((skill, skillIdx) => (
                              <span
                                key={skillIdx}
                                className="bg-gray-50 px-4 py-2 rounded-lg text-sm border border-gray-200"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-6 text-blue-600 font-semibold">
                        <span>Scopri il corso</span>
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Fallback per corsi senza categoria */}
          {coursesToShow.some(c => !c.category) && (
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              {coursesToShow.filter(c => !c.category).map((course, idx) => (
                <Link
                  key={idx}
                  to={course.id ? `/corsi/${course.id}` : '#'}
                  className={`bg-gradient-to-br ${program.bgGradient} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
                >
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`bg-gradient-to-r ${program.gradient} text-white px-4 py-2 rounded-full text-sm`}>
                        {course.duration}
                      </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl mb-4">{course.title}</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">{course.description}</p>

                    <div className="space-y-2">
                      <div className="text-sm uppercase tracking-wide text-gray-500 mb-3">Competenze</div>
                      <div className="flex flex-wrap gap-2">
                        {course.skills.map((skill, skillIdx) => (
                          <span
                            key={skillIdx}
                            className="bg-white px-4 py-2 rounded-lg text-sm shadow-md hover:shadow-lg transition-shadow"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 mt-6 font-semibold`} style={{ color: program.gradient.includes('pink') ? '#db2777' : '#7c3aed' }}>
                      <span>Scopri il corso</span>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
              </>
            );
          })()}
        </div>
      </section>

      {/* Timeline Section */}
      <section className={`py-20 bg-gradient-to-br ${program.bgGradient}`} data-animate id="timeline">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-in-down">
            <div className={`inline-block bg-gradient-to-r ${program.gradient} text-white px-6 py-2 rounded-full mb-4`}>
              Il Percorso
            </div>
            <h2 className="text-4xl md:text-5xl mb-4">
              Come Funziona
            </h2>
          </div>

          <div className="space-y-8">
            {program.timeline.map((phase, idx) => (
              <div 
                key={idx} 
                className={`flex gap-6 items-start animate-slide-in-${idx % 2 === 0 ? 'left' : 'right'} delay-${idx * 100}`}
              >
                <div className={`bg-gradient-to-br ${program.gradient} text-white w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg animate-pulse-glow`}>
                  <span className="text-2xl">{idx + 1}</span>
                </div>
                <div className="bg-white rounded-2xl p-6 flex-1 shadow-lg hover:shadow-2xl transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`text-sm bg-gradient-to-r ${program.gradient} bg-clip-text text-transparent uppercase tracking-wide`}>
                      {phase.phase}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={16} />
                      {phase.duration}
                    </div>
                  </div>
                  <h3 className="text-2xl mb-2">{phase.title}</h3>
                  <p className="text-gray-600">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white" data-animate id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-in-down">
            <div className={`inline-block bg-gradient-to-r ${program.gradient} text-white px-6 py-2 rounded-full mb-4`}>
              Testimonianze
            </div>
            <h2 className="text-4xl md:text-5xl mb-4">
              Cosa Dicono di Noi
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {program.testimonials.map((testimonial, idx) => (
              <div 
                key={idx} 
                className={`bg-gradient-to-br ${program.bgGradient} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-scale-in delay-${idx * 100}`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div>
                  <div>{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 bg-gradient-to-br ${program.gradient} text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 animate-gradient-xy" style={{ background: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%), linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%)', backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px' }}></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl mb-6 animate-bounce-in">
            Inizia il Tuo Percorso Oggi
          </h2>
          <p className="text-xl mb-8 opacity-90 animate-fade-in-blur delay-200">
            Compila il form o contattaci per ricevere tutte le informazioni
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-up delay-300">
            <a 
              href="#contatti"
              className="bg-white text-gray-900 px-10 py-5 rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 shadow-lg inline-flex items-center justify-center gap-2 hover-lift"
            >
              <GraduationCap size={24} />
              <span>Iscriviti Ora</span>
            </a>
            <Link 
              to="/"
              className="bg-white/20 backdrop-blur-sm text-white border-2 border-white px-10 py-5 rounded-xl hover:bg-white/30 transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <BookOpen size={24} />
              <span>Vedi Tutti i Programmi</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}