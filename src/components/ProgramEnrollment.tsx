/**
 * Componente ProgramEnrollment
 * Pagina dedicata per la pre-iscrizione ai programmi GOL e Master
 * Integrato con EduPlan per la gestione delle iscrizioni
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, GraduationCap } from 'lucide-react';
import { PreEnrollmentForm } from './EduPlanForms';

// Dati dei programmi disponibili per la pre-iscrizione
const PROGRAMS: Record<string, {
  id: string;
  name: string;
  type: 'gol' | 'master' | 'professionale';
  hours: number;
  description: string;
  requirements: string[];
  documents: string[];
}> = {
  'sviluppo-turistico': {
    id: 'gol-turismo-001',
    name: 'Tecnico Esperto per lo Sviluppo Turistico Territoriale',
    type: 'gol',
    hours: 500,
    description: 'Elaborazione e progettazione di piani di sviluppo del territorio, definizione dell\'offerta turistica, ideazione di nuovi itinerari e pacchetti, elaborazione strategie di valorizzazione.',
    requirements: [
      'Essere disoccupati/inoccupati o in CIG',
      'Essere residenti in Basilicata',
      'Essere iscritti al Centro per l\'Impiego',
      'Avere almeno il diploma di scuola superiore'
    ],
    documents: [
      'Documento di identità',
      'Codice fiscale',
      'Curriculum Vitae',
      'Attestato di disoccupazione/DID',
      'Patto di servizio GOL'
    ]
  },
  'sistema-educativo-infanzia': {
    id: 'gol-infanzia-001',
    name: 'Tecnico del Sistema Educativo per la Prima Infanzia',
    type: 'gol',
    hours: 600,
    description: 'Progettazione e gestione di attività educative, ludiche e di socializzazione per bambini da 0 a 36 mesi. Monitoraggio della salute e gestione rapporti con i genitori.',
    requirements: [
      'Essere disoccupati/inoccupati o in CIG',
      'Essere residenti in Basilicata',
      'Essere iscritti al Centro per l\'Impiego',
      'Avere almeno il diploma di scuola superiore'
    ],
    documents: [
      'Documento di identità',
      'Codice fiscale',
      'Curriculum Vitae',
      'Attestato di disoccupazione/DID',
      'Patto di servizio GOL',
      'Certificato casellario giudiziale (per lavoro con minori)'
    ]
  },
  'operatore-tornitura': {
    id: 'gol-tornitura-001',
    name: 'Operatore della Tornitura',
    type: 'gol',
    hours: 600,
    description: 'Lavorazione dei metalli utilizzando il tornio tradizionale e CNC. Lettura disegno meccanico, esecuzione lavorazioni complesse, regolazioni e manutenzione.',
    requirements: [
      'Essere disoccupati/inoccupati o in CIG',
      'Essere residenti in Basilicata',
      'Essere iscritti al Centro per l\'Impiego',
      'Assolvimento obbligo di istruzione'
    ],
    documents: [
      'Documento di identità',
      'Codice fiscale',
      'Curriculum Vitae',
      'Attestato di disoccupazione/DID',
      'Patto di servizio GOL'
    ]
  },
  'operatore-h2s': {
    id: 'gol-h2s-001',
    name: 'Operatore H2S e Sicurezza',
    type: 'gol',
    hours: 600,
    description: 'Sicurezza industriale con focus sulla gestione dei rischi connessi all\'esposizione all\'idrogeno solforato (H2S). Valutazione effetti, misure preventive, rilevamento e gestione DPI.',
    requirements: [
      'Essere disoccupati/inoccupati o in CIG',
      'Essere residenti in Basilicata',
      'Essere iscritti al Centro per l\'Impiego',
      'Assolvimento obbligo di istruzione'
    ],
    documents: [
      'Documento di identità',
      'Codice fiscale',
      'Curriculum Vitae',
      'Attestato di disoccupazione/DID',
      'Patto di servizio GOL',
      'Certificato medico di idoneità fisica'
    ]
  },
  'tecnico-analisi-alimentari': {
    id: 'master-analisi-001',
    name: 'Tecnico Esperto in Analisi Alimentari e Ambientali',
    type: 'master',
    hours: 900,
    description: 'Competenze su metodi e tecniche di analisi chimiche in ambito ambientale e alimentare, certificazioni ISO e HACCP.',
    requirements: [
      'Laurea in Chimica, Biologia, Biotecnologie',
      'Scienze e Tecnologie degli Alimenti',
      'Farmacia, Ingegneria Chimica',
      'Ambiente e Territorio, Geologia, Agraria',
      'Veterinaria, Tecnico della Prevenzione'
    ],
    documents: [
      'Documento di identità',
      'Codice fiscale',
      'Curriculum Vitae',
      'Titolo di laurea',
      'Foto tessera'
    ]
  },
  'master-editoria': {
    id: 'master-editoria-001',
    name: 'Master in Editoria e Comunicazione - IV Edizione',
    type: 'master',
    hours: 900,
    description: 'Competenze nell\'impostazione e organizzazione del ciclo di lavorazione del prodotto editoriale, management editoriale, comunicazione, marketing e social media.',
    requirements: [
      'Laurea (qualsiasi disciplina)',
      'Forte interesse per il mondo editoriale',
      'Buona conoscenza della lingua inglese'
    ],
    documents: [
      'Documento di identità',
      'Codice fiscale',
      'Curriculum Vitae',
      'Titolo di laurea',
      'Lettera motivazionale',
      'Foto tessera'
    ]
  },
  'safety-manager': {
    id: 'master-safety-001',
    name: 'Safety Manager: Esperto in Sicurezza e Ambiente',
    type: 'master',
    hours: 900,
    description: 'Figura trasversale per gestire il sistema di prevenzione del rischio e implementazione del piano della sicurezza ambientale ed aziendale.',
    requirements: [
      'Laurea (preferibilmente in discipline tecniche)',
      'Interesse per la sicurezza sul lavoro'
    ],
    documents: [
      'Documento di identità',
      'Codice fiscale',
      'Curriculum Vitae',
      'Titolo di laurea',
      'Foto tessera'
    ]
  },
  'interior-design': {
    id: 'master-interior-001',
    name: 'Master Interior Design',
    type: 'master',
    hours: 600,
    description: 'Progettazione di spazi che emozionano. Creatività, tecnica e conoscenza dei materiali per formare i designer del futuro.',
    requirements: [
      'Diploma superiore',
      'Passione per il design e l\'arredamento'
    ],
    documents: [
      'Documento di identità',
      'Codice fiscale',
      'Curriculum Vitae',
      'Portfolio (se disponibile)',
      'Foto tessera'
    ]
  }
};

export function ProgramEnrollment() {
  const { slug } = useParams<{ slug: string }>();
  const program = slug ? PROGRAMS[slug] : null;

  if (!program) {
    return (
      <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-8xl mb-6">🎯</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Programma non trovato</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Ci dispiace, ma il programma che stai cercando non sembra esistere o non è più disponibile per le iscrizioni.
        </p>
        <Link
          to="/"
          className="bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold inline-flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          Torna alla Home
        </Link>
      </div>
    );
  }

  const handleSuccess = (result: any) => {
    console.log('[ProgramEnrollment] Pre-iscrizione completata:', result);

    // Analytics tracking (opzionale)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pre_enrollment_submitted', {
        program_id: program.id,
        program_name: program.name,
        program_type: program.type,
      });
    }
  };

  const handleError = (error: string) => {
    console.error('[ProgramEnrollment] Errore:', error);
  };

  const getTypeStyles = () => {
    switch (program.type) {
      case 'gol':
        return {
          badge: 'bg-green-100 text-green-800 border-green-200',
          gradient: 'from-green-600 to-emerald-600',
          bgGradient: 'from-green-50 to-emerald-50',
          button: 'bg-green-600 hover:bg-green-700'
        };
      case 'master':
        return {
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
          gradient: 'from-purple-600 to-pink-600',
          bgGradient: 'from-purple-50 to-pink-50',
          button: 'bg-purple-600 hover:bg-purple-700'
        };
      default:
        return {
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          gradient: 'from-blue-600 to-cyan-600',
          bgGradient: 'from-blue-50 to-cyan-50',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${styles.bgGradient}`}>
      {/* Header */}
      <div className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <Link
            to={`/corsi/${slug}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Torna al corso
          </Link>

          {/* Header Content */}
          <div className="text-center mb-8">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border ${styles.badge}`}>
              {program.type === 'gol' ? 'Programma GOL - Gratuito' : program.type === 'master' ? 'Master' : 'Corso Professionale'}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {program.name}
            </h1>
            <div className="flex items-center justify-center gap-4 text-gray-600">
              <span className="flex items-center gap-2">
                <Clock size={18} />
                {program.hours} ore
              </span>
              <span className="flex items-center gap-2">
                <GraduationCap size={18} />
                Certificazione inclusa
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="space-y-6">
            {/* Descrizione */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-3">Descrizione</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {program.description}
              </p>
            </div>

            {/* Requisiti */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <AlertCircle size={18} className="text-amber-500" />
                Requisiti
              </h3>
              <ul className="space-y-2">
                {program.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Documenti richiesti */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-3">Documenti da Preparare</h3>
              <ul className="space-y-2">
                {program.documents.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400 mt-4">
                * I documenti verranno richiesti dopo la pre-iscrizione
              </p>
            </div>

            {/* Info GOL */}
            {program.type === 'gol' && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <h3 className="font-bold text-green-800 mb-2">Corso 100% Gratuito</h3>
                <p className="text-sm text-green-700">
                  Questo corso è finanziato dal Programma GOL (Garanzia Occupabilità Lavoratori).
                  Non sono previsti costi a carico del partecipante.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Compila la Pre-iscrizione</h2>
              <PreEnrollmentForm
                programId={program.id}
                programName={program.name}
                programType={program.type}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramEnrollment;
