/**
 * Student Authentication API Service
 * Servizio per autenticazione studenti tramite API EDU (public-students-api)
 */

// ============================================
// CONFIGURAZIONE API EDU
// ============================================

const EDU_API_CONFIG = {
  BASE_URL: 'https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1',
  ENDPOINT: '/public-students-api',
  API_KEY: '78889692017718889893657167663215',
  // Supabase anon key per Authorization header
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlranFibWp5anVoa3d0ZHZ4amFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzc4MDksImV4cCI6MjA3NjYxMzgwOX0.6MqvODmDE27UtnTXgI7ZiZF1th5q4QVVxwVu_2czBcs',
};

// ============================================
// TIPI PER RISPOSTA API
// ============================================

export interface StudentEnrollment {
  id: string;
  course_id: string;
  course_code: string;
  course_title: string;
  course_category: string;
  enrollment_date: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'withdrawn' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'partial' | 'cancelled' | 'refunded';
  payment_amount: number;
  start_date?: string;
  end_date?: string;
}

export interface AuthenticatedStudent {
  id: string;
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
  postal_code?: string;
  role: string;
  active: boolean;
  enrollments: StudentEnrollment[];
}

export interface StudentApiResponse {
  success: boolean;
  data?: AuthenticatedStudent;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface LoginCredentials {
  email?: string;
  fiscal_code?: string;
}

// ============================================
// STORAGE KEYS
// ============================================

const STORAGE_KEYS = {
  STUDENT_DATA: 'innform_student_data',
  SESSION_EXPIRY: 'innform_session_expiry',
};

// Durata sessione: 24 ore
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

// ============================================
// FUNZIONI UTILITY
// ============================================

const log = (message: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(`[StudentAuth] ${message}`, data || '');
  }
};

// ============================================
// STUDENT AUTH SERVICE
// ============================================

export const StudentAuthService = {
  /**
   * Effettua il login dello studente tramite email o codice fiscale
   */
  async login(credentials: LoginCredentials): Promise<StudentApiResponse> {
    try {
      const { email, fiscal_code } = credentials;

      if (!email && !fiscal_code) {
        return {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Inserisci email o codice fiscale',
          },
        };
      }

      // Costruisci query params
      const params = new URLSearchParams();
      if (email) {
        params.append('email', email);
      } else if (fiscal_code) {
        params.append('fiscal_code', fiscal_code);
      }

      const url = `${EDU_API_CONFIG.BASE_URL}${EDU_API_CONFIG.ENDPOINT}?${params.toString()}`;
      log('Login request:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${EDU_API_CONFIG.SUPABASE_ANON_KEY}`,
          'x-api-key': EDU_API_CONFIG.API_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        log('API Error:', errorText);

        if (response.status === 404) {
          return {
            success: false,
            error: {
              code: 'STUDENT_NOT_FOUND',
              message: 'Nessun account trovato con queste credenziali. Verifica i dati inseriti.',
            },
          };
        }

        if (response.status === 401 || response.status === 403) {
          return {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Accesso non autorizzato. Riprova più tardi.',
            },
          };
        }

        return {
          success: false,
          error: {
            code: 'API_ERROR',
            message: 'Errore di connessione. Riprova più tardi.',
          },
        };
      }

      const result: StudentApiResponse = await response.json();
      log('Login response:', result);

      if (result.success && result.data) {
        // Verifica che lo studente sia attivo
        if (!result.data.active) {
          return {
            success: false,
            error: {
              code: 'ACCOUNT_INACTIVE',
              message: 'Il tuo account non è attivo. Contatta la segreteria.',
            },
          };
        }

        // Salva i dati in sessione
        this.saveSession(result.data);

        return result;
      }

      return {
        success: false,
        error: result.error || {
          code: 'LOGIN_FAILED',
          message: 'Login fallito. Verifica le credenziali.',
        },
      };
    } catch (error) {
      log('Login error:', error);
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Errore di rete. Verifica la connessione e riprova.',
        },
      };
    }
  },

  /**
   * Salva i dati della sessione in localStorage
   */
  saveSession(studentData: AuthenticatedStudent): void {
    try {
      const expiry = Date.now() + SESSION_DURATION_MS;
      localStorage.setItem(STORAGE_KEYS.STUDENT_DATA, JSON.stringify(studentData));
      localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, expiry.toString());
      log('Session saved for:', studentData.email);
    } catch (error) {
      log('Error saving session:', error);
    }
  },

  /**
   * Recupera i dati della sessione corrente
   */
  getSession(): AuthenticatedStudent | null {
    try {
      const expiryStr = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY);
      if (!expiryStr) return null;

      const expiry = parseInt(expiryStr, 10);
      if (Date.now() > expiry) {
        // Sessione scaduta
        this.logout();
        return null;
      }

      const dataStr = localStorage.getItem(STORAGE_KEYS.STUDENT_DATA);
      if (!dataStr) return null;

      return JSON.parse(dataStr) as AuthenticatedStudent;
    } catch (error) {
      log('Error getting session:', error);
      return null;
    }
  },

  /**
   * Verifica se l'utente è autenticato
   */
  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },

  /**
   * Effettua il logout
   */
  logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.STUDENT_DATA);
      localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
      log('Session cleared');
    } catch (error) {
      log('Error clearing session:', error);
    }
  },

  /**
   * Aggiorna i dati dello studente (ricarica dal server)
   */
  async refreshSession(): Promise<StudentApiResponse> {
    const currentSession = this.getSession();
    if (!currentSession) {
      return {
        success: false,
        error: {
          code: 'NO_SESSION',
          message: 'Nessuna sessione attiva',
        },
      };
    }

    // Ricarica i dati usando l'email della sessione
    return this.login({ email: currentSession.email });
  },
};

export default StudentAuthService;
