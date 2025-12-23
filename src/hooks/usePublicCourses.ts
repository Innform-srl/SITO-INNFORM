/**
 * Hook per gestire i corsi pubblici con polling automatico
 * Basato sulla guida GUIDA_INTEGRAZIONE_SITO_WEB.md
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getCourses,
  getCourseById,
  getCourseByCode,
  getCourseBySlug,
  invalidateCache,
} from '../services/public-courses-api';
import { CoursePublicData, CoursesQueryParams } from '../types/courses-public';

interface UseCoursesOptions {
  category?: string;
  type?: CoursesQueryParams['type'];
  limit?: number;
  pollingInterval?: number; // ms, default 60000 (1 minuto)
  enabled?: boolean;        // default true
}

interface UseCoursesResult {
  courses: CoursePublicData[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

/**
 * Hook per ottenere la lista dei corsi con polling automatico
 */
export function usePublicCourses(options: UseCoursesOptions = {}): UseCoursesResult {
  const {
    category,
    type,
    limit = 50,
    pollingInterval = 60000,
    enabled = true,
  } = options;

  const [courses, setCourses] = useState<CoursePublicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCourses = useCallback(async (forceRefresh = false) => {
    if (!enabled) return;

    try {
      setError(null);
      // Non mostrare loading se e' un refresh in background
      if (!lastUpdated) setLoading(true);

      const response = await getCourses({
        category,
        type,
        limit,
        forceRefresh,
      });

      if (response.success && Array.isArray(response.data)) {
        setCourses(response.data);
        setTotal(response.meta.total);
        setLastUpdated(new Date());
      } else {
        setError(response.error || 'Errore nel recupero dei corsi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore di connessione');
    } finally {
      setLoading(false);
    }
  }, [category, type, limit, enabled, lastUpdated]);

  // Fetch iniziale
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Polling automatico
  useEffect(() => {
    if (!enabled || pollingInterval <= 0) return;

    const interval = setInterval(() => {
      fetchCourses(true); // Force refresh per aggiornare dati
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [enabled, pollingInterval, fetchCourses]);

  const refetch = useCallback(async () => {
    await fetchCourses(true);
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    total,
    refetch,
    lastUpdated,
  };
}

interface UseCourseOptions {
  id?: string;
  slug?: string;           // CONSIGLIATO - website_slug generato dal titolo
  code?: string;           // Deprecated - usa slug invece
  pollingInterval?: number;
  enabled?: boolean;
}

interface UseCourseResult {
  course: CoursePublicData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

/**
 * Hook per ottenere un singolo corso (per ID, slug o code) con polling
 * Priorita': id > slug > code
 * CONSIGLIATO: usare slug (website_slug generato automaticamente dal titolo)
 */
export function usePublicCourse(options: UseCourseOptions): UseCourseResult {
  const {
    id,
    slug,
    code,
    pollingInterval = 60000,
    enabled = true,
  } = options;

  const [course, setCourse] = useState<CoursePublicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCourse = useCallback(async (forceRefresh = false) => {
    if (!enabled || (!id && !slug && !code)) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      if (!lastUpdated) setLoading(true);

      let result: CoursePublicData | null = null;

      // Priorita': id > slug > code
      if (id) {
        result = await getCourseById(id, forceRefresh);
      } else if (slug) {
        result = await getCourseBySlug(slug, forceRefresh);
      } else if (code) {
        result = await getCourseByCode(code, forceRefresh);
      }

      setCourse(result);
      setLastUpdated(new Date());

      if (!result && (id || slug || code)) {
        setError('Corso non trovato');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore di connessione');
    } finally {
      setLoading(false);
    }
  }, [id, slug, code, enabled, lastUpdated]);

  // Fetch iniziale
  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  // Polling
  useEffect(() => {
    if (!enabled || pollingInterval <= 0) return;

    const interval = setInterval(() => {
      fetchCourse(true);
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [enabled, pollingInterval, fetchCourse]);

  const refetch = useCallback(async () => {
    await fetchCourse(true);
  }, [fetchCourse]);

  return {
    course,
    loading,
    error,
    refetch,
    lastUpdated,
  };
}

/**
 * Hook per invalidare la cache (utile dopo iscrizione)
 */
export function useInvalidateCoursesCache() {
  return useCallback(() => {
    invalidateCache();
  }, []);
}

export default {
  usePublicCourses,
  usePublicCourse,
  useInvalidateCoursesCache,
};
