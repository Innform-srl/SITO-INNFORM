/**
 * LMS API Service
 * Servizio per recuperare le iscrizioni dello studente dalla piattaforma LMS
 */

// ============================================
// CONFIGURAZIONE API LMS
// ============================================

const LMS_API_CONFIG = {
  BASE_URL: 'https://lms-innform.vercel.app/lms/api',
  API_KEY: 'a84a5cc35fd769813a3192f367a77c28b15acc39eeea3178c448d92d5f43da5a',
};

// ============================================
// TIPI PER RISPOSTA API LMS
// ============================================

export interface LmsCourse {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  isRequired?: boolean;
  minimumDuration?: number;
}

export interface LmsCertificate {
  id: string;
  certificateNumber: string;
  verificationCode: string;
  issuedAt?: string;
  downloadUrl: string;
}

export interface LmsEnrollment {
  id: string;
  tmsEnrollmentId?: string;
  course: LmsCourse;
  progress: number;
  completed: boolean;
  timeSpent: number;
  createdAt: string;
  dueDate?: string;
  completedAt?: string;
  lastActivityAt?: string;
  certificate?: LmsCertificate | null;
}

export interface LmsStudent {
  id: string;
  email: string;
  name: string;
}

export interface LmsEnrollmentsResponse {
  success: boolean;
  data?: {
    student: LmsStudent | null;
    enrollments: LmsEnrollment[];
  };
  error?: string;
  meta?: {
    requestId: string;
    timestamp: string;
    totalCount?: number;
  };
}

// ============================================
// FUNZIONI UTILITY
// ============================================

const log = (message: string, data?: unknown) => {
  if (import.meta.env.DEV) {
    console.log(`[LmsApi] ${message}`, data || '');
  }
};

// ============================================
// LMS API SERVICE
// ============================================

export const LmsApiService = {
  /**
   * Recupera le iscrizioni dello studente dalla piattaforma LMS
   * @param email Email dello studente
   * @param eduCourseIds Lista opzionale di ID corsi EDU per filtrare solo i corsi LMS mappati
   */
  async getEnrollments(email: string, eduCourseIds?: string[]): Promise<LmsEnrollmentsResponse> {
    try {
      let url = `${LMS_API_CONFIG.BASE_URL}/eduplan/enrollments?email=${encodeURIComponent(email)}`;

      // Aggiungi filtro per corsi EDU se specificato
      if (eduCourseIds && eduCourseIds.length > 0) {
        url += `&eduCourseIds=${eduCourseIds.join(',')}`;
      }

      log('Fetching LMS enrollments:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-API-Key': LMS_API_CONFIG.API_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        log('LMS API Error:', errorText);

        if (response.status === 404) {
          // Studente non trovato nel LMS - non è un errore critico
          return {
            success: true,
            data: {
              student: { id: '', email, name: '' },
              enrollments: [],
            },
          };
        }

        return {
          success: false,
          error: `Errore LMS: ${response.status}`,
        };
      }

      const result: LmsEnrollmentsResponse = await response.json();
      log('LMS enrollments response:', result);

      return result;
    } catch (error) {
      log('LMS API error:', error);
      // In caso di errore di rete, restituiamo array vuoto invece di fallire
      // Così la dashboard mostra comunque i corsi EDU
      return {
        success: true,
        data: {
          student: { id: '', email, name: '' },
          enrollments: [],
        },
      };
    }
  },

  /**
   * Converte un enrollment LMS nel formato compatibile con StudentEnrollment
   */
  convertToStudentEnrollment(lmsEnrollment: LmsEnrollment): import('./student-auth-api').StudentEnrollment {
    // Mappa lo stato LMS allo stato EDU
    let status: 'pending' | 'confirmed' | 'active' | 'completed' | 'withdrawn' | 'cancelled';
    if (lmsEnrollment.completed) {
      status = 'completed';
    } else if (lmsEnrollment.progress > 0) {
      status = 'active';
    } else {
      status = 'confirmed';
    }

    return {
      id: `lms_${lmsEnrollment.id}`,
      course_id: lmsEnrollment.course.id,
      course_code: lmsEnrollment.tmsEnrollmentId || lmsEnrollment.id,
      course_title: lmsEnrollment.course.title,
      course_category: 'LMS', // Identificatore piattaforma
      enrollment_date: lmsEnrollment.createdAt,
      status,
      payment_status: 'paid', // LMS non gestisce pagamenti
      payment_amount: 0,
      start_date: lmsEnrollment.createdAt,
      end_date: lmsEnrollment.completedAt,
      // Campi extra per LMS
      _source: 'lms' as const,
      _progress: lmsEnrollment.progress,
      _timeSpent: lmsEnrollment.timeSpent,
      _certificate: lmsEnrollment.certificate,
    };
  },
};

// Estendi il tipo StudentEnrollment per includere campi LMS
declare module './student-auth-api' {
  interface StudentEnrollment {
    _source?: 'edu' | 'lms';
    _progress?: number;
    _timeSpent?: number;
    _certificate?: LmsCertificate | null;
  }
}

export default LmsApiService;
