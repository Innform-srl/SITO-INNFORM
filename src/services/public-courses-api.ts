/**
 * Public Courses API Service
 * Servizio per ottenere dati in tempo reale dei corsi da EduPlan
 *
 * Basato sulla guida GUIDA_INTEGRAZIONE_SITO_WEB.md
 */

import {
  CoursePublicData,
  CoursesApiResponse,
  CoursesQueryParams,
  NextLesson,
} from '../types/courses-public';

// URL base delle API pubbliche
const API_BASE = 'https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-courses-api';
const LESSONS_API_BASE = 'https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-lessons-api';

// Supabase anon key per autenticazione API pubblica
// La chiave viene letta da VITE_SUPABASE_ANON_KEY nel .env
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Configurazione
const CONFIG = {
  DEBUG: false, // Disabilitato in produzione per ridurre overhead
  RETRY_COUNT: 3,
  RETRY_DELAY_BASE: 1000, // ms, exponential backoff
  CACHE_TIME: 300000, // 5 minuti - compromesso tra reattività e risparmio egress
};

// Cache semplice in memoria con versioning per gestire invalidazioni
interface CacheEntry {
  data: CoursesApiResponse;
  timestamp: number;
  version: number;  // Versione della cache quando l'entry è stata creata
}
const cache = new Map<string, CacheEntry>();
let cacheVersion = 0;  // Incrementato ad ogni invalidateCache()

const log = (message: string, data?: any) => {
  if (CONFIG.DEBUG) {
    console.log(`[PublicCoursesAPI] ${message}`, data || '');
  }
};

/**
 * Genera la chiave cache basata sui parametri
 */
const getCacheKey = (params?: CoursesQueryParams): string => {
  return JSON.stringify(params || {});
};

/**
 * Verifica se la cache e' valida (tempo + versione)
 */
const isCacheValid = (entry: CacheEntry): boolean => {
  // La cache è valida solo se non è scaduta E ha la versione corrente
  return Date.now() - entry.timestamp < CONFIG.CACHE_TIME && entry.version === cacheVersion;
};

/**
 * Costruisce l'URL con i parametri
 */
const buildUrl = (params?: CoursesQueryParams, bustCache = false): string => {
  const url = new URL(API_BASE);

  if (params) {
    if (params.id) url.searchParams.set('id', params.id);
    if (params.slug) url.searchParams.set('slug', params.slug);  // CONSIGLIATO - usa website_slug
    if (params.code) url.searchParams.set('code', params.code);  // backward compatible
    if (params.status) url.searchParams.set('status', params.status);
    if (params.category) url.searchParams.set('category', params.category);
    if (params.type) url.searchParams.set('type', params.type);
    if (params.limit) url.searchParams.set('limit', String(params.limit));
    if (params.offset) url.searchParams.set('offset', String(params.offset));
  }

  // Aggiungi timestamp per bypassare cache HTTP quando richiesto
  if (bustCache) {
    url.searchParams.set('_t', String(Date.now()));
  }

  return url.toString();
};

/**
 * Fetch con retry e exponential backoff
 */
async function fetchWithRetry(url: string, retries = CONFIG.RETRY_COUNT): Promise<CoursesApiResponse> {
  for (let i = 0; i < retries; i++) {
    try {
      log(`Fetch tentativo ${i + 1}/${retries}: ${url}`);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
        // Cache bypass gestito lato server con parametro _t nell'URL
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: CoursesApiResponse = await response.json();

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
 * Recupera tutti i corsi pubblicati
 */
export async function getCourses(options?: {
  category?: string;
  type?: CoursesQueryParams['type'];
  limit?: number;
  offset?: number;
  forceRefresh?: boolean;
}): Promise<CoursesApiResponse> {
  const params: CoursesQueryParams = {
    category: options?.category,
    type: options?.type,
    limit: options?.limit,
    offset: options?.offset,
  };

  const cacheKey = getCacheKey(params);
  const requestVersion = cacheVersion;

  // Controlla cache (se non forceRefresh)
  if (!options?.forceRefresh) {
    const cached = cache.get(cacheKey);
    if (cached && isCacheValid(cached)) {
      log('Dati da cache');
      return cached.data;
    }
  }

  const url = buildUrl(params, options?.forceRefresh);
  const data = await fetchWithRetry(url);

  // Salva in cache SOLO se la versione non è cambiata durante la fetch
  if (requestVersion === cacheVersion) {
    cache.set(cacheKey, { data, timestamp: Date.now(), version: cacheVersion });
  }

  return data;
}

/**
 * Recupera un singolo corso per ID
 */
export async function getCourseById(id: string, forceRefresh = false): Promise<CoursePublicData | null> {
  const cacheKey = getCacheKey({ id });
  const requestVersion = cacheVersion;

  if (!forceRefresh) {
    const cached = cache.get(cacheKey);
    if (cached && isCacheValid(cached)) {
      log('Corso da cache (ID)');
      const data = cached.data.data;
      return Array.isArray(data) ? data[0] || null : data;
    }
  }

  const url = buildUrl({ id }, forceRefresh);
  const response = await fetchWithRetry(url);

  if (requestVersion === cacheVersion) {
    cache.set(cacheKey, { data: response, timestamp: Date.now(), version: cacheVersion });
  }

  const data = response.data;
  return Array.isArray(data) ? data[0] || null : data;
}

/**
 * Recupera un singolo corso per codice (backward compatible)
 * @deprecated Usa getCourseBySlug() invece
 */
export async function getCourseByCode(code: string, forceRefresh = false): Promise<CoursePublicData | null> {
  const cacheKey = getCacheKey({ code });
  const requestVersion = cacheVersion;

  if (!forceRefresh) {
    const cached = cache.get(cacheKey);
    if (cached && isCacheValid(cached)) {
      log('Corso da cache (code)');
      const data = cached.data.data;
      return Array.isArray(data) ? data[0] || null : data;
    }
  }

  const url = buildUrl({ code }, forceRefresh);
  const response = await fetchWithRetry(url);

  if (requestVersion === cacheVersion) {
    cache.set(cacheKey, { data: response, timestamp: Date.now(), version: cacheVersion });
  }

  const data = response.data;
  return Array.isArray(data) ? data[0] || null : data;
}

/**
 * Recupera un singolo corso per website_slug (CONSIGLIATO)
 * Lo slug e' generato automaticamente dal titolo del corso su EduPlan
 * Es: "Tecnico Analisi Alimentari" -> "tecnico-analisi-alimentari"
 */
export async function getCourseBySlug(slug: string, forceRefresh = false): Promise<CoursePublicData | null> {
  const cacheKey = getCacheKey({ slug });
  // Cattura la versione all'inizio - se cambia durante la fetch, non salviamo dati stale
  const requestVersion = cacheVersion;

  if (!forceRefresh) {
    const cached = cache.get(cacheKey);
    if (cached && isCacheValid(cached)) {
      log('Corso da cache (slug)');
      const data = cached.data.data;
      const result = Array.isArray(data) ? data[0] || null : data;
      console.log('[PublicCoursesAPI] getCourseBySlug DA CACHE:', slug, '- edizioni:', result?.editions?.length || 0);
      return result;
    }
  }

  console.log('[PublicCoursesAPI] getCourseBySlug FETCH NETWORK:', slug, '- forceRefresh:', forceRefresh);
  const url = buildUrl({ slug }, forceRefresh);
  const response = await fetchWithRetry(url);

  // Salva in cache SOLO se la versione non è cambiata durante la fetch
  // Questo previene che dati vecchi (da richieste pre-invalidazione) sovrascrivano dati freschi
  if (requestVersion === cacheVersion) {
    cache.set(cacheKey, { data: response, timestamp: Date.now(), version: cacheVersion });
  } else {
    console.log('[PublicCoursesAPI] Skip cache save - versione cambiata durante fetch (', requestVersion, '->', cacheVersion, ')');
  }

  const data = response.data;
  const result = Array.isArray(data) ? data[0] || null : data;
  console.log('[PublicCoursesAPI] getCourseBySlug RISULTATO:', slug, '- edizioni:', result?.editions?.length || 0, '- fresh:', response.meta?.fresh);
  return result;
}

/**
 * Invalida la cache (utile dopo un'iscrizione o aggiornamento realtime)
 * Incrementa la versione per invalidare anche le entry che verranno scritte
 * da richieste in flight che erano partite prima dell'invalidazione
 */
export function invalidateCache(): void {
  cacheVersion++;  // Incrementa versione - tutte le entry esistenti diventeranno invalide
  cache.clear();
  console.log('[PublicCoursesAPI] Cache invalidata, nuova versione:', cacheVersion);
}

/**
 * Utility: formatta data in italiano
 */
export function formatDateIT(dateString: string | null): string {
  if (!dateString) return 'Da definire';
  try {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Utility: formatta prezzo in EUR
 */
export function formatPriceEUR(price: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

/**
 * Utility: calcola percentuale posti occupati
 */
export function getOccupancyPercent(course: CoursePublicData): number {
  if (course.max_participants === 0) return 0;
  return Math.round((course.enrolled_count / course.max_participants) * 100);
}

// ============================================
// API CALENDARIO LEZIONI
// ============================================

interface LessonsApiResponse {
  success: boolean;
  data: NextLesson[] | null;
  error?: string;
  meta: {
    total: number;
    course_id?: string;
    edition_id?: string;
    timestamp: string;
  };
}

// Cache per lezioni
const lessonsCache = new Map<string, { data: LessonsApiResponse; timestamp: number }>();

// Flag per abilitare API lezioni
// Endpoint public-lessons-api attivo dal 23/12/2025 (v5.1)
const LESSONS_API_ENABLED = true;

/**
 * Recupera il calendario completo delle lezioni per un corso o edizione
 * @param courseId - ID UUID del corso
 * @param editionId - ID UUID dell'edizione (opzionale)
 * @param forceRefresh - Forza refresh cache
 *
 * NOTA: L'endpoint public-lessons-api deve essere creato su EduPlan.
 * Impostare LESSONS_API_ENABLED = true quando l'endpoint sarà disponibile.
 */
export async function getCourseLessons(
  courseId: string,
  editionId?: string,
  forceRefresh = false
): Promise<NextLesson[]> {
  // API lezioni non ancora disponibile - ritorna array vuoto senza chiamate
  if (!LESSONS_API_ENABLED) {
    return [];
  }

  const cacheKey = `lessons:${courseId}:${editionId || 'all'}`;

  // Controlla cache
  if (!forceRefresh) {
    const cached = lessonsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_TIME) {
      log('Lezioni da cache');
      return cached.data.data || [];
    }
  }

  try {
    const url = new URL(LESSONS_API_BASE);
    url.searchParams.set('course_id', courseId);
    if (editionId) {
      url.searchParams.set('edition_id', editionId);
    }

    log(`Fetch lezioni: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: LessonsApiResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Errore API lezioni');
    }

    // Salva in cache
    lessonsCache.set(cacheKey, { data, timestamp: Date.now() });

    log('Lezioni ricevute:', data.meta);
    return data.data || [];

  } catch (error) {
    log('Errore fetch lezioni:', error);
    // In caso di errore, ritorna array vuoto
    return [];
  }
}

/**
 * Recupera lezioni per slug corso
 * @param slug - Website slug del corso
 * @param forceRefresh - Forza refresh cache
 */
export async function getCourseLessonsBySlug(
  slug: string,
  forceRefresh = false
): Promise<NextLesson[]> {
  // Prima recupera il corso per ottenere l'ID
  const course = await getCourseBySlug(slug, forceRefresh);
  if (!course) {
    log('Corso non trovato per slug:', slug);
    return [];
  }

  return getCourseLessons(course.id, undefined, forceRefresh);
}

/**
 * Invalida cache lezioni
 */
export function invalidateLessonsCache(): void {
  lessonsCache.clear();
  log('Cache lezioni invalidata');
}

// Export default
export default {
  getCourses,
  getCourseById,
  getCourseByCode,
  getCourseBySlug,
  getCourseLessons,
  getCourseLessonsBySlug,
  invalidateCache,
  invalidateLessonsCache,
  formatDateIT,
  formatPriceEUR,
  getOccupancyPercent,
};
