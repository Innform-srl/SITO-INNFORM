/**
 * EduPlan API Service
 * Servizio per comunicare tra sito Innform.eu e piattaforma EduPlan
 *
 * INTEGRAZIONE DIRETTA CON SUPABASE
 */

import {
  Student,
  StudentCreateInput,
  Enrollment,
  EnrollmentCreateInput,
  Lead,
  LeadCreateInput,
  ApiResponse,
  WorkflowEventPayload,
  ENROLLMENT_EVENTS,
  NOTIFICATION_EVENTS,
  EnrollmentStatus,
  PaymentStatus,
} from '../types/eduplan';

// ============================================
// CONFIGURAZIONE SUPABASE (FISSA)
// ============================================

const CONFIG = {
  SUPABASE_URL: 'https://ikjqbmjyjuhkwtdvxjai.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlranFibWp5anVoa3d0ZHZ4amFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzc4MDksImV4cCI6MjA3NjYxMzgwOX0.6MqvODmDE27UtnTXgI7ZiZF1th5q4QVVxwVu_2czBcs',
  SOURCE: 'website',
  SOURCE_DETAIL: 'www.innform.eu',
  DEBUG: false
};

interface EduPlanConfig {
  mode: 'localStorage' | 'supabase' | 'api';
  apiBaseUrl?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  debug?: boolean;
}

let config: EduPlanConfig = {
  mode: 'supabase',
  supabaseUrl: CONFIG.SUPABASE_URL,
  supabaseAnonKey: CONFIG.SUPABASE_ANON_KEY,
  debug: CONFIG.DEBUG,
};

export const configureEduPlan = (newConfig: Partial<EduPlanConfig>) => {
  // Ignora le configurazioni esterne, usa sempre CONFIG fissa
};

// ============================================
// UTILITIES
// ============================================

const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const getTimestamp = (): string => new Date().toISOString();

const log = (message: string, data?: any) => {
  if (config.debug) {
    console.log(`[EduPlan] ${message}`, data || '');
  }
};

// ============================================
// SUPABASE REST API CLIENT
// ============================================

class SupabaseClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = CONFIG.SUPABASE_URL;
    this.apiKey = CONFIG.SUPABASE_ANON_KEY;
  }

  private getHeaders(): HeadersInit {
    return {
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
  }

  async insert<T>(table: string, data: Record<string, any>): Promise<T | null> {
    try {
      const url = `${this.baseUrl}/rest/v1/${table}`;
      log(`POST ${url}`, data);

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        // Supabase error logged silently
        throw new Error(`Supabase error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      log(`Risposta Supabase:`, result);
      return Array.isArray(result) ? result[0] : result;
    } catch (error) {
      throw error;
    }
  }

  async select<T>(table: string, query?: string): Promise<T[]> {
    try {
      const url = `${this.baseUrl}/rest/v1/${table}${query ? `?${query}` : ''}`;
      log(`GET ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        // Supabase error logged silently
        throw new Error(`Supabase error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async update<T>(table: string, id: string, data: Record<string, any>): Promise<T | null> {
    try {
      const url = `${this.baseUrl}/rest/v1/${table}?id=eq.${id}`;
      log(`PATCH ${url}`, data);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        // Supabase error logged silently
        throw new Error(`Supabase error: ${response.status}`);
      }

      const result = await response.json();
      return Array.isArray(result) ? result[0] : result;
    } catch (error) {
      throw error;
    }
  }
}

const supabase = new SupabaseClient();

// ============================================
// EVENT EMITTER (Sistema Workflow)
// ============================================

type EventHandler = (payload: WorkflowEventPayload) => void | Promise<void>;

class WorkflowEventEmitter {
  private handlers: Map<string, EventHandler[]> = new Map();

  subscribe(event: string, handler: EventHandler): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
    
    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(event);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) handlers.splice(index, 1);
      }
    };
  }

  async emit(event: string, data: Record<string, any>, source: WorkflowEventPayload['source'] = 'website'): Promise<void> {
    const payload: WorkflowEventPayload = {
      event,
      timestamp: getTimestamp(),
      source,
      data,
      metadata: {
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      },
    };

    log(`Evento emesso: ${event}`, payload);

    const handlers = this.handlers.get(event) || [];
    const wildcardHandlers = this.handlers.get('*') || [];
    
    const allHandlers = [...handlers, ...wildcardHandlers];
    
    for (const handler of allHandlers) {
      try {
        await handler(payload);
      } catch (error) {
        // Handler error silently ignored
      }
    }

    // Salva evento nel log
    await this.logEvent(payload);
  }

  private async logEvent(payload: WorkflowEventPayload): Promise<void> {
    try {
      const events = JSON.parse(localStorage.getItem('eduplan_workflow_events') || '[]');
      events.push(payload);
      // Mantieni solo ultimi 1000 eventi
      const trimmed = events.slice(-1000);
      localStorage.setItem('eduplan_workflow_events', JSON.stringify(trimmed));
    } catch (error) {
      // Log event error silently ignored
    }
  }
}

export const workflowEvents = new WorkflowEventEmitter();

// ============================================
// STUDENT SERVICE
// ============================================

export const StudentService = {
  /**
   * Crea un nuovo studente da form sito web
   * Usa la tabella "people" su Supabase
   */
  async create(input: StudentCreateInput): Promise<ApiResponse<Student>> {
    try {
      // Verifica se esiste già con stessa email
      const existingResults = await supabase.select<any>('people', `email=eq.${encodeURIComponent(input.email)}`);
      if (existingResults.length > 0) {
        const existing = existingResults[0];
        log('Studente esistente trovato:', existing.id);
        return {
          success: true,
          data: {
            id: existing.id,
            first_name: existing.first_name,
            last_name: existing.last_name,
            full_name: `${existing.first_name} ${existing.last_name}`,
            email: existing.email,
            phone: existing.phone,
            fiscal_code: existing.fiscal_code,
            role: existing.role || 'student',
            created_at: existing.created_at,
            updated_at: existing.updated_at,
          } as Student,
          meta: { timestamp: getTimestamp(), request_id: generateId() },
        };
      }

      // Prepara dati per tabella people
      const personData = {
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email,
        phone: input.phone || null,
        fiscal_code: input.fiscal_code || null,
        birth_date: input.birth_date || null,
        birth_place: input.birth_place || null,
        address: input.address || null,
        city: input.city || null,
        province: input.province || null,
        postal_code: input.zip_code || null,
        role: 'corsista', // Ruolo per studenti dal sito
        active: true,
        notes: `Iscritto dal sito web ${CONFIG.SOURCE_DETAIL} il ${new Date().toLocaleDateString('it-IT')}`,
      };

      const result = await supabase.insert<any>('people', personData);

      if (!result) {
        throw new Error('Nessuna risposta da Supabase');
      }

      const student: Student = {
        id: result.id,
        first_name: result.first_name,
        last_name: result.last_name,
        full_name: `${result.first_name} ${result.last_name}`,
        email: result.email,
        phone: result.phone,
        fiscal_code: result.fiscal_code,
        role: 'student',
        created_at: result.created_at,
        updated_at: result.updated_at,
      };

      log('Studente creato:', student.id);

      return {
        success: true,
        data: student,
        meta: { timestamp: getTimestamp(), request_id: generateId() },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'STUDENT_CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Errore creazione studente',
        },
        meta: { timestamp: getTimestamp(), request_id: generateId() },
      };
    }
  },

  async getById(id: string): Promise<Student | null> {
    try {
      const results = await supabase.select<any>('people', `id=eq.${id}`);
      if (results.length === 0) return null;
      const p = results[0];
      return {
        id: p.id,
        first_name: p.first_name,
        last_name: p.last_name,
        full_name: `${p.first_name} ${p.last_name}`,
        email: p.email,
        phone: p.phone,
        fiscal_code: p.fiscal_code,
        role: 'student',
        created_at: p.created_at,
        updated_at: p.updated_at,
      };
    } catch {
      return null;
    }
  },

  async getByEmail(email: string): Promise<Student | null> {
    try {
      const results = await supabase.select<any>('people', `email=eq.${encodeURIComponent(email)}`);
      if (results.length === 0) return null;
      const p = results[0];
      return {
        id: p.id,
        first_name: p.first_name,
        last_name: p.last_name,
        full_name: `${p.first_name} ${p.last_name}`,
        email: p.email,
        phone: p.phone,
        fiscal_code: p.fiscal_code,
        role: 'student',
        created_at: p.created_at,
        updated_at: p.updated_at,
      };
    } catch {
      return null;
    }
  },

  async update(id: string, updates: Partial<Student>): Promise<Student | null> {
    try {
      const result = await supabase.update<any>('people', id, updates);
      if (!result) return null;
      return {
        id: result.id,
        first_name: result.first_name,
        last_name: result.last_name,
        full_name: `${result.first_name} ${result.last_name}`,
        email: result.email,
        phone: result.phone,
        fiscal_code: result.fiscal_code,
        role: 'student',
        created_at: result.created_at,
        updated_at: result.updated_at,
      };
    } catch {
      return null;
    }
  },
};

// ============================================
// ENROLLMENT SERVICE
// ============================================

export const EnrollmentService = {
  /**
   * Crea una nuova iscrizione da form sito web
   * NOTA: Richiede tabella "enrollments" su Supabase
   * Per ora salva localmente in localStorage come backup
   */
  async create(input: EnrollmentCreateInput): Promise<ApiResponse<Enrollment>> {
    try {
      const enrollment: Enrollment = {
        id: generateId(),
        course_id: input.course_id,
        student_id: input.student_id,
        project_id: input.project_id,
        company_id: input.company_id,
        enrollment_date: input.enrollment_date || new Date().toISOString().split('T')[0],
        status: 'pending',
        payment_status: 'pending',
        payment_amount: input.payment_amount,
        notes: input.notes,
        created_at: getTimestamp(),
        updated_at: getTimestamp(),
        metadata: {
          source: input.source || 'website',
          source_detail: CONFIG.SOURCE_DETAIL,
          ...input.metadata,
        },
      };

      // Prova a salvare su Supabase (tabella enrollments)
      try {
        // Verifica se course_id è un UUID valido
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const isValidUUID = uuidRegex.test(enrollment.course_id);

        // Se non è un UUID valido (è uno slug), cerca il corso per code
        // Corso placeholder per iscrizioni senza corso corrispondente
        const WEBSITE_PLACEHOLDER_COURSE_ID = '88e2f8f8-7b38-4eae-a7cd-d957fc9fdd4d';

        let actualCourseId: string = WEBSITE_PLACEHOLDER_COURSE_ID; // Default al placeholder
        if (isValidUUID) {
          actualCourseId = enrollment.course_id;
        } else {
          // Cerca il corso per code (slug) nella tabella courses
          try {
            const courses = await supabase.select<any>('courses', `code=eq.${encodeURIComponent(enrollment.course_id)}`);
            if (courses.length > 0) {
              actualCourseId = courses[0].id;
              log(`Corso trovato per slug "${enrollment.course_id}": ${actualCourseId}`);
            } else {
              log(`Corso non trovato per slug "${enrollment.course_id}", uso placeholder ${WEBSITE_PLACEHOLDER_COURSE_ID}`);
            }
          } catch (lookupError) {
            log('Errore ricerca corso, uso placeholder:', lookupError);
          }
        }

        // Prepara i dati per l'iscrizione
        // Secondo la guida: course_id, person_id, enrollment_date, status, payment_status, notes
        const enrollmentData: Record<string, any> = {
          course_id: actualCourseId, // UUID valido (corso trovato o placeholder)
          person_id: enrollment.student_id, // La tabella usa person_id, non student_id
          enrollment_date: enrollment.enrollment_date,
          status: enrollment.status,
          payment_status: enrollment.payment_status,
          notes: JSON.stringify({
            source: 'website',
            source_detail: CONFIG.SOURCE_DETAIL,
            course_slug: enrollment.course_id, // Salva sempre lo slug originale per riferimento
            course_name: enrollment.metadata?.course_name,
            student_notes: enrollment.notes,
            ...enrollment.metadata,
          }),
        };

        const result = await supabase.insert<any>('enrollments', enrollmentData);
        if (result) {
          enrollment.id = result.id;
          log('Iscrizione salvata su Supabase:', enrollment.id);
        }
      } catch (supabaseError) {
        // Se tabella non esiste o errore, salva localmente come backup
        log('Errore salvataggio enrollment, salvo localmente', supabaseError);
        const enrollments = JSON.parse(localStorage.getItem('eduplan_enrollments') || '[]');
        enrollments.push(enrollment);
        localStorage.setItem('eduplan_enrollments', JSON.stringify(enrollments));
      }

      log('Iscrizione creata:', enrollment.id);

      // Emetti evento workflow
      await workflowEvents.emit(ENROLLMENT_EVENTS.ENROLLMENT_PENDING, {
        enrollment,
        student_id: input.student_id,
        course_id: input.course_id,
        source: 'website',
      });

      return {
        success: true,
        data: enrollment,
        meta: { timestamp: getTimestamp(), request_id: generateId() },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'ENROLLMENT_CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Errore creazione iscrizione',
        },
        meta: { timestamp: getTimestamp(), request_id: generateId() },
      };
    }
  },

  /**
   * Aggiorna stato iscrizione
   */
  async updateStatus(id: string, status: EnrollmentStatus): Promise<ApiResponse<Enrollment>> {
    try {
      let enrollment: Enrollment | null = null;

      try {
        const result = await supabase.update<any>('enrollments', id, { status });
        if (result) enrollment = result;
      } catch {
        // Fallback localStorage
        const enrollments = JSON.parse(localStorage.getItem('eduplan_enrollments') || '[]');
        const index = enrollments.findIndex((e: any) => e.id === id);
        if (index >= 0) {
          enrollments[index].status = status;
          enrollments[index].updated_at = getTimestamp();
          localStorage.setItem('eduplan_enrollments', JSON.stringify(enrollments));
          enrollment = enrollments[index];
        }
      }

      if (!enrollment) {
        return {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Iscrizione non trovata' },
          meta: { timestamp: getTimestamp(), request_id: generateId() },
        };
      }

      // Emetti evento appropriato
      if (status === 'confirmed') {
        await workflowEvents.emit(ENROLLMENT_EVENTS.ENROLLMENT_CONFIRMED, { enrollment });
      } else if (status === 'active') {
        await workflowEvents.emit(ENROLLMENT_EVENTS.STUDENT_ENROLLED, { enrollment });
      }

      return {
        success: true,
        data: enrollment,
        meta: { timestamp: getTimestamp(), request_id: generateId() },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'ENROLLMENT_UPDATE_ERROR',
          message: error instanceof Error ? error.message : 'Errore aggiornamento iscrizione',
        },
        meta: { timestamp: getTimestamp(), request_id: generateId() },
      };
    }
  },

  /**
   * Registra pagamento
   */
  async recordPayment(
    id: string,
    amount: number,
    method: 'bank_transfer' | 'credit_card' | 'paypal' | 'cash'
  ): Promise<ApiResponse<Enrollment>> {
    try {
      const updateData = {
        payment_status: 'paid',
        payment_amount: amount,
        payment_date: new Date().toISOString().split('T')[0],
      };

      let enrollment: Enrollment | null = null;

      try {
        const result = await supabase.update<any>('enrollments', id, updateData);
        if (result) enrollment = result;
      } catch {
        // Fallback localStorage
        const enrollments = JSON.parse(localStorage.getItem('eduplan_enrollments') || '[]');
        const index = enrollments.findIndex((e: any) => e.id === id);
        if (index >= 0) {
          enrollments[index] = { ...enrollments[index], ...updateData, updated_at: getTimestamp() };
          localStorage.setItem('eduplan_enrollments', JSON.stringify(enrollments));
          enrollment = enrollments[index];
        }
      }

      if (!enrollment) {
        return {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Iscrizione non trovata' },
          meta: { timestamp: getTimestamp(), request_id: generateId() },
        };
      }

      // Emetti evento pagamento
      await workflowEvents.emit(ENROLLMENT_EVENTS.PAYMENT_RECEIVED, {
        enrollment,
        amount,
        method,
      });

      return {
        success: true,
        data: enrollment,
        meta: { timestamp: getTimestamp(), request_id: generateId() },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PAYMENT_ERROR',
          message: error instanceof Error ? error.message : 'Errore registrazione pagamento',
        },
        meta: { timestamp: getTimestamp(), request_id: generateId() },
      };
    }
  },

  /**
   * Richiedi documenti
   */
  async requestDocuments(id: string, requiredDocs: string[]): Promise<ApiResponse<Enrollment>> {
    try {
      let enrollment: Enrollment | null = null;

      try {
        const results = await supabase.select<Enrollment>('enrollments', `id=eq.${id}`);
        enrollment = results.length > 0 ? results[0] : null;
      } catch {
        // Fallback localStorage
        const enrollments = JSON.parse(localStorage.getItem('eduplan_enrollments') || '[]');
        enrollment = enrollments.find((e: any) => e.id === id) || null;
      }

      if (!enrollment) {
        return {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Iscrizione non trovata' },
          meta: { timestamp: getTimestamp(), request_id: generateId() },
        };
      }

      // Emetti evento documenti richiesti
      await workflowEvents.emit(ENROLLMENT_EVENTS.DOCUMENTS_REQUIRED, {
        enrollment,
        requiredDocs,
      });

      return {
        success: true,
        data: enrollment,
        meta: { timestamp: getTimestamp(), request_id: generateId() },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'DOCUMENTS_ERROR',
          message: error instanceof Error ? error.message : 'Errore richiesta documenti',
        },
        meta: { timestamp: getTimestamp(), request_id: generateId() },
      };
    }
  },

  async getById(id: string): Promise<Enrollment | null> {
    try {
      const results = await supabase.select<Enrollment>('enrollments', `id=eq.${id}`);
      return results.length > 0 ? results[0] : null;
    } catch {
      // Fallback localStorage
      const enrollments = JSON.parse(localStorage.getItem('eduplan_enrollments') || '[]');
      return enrollments.find((e: any) => e.id === id) || null;
    }
  },

  async getByStudentId(studentId: string): Promise<Enrollment[]> {
    try {
      return await supabase.select<Enrollment>('enrollments', `student_id=eq.${studentId}`);
    } catch {
      // Fallback localStorage
      const enrollments = JSON.parse(localStorage.getItem('eduplan_enrollments') || '[]');
      return enrollments.filter((e: any) => e.student_id === studentId);
    }
  },
};

// ============================================
// LEAD SERVICE (CONTATTI) - USA TABELLA crm_leads
// ============================================

export const LeadService = {
  /**
   * Crea un nuovo contatto/lead da form sito web
   * Usa la tabella "crm_leads" su Supabase per il CRM marketing
   */
  async create(input: LeadCreateInput): Promise<ApiResponse<Lead>> {
    try {
      // Estrai UTM params dalla URL
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

      // Prepara il record per la tabella crm_leads
      // Se viene passato uno status specifico (es: 'converted' per iscrizioni) lo usa, altrimenti 'new'
      const leadData = {
        first_name: input.nome,
        last_name: input.cognome,
        email: input.email,
        phone: input.telefono || null,
        company: input.ragione_sociale || null,
        source: 'website',
        source_detail: CONFIG.SOURCE_DETAIL,
        status: input.status || 'new',
        notes: input.messaggio || input.fabbisogno_formativo || '',
        email_consent: true,
        utm_source: input.utm_source || urlParams?.get('utm_source') || null,
        utm_medium: input.utm_medium || urlParams?.get('utm_medium') || null,
        utm_campaign: input.utm_campaign || urlParams?.get('utm_campaign') || null,
        utm_content: urlParams?.get('utm_content') || null,
        landing_page: typeof window !== 'undefined' ? window.location.href : null,
        referrer: typeof document !== 'undefined' ? document.referrer || null : null,
        custom_fields: {
          course_interest: input.corso_interesse || null,
          edition_id: input.edition_id || null,
          subject: input.oggetto || 'Informazioni sui corsi',
          page_url: typeof window !== 'undefined' ? window.location.href : null,
          submitted_at: getTimestamp(),
        },
      };

      log('Invio lead a Supabase (crm_leads):', leadData);

      const result = await supabase.insert<any>('crm_leads', leadData);

      if (!result) {
        throw new Error('Nessuna risposta da Supabase');
      }

      log('Lead creato con successo:', result);

      // Converti in formato Lead per retrocompatibilità
      const lead: Lead = {
        id: result.id || generateId(),
        ragione_sociale: input.ragione_sociale,
        piva: input.piva,
        pec: input.pec,
        codice_fiscale: undefined,
        settore_ateco: input.settore_ateco,
        dimensione: input.dimensione,
        indirizzo: undefined,
        contatti: {
          telefono: input.telefono,
          email: input.email,
        },
        referenti: [{
          nome: input.nome,
          cognome: input.cognome,
          email: input.email,
          telefono: input.telefono,
        }],
        stato: 'prospect',
        fonte: input.fonte,
        interesse: 'medio',
        fabbisogno_formativo: input.fabbisogno_formativo || input.messaggio,
        created_at: result.created_at || getTimestamp(),
        updated_at: result.updated_at || getTimestamp(),
      };

      // Emetti evento per notifica locale
      await workflowEvents.emit('lead.created', {
        lead,
        corso_interesse: input.corso_interesse,
        source: input.fonte,
      });

      return {
        success: true,
        data: lead,
        meta: { timestamp: getTimestamp(), request_id: generateId() },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'LEAD_CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Errore creazione lead',
        },
        meta: { timestamp: getTimestamp(), request_id: generateId() },
      };
    }
  },

  /**
   * Aggiorna stato lead nel funnel
   */
  async updateStatus(id: string, stato: Lead['stato']): Promise<ApiResponse<Lead>> {
    try {
      // Mappa lo stato interno al formato crm_leads
      const statusMap: Record<string, string> = {
        'prospect': 'new',
        'lead': 'contacted',
        'cliente': 'converted',
        'perso': 'lost',
      };

      const result = await supabase.update<any>('crm_leads', id, {
        status: statusMap[stato] || stato
      });

      if (!result) {
        return {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Lead non trovato' },
          meta: { timestamp: getTimestamp(), request_id: generateId() },
        };
      }

      const lead: Lead = {
        id: result.id,
        ragione_sociale: result.company,
        contatti: { telefono: result.phone, email: result.email },
        referenti: [{ nome: result.first_name, cognome: result.last_name, email: result.email, telefono: result.phone }],
        stato: stato,
        fonte: result.source,
        interesse: 'medio',
        fabbisogno_formativo: result.notes,
        created_at: result.created_at,
        updated_at: getTimestamp(),
      };

      await workflowEvents.emit('lead.status.changed', { lead, new_status: stato });

      return {
        success: true,
        data: lead,
        meta: { timestamp: getTimestamp(), request_id: generateId() },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'LEAD_UPDATE_ERROR',
          message: error instanceof Error ? error.message : 'Errore aggiornamento lead',
        },
        meta: { timestamp: getTimestamp(), request_id: generateId() },
      };
    }
  },

  async getById(id: string): Promise<Lead | null> {
    try {
      const results = await supabase.select<any>('crm_leads', `id=eq.${id}`);
      if (results.length === 0) return null;

      const r = results[0];
      return {
        id: r.id,
        ragione_sociale: r.company,
        contatti: { telefono: r.phone, email: r.email },
        referenti: [{ nome: r.first_name, cognome: r.last_name, email: r.email, telefono: r.phone }],
        stato: r.status === 'new' ? 'prospect' : r.status,
        fonte: r.source,
        interesse: 'medio',
        fabbisogno_formativo: r.notes,
        created_at: r.created_at,
        updated_at: r.updated_at,
      };
    } catch {
      return null;
    }
  },

  async getAll(): Promise<Lead[]> {
    try {
      const results = await supabase.select<any>('crm_leads', 'source=eq.website');
      return results.map((r: any) => ({
        id: r.id,
        ragione_sociale: r.company,
        contatti: { telefono: r.phone, email: r.email },
        referenti: [{ nome: r.first_name, cognome: r.last_name, email: r.email, telefono: r.phone }],
        stato: r.status === 'new' ? 'prospect' : r.status,
        fonte: r.source,
        interesse: 'medio',
        fabbisogno_formativo: r.notes,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    } catch {
      return [];
    }
  },
};

// ============================================
// CONTACT SERVICE - USA TABELLA crm_contacts (v2.5)
// ============================================

export interface ContactCreateInput {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  privacyAccepted: boolean;
  marketingConsent?: boolean;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  privacy_accepted: boolean;
  marketing_consent?: boolean;
  status: 'new' | 'read' | 'replied' | 'converted' | 'archived';
  source: string;
  source_detail?: string;
  page_url?: string;
  created_at?: string;
  updated_at?: string;
}

export const ContactService = {
  /**
   * Crea un nuovo contatto da form "Inviaci un Messaggio"
   * Usa la tabella "crm_contacts" su Supabase (v2.5)
   * Per richieste informazioni generiche (NON lead qualificati)
   */
  async create(input: ContactCreateInput): Promise<ApiResponse<Contact>> {
    try {
      // Estrai UTM params dalla URL
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;

      // Prepara il record per la tabella crm_contacts
      const contactData = {
        first_name: input.firstName,
        last_name: input.lastName || null,
        email: input.email,
        phone: input.phone || null,
        company: input.company || null,
        subject: input.subject || null,
        message: input.message,
        privacy_accepted: input.privacyAccepted,
        marketing_consent: input.marketingConsent || false,
        source: 'website',
        source_detail: CONFIG.SOURCE_DETAIL,
        page_url: typeof window !== 'undefined' ? window.location.href : null,
        page_title: typeof document !== 'undefined' ? document.title : null,
        referrer: typeof document !== 'undefined' ? document.referrer || null : null,
        utm_source: urlParams?.get('utm_source') || null,
        utm_medium: urlParams?.get('utm_medium') || null,
        utm_campaign: urlParams?.get('utm_campaign') || null,
      };

      log('Invio contatto a Supabase (crm_contacts):', contactData);

      const result = await supabase.insert<any>('crm_contacts', contactData);

      if (!result) {
        throw new Error('Nessuna risposta da Supabase');
      }

      log('Contatto creato con successo:', result);

      const contact: Contact = {
        id: result.id,
        first_name: result.first_name,
        last_name: result.last_name,
        email: result.email,
        phone: result.phone,
        company: result.company,
        subject: result.subject,
        message: result.message,
        privacy_accepted: result.privacy_accepted,
        marketing_consent: result.marketing_consent,
        status: result.status || 'new',
        source: result.source,
        source_detail: result.source_detail,
        page_url: result.page_url,
        created_at: result.created_at,
        updated_at: result.updated_at,
      };

      // Emetti evento per notifica locale
      await workflowEvents.emit('contact.created', {
        contact,
        source: 'website',
      });

      return {
        success: true,
        data: contact,
        meta: { timestamp: getTimestamp(), request_id: generateId() },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CONTACT_CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Errore creazione contatto',
        },
        meta: { timestamp: getTimestamp(), request_id: generateId() },
      };
    }
  },

  async getById(id: string): Promise<Contact | null> {
    try {
      const results = await supabase.select<any>('crm_contacts', `id=eq.${id}`);
      if (results.length === 0) return null;
      return results[0] as Contact;
    } catch {
      return null;
    }
  },
};

// ============================================
// EXPORT DEFAULT
// ============================================

export default {
  configure: configureEduPlan,
  students: StudentService,
  enrollments: EnrollmentService,
  leads: LeadService,
  contacts: ContactService,
  events: workflowEvents,
};
