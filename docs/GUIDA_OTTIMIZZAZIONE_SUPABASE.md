# Guida Ottimizzazione Supabase - Riduzione Egress

Questa guida descrive le ottimizzazioni implementate per ridurre il consumo di egress (traffico in uscita) su Supabase e rimanere nel piano Free.

---

## Aggiornamento 30/12/2025 ore 14:30 - Implementazione COMPLETATA ✅

### Problema CORS risolto

Il sito non caricava i corsi a causa di un errore CORS:
```
Request header field cache-control is not allowed by Access-Control-Allow-Headers in preflight response
```

**Causa**: Il sito inviava header `Cache-Control` e `Pragma` nelle richieste, ma la Edge Function di EduPlan non li permetteva.

**Soluzione applicata lato sito** (`src/services/public-courses-api.ts`):
- Rimossi gli header `Cache-Control` e `Pragma` dalle richieste
- Il bypass della cache ora funziona tramite parametro `_t` nell'URL

### Modifiche implementate lato EduPlan (COMPLETATO ✅)

**1. Supporto parametro `_t` per cache bust** ✅ IMPLEMENTATO
- La Edge Function `public-courses-api` ora riconosce il parametro `_t`
- Se presente, restituisce `Cache-Control: no-cache, no-store, must-revalidate`
- Se assente, permette caching CDN per 60 secondi
- Il campo `meta.fresh` indica se i dati sono stati forzati freschi

**2. CORS headers corretti** ✅ GIA' FUNZIONANTE

**3. Broadcast Realtime dopo modifiche** ✅ IMPLEMENTATO
- `courseService.ts`: broadcast su create/update/delete corso
- `lessonService.ts`: broadcast su create/update/delete lezione
- `EditionModal.tsx`: broadcast su create/update/delete edizione
- `projectService.ts`: broadcast su update percorsi formativi

---

## Problema

Il piano Free di Supabase include **5 GB/mese di egress**. Un sito con traffico moderato può facilmente superare questo limite se:
- Ogni visita genera chiamate API al database
- Non c'è caching delle risposte
- I dati vengono richiesti ad ogni navigazione

## Soluzioni Implementate

### 1. Cache Client-Side (JavaScript)

**File**: `src/services/public-courses-api.ts` (o equivalente)

```typescript
const CONFIG = {
  DEBUG: false, // Disabilitato in produzione
  RETRY_COUNT: 3,
  RETRY_DELAY_BASE: 1000,
  CACHE_TIME: 600000, // 10 minuti (era 60 secondi)
};
```

**Cosa fa**:
- I dati vengono salvati in memoria per 10 minuti
- Se l'utente naviga tra le pagine, non vengono fatte nuove chiamate
- Riduce chiamate del ~90% per sessione utente

**Come implementare in altri progetti**:

```typescript
// Cache semplice in memoria
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const cache = new Map<string, CacheEntry<any>>();

const CACHE_TIME = 600000; // 10 minuti

function isCacheValid(entry: CacheEntry<any>): boolean {
  return Date.now() - entry.timestamp < CACHE_TIME;
}

async function fetchWithCache<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached && isCacheValid(cached)) {
    return cached.data;
  }

  const data = await fetchFn();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
```

### 2. Cache CDN con Vercel

**File**: `vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/((?!assets|.*\\.js|.*\\.css|.*\\.ico|.*\\.png|.*\\.jpg|.*\\.webp|.*\\.svg|.*\\.xml|.*\\.txt).*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, s-maxage=600, stale-while-revalidate=86400"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).css",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).ico",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400"
        }
      ]
    },
    {
      "source": "/(.*).png",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400"
        }
      ]
    },
    {
      "source": "/(.*).jpg",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400"
        }
      ]
    },
    {
      "source": "/(.*).webp",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400"
        }
      ]
    },
    {
      "source": "/(.*).svg",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400"
        }
      ]
    }
  ]
}
```

**Spiegazione header Cache-Control**:

| Header | Significato |
|--------|-------------|
| `max-age=0` | Browser non cachea (sempre fresco per l'utente) |
| `s-maxage=600` | CDN Vercel cachea per 10 minuti |
| `stale-while-revalidate=86400` | Serve vecchia versione mentre aggiorna in background (24h) |
| `immutable` | File non cambia mai (per JS/CSS con hash) |

### 3. Disabilitare Debug in Produzione

```typescript
const CONFIG = {
  DEBUG: false, // Era true
  // ...
};
```

**Perche'**:
- Meno console.log = meno overhead
- Codice piu' pulito in produzione

## Verifica Implementazione

### 1. Verificare header Vercel

```bash
curl -sI "https://tuo-sito.vercel.app/" | grep -i cache-control
```

Output atteso:
```
Cache-Control: public, max-age=0, s-maxage=600, stale-while-revalidate=86400
```

### 2. Verificare cache client (DevTools)

1. Apri Chrome DevTools (F12)
2. Vai su tab Network
3. Naviga tra le pagine
4. Le chiamate API dovrebbero mostrare "(from memory cache)" o non apparire affatto

### 3. Monitorare Supabase

1. Vai su Supabase Dashboard > Usage
2. Controlla "Egress" giornaliero
3. Obiettivo: < 0.15 GB/giorno per stare sotto 5 GB/mese

## Risultati Attesi

| Metrica | Prima | Dopo |
|---------|-------|------|
| Egress giornaliero | 1.4-4.2 GB | 0.1-0.5 GB |
| Egress mensile | ~32 GB | ~3-5 GB |
| Chiamate API per sessione | 10-20 | 1-3 |

## Ottimizzazioni Aggiuntive (se necessario)

### A. Aumentare tempo cache

Se i dati cambiano raramente, aumenta `CACHE_TIME`:

```typescript
CACHE_TIME: 1800000, // 30 minuti
```

E in `vercel.json`:

```json
"value": "public, max-age=0, s-maxage=1800, stale-while-revalidate=86400"
```

### B. Static Site Generation (SSG)

Per pagine che cambiano raramente, genera HTML a build-time invece di chiamare Supabase ad ogni visita.

### C. Selezionare solo campi necessari

Invece di:
```typescript
const { data } = await supabase.from('courses').select('*');
```

Usa:
```typescript
const { data } = await supabase.from('courses').select('id, title, slug, price');
```

### D. Paginazione

Limita i risultati:
```typescript
const { data } = await supabase
  .from('courses')
  .select('*')
  .limit(10)
  .range(0, 9);
```

### E. Usare Supabase Edge Functions con caching

Le Edge Functions possono avere il proprio caching:

```typescript
// In una Edge Function
return new Response(JSON.stringify(data), {
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=600', // 10 minuti
  },
});
```

## Limiti Piano Free Supabase (Dicembre 2025)

| Risorsa | Limite |
|---------|--------|
| Egress | 5 GB/mese |
| Database Size | 500 MB |
| Storage | 1 GB |
| Edge Function Invocations | 500.000/mese |
| Realtime Connections | 200 concurrent |

## Troubleshooting

### Egress ancora alto dopo ottimizzazioni

1. **Bot/crawler**: Aggiungi robots.txt per limitare crawling
2. **Immagini da Storage**: Sposta su CDN esterno (Cloudinary, ImageKit)
3. **Query pesanti**: Ottimizza le query, usa indici
4. **Attacchi/abusi**: Implementa rate limiting

### Cache non funziona

1. Verifica che `vercel.json` sia nella root del progetto
2. Fai un nuovo deploy dopo le modifiche
3. Svuota cache browser (Ctrl+Shift+R)
4. Verifica con curl che gli header siano presenti

---

## Modifiche Lato EduPlan (Edge Function public-courses-api)

Per supportare il refresh dei dati in tempo reale e il bypass della cache quando necessario, la Edge Function `public-courses-api` su EduPlan deve essere modificata come segue:

### 1. Aggiungere supporto per parametro `_t` (cache bust)

Il sito invia un parametro `_t` con timestamp quando vuole dati freschi (dopo un broadcast Realtime).
La Edge Function deve riconoscere questo parametro e bypassare eventuali cache interne.

```typescript
// Nella Edge Function public-courses-api

export default async function handler(req: Request) {
  const url = new URL(req.url);

  // Parametro _t indica richiesta di dati freschi (bypass cache)
  const cacheBust = url.searchParams.get('_t');
  const forceRefresh = cacheBust !== null;

  // Se forceRefresh, non usare cache interna
  if (!forceRefresh) {
    // Controlla cache interna se presente
    const cached = getCachedResponse(cacheKey);
    if (cached) return cached;
  }

  // Fetch dati dal database
  const data = await fetchFromDatabase();

  // Header di risposta
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, apikey, Content-Type',
  };

  // Se richiesta con _t, aggiungi header no-cache nella risposta
  if (forceRefresh) {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  } else {
    // Altrimenti permetti caching CDN (10 minuti)
    headers['Cache-Control'] = 'public, max-age=600';
  }

  return new Response(JSON.stringify(data), { headers });
}
```

### 2. CORS Headers nella Edge Function

La Edge Function deve includere CORS headers corretti per permettere le richieste dal sito:

```typescript
// Handler OPTIONS per preflight CORS
if (req.method === 'OPTIONS') {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, apikey, Content-Type',
      'Access-Control-Max-Age': '86400', // Cache preflight per 24h
    },
  });
}
```

### 3. Broadcast Realtime dopo modifiche

Quando un corso viene modificato su EduPlan, inviare un broadcast per notificare il sito:

```typescript
// Dopo salvataggio corso su EduPlan
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Invia broadcast al canale public-data
await supabase.channel('public-data').send({
  type: 'broadcast',
  event: 'courses:updated',
  payload: {
    timestamp: new Date().toISOString(),
    // Opzionale: includere i dati aggiornati per evitare refetch
    // data: updatedCourses
  }
});
```

### 4. Struttura Eventi Broadcast

| Evento | Quando inviarlo | Payload |
|--------|-----------------|---------|
| `courses:updated` | Modifica lista corsi | `{ timestamp, data?: CoursePublicData[] }` |
| `courses:single` | Modifica singolo corso | `{ timestamp, id, slug, data?: CoursePublicData }` |
| `lessons:updated` | Modifica calendario lezioni | `{ timestamp, course_id, edition_id? }` |
| `paths:updated` | Modifica percorsi formativi | `{ timestamp }` |

### 5. Flusso Completo

```
[Admin modifica corso su EduPlan]
         ↓
[EduPlan salva nel database]
         ↓
[EduPlan invia broadcast: courses:updated]
         ↓
[Sito riceve broadcast via WebSocket]
         ↓
[Sito invalida cache locale]
         ↓
[Sito chiama API con ?_t=timestamp]
         ↓
[Edge Function bypassa cache, ritorna dati freschi]
         ↓
[Sito aggiorna UI istantaneamente]
```

### 6. Checklist Implementazione EduPlan (COMPLETATA ✅)

- [x] Aggiungere gestione parametro `_t` nella Edge Function ✅ (30/12/2025)
- [x] Aggiungere CORS headers corretti (specialmente handler OPTIONS) ✅
- [x] Implementare broadcast Realtime dopo ogni modifica corso ✅ (courseService.ts)
- [x] Implementare broadcast per modifiche edizioni ✅ (EditionModal.tsx)
- [x] Implementare broadcast per modifiche calendario lezioni ✅ (lessonService.ts)
- [ ] Testare flusso completo con DevTools aperto (richiede fix lato sito - vedi GUIDA_REALTIME)

### 7. Debug Realtime

Per verificare che i broadcast funzionino, controllare la console del browser:

```
[Realtime] Ricevuto evento courses:updated: {...}
[useRealtimeCourses] Ricevuto aggiornamento, forzo refetch
[useRealtimeCourses] Eseguo refetch dopo delay...
```

Se non appaiono questi log:
1. Verificare che EduPlan invii il broadcast
2. Verificare che il canale sia `public-data`
3. Verificare che l'evento sia `courses:updated` (non `course:updated`)

---

*Guida creata il 26/12/2025 per progetto Innform.eu*
*Aggiornata il 30/12/2025 ore 14:30 - Implementazione EduPlan COMPLETATA*
*Applicabile a qualsiasi progetto React/Vite con Supabase e Vercel*
