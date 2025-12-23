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
} from '../types/courses-public';

// URL base dell'API pubblica
const API_BASE = 'https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-courses-api';

// Supabase anon key per autenticazione API pubblica
// La chiave viene letta da VITE_SUPABASE_ANON_KEY nel .env
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Configurazione
const CONFIG = {
  DEBUG: true,
  RETRY_COUNT: 3,
  RETRY_DELAY_BASE: 1000, // ms, exponential backoff
  CACHE_TIME: 60000, // 60 secondi (come da header Cache-Control)
};

// Cache semplice in memoria
interface CacheEntry {
  data: CoursesApiResponse;
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();

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
 * Verifica se la cache e' valida
 */
const isCacheValid = (entry: CacheEntry): boolean => {
  return Date.now() - entry.timestamp < CONFIG.CACHE_TIME;
};

/**
 * Costruisce l'URL con i parametri
 */
const buildUrl = (params?: CoursesQueryParams): string => {
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

  // Controlla cache (se non forceRefresh)
  if (!options?.forceRefresh) {
    const cached = cache.get(cacheKey);
    if (cached && isCacheValid(cached)) {
      log('Dati da cache');
      return cached.data;
    }
  }

  const url = buildUrl(params);
  const data = await fetchWithRetry(url);

  // Salva in cache
  cache.set(cacheKey, { data, timestamp: Date.now() });

  return data;
}

/**
 * Recupera un singolo corso per ID
 */
export async function getCourseById(id: string, forceRefresh = false): Promise<CoursePublicData | null> {
  const cacheKey = getCacheKey({ id });

  if (!forceRefresh) {
    const cached = cache.get(cacheKey);
    if (cached && isCacheValid(cached)) {
      log('Corso da cache (ID)');
      const data = cached.data.data;
      return Array.isArray(data) ? data[0] || null : data;
    }
  }

  const url = buildUrl({ id });
  const response = await fetchWithRetry(url);

  cache.set(cacheKey, { data: response, timestamp: Date.now() });

  const data = response.data;
  return Array.isArray(data) ? data[0] || null : data;
}

/**
 * Recupera un singolo corso per codice (backward compatible)
 * @deprecated Usa getCourseBySlug() invece
 */
export async function getCourseByCode(code: string, forceRefresh = false): Promise<CoursePublicData | null> {
  const cacheKey = getCacheKey({ code });

  if (!forceRefresh) {
    const cached = cache.get(cacheKey);
    if (cached && isCacheValid(cached)) {
      log('Corso da cache (code)');
      const data = cached.data.data;
      return Array.isArray(data) ? data[0] || null : data;
    }
  }

  const url = buildUrl({ code });
  const response = await fetchWithRetry(url);

  cache.set(cacheKey, { data: response, timestamp: Date.now() });

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

  if (!forceRefresh) {
    const cached = cache.get(cacheKey);
    if (cached && isCacheValid(cached)) {
      log('Corso da cache (slug)');
      const data = cached.data.data;
      return Array.isArray(data) ? data[0] || null : data;
    }
  }

  const url = buildUrl({ slug });
  const response = await fetchWithRetry(url);

  cache.set(cacheKey, { data: response, timestamp: Date.now() });

  const data = response.data;
  return Array.isArray(data) ? data[0] || null : data;
}

/**
 * Invalida la cache (utile dopo un'iscrizione)
 */
export function invalidateCache(): void {
  cache.clear();
  log('Cache invalidata');
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

// Export default
export default {
  getCourses,
  getCourseById,
  getCourseByCode,
  getCourseBySlug,
  invalidateCache,
  formatDateIT,
  formatPriceEUR,
  getOccupancyPercent,
};
