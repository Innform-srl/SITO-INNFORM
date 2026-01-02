/**
 * Hook per percorsi formativi con Supabase Realtime + fallback polling
 *
 * STRATEGIA IBRIDA:
 * 1. Fetch iniziale dei dati via Edge Function
 * 2. Sottoscrizione al canale Realtime per aggiornamenti
 * 3. Se Realtime non disponibile, fallback a polling
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getPaths,
  LearningPath,
  invalidatePathsCache,
} from '../services/public-paths-api';
import {
  subscribe,
  isRealtimeConnected,
  connectRealtime,
  BroadcastPayload,
} from '../lib/supabase-realtime';

// Configurazione
const CONFIG = {
  // Polling di fallback (usato solo se Realtime non funziona)
  FALLBACK_POLLING_INTERVAL: 300000, // 5 minuti
  // Verifica connessione Realtime ogni X ms
  CONNECTION_CHECK_INTERVAL: 30000, // 30 secondi
  // Abilita/disabilita Realtime
  REALTIME_ENABLED: true,
};

interface UseRealtimePathsOptions {
  enabled?: boolean;
  forcePolling?: boolean;
}

interface UseRealtimePathsResult {
  paths: LearningPath[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
  isRealtime: boolean;
  connectionStatus: 'connected' | 'polling' | 'disconnected';
}

/**
 * Hook per percorsi formativi con Realtime
 */
export function useRealtimePaths(options: UseRealtimePathsOptions = {}): UseRealtimePathsResult {
  const {
    enabled = true,
    forcePolling = false,
  } = options;

  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRealtime, setIsRealtime] = useState(false);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Fetch percorsi
  const fetchPaths = useCallback(async (forceRefresh = false, isInitial = false) => {
    if (!enabled) return;

    try {
      setError(null);
      if (isInitial) setLoading(true);

      const response = await getPaths(forceRefresh);

      if (!isMountedRef.current) return;

      if (response.success && Array.isArray(response.data)) {
        setPaths(response.data);
        setLastUpdated(new Date());
      } else {
        setError(response.error || 'Errore nel recupero dei percorsi');
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Errore di connessione');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [enabled]);

  // Gestione Realtime
  useEffect(() => {
    if (!enabled || forcePolling || !CONFIG.REALTIME_ENABLED) {
      return;
    }

    // Connetti a Realtime
    connectRealtime();

    // Sottoscrivi agli aggiornamenti percorsi
    const unsubscribe = subscribe<LearningPath[]>('paths:updated', (payload: BroadcastPayload<LearningPath[]>) => {
      console.log('[useRealtimePaths] Ricevuto aggiornamento:', payload);

      if (payload.data && Array.isArray(payload.data)) {
        setPaths(payload.data);
        setLastUpdated(new Date());
      } else {
        invalidatePathsCache();
        fetchPaths(true);
      }
    });

    // Verifica periodicamente lo stato della connessione
    const checkConnection = setInterval(() => {
      const connected = isRealtimeConnected();
      setIsRealtime(connected);

      if (!connected && !pollingIntervalRef.current) {
        console.log('[useRealtimePaths] Realtime disconnesso, attivo polling fallback');
        startFallbackPolling();
      } else if (connected && pollingIntervalRef.current) {
        console.log('[useRealtimePaths] Realtime riconnesso, disattivo polling');
        stopFallbackPolling();
      }
    }, CONFIG.CONNECTION_CHECK_INTERVAL);

    setTimeout(() => {
      setIsRealtime(isRealtimeConnected());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(checkConnection);
      stopFallbackPolling();
    };
  }, [enabled, forcePolling, fetchPaths]);

  // Polling di fallback
  const startFallbackPolling = useCallback(() => {
    if (pollingIntervalRef.current) return;

    pollingIntervalRef.current = setInterval(() => {
      fetchPaths(true);
    }, CONFIG.FALLBACK_POLLING_INTERVAL);
  }, [fetchPaths]);

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
    fetchPaths(false, true);

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchPaths]);

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      if (lastUpdated && Date.now() - lastUpdated.getTime() > 60000) {
        fetchPaths(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchPaths, lastUpdated]);

  const refetch = useCallback(async () => {
    await fetchPaths(true);
  }, [fetchPaths]);

  const connectionStatus = isRealtime ? 'connected' : (pollingIntervalRef.current ? 'polling' : 'disconnected');

  return {
    paths,
    loading,
    error,
    refetch,
    lastUpdated,
    isRealtime,
    connectionStatus,
  };
}

export default useRealtimePaths;
