/**
 * Hook per gestire i percorsi formativi pubblici con polling automatico
 * Basato sulla guida GUIDA_INTEGRAZIONE_SITO_WEB.md
 */

import { useState, useEffect, useCallback } from 'react';
import { getPaths, LearningPath, invalidatePathsCache } from '../services/public-paths-api';

interface UsePathsOptions {
  pollingInterval?: number; // ms, default 300000 (5 minuti)
  enabled?: boolean;        // default true
}

interface UsePathsResult {
  paths: LearningPath[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

/**
 * Hook per ottenere i percorsi formativi con polling automatico
 */
export function usePublicPaths(options: UsePathsOptions = {}): UsePathsResult {
  const {
    pollingInterval = 300000, // 5 minuti - allineato con la cache
    enabled = true,
  } = options;

  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPaths = useCallback(async (forceRefresh = false, isInitial = false) => {
    if (!enabled) return;

    try {
      setError(null);
      // Mostra loading solo al primo caricamento
      if (isInitial) setLoading(true);

      const response = await getPaths(forceRefresh);

      if (response.success && Array.isArray(response.data)) {
        setPaths(response.data);
        setLastUpdated(new Date());
      } else {
        setError(response.error || 'Errore nel recupero dei percorsi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore di connessione');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  // Fetch iniziale
  useEffect(() => {
    fetchPaths(false, true);
  }, [fetchPaths]);

  // Polling automatico
  useEffect(() => {
    if (!enabled || pollingInterval <= 0) return;

    const interval = setInterval(() => {
      fetchPaths(true); // Force refresh per aggiornare dati
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [enabled, pollingInterval, fetchPaths]);

  const refetch = useCallback(async () => {
    await fetchPaths(true);
  }, [fetchPaths]);

  return {
    paths,
    loading,
    error,
    refetch,
    lastUpdated,
  };
}

/**
 * Hook per invalidare la cache dei percorsi
 */
export function useInvalidatePathsCache() {
  return useCallback(() => {
    invalidatePathsCache();
  }, []);
}

export default usePublicPaths;
