# Guida Integrazione Realtime - EduPlan

**Per:** Team Sviluppo EduPlan
**Da:** Team innform.eu
**Data:** Dicembre 2024
**Oggetto:** Configurazione Supabase Realtime per aggiornamenti live sul sito web

---

## Riepilogo

Abbiamo implementato sul sito innform.eu un sistema di aggiornamenti in tempo reale basato su **Supabase Realtime Broadcast**. Per attivarlo, è necessario configurare EduPlan per inviare notifiche quando i dati pubblici (corsi, percorsi, lezioni) vengono modificati.

### Benefici

| Metrica | Prima (Polling) | Dopo (Realtime) | Risparmio |
|---------|----------------|-----------------|-----------|
| Latenza aggiornamenti | 1-5 minuti | < 1 secondo | 99% |
| Egress mensile stimato | ~65 GB | ~200 MB | 99.7% |
| Richieste API/giorno | ~150.000 | ~500 | 99.6% |

---

## Cosa Serve da EduPlan

### 1. Abilitare Realtime sul Database

Nel dashboard Supabase del progetto EduPlan:

1. Vai su **Database → Replication**
2. Nella sezione "Realtime", abilita le tabelle:
   - `courses` (o il nome della tabella corsi)
   - `learning_paths` (o il nome della tabella percorsi)
   - `lessons` (opzionale, per calendario lezioni)

### 2. Creare Edge Function per Broadcast

Creare una nuova Edge Function chiamata `broadcast-public-update`:

```typescript
// supabase/functions/broadcast-public-update/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Canale usato dal sito innform.eu
const BROADCAST_CHANNEL = 'public-data'

interface BroadcastPayload {
  type: 'courses:updated' | 'courses:single' | 'paths:updated' | 'lessons:updated'
  id?: string
  slug?: string
  timestamp: string
}

Deno.serve(async (req) => {
  try {
    const payload: BroadcastPayload = await req.json()

    // Crea/ottieni il canale
    const channel = supabase.channel(BROADCAST_CHANNEL)

    // Invia il broadcast
    await channel.send({
      type: 'broadcast',
      event: payload.type,
      payload: {
        ...payload,
        timestamp: new Date().toISOString(),
      },
    })

    console.log(`[Broadcast] Inviato: ${payload.type}`, payload)

    return new Response(
      JSON.stringify({ success: true, event: payload.type }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[Broadcast] Errore:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

**Deploy:**
```bash
supabase functions deploy broadcast-public-update
```

### 3. Invocare il Broadcast quando i Dati Cambiano

Ci sono due opzioni per attivare il broadcast:

#### Opzione A: Database Trigger (Consigliata)

Richiede l'estensione `pg_net`. Crea questi trigger:

```sql
-- Abilita pg_net se non già attivo
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Funzione generica per broadcast
CREATE OR REPLACE FUNCTION broadcast_public_update()
RETURNS TRIGGER AS $$
DECLARE
  payload JSONB;
  event_type TEXT;
BEGIN
  -- Determina il tipo di evento basato sulla tabella
  CASE TG_TABLE_NAME
    WHEN 'courses' THEN
      -- Solo corsi pubblicati
      IF (NEW.status = 'published' OR (OLD IS NOT NULL AND OLD.status = 'published')) THEN
        event_type := 'courses:updated';
        payload := jsonb_build_object(
          'type', event_type,
          'id', NEW.id,
          'slug', NEW.website_slug
        );
      ELSE
        RETURN NEW;
      END IF;

    WHEN 'learning_paths' THEN
      IF (NEW.status = 'published' OR (OLD IS NOT NULL AND OLD.status = 'published')) THEN
        event_type := 'paths:updated';
        payload := jsonb_build_object(
          'type', event_type,
          'id', NEW.id
        );
      ELSE
        RETURN NEW;
      END IF;

    WHEN 'lessons' THEN
      event_type := 'lessons:updated';
      payload := jsonb_build_object(
        'type', event_type,
        'course_id', NEW.course_id
      );

    ELSE
      RETURN NEW;
  END CASE;

  -- Chiama Edge Function (asincrono, non blocca la transazione)
  PERFORM net.http_post(
    url := 'https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/broadcast-public-update',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' ||
               current_setting('supabase.service_role_key', true) || '"}'::jsonb,
    body := payload
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger per corsi
DROP TRIGGER IF EXISTS broadcast_course_update ON courses;
CREATE TRIGGER broadcast_course_update
  AFTER INSERT OR UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION broadcast_public_update();

-- Trigger per percorsi
DROP TRIGGER IF EXISTS broadcast_path_update ON learning_paths;
CREATE TRIGGER broadcast_path_update
  AFTER INSERT OR UPDATE ON learning_paths
  FOR EACH ROW
  EXECUTE FUNCTION broadcast_public_update();

-- Trigger per lezioni (opzionale)
DROP TRIGGER IF EXISTS broadcast_lesson_update ON lessons;
CREATE TRIGGER broadcast_lesson_update
  AFTER INSERT OR UPDATE OR DELETE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION broadcast_public_update();
```

#### Opzione B: Chiamata da Codice Applicativo

Se preferite non usare trigger, chiamate la Edge Function dal codice quando salvate un corso:

```typescript
// Nel codice EduPlan, dopo aver salvato un corso
async function notifyWebsite(type: string, id: string, slug?: string) {
  try {
    await fetch(
      'https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/broadcast-public-update',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ type, id, slug }),
      }
    )
  } catch (error) {
    // Non bloccare il salvataggio se il broadcast fallisce
    console.warn('Broadcast fallito:', error)
  }
}

// Esempio: dopo aver salvato un corso
await saveCourse(courseData)
await notifyWebsite('courses:updated', courseData.id, courseData.website_slug)
```

---

## Specifiche Tecniche

### Canale Broadcast

| Parametro | Valore |
|-----------|--------|
| Nome canale | `public-data` |
| Progetto | `ikjqbmjyjuhkwtdvxjai` (EduPlan) |

### Tipi di Eventi

| Evento | Quando Inviarlo | Payload |
|--------|-----------------|---------|
| `courses:updated` | Corso creato/modificato/eliminato | `{ type, id?, slug? }` |
| `courses:single` | Singolo corso modificato (opzionale) | `{ type, id, slug }` |
| `paths:updated` | Percorso creato/modificato/eliminato | `{ type, id? }` |
| `lessons:updated` | Lezione modificata | `{ type, course_id }` |

### Formato Payload

```typescript
interface BroadcastPayload {
  type: 'courses:updated' | 'courses:single' | 'paths:updated' | 'lessons:updated'
  id?: string       // UUID dell'entità modificata
  slug?: string     // website_slug (solo per corsi)
  timestamp?: string // ISO 8601, aggiunto automaticamente
}
```

---

## Test

### Verifica che il Broadcast Funzioni

1. **Dalla CLI Supabase:**
```bash
supabase functions invoke broadcast-public-update \
  --body '{"type":"courses:updated"}'
```

2. **Da curl:**
```bash
curl -X POST \
  'https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/broadcast-public-update' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -d '{"type":"courses:updated"}'
```

3. **Verifica sul sito:**
   - Apri innform.eu in una tab
   - Apri la console del browser (F12)
   - Cerca log `[Realtime] Ricevuto broadcast:`
   - Invia un broadcast di test
   - Dovresti vedere il log apparire

---

## Domande Frequenti

### Il broadcast è sincrono o asincrono?

**Asincrono.** L'uso di `pg_net` o `fetch` non blocca il salvataggio. Se il broadcast fallisce, i dati vengono comunque salvati.

### Cosa succede se il sito è offline?

Nessun problema. Quando l'utente ricarica la pagina, i dati vengono fetchati normalmente. Il Realtime serve solo per aggiornamenti live mentre l'utente è sulla pagina.

### Devo inviare tutti i dati nel broadcast?

**No.** Il payload contiene solo il tipo di evento e gli ID. Il sito innform.eu farà una nuova chiamata alle API pubbliche per ottenere i dati aggiornati. Questo garantisce che i dati passino sempre attraverso le API autorizzate.

### Quanti broadcast posso inviare?

Il piano Pro di Supabase include 5 milioni di messaggi Realtime/mese. Con una stima di 100 modifiche/giorno = 3.000/mese, siete ampiamente nei limiti.

---

## Contatti

Per domande tecniche sull'integrazione:
- **Sito innform.eu:** [inserire contatto]
- **Documentazione Supabase Realtime:** https://supabase.com/docs/guides/realtime

---

## Checklist Implementazione

- [ ] Abilitare Realtime su tabelle `courses`, `learning_paths`
- [ ] Creare Edge Function `broadcast-public-update`
- [ ] Scegliere metodo di invocazione (Trigger DB o Codice)
- [ ] Implementare invocazione
- [ ] Testare con broadcast manuale
- [ ] Verificare ricezione su innform.eu
- [ ] Monitorare per una settimana
