/**
 * React Hooks per Form Sito Innform.eu
 * Collegamento con EduPlan
 * 
 * Uso nei componenti React del sito Figma Make:
 * - useEnrollmentForm: Per form iscrizione corso
 * - useContactForm: Per form contatto/richiesta info
 * - usePreEnrollmentForm: Per pre-iscrizione GOL/Master
 */

import { useState, useCallback } from 'react';
import {
  StudentService,
  EnrollmentService,
  LeadService,
  ContactService,
  Contact,
  workflowEvents,
} from '../services/eduplan-api';
import {
  StudentCreateInput,
  EnrollmentCreateInput,
  LeadCreateInput,
  Student,
  Enrollment,
  Lead,
  ENROLLMENT_EVENTS,
} from '../types/eduplan';

// ============================================
// TYPES
// ============================================

export interface FormState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface UseFormReturn<TInput, TOutput> {
  state: FormState<TOutput>;
  submit: (input: TInput) => Promise<TOutput | null>;
  reset: () => void;
}

// ============================================
// FORM ISCRIZIONE CORSO
// ============================================

export interface EnrollmentFormInput {
  // Dati studente
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  fiscalCode?: string;
  birthDate?: string;
  birthPlace?: string;
  address?: string;
  city?: string;
  province?: string;
  zipCode?: string;

  // Dati iscrizione
  courseId: string;
  courseName?: string;          // Per riferimento
  editionId?: string;           // ID edizione selezionata
  editionName?: string;         // Nome edizione (es. "Edizione 4")
  projectId?: string;
  notes?: string;

  // Privacy
  privacyAccepted: boolean;
  marketingAccepted?: boolean;
}

export interface EnrollmentFormResult {
  student: Student;
  enrollment: Enrollment;
}

export function useEnrollmentForm(): UseFormReturn<EnrollmentFormInput, EnrollmentFormResult> {
  const [state, setState] = useState<FormState<EnrollmentFormResult>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const submit = useCallback(async (input: EnrollmentFormInput): Promise<EnrollmentFormResult | null> => {
    // Validazione
    if (!input.privacyAccepted) {
      setState(prev => ({
        ...prev,
        error: 'Devi accettare la privacy policy per procedere',
        loading: false,
      }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // IMPORTANTE: Per i corsi Master, creiamo SOLO un lead in crm_leads
      // L'iscrizione effettiva (people + enrollments) sarà gestita manualmente dalla segreteria
      const urlParams = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();

      // Costruisci il messaggio con edizione se presente
      const editionInfo = input.editionId
        ? ` - ${input.editionName || `Edizione ID: ${input.editionId}`}`
        : '';
      const notesInfo = input.notes ? ` - Note: ${input.notes}` : '';

      const leadResult = await LeadService.create({
        nome: input.firstName,
        cognome: input.lastName,
        email: input.email,
        telefono: input.phone,
        corso_interesse: input.courseId,
        messaggio: `Richiesta iscrizione al corso: ${input.courseName || input.courseId}${editionInfo}${notesInfo}`,
        fonte: 'website',
        landing_page: typeof window !== 'undefined' ? window.location.href : undefined,
        utm_source: urlParams.get('utm_source') || undefined,
        utm_medium: urlParams.get('utm_medium') || undefined,
        utm_campaign: urlParams.get('utm_campaign') || undefined,
        status: 'new', // Status 'new' - sarà la segreteria a gestire l'iscrizione
        edition_id: input.editionId, // ID edizione per tracciamento
      });

      if (!leadResult.success) {
        throw new Error(leadResult.error?.message || 'Errore invio richiesta');
      }

      // Creiamo un risultato fittizio per compatibilità con l'interfaccia
      // In realtà non creiamo studente né iscrizione
      const result: EnrollmentFormResult = {
        student: {
          id: leadResult.data?.id || '',
          first_name: input.firstName,
          last_name: input.lastName,
          full_name: `${input.firstName} ${input.lastName}`,
          email: input.email,
          phone: input.phone,
          role: 'student',
        },
        enrollment: {
          id: leadResult.data?.id || '',
          course_id: input.courseId,
          student_id: leadResult.data?.id || '',
          enrollment_date: new Date().toISOString().split('T')[0],
          status: 'pending',
          payment_status: 'pending',
        },
      };

      setState({
        data: result,
        loading: false,
        error: null,
        success: true,
      });

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante l\'invio della richiesta';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        success: false,
      });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return { state, submit, reset };
}

// ============================================
// FORM CONTATTO / RICHIESTA INFO
// v2.5: Usa tabella crm_contacts (NON crm_leads)
// ============================================

export interface ContactFormInput {
  // Dati contatto
  name: string;                 // Nome completo o nome
  surname?: string;             // Cognome (se separato)
  email: string;
  phone?: string;

  // Azienda (opzionale)
  company?: string;
  piva?: string;

  // Richiesta
  subject?: string;
  courseInterest?: string;      // ID o nome corso
  message: string;

  // Privacy
  privacyAccepted: boolean;
  marketingAccepted?: boolean;
}

export function useContactForm(): UseFormReturn<ContactFormInput, Contact> {
  const [state, setState] = useState<FormState<Contact>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const submit = useCallback(async (input: ContactFormInput): Promise<Contact | null> => {
    if (!input.privacyAccepted) {
      setState(prev => ({
        ...prev,
        error: 'Devi accettare la privacy policy per procedere',
        loading: false,
      }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Separa nome/cognome se necessario
      let firstName = input.name;
      let lastName = input.surname || '';

      if (!lastName && input.name.includes(' ')) {
        const parts = input.name.split(' ');
        firstName = parts[0];
        lastName = parts.slice(1).join(' ');
      }

      // v2.5: Usa ContactService per crm_contacts (NON LeadService)
      const result = await ContactService.create({
        firstName,
        lastName,
        email: input.email,
        phone: input.phone,
        company: input.company,
        subject: input.subject,
        message: input.message,
        privacyAccepted: input.privacyAccepted,
        marketingConsent: input.marketingAccepted,
      });

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Errore invio richiesta');
      }

      setState({
        data: result.data,
        loading: false,
        error: null,
        success: true,
      });

      return result.data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante l\'invio';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        success: false,
      });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return { state, submit, reset };
}

// ============================================
// FORM PRE-ISCRIZIONE GOL/MASTER
// ============================================

export interface PreEnrollmentFormInput {
  // Dati personali
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  fiscalCode: string;
  birthDate: string;
  birthPlace: string;
  
  // Residenza
  address: string;
  city: string;
  province: string;
  zipCode: string;
  
  // Corso
  programId: string;
  programName?: string;
  programType: 'master' | 'gol' | 'professionale';
  
  // Requisiti (per GOL)
  employmentStatus?: 'disoccupato' | 'inoccupato' | 'occupato' | 'cig';
  educationLevel?: 'diploma' | 'laurea_triennale' | 'laurea_magistrale' | 'altro';
  didYouKnowUs?: string;
  
  // Documenti
  hasIdDocument: boolean;
  hasFiscalCode: boolean;
  hasCurriculum?: boolean;
  
  // Privacy
  privacyAccepted: boolean;
  marketingAccepted?: boolean;
  dataProcessingAccepted: boolean;
}

export interface PreEnrollmentResult {
  student: Student;
  enrollment: Enrollment;
  documentsRequired: string[];
}

export function usePreEnrollmentForm(): UseFormReturn<PreEnrollmentFormInput, PreEnrollmentResult> {
  const [state, setState] = useState<FormState<PreEnrollmentResult>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const submit = useCallback(async (input: PreEnrollmentFormInput): Promise<PreEnrollmentResult | null> => {
    // Validazioni
    if (!input.privacyAccepted || !input.dataProcessingAccepted) {
      setState(prev => ({
        ...prev,
        error: 'Devi accettare privacy e trattamento dati per procedere',
        loading: false,
      }));
      return null;
    }

    if (!input.fiscalCode || input.fiscalCode.length !== 16) {
      setState(prev => ({
        ...prev,
        error: 'Codice fiscale non valido',
        loading: false,
      }));
      return null;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // 1. Crea studente
      const studentInput: StudentCreateInput = {
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        phone: input.phone,
        fiscal_code: input.fiscalCode.toUpperCase(),
        birth_date: input.birthDate,
        birth_place: input.birthPlace,
        address: input.address,
        city: input.city,
        province: input.province,
        zip_code: input.zipCode,
      };

      const studentResult = await StudentService.create(studentInput);
      
      if (!studentResult.success || !studentResult.data) {
        throw new Error(studentResult.error?.message || 'Errore creazione anagrafica');
      }

      const student = studentResult.data;

      // 2. Crea pre-iscrizione
      const enrollmentInput: EnrollmentCreateInput = {
        course_id: input.programId,
        student_id: student.id,
        source: 'website',
        notes: `Pre-iscrizione ${input.programType.toUpperCase()}`,
        metadata: {
          program_type: input.programType,
          program_name: input.programName,
          employment_status: input.employmentStatus,
          education_level: input.educationLevel,
          how_did_you_know: input.didYouKnowUs,
          marketing_accepted: input.marketingAccepted,
        },
      };

      const enrollmentResult = await EnrollmentService.create(enrollmentInput);
      
      if (!enrollmentResult.success || !enrollmentResult.data) {
        throw new Error(enrollmentResult.error?.message || 'Errore creazione pre-iscrizione');
      }

      const enrollment = enrollmentResult.data;

      // 3. Determina documenti richiesti
      const documentsRequired: string[] = [
        'documento_identita',
        'codice_fiscale',
        'privacy_firmata',
      ];

      if (input.programType === 'gol') {
        documentsRequired.push(
          'did_centro_impiego',      // Dichiarazione di disoccupazione
          'isee',                     // Se richiesto
          'autocertificazione_residenza',
        );
      }

      if (input.programType === 'master') {
        documentsRequired.push(
          'titolo_studio',           // Copia laurea
          'curriculum_vitae',
        );
      }

      // 4. Richiedi documenti
      await EnrollmentService.requestDocuments(enrollment.id, documentsRequired);

      // 5. Crea anche un lead in crm_leads per tracciamento marketing
      // Questo permette di tracciare tutte le pre-iscrizioni nel CRM
      const urlParams = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();

      try {
        await LeadService.create({
          nome: input.firstName,
          cognome: input.lastName,
          email: input.email,
          telefono: input.phone,
          corso_interesse: input.programId,
          messaggio: `Pre-iscrizione ${input.programType.toUpperCase()}: ${input.programName || input.programId}`,
          fonte: 'website',
          landing_page: typeof window !== 'undefined' ? window.location.href : undefined,
          utm_source: urlParams.get('utm_source') || undefined,
          utm_medium: urlParams.get('utm_medium') || undefined,
          utm_campaign: urlParams.get('utm_campaign') || undefined,
          status: 'enrolled', // Status 'enrolled' per indicare pre-iscrizione
        });
      } catch (leadError) {
        // Non bloccare la pre-iscrizione se la creazione del lead fallisce
        console.warn('Errore creazione lead CRM (non bloccante):', leadError);
      }

      const result: PreEnrollmentResult = {
        student,
        enrollment,
        documentsRequired,
      };

      setState({
        data: result,
        loading: false,
        error: null,
        success: true,
      });

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore durante la pre-iscrizione';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        success: false,
      });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
  }, []);

  return { state, submit, reset };
}

// ============================================
// HOOK PER EVENTI WORKFLOW
// ============================================

export function useWorkflowEvents() {
  const subscribe = useCallback((
    event: string,
    handler: (payload: any) => void
  ) => {
    return workflowEvents.subscribe(event, handler);
  }, []);

  const emit = useCallback((
    event: string,
    data: Record<string, any>
  ) => {
    return workflowEvents.emit(event, data, 'website');
  }, []);

  return { subscribe, emit };
}

// ============================================
// EXPORT
// ============================================

export default {
  useEnrollmentForm,
  useContactForm,
  usePreEnrollmentForm,
  useWorkflowEvents,
};
