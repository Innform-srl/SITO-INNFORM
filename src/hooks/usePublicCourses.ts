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
  getCourseLessons,
  getCourseLessonsBySlug,
  invalidateCache,
  invalidateLessonsCache,
} from '../services/public-courses-api';
import { CoursePublicData, CoursesQueryParams, NextLesson } from '../types/courses-public';

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

  const fetchCourses = useCallback(async (forceRefresh = false, isInitial = false) => {
    if (!enabled) return;

    try {
      setError(null);
      // Mostra loading solo al primo caricamento
      if (isInitial) setLoading(true);

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
  }, [category, type, limit, enabled]);

  // Fetch iniziale
  useEffect(() => {
    fetchCourses(false, true);
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

  const fetchCourse = useCallback(async (forceRefresh = false, isInitial = false) => {
    if (!enabled || (!id && !slug && !code)) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      if (isInitial) setLoading(true);

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
  }, [id, slug, code, enabled]);

  // Fetch iniziale
  useEffect(() => {
    fetchCourse(false, true);
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
    invalidateLessonsCache();
  }, []);
}

// ============================================
// HOOK CALENDARIO LEZIONI
// ============================================

interface UseCourseLessonsOptions {
  courseId?: string;       // ID UUID del corso
  slug?: string;           // Website slug (alternativa a courseId)
  editionId?: string;      // ID UUID edizione (opzionale)
  pollingInterval?: number;
  enabled?: boolean;
}

interface UseCourseLessonsResult {
  lessons: NextLesson[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

/**
 * Hook per ottenere il calendario completo delle lezioni di un corso
 * Usa courseId o slug per identificare il corso
 */
export function useCourseLessons(options: UseCourseLessonsOptions): UseCourseLessonsResult {
  const {
    courseId,
    slug,
    editionId,
    pollingInterval = 60000,
    enabled = true,
  } = options;

  const [lessons, setLessons] = useState<NextLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLessons = useCallback(async (forceRefresh = false, isInitial = false) => {
    if (!enabled || (!courseId && !slug)) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      if (isInitial) setLoading(true);

      let result: NextLesson[] = [];

      if (courseId) {
        result = await getCourseLessons(courseId, editionId, forceRefresh);
      } else if (slug) {
        result = await getCourseLessonsBySlug(slug, forceRefresh);
      }

      setLessons(result);
      setLastUpdated(new Date());

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore nel recupero delle lezioni');
    } finally {
      setLoading(false);
    }
  }, [courseId, slug, editionId, enabled]);

  // Fetch iniziale
  useEffect(() => {
    fetchLessons(false, true);
  }, [fetchLessons]);

  // Polling
  useEffect(() => {
    if (!enabled || pollingInterval <= 0) return;

    const interval = setInterval(() => {
      fetchLessons(true);
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [enabled, pollingInterval, fetchLessons]);

  const refetch = useCallback(async () => {
    await fetchLessons(true);
  }, [fetchLessons]);

  return {
    lessons,
    loading,
    error,
    refetch,
    lastUpdated,
  };
}

export default {
  usePublicCourses,
  usePublicCourse,
  useCourseLessons,
  useInvalidateCoursesCache,
};
