/**
 * Tipi per l'API pubblica dei corsi EduPlan
 * Basato sulla guida GUIDA_INTEGRAZIONE_SITO_WEB.md
 */

// Tipo del corso
export type CourseType = 'classroom' | 'online' | 'hybrid' | 'elearning';

// Livello del corso
export type CourseLevel = 'base' | 'intermediate' | 'advanced';

// Badge dinamici per UI
export interface CourseBadges {
  last_spots: boolean;       // < 3 posti disponibili
  enrollments_open: boolean; // Iscrizioni aperte
  starting_soon: boolean;    // Inizia entro 14 giorni
  deadline_soon: boolean;    // Deadline entro 7 giorni
  sold_out: boolean;         // Esaurito
  new_course: boolean;       // Creato negli ultimi 30 giorni
  has_multiple_editions?: boolean; // true se total_editions > 1 (v3.0)
  already_started?: boolean; // true se days_until_start < 0 (v3.7) - corso già iniziato
}

// Badge specifici per edizione
export interface EditionBadges {
  last_spots: boolean;
  sold_out: boolean;
  starting_soon: boolean;
  deadline_soon: boolean;
  already_started?: boolean; // true se days_until_start < 0 (v3.7) - edizione già iniziata
}

// Status edizione
export type EditionStatus = 'draft' | 'published' | 'active' | 'completed' | 'cancelled';

// Edizione del corso (v3.0)
export interface CourseEdition {
  id: string;                       // UUID edizione
  edition_number: number;           // 1, 2, 3...
  edition_name: string | null;      // "Edizione Gennaio", "Ed. Serale", etc.

  // Date edizione
  start_date: string;               // YYYY-MM-DD (obbligatorio)
  end_date: string | null;
  enrollment_deadline: string | null;

  // Disponibilita' edizione
  max_participants: number;
  enrolled_count: number;
  available_spots: number;

  // Info aggiuntive
  location: string | null;
  price: number | null;
  status: EditionStatus;

  // Calcolati
  days_until_start: number | null;
  days_until_deadline: number | null;
  is_enrollments_open: boolean;

  // Docente edizione
  teacher: CourseTeacher | null;

  // Badge specifici edizione
  badges: EditionBadges;
}

// Lezione prossima
export interface NextLesson {
  date: string;        // YYYY-MM-DD
  start_time: string;  // HH:MM:SS
  end_time: string;    // HH:MM:SS
  title: string;       // Titolo/note lezione
  description?: string; // Descrizione opzionale della lezione
}

// Lezione per calendario completo (alias per chiarezza)
export type CourseLesson = NextLesson;

// Docente
export interface CourseTeacher {
  name: string;  // Nome completo
}

// Coordinatore (v4.5)
export interface CourseCoordinator {
  name: string;   // Nome e cognome
  email: string;  // Email
  phone: string;  // Numero di telefono
}

// Struttura principale CoursePublicData
export interface CoursePublicData {
  // Dati base
  id: string;                    // UUID del corso
  code: string;                  // Codice interno (es: "TAA", "EEC")
  website_slug: string;          // Slug per URL (es: "tecnico-analisi-alimentari") - AUTO-GENERATO dal titolo
  title: string;                 // Titolo del corso
  description: string | null;    // Descrizione
  category: string;              // Categoria (es: "Sicurezza", "Informatica")
  type: CourseType;
  level: CourseLevel | null;
  duration_hours: number;        // Ore totali
  price: number;                 // Prezzo in EUR
  location: string | null;       // Sede (se in presenza)

  // Date
  start_date: string | null;     // Data inizio (YYYY-MM-DD)
  end_date: string | null;       // Data fine (YYYY-MM-DD)
  enrollment_deadline: string | null;  // Deadline iscrizioni

  // Disponibilita' (TEMPO REALE)
  max_participants: number;      // Posti totali
  enrolled_count: number;        // Iscritti attuali
  available_spots: number;       // Posti disponibili
  is_enrollments_open: boolean;  // Iscrizioni aperte?
  days_until_deadline: number | null;  // Giorni alla deadline
  days_until_start: number | null;     // Giorni all'inizio

  // Badge per UI
  badges: CourseBadges;

  // ============================================
  // EDIZIONI (v3.0)
  // ============================================
  total_editions?: number;        // Numero totale edizioni
  available_editions?: number;    // Edizioni con posti disponibili
  editions?: CourseEdition[];     // Array edizioni

  // Prossime lezioni (max 3)
  next_lessons: NextLesson[];

  // Docente
  teacher: CourseTeacher | null;

  // Coordinatore (v4.5) - mostrato solo se pubblicato dall'admin
  coordinator: CourseCoordinator | null;
}

// Risposta API lista corsi
export interface CoursesApiResponse {
  success: boolean;
  data: CoursePublicData[] | CoursePublicData | null;
  error?: string;
  meta: {
    total: number;      // Totale corsi trovati
    limit: number;      // Limite applicato
    offset: number;     // Offset applicato
    returned: number;   // Numero elementi restituiti
    timestamp: string;  // ISO timestamp della risposta
  };
}

// Parametri per la query
export interface CoursesQueryParams {
  status?: string;     // Filtra per stato (virgola-separati)
  category?: string;   // Filtra per categoria
  type?: CourseType;   // Filtra per tipo
  limit?: number;      // Numero massimo risultati (default 50)
  offset?: number;     // Offset per paginazione
  id?: string;         // UUID specifico
  code?: string;       // Codice interno (backward compatible)
  slug?: string;       // Website slug (CONSIGLIATO) - es: "tecnico-analisi-alimentari"
}
