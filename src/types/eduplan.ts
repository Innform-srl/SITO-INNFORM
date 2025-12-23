/**
 * EduPlan TypeScript Interfaces
 * Tipi per l'integrazione tra sito Innform.eu e piattaforma EduPlan
 * 
 * Basato sulla struttura dati di EduPlan (React 18 + Vite + Tailwind)
 */

// ============================================
// OGGETTO STUDENT (Studente/Corsista)
// ============================================

export interface Student {
  id: string;                          // UUID/string - Identificativo univoco
  first_name: string;                  // VARCHAR(100) - Nome
  last_name: string;                   // VARCHAR(100) - Cognome
  full_name?: string;                  // string - Nome completo (derivato)
  email: string;                       // VARCHAR(255) - Email (unique)
  phone?: string;                      // VARCHAR(20) - Telefono
  fiscal_code?: string;                // VARCHAR(16) - Codice fiscale (unique)
  birth_date?: string;                 // DATE - Data di nascita (ISO format)
  birth_place?: string;                // VARCHAR(100) - Luogo di nascita
  address?: string;                    // TEXT - Indirizzo
  city?: string;                       // VARCHAR(100) - Città
  province?: string;                   // VARCHAR(2) - Provincia
  zip_code?: string;                   // VARCHAR(10) - CAP
  role: 'student' | 'instructor' | 'admin';  // Ruolo
  organization_id?: string;            // UUID - Azienda di appartenenza
  qualifications?: Qualification[];    // JSONB - Qualifiche/competenze
  notes?: string;                      // TEXT - Note
  created_at?: string;                 // TIMESTAMP
  updated_at?: string;                 // TIMESTAMP
}

export interface Qualification {
  name: string;
  issuer?: string;
  date?: string;
  expiry?: string;
}

// Input per creazione studente da form sito web
export interface StudentCreateInput {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  fiscal_code?: string;
  birth_date?: string;
  birth_place?: string;
  address?: string;
  city?: string;
  province?: string;
  zip_code?: string;
}

// ============================================
// OGGETTO ENROLLMENT (Iscrizione)
// ============================================

export type EnrollmentStatus = 
  | 'pending'      // In attesa di conferma
  | 'active'       // Attiva
  | 'confirmed'    // Confermata
  | 'completed'    // Completata
  | 'withdrawn'    // Ritirato
  | 'cancelled'    // Annullata
  | 'failed'       // Non superata
  | 'suspended';   // Sospesa

export type PaymentStatus = 
  | 'pending'      // In attesa
  | 'paid'         // Pagato
  | 'partial'      // Parziale
  | 'cancelled'    // Annullato
  | 'refunded'     // Rimborsato
  | 'overdue';     // Scaduto

export interface Enrollment {
  id: string;                          // UUID/string - Identificativo univoco
  course_id: string;                   // UUID - ID corso (FK)
  project_id?: string;                 // UUID - ID progetto (FK)
  student_id: string;                  // UUID - ID studente (FK)
  person_id?: string;                  // UUID - Alias per student_id
  company_id?: string;                 // UUID - ID azienda (opzionale)
  enrollment_date: string;             // DATE - Data iscrizione
  status: EnrollmentStatus;            // ENUM - Stato iscrizione
  payment_status: PaymentStatus;       // ENUM - Stato pagamento
  payment_amount?: number;             // DECIMAL(10,2) - Importo
  payment_date?: string;               // DATE - Data pagamento
  invoice_number?: string;             // VARCHAR(50) - Numero fattura
  notes?: string;                      // TEXT - Note
  created_by?: string;                 // UUID - Creato da
  created_at?: string;                 // TIMESTAMP
  updated_at?: string;                 // TIMESTAMP
  metadata?: Record<string, any>;      // JSONB - Dati aggiuntivi
}

// Input per creazione iscrizione da form sito web
export interface EnrollmentCreateInput {
  course_id: string;
  student_id: string;
  project_id?: string;
  company_id?: string;
  enrollment_date?: string;            // Default: oggi
  payment_amount?: number;
  notes?: string;
  source?: 'website' | 'phone' | 'email' | 'walk-in' | 'partner';
  metadata?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    referrer?: string;
    landing_page?: string;
  };
}

// ============================================
// OGGETTO LEAD/PROSPECT (Potenziale Cliente)
// ============================================

export type LeadStatus = 
  | 'prospect'     // Primo contatto
  | 'lead'         // Interesse confermato
  | 'cliente'      // Cliente attivo
  | 'inattivo';    // Non più attivo

export type LeadInterest = 'alto' | 'medio' | 'basso';
export type LeadDimension = 'micro' | 'piccola' | 'media' | 'grande';

export interface LeadAddress {
  via?: string;
  citta?: string;
  cap?: string;
  provincia?: string;
}

export interface LeadContact {
  telefono?: string;
  email?: string;
  sitoweb?: string;
}

export interface LeadReferent {
  nome: string;
  cognome: string;
  ruolo?: string;
  email?: string;
  telefono?: string;
}

export interface LeadDocument {
  tipo: string;
  file: string;
  dataScadenza?: string;
}

export interface LeadDeadline {
  tipologia: string;
  dataScadenza: string;
  note?: string;
}

export interface Lead {
  id: string;                          // BIGSERIAL/UUID - Identificativo
  ragione_sociale?: string;            // VARCHAR(255) - Nome azienda
  piva?: string;                       // VARCHAR(20) - Partita IVA
  codice_fiscale?: string;             // VARCHAR(16) - Codice fiscale
  pec?: string;                        // VARCHAR(255) - PEC
  indirizzo?: LeadAddress;             // JSONB - Indirizzo completo
  contatti?: LeadContact;              // JSONB - Contatti
  referenti?: LeadReferent[];          // ARRAY - Referenti aziendali
  settore_ateco?: string;              // VARCHAR(10) - Settore ATECO
  dimensione?: LeadDimension;          // ENUM - Dimensione azienda
  stato: LeadStatus;                   // ENUM - Stato nel funnel
  fonte?: string;                      // VARCHAR(100) - Come ci ha conosciuto
  interesse: LeadInterest;             // ENUM - Livello interesse
  intermediario_id?: string;           // BIGINT - ID commerciale assegnato
  fabbisogno_formativo?: string;       // TEXT - Esigenze formative
  scadenze?: LeadDeadline[];           // ARRAY - Scadenze
  documenti?: LeadDocument[];          // ARRAY - Documenti
  created_at?: string;                 // TIMESTAMP
  updated_at?: string;                 // TIMESTAMP
}

// Input per creazione lead da form sito web
export interface LeadCreateInput {
  // Per aziende
  ragione_sociale?: string;
  piva?: string;
  pec?: string;
  settore_ateco?: string;
  dimensione?: LeadDimension;
  
  // Per privati (referente principale)
  nome: string;
  cognome: string;
  email: string;
  telefono?: string;
  
  // Interesse
  corso_interesse?: string;            // ID o nome del corso
  messaggio?: string;                  // Messaggio libero
  fabbisogno_formativo?: string;
  
  // Tracking
  fonte: string;                       // es: 'website', 'google', 'facebook'
  landing_page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;

  // Status opzionale (default: 'new')
  // Usare 'enrolled' per lead da iscrizioni dirette
  status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'enrolled' | 'alumni' | 'lost' | 'dormant';

  // Campo oggetto per form contatto
  oggetto?: string;
}

// ============================================
// WORKFLOW EVENTS
// ============================================

export const ENROLLMENT_EVENTS = {
  // Iscrizioni
  STUDENT_ENROLLED: 'enrollment.student.enrolled',
  STUDENT_WITHDRAWN: 'enrollment.student.withdrawn',
  ENROLLMENT_CONFIRMED: 'enrollment.confirmed',
  ENROLLMENT_PENDING: 'enrollment.pending',
  
  // Pagamenti
  PAYMENT_RECEIVED: 'enrollment.payment.received',
  PAYMENT_PENDING: 'enrollment.payment.pending',
  PAYMENT_OVERDUE: 'enrollment.payment.overdue',
  
  // Documenti
  DOCUMENTS_REQUIRED: 'enrollment.documents.required',
  DOCUMENTS_RECEIVED: 'enrollment.documents.received',
  DOCUMENTS_APPROVED: 'enrollment.documents.approved',
} as const;

export const COURSE_EVENTS = {
  CREATED: 'course.created',
  PUBLISHED: 'course.published',
  STARTING_SOON: 'course.starting.soon',
  CAPACITY_FULL: 'course.capacity.full',
  CAPACITY_WARNING: 'course.capacity.warning',
  STATUS_CHANGED: 'course.status.changed',
} as const;

export const NOTIFICATION_EVENTS = {
  EMAIL_SENT: 'notification.email.sent',
  SMS_SENT: 'notification.sms.sent',
  SCHEDULED: 'notification.scheduled',
} as const;

export type EnrollmentEventType = typeof ENROLLMENT_EVENTS[keyof typeof ENROLLMENT_EVENTS];
export type CourseEventType = typeof COURSE_EVENTS[keyof typeof COURSE_EVENTS];
export type NotificationEventType = typeof NOTIFICATION_EVENTS[keyof typeof NOTIFICATION_EVENTS];

// Payload per eventi workflow
export interface WorkflowEventPayload {
  event: string;
  timestamp: string;
  source: 'website' | 'admin' | 'api' | 'system';
  data: Record<string, any>;
  metadata?: {
    user_agent?: string;
    ip_address?: string;
    session_id?: string;
  };
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    timestamp: string;
    request_id: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
