/**
 * Supabase Realtime Client per EduPlan
 *
 * Implementa la connessione Realtime via Broadcast Channel.
 * EduPlan invia broadcast quando i dati cambiano, il sito riceve gli aggiornamenti.
 *
 * ARCHITETTURA:
 * 1. Il sito si connette al canale "public-data" su EduPlan
 * 2. Quando un admin modifica un corso su EduPlan, viene inviato un broadcast
 * 3. Il sito riceve il broadcast e aggiorna i dati locali
 *
 * VANTAGGI vs POLLING:
 * - Aggiornamenti istantanei (< 100ms)
 * - Egress solo quando ci sono modifiche reali
 * - Risparmio ~99% egress per dati che cambiano raramente
 */

import { createClient, RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';

// Configurazione EduPlan Supabase
const EDUPLAN_URL = 'https://ikjqbmjyjuhkwtdvxjai.supabase.co';
const EDUPLAN_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Nome del canale broadcast (deve corrispondere a quello configurato su EduPlan)
const BROADCAST_CHANNEL = 'public-data';

// Tipi di eventi broadcast
export type BroadcastEventType =
  | 'courses:updated'      // Lista corsi aggiornata
  | 'courses:single'       // Singolo corso aggiornato
  | 'paths:updated'        // Percorsi aggiornati
  | 'lessons:updated'      // Calendario lezioni aggiornato
  | 'sync:full';           // Richiesta sync completo

export interface BroadcastPayload<T = unknown> {
  type: BroadcastEventType;
  data?: T;
  timestamp: string;
  // Per eventi singoli
  id?: string;
  slug?: string;
  // Per lessons:updated
  course_id?: string;
}

/**
 * Utility debounce per evitare refresh multipli
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

// Tipo per i listener
type BroadcastListener<T = unknown> = (payload: BroadcastPayload<T>) => void;

// Singleton per il client Supabase
let supabaseClient: SupabaseClient | null = null;
let realtimeChannel: RealtimeChannel | null = null;
let isConnected = false;
let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000;

// Map dei listener per tipo di evento
const listeners = new Map<BroadcastEventType, Set<BroadcastListener>>();

/**
 * Inizializza il client Supabase (singleton)
 */
function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    if (!EDUPLAN_ANON_KEY) {
      console.warn('[Realtime] VITE_SUPABASE_ANON_KEY non configurata');
    }

    supabaseClient = createClient(EDUPLAN_URL, EDUPLAN_ANON_KEY, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }
  return supabaseClient;
}

/**
 * Connette al canale broadcast di EduPlan
 */
export function connectRealtime(): RealtimeChannel {
  if (realtimeChannel && isConnected) {
    return realtimeChannel;
  }

  const client = getSupabaseClient();

  realtimeChannel = client.channel(BROADCAST_CHANNEL, {
    config: {
      broadcast: {
        self: false, // Non ricevere i propri messaggi
      },
    },
  });

  // Sottoscrivi a tutti gli eventi broadcast specifici
  // EduPlan invia eventi con nomi specifici (courses:updated, paths:updated, ecc.)
  const eventTypes: BroadcastEventType[] = [
    'courses:updated',
    'courses:single',
    'paths:updated',
    'lessons:updated',
    'sync:full',
  ];

  eventTypes.forEach(eventType => {
    realtimeChannel!.on('broadcast', { event: eventType }, (payload) => {
      console.log(`[Realtime] Ricevuto evento ${eventType}:`, payload);
      handleBroadcast(eventType, payload.payload);
    });
  });

  realtimeChannel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      isConnected = true;
      connectionAttempts = 0;
      console.log('[Realtime] Connesso al canale', BROADCAST_CHANNEL);
    } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
      isConnected = false;
      console.warn('[Realtime] Disconnesso, stato:', status);
      attemptReconnect();
    }
  });

  return realtimeChannel;
}

/**
 * Gestisce i messaggi broadcast ricevuti
 */
function handleBroadcast(eventType: BroadcastEventType, payloadData: unknown) {
  // Gestisci il caso in cui payloadData è undefined o null
  const safePayloadData = payloadData && typeof payloadData === 'object' ? payloadData : {};

  // Costruisci il payload con il tipo di evento
  const data: BroadcastPayload = {
    type: eventType,
    timestamp: new Date().toISOString(),
    ...(safePayloadData as object),
  };

  console.log('[Realtime] Elaboro broadcast:', eventType, data);

  // Notifica tutti i listener per questo tipo di evento
  const eventListeners = listeners.get(eventType);
  if (eventListeners) {
    console.log(`[Realtime] Notifica ${eventListeners.size} listener per ${eventType}`);
    eventListeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('[Realtime] Errore nel listener:', error);
      }
    });
  } else {
    console.log(`[Realtime] Nessun listener registrato per ${eventType}`);
  }

  // Notifica anche i listener generici (sync:full)
  if (eventType !== 'sync:full') {
    const syncListeners = listeners.get('sync:full');
    if (syncListeners) {
      syncListeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error('[Realtime] Errore nel sync listener:', error);
        }
      });
    }
  }
}

/**
 * Tenta la riconnessione con backoff esponenziale
 */
function attemptReconnect() {
  if (connectionAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error('[Realtime] Max tentativi di riconnessione raggiunti');
    return;
  }

  connectionAttempts++;
  const delay = RECONNECT_DELAY * Math.pow(2, connectionAttempts - 1);

  console.log(`[Realtime] Riconnessione in ${delay}ms (tentativo ${connectionAttempts}/${MAX_RECONNECT_ATTEMPTS})`);

  setTimeout(() => {
    if (!isConnected) {
      disconnectRealtime();
      connectRealtime();
    }
  }, delay);
}

/**
 * Disconnette dal canale Realtime
 */
export function disconnectRealtime(): void {
  if (realtimeChannel) {
    realtimeChannel.unsubscribe();
    realtimeChannel = null;
  }
  isConnected = false;
  console.log('[Realtime] Disconnesso');
}

/**
 * Registra un listener per un tipo di evento
 */
export function subscribe<T = unknown>(
  eventType: BroadcastEventType,
  listener: BroadcastListener<T>
): () => void {
  // Connetti automaticamente se non connesso
  if (!isConnected) {
    connectRealtime();
  }

  if (!listeners.has(eventType)) {
    listeners.set(eventType, new Set());
  }

  listeners.get(eventType)!.add(listener as BroadcastListener);

  // Ritorna funzione di unsubscribe
  return () => {
    const eventListeners = listeners.get(eventType);
    if (eventListeners) {
      eventListeners.delete(listener as BroadcastListener);
      if (eventListeners.size === 0) {
        listeners.delete(eventType);
      }
    }
  };
}

/**
 * Verifica se la connessione Realtime è attiva
 */
export function isRealtimeConnected(): boolean {
  return isConnected;
}

/**
 * Ottiene lo stato della connessione
 */
export function getConnectionStatus(): {
  connected: boolean;
  attempts: number;
  channel: string;
} {
  return {
    connected: isConnected,
    attempts: connectionAttempts,
    channel: BROADCAST_CHANNEL,
  };
}

// Auto-connessione al caricamento (opzionale, commentare se non desiderato)
// if (typeof window !== 'undefined') {
//   connectRealtime();
// }

export default {
  connectRealtime,
  disconnectRealtime,
  subscribe,
  isRealtimeConnected,
  getConnectionStatus,
  debounce,
};
