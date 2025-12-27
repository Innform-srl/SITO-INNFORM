# Guida Ottimizzazione Supabase - Riduzione Egress

Questa guida descrive le ottimizzazioni implementate per ridurre il consumo di egress (traffico in uscita) su Supabase e rimanere nel piano Free.

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

*Guida creata il 26/12/2025 per progetto Innform.eu*
*Applicabile a qualsiasi progetto React/Vite con Supabase e Vercel*
