/**
 * Hook per corsi con Supabase Realtime + fallback polling
 *
 * STRATEGIA IBRIDA:
 * 1. Fetch iniziale dei dati via Edge Function (come prima)
 * 2. Sottoscrizione al canale Realtime per aggiornamenti
 * 3. Se Realtime non disponibile, fallback a polling (intervallo aumentato)
 *
 * RISPARMIO EGRESS:
 * - Con Realtime: ~99% risparmio (solo fetch iniziale + delta)
 * - Con fallback polling: ~80% risparmio (intervallo 5 min invece di 1 min)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getCourses,
  getCourseById,
  getCourseBySlug,
  getCourseByCode,
  invalidateCache,
} from '../services/public-courses-api';
import {
  subscribe,
  isRealtimeConnected,
  connectRealtime,
  BroadcastPayload,
  debounce,
} from '../lib/supabase-realtime';
import { CoursePublicData, CoursesQueryParams } from '../types/courses-public';

// Configurazione
const CONFIG = {
  // Polling di fallback (usato solo se Realtime non funziona)
  FALLBACK_POLLING_INTERVAL: 300000, // 5 minuti
  // Verifica connessione Realtime ogni X ms
  CONNECTION_CHECK_INTERVAL: 30000, // 30 secondi
  // Abilita/disabilita Realtime (per debug o rollback)
  REALTIME_ENABLED: true,
  // Debounce per evitare refresh multipli (ms)
  DEBOUNCE_DELAY: 500,
};

interface UseRealtimeCoursesOptions {
  category?: string;
  type?: CoursesQueryParams['type'];
  limit?: number;
  enabled?: boolean;
  // Se true, usa solo polling (ignora Realtime)
  forcePolling?: boolean;
}

interface UseRealtimeCoursesResult {
  courses: CoursePublicData[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
  // Info connessione Realtime
  isRealtime: boolean;
  connectionStatus: 'connected' | 'polling' | 'disconnected';
}

/**
 * Hook per lista corsi con Realtime
 */
export function useRealtimeCourses(options: UseRealtimeCoursesOptions = {}): UseRealtimeCoursesResult {
  const {
    category,
    type,
    limit = 50,
    enabled = true,
    forcePolling = false,
  } = options;

  const [courses, setCourses] = useState<CoursePublicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRealtime, setIsRealtime] = useState(false);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Fetch corsi
  const fetchCourses = useCallback(async (forceRefresh = false, isInitial = false) => {
    if (!enabled) return;

    try {
      setError(null);
      if (isInitial) setLoading(true);

      console.log('[useRealtimeCourses] fetchCourses chiamato con forceRefresh:', forceRefresh);

      const response = await getCourses({
        category,
        type,
        limit,
        forceRefresh,
      });

      console.log('[useRealtimeCourses] Risposta API ricevuta:', {
        success: response.success,
        total: response.meta?.total,
        fresh: response.meta?.fresh,
        coursesCount: Array.isArray(response.data) ? response.data.length : 0,
      });

      if (!isMountedRef.current) return;

      if (response.success && Array.isArray(response.data)) {
        console.log('[useRealtimeCourses] Aggiorno state con', response.data.length, 'corsi');
        // Deep clone per forzare React a rilevare il cambiamento
        setCourses(structuredClone(response.data));
        setTotal(response.meta.total);
        setLastUpdated(new Date());
      } else {
        setError(response.error || 'Errore nel recupero dei corsi');
      }
    } catch (err) {
      console.error('[useRealtimeCourses] Errore fetch:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Errore di connessione');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [category, type, limit, enabled]);

  // Gestione Realtime
  useEffect(() => {
    if (!enabled || forcePolling || !CONFIG.REALTIME_ENABLED) {
      return;
    }

    // Connetti a Realtime
    connectRealtime();

    // Debounce per evitare refresh multipli
    const debouncedRefresh = debounce(() => {
      invalidateCache();
      fetchCourses(true);
    }, CONFIG.DEBOUNCE_DELAY);

    // Sottoscrivi agli aggiornamenti corsi
    // EduPlan invia: { type: 'courses:updated', id: courseId }
    const unsubscribe = subscribe<CoursePublicData[]>('courses:updated', (payload: BroadcastPayload<CoursePublicData[]>) => {
      console.log('[useRealtimeCourses] Ricevuto broadcast courses:updated:', payload);

      // Log dell'id del corso aggiornato (se presente)
      if (payload.id) {
        console.log('[useRealtimeCourses] Corso aggiornato ID:', payload.id);
      }

      // Se il payload contiene i dati completi, usali direttamente
      if (payload.data && Array.isArray(payload.data) && payload.data.length > 0) {
        console.log('[useRealtimeCourses] Uso dati dal payload:', payload.data.length, 'corsi');
        // Deep clone per forzare React a rilevare il cambiamento
        setCourses(structuredClone(payload.data));
        setTotal(payload.data.length);
        setLastUpdated(new Date());
      } else {
        // Invalida cache e refetch - il payload contiene solo l'id del corso modificato
        console.log('[useRealtimeCourses] Invalido cache e refetch (corso modificato:', payload.id || 'non specificato', ')');
        invalidateCache();
        // Delay per dare tempo al database di propagare le modifiche
        setTimeout(() => {
          console.log('[useRealtimeCourses] Eseguo refetch dopo delay...');
          fetchCourses(true);
        }, 1000);  // 1 secondo di delay
      }
    });

    // Verifica periodicamente lo stato della connessione
    const checkConnection = setInterval(() => {
      const connected = isRealtimeConnected();
      setIsRealtime(connected);

      // Se non connesso, attiva polling di fallback
      if (!connected && !pollingIntervalRef.current) {
        console.log('[useRealtimeCourses] Realtime disconnesso, attivo polling fallback');
        startFallbackPolling();
      } else if (connected && pollingIntervalRef.current) {
        console.log('[useRealtimeCourses] Realtime riconnesso, disattivo polling');
        stopFallbackPolling();
      }
    }, CONFIG.CONNECTION_CHECK_INTERVAL);

    // Controllo iniziale
    setTimeout(() => {
      setIsRealtime(isRealtimeConnected());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(checkConnection);
      stopFallbackPolling();
    };
  }, [enabled, forcePolling, fetchCourses]);

  // Polling di fallback
  const startFallbackPolling = useCallback(() => {
    if (pollingIntervalRef.current) return;

    pollingIntervalRef.current = setInterval(() => {
      fetchCourses(true);
    }, CONFIG.FALLBACK_POLLING_INTERVAL);
  }, [fetchCourses]);

  const stopFallbackPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Se forcePolling, usa sempre polling
  useEffect(() => {
    if (!enabled) return;

    if (forcePolling || !CONFIG.REALTIME_ENABLED) {
      startFallbackPolling();
      return () => stopFallbackPolling();
    }
  }, [enabled, forcePolling, startFallbackPolling, stopFallbackPolling]);

  // Fetch iniziale
  useEffect(() => {
    isMountedRef.current = true;
    fetchCourses(false, true);

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchCourses]);

  // Refresh on window focus (ottimizzazione UX)
  useEffect(() => {
    const handleFocus = () => {
      // Refresh solo se l'ultimo aggiornamento e' piu' vecchio di 1 minuto
      if (lastUpdated && Date.now() - lastUpdated.getTime() > 60000) {
        fetchCourses(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchCourses, lastUpdated]);

  const refetch = useCallback(async () => {
    await fetchCourses(true);
  }, [fetchCourses]);

  const connectionStatus = isRealtime ? 'connected' : (pollingIntervalRef.current ? 'polling' : 'disconnected');

  return {
    courses,
    loading,
    error,
    total,
    refetch,
    lastUpdated,
    isRealtime,
    connectionStatus,
  };
}

// ============================================
// HOOK SINGOLO CORSO CON REALTIME
// ============================================

interface UseRealtimeCourseOptions {
  id?: string;
  slug?: string;
  code?: string;
  enabled?: boolean;
  forcePolling?: boolean;
}

interface UseRealtimeCourseResult {
  course: CoursePublicData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
  isRealtime: boolean;
}

/**
 * Hook per singolo corso con Realtime
 */
export function useRealtimeCourse(options: UseRealtimeCourseOptions): UseRealtimeCourseResult {
  const {
    id,
    slug,
    code,
    enabled = true,
    forcePolling = false,
  } = options;

  const [course, setCourse] = useState<CoursePublicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRealtime, setIsRealtime] = useState(false);

  const isMountedRef = useRef(true);
  // Flag per evitare fetch concorrenti
  const isFetchingRef = useRef(false);
  // Ref per la funzione fetch - evita re-render loops
  const fetchCourseRef = useRef<(forceRefresh?: boolean, isInitial?: boolean) => Promise<void>>();

  // Fetch corso
  const fetchCourse = useCallback(async (forceRefresh = false, isInitial = false) => {
    if (!enabled || (!id && !slug && !code)) {
      setLoading(false);
      return;
    }

    // Evita fetch concorrenti - se già in corso, skippa
    if (isFetchingRef.current && !isInitial) {
      console.log('[useRealtimeCourse] Fetch già in corso, skippo');
      return;
    }

    isFetchingRef.current = true;

    try {
      setError(null);
      if (isInitial) setLoading(true);

      console.log('[useRealtimeCourse] fetchCourse chiamato con forceRefresh:', forceRefresh, 'slug:', slug);

      let result: CoursePublicData | null = null;

      if (id) {
        result = await getCourseById(id, forceRefresh);
      } else if (slug) {
        result = await getCourseBySlug(slug, forceRefresh);
      } else if (code) {
        result = await getCourseByCode(code, forceRefresh);
      }

      console.log('[useRealtimeCourse] Risposta ricevuta:', {
        id: result?.id,
        title: result?.title,
        editionsCount: result?.editions?.length || 0,
      });

      if (!isMountedRef.current) return;

      console.log('[useRealtimeCourse] Aggiorno state corso con', result?.editions?.length || 0, 'edizioni');
      // IMPORTANTE: deep clone per forzare React a rilevare il cambiamento
      setCourse(result ? structuredClone(result) : null);
      setLastUpdated(new Date());

      if (!result) {
        setError('Corso non trovato');
      }
    } catch (err) {
      console.error('[useRealtimeCourse] Errore fetch:', err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Errore di connessione');
      }
    } finally {
      isFetchingRef.current = false;
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [id, slug, code, enabled]);

  // Aggiorna il ref ogni volta che fetchCourse cambia
  fetchCourseRef.current = fetchCourse;

  // Gestione Realtime per singolo corso
  useEffect(() => {
    if (!enabled || forcePolling || !CONFIG.REALTIME_ENABLED || (!id && !slug)) {
      return;
    }

    connectRealtime();

    // Sottoscrivi agli aggiornamenti del singolo corso
    const unsubscribe = subscribe<CoursePublicData>('courses:single', (payload: BroadcastPayload<CoursePublicData>) => {
      // Verifica se l'aggiornamento riguarda questo corso
      const matchesId = id && payload.id === id;
      const matchesSlug = slug && payload.slug === slug;

      if (matchesId || matchesSlug) {
        console.log('[useRealtimeCourse] Aggiornamento per questo corso:', payload);

        if (payload.data) {
          // Deep clone per forzare React a rilevare il cambiamento
          setCourse(structuredClone(payload.data));
          setLastUpdated(new Date());
        } else {
          invalidateCache();
          fetchCourseRef.current?.(true);
        }
      }
    });

    // Sottoscrivi anche a courses:updated per sync generale
    // EduPlan invia: { type: 'courses:updated', id: courseId }
    // NOTA: Usiamo un debounce per evitare chiamate multiple
    let refetchTimeout: NodeJS.Timeout | null = null;
    const unsubscribeAll = subscribe<CoursePublicData[]>('courses:updated', (payload) => {
      console.log('[useRealtimeCourse] Ricevuto broadcast courses:updated:', payload);

      // Verifica se l'aggiornamento riguarda questo corso specifico
      const isThisCourse = payload.id && (payload.id === id || payload.id === course?.id);

      if (isThisCourse) {
        console.log('[useRealtimeCourse] Aggiornamento per QUESTO corso, refetch immediato');
      } else if (payload.id) {
        console.log('[useRealtimeCourse] Aggiornamento per altro corso:', payload.id, '- ignoro');
        return; // Non è questo corso, ignora
      } else {
        console.log('[useRealtimeCourse] Aggiornamento generico, refetch per sicurezza');
      }

      // Cancella eventuali timeout precedenti per evitare chiamate multiple
      if (refetchTimeout) {
        clearTimeout(refetchTimeout);
      }

      // Delay per dare tempo al database di propagare le modifiche
      // Delay ridotto se è specificamente questo corso
      const delay = isThisCourse ? 1000 : 5000;
      refetchTimeout = setTimeout(() => {
        console.log(`[useRealtimeCourse] Invalido cache e forzo refetch (dopo ${delay}ms)...`);
        invalidateCache();
        fetchCourseRef.current?.(true);
        refetchTimeout = null;
      }, delay);
    });

    setTimeout(() => {
      setIsRealtime(isRealtimeConnected());
    }, 1000);

    return () => {
      unsubscribe();
      unsubscribeAll();
      // Cleanup del timeout pendente per evitare memory leak
      if (refetchTimeout) {
        clearTimeout(refetchTimeout);
      }
    };
  }, [enabled, forcePolling, id, slug]);  // Rimosso fetchCourse dalle dipendenze

  // Fetch iniziale
  useEffect(() => {
    isMountedRef.current = true;
    fetchCourseRef.current?.(false, true);

    return () => {
      isMountedRef.current = false;
    };
  }, [id, slug, code, enabled]);  // Dipendenze stabili

  const refetch = useCallback(async () => {
    await fetchCourse(true);
  }, [fetchCourse]);

  return {
    course,
    loading,
    error,
    refetch,
    lastUpdated,
    isRealtime,
  };
}

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Hook per ottenere lo stato della connessione Realtime
 */
export function useRealtimeStatus() {
  const [status, setStatus] = useState({
    connected: false,
    checking: true,
  });

  useEffect(() => {
    const checkStatus = () => {
      setStatus({
        connected: isRealtimeConnected(),
        checking: false,
      });
    };

    // Check iniziale
    setTimeout(checkStatus, 1000);

    // Check periodico
    const interval = setInterval(checkStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  return status;
}

export default {
  useRealtimeCourses,
  useRealtimeCourse,
  useRealtimeStatus,
};
