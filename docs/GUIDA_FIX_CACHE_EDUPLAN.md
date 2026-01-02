# Fix Cache Edge Function EduPlan

## Problema Riscontrato

Quando si cancella un'edizione su EduPlan, il sito innform.eu non si aggiorna correttamente.

**Causa**: La Edge Function `public-courses-api` ha una cache interna che non viene invalidata prima di inviare il broadcast Realtime.

**Flusso attuale (ERRATO)**:
1. Admin cancella edizione dal DB
2. EduPlan invia broadcast `courses:updated`
3. Sito riceve broadcast e chiama API con `?_t=timestamp`
4. Edge Function restituisce dati VECCHI dalla sua cache interna
5. Sito mostra dati vecchi

**Flusso corretto (DA IMPLEMENTARE)**:
1. Admin cancella edizione dal DB
2. **Edge Function invalida la sua cache interna**
3. EduPlan invia broadcast `courses:updated`
4. Sito riceve broadcast e chiama API con `?_t=timestamp`
5. Edge Function restituisce dati FRESCHI dal database
6. Sito mostra dati aggiornati

---

## Soluzione

### Opzione A: Invalidare cache PRIMA del broadcast (CONSIGLIATA)

Nel codice che gestisce il salvataggio/cancellazione di corsi/edizioni, invalidare la cache della Edge Function **PRIMA** di inviare il broadcast.

```typescript
// Esempio in EduPlan quando si salva/cancella un'edizione

async function onEditionChange(editionId: string, action: 'create' | 'update' | 'delete') {
  // 1. Esegui l'operazione sul database
  if (action === 'delete') {
    await supabase.from('editions').delete().eq('id', editionId);
  }

  // 2. IMPORTANTE: Invalida la cache della Edge Function
  // Questo puo' essere fatto in diversi modi:

  // Opzione A1: Chiamare la Edge Function con parametro speciale
  await fetch(`${SUPABASE_URL}/functions/v1/public-courses-api?invalidate_cache=true`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  // Opzione A2: Usare una variabile globale/database per la versione cache
  // (vedi dettagli sotto)

  // 3. DOPO l'invalidazione, invia il broadcast
  await supabase.channel('public-data').send({
    type: 'broadcast',
    event: 'courses:updated',
    payload: {
      timestamp: new Date().toISOString(),
      action,
      editionId,
    },
  });
}
```

### Opzione B: Cache con versione in database

Usare una tabella per tracciare la versione della cache:

```sql
-- Creare tabella per versione cache
CREATE TABLE IF NOT EXISTS cache_versions (
  key TEXT PRIMARY KEY,
  version INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserire record iniziale
INSERT INTO cache_versions (key, version) VALUES ('public_courses', 0)
ON CONFLICT (key) DO NOTHING;
```

```typescript
// Nella Edge Function public-courses-api

// All'inizio della funzione, leggi la versione corrente
const { data: versionData } = await supabase
  .from('cache_versions')
  .select('version')
  .eq('key', 'public_courses')
  .single();

const currentVersion = versionData?.version || 0;

// Controlla se la cache locale e' valida
if (localCacheVersion !== currentVersion) {
  // Cache invalidata, svuota e aggiorna versione locale
  cache.clear();
  localCacheVersion = currentVersion;
}

// ... resto della logica ...
```

```typescript
// Quando si modifica un corso/edizione, incrementa la versione

async function invalidatePublicCoursesCache() {
  await supabase.rpc('increment_cache_version', { cache_key: 'public_courses' });
}

// Funzione SQL da creare:
// CREATE OR REPLACE FUNCTION increment_cache_version(cache_key TEXT)
// RETURNS void AS $$
// BEGIN
//   UPDATE cache_versions SET version = version + 1, updated_at = NOW()
//   WHERE key = cache_key;
// END;
// $$ LANGUAGE plpgsql;
```

### Opzione C: Nessuna cache nella Edge Function (piu' semplice)

Se il traffico non e' elevato, rimuovere completamente la cache dalla Edge Function e fare sempre query dirette al database.

```typescript
// Nella Edge Function, rimuovere tutta la logica di cache
// e fare sempre:

const { data, error } = await supabase
  .from('courses_public_view')  // o la view/query appropriata
  .select('*')
  .eq('status', 'published');

// Restituire sempre dati freschi
return new Response(JSON.stringify({ success: true, data }), {
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  },
});
```

---

## Implementazione Consigliata

**Per semplicita' e affidabilita', consiglio l'Opzione C** (rimuovere cache dalla Edge Function) per questi motivi:

1. Il parametro `_t` nel URL gia' bypassa le cache HTTP/CDN
2. Le Edge Function di Supabase sono veloci
3. Il sito ha gia' una cache client-side di 5 minuti
4. La cache nella Edge Function aggiunge complessita' senza benefici significativi

Se proprio serve la cache nella Edge Function per performance, usare l'**Opzione B** (versione in database) che e' piu' robusta.

---

## Verifica della Correzione

Dopo aver implementato la fix, testare cosi':

1. Aprire il sito su http://localhost:3002/corsi/corso-ai (o produzione)
2. Aprire la Console del browser (F12)
3. Su EduPlan, aggiungere o cancellare un'edizione
4. Osservare la console del sito:
   - Deve apparire `[Realtime] Ricevuto evento courses:updated`
   - Deve apparire `[PublicCoursesAPI] getCourseBySlug RISULTATO: ... edizioni: X`
   - Il numero di edizioni deve corrispondere a quello su EduPlan
5. La UI deve aggiornarsi automaticamente

---

## File da Modificare su EduPlan

1. **Edge Function `public-courses-api`**: Rimuovere o modificare la logica di cache
2. **Codice che gestisce salvataggio corsi/edizioni**: Assicurarsi che invalidi la cache prima del broadcast
3. **Codice che invia broadcast**: Verificare che venga chiamato DOPO l'invalidazione cache

---

## Note Tecniche

- Il sito invia `?_t=timestamp` per bypassare cache HTTP
- Il sito ha gia' `forceRefresh=true` che dovrebbe bypassare cache
- Il problema e' che la Edge Function ignora questi parametri per la sua cache interna
- La Edge Function deve riconoscere `_t` o `invalidate_cache` e bypassare la cache

---

*Guida creata il 30/12/2025*
*Per progetto: innform.eu + EduPlan*
