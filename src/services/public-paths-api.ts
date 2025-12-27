/**
 * Public Paths API Service
 * Servizio per ottenere i percorsi formativi pubblicati da EduPlan
 *
 * Basato sulla guida GUIDA_INTEGRAZIONE_SITO_WEB.md
 */

// URL base delle API pubbliche
const API_BASE = 'https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-paths-api';

// Supabase anon key per autenticazione API pubblica
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Configurazione
const CONFIG = {
  DEBUG: false,
  RETRY_COUNT: 3,
  RETRY_DELAY_BASE: 1000,
  CACHE_TIME: 300000, // 5 minuti - allineato con public-courses-api
};

// Corso dentro un percorso
export interface PathCourse {
  id: string;
  code: string;
  title: string;
  duration_hours: number;
  status: string;
  order: number;
}

// Tipo per un percorso formativo
export interface LearningPath {
  id: string;
  code: string;           // Codice percorso (es: "MS", "GOL")
  title: string;          // Titolo percorso (es: "Master", "GOL - Garanzia Occupabilità Lavoratori")
  slug: string;           // Slug URL
  description: string | null;
  courses: PathCourse[];  // Corsi nel percorso
  total_courses: number;
  badges: {
    new_path: boolean;
    popular: boolean;
    has_multiple_courses: boolean;
  };
}

// Risposta API
export interface PathsApiResponse {
  success: boolean;
  data: LearningPath[] | null;
  error?: string;
  meta: {
    total: number;
    timestamp: string;
  };
}

// Cache semplice in memoria
interface CacheEntry {
  data: PathsApiResponse;
  timestamp: number;
}
let pathsCache: CacheEntry | null = null;

const log = (message: string, data?: any) => {
  if (CONFIG.DEBUG) {
    console.log(`[PublicPathsAPI] ${message}`, data || '');
  }
};

/**
 * Verifica se la cache è valida
 */
const isCacheValid = (entry: CacheEntry): boolean => {
  return Date.now() - entry.timestamp < CONFIG.CACHE_TIME;
};

/**
 * Fetch con retry e exponential backoff
 */
async function fetchWithRetry(url: string, retries = CONFIG.RETRY_COUNT): Promise<PathsApiResponse> {
  for (let i = 0; i < retries; i++) {
    try {
      log(`Fetch tentativo ${i + 1}/${retries}: ${url}`);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: PathsApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'API Error');
      }

      log('Risposta ricevuta:', data.meta);
      return data;

    } catch (error) {
      log(`Errore tentativo ${i + 1}:`, error);

      if (i === retries - 1) {
        throw error;
      }

      // Exponential backoff
      const delay = CONFIG.RETRY_DELAY_BASE * Math.pow(2, i);
      log(`Attendo ${delay}ms prima del retry...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }

  throw new Error('Max retries exceeded');
}

/**
 * Recupera tutti i percorsi formativi pubblicati
 * Restituisce solo percorsi con is_learning_path=true E is_published_on_website=true
 */
export async function getPaths(forceRefresh = false): Promise<PathsApiResponse> {
  // Controlla cache (se non forceRefresh)
  if (!forceRefresh && pathsCache && isCacheValid(pathsCache)) {
    log('Dati da cache');
    return pathsCache.data;
  }

  const data = await fetchWithRetry(API_BASE);

  // Salva in cache
  pathsCache = { data, timestamp: Date.now() };

  return data;
}

/**
 * Invalida la cache
 */
export function invalidatePathsCache(): void {
  pathsCache = null;
  log('Cache invalidata');
}

export default {
  getPaths,
  invalidatePathsCache,
};
