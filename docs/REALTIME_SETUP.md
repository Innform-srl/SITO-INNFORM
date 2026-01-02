# Configurazione Supabase Realtime per EduPlan

## Panoramica

Questa guida descrive come configurare il sistema Realtime tra EduPlan e il sito web innform.eu.

### Architettura

```
┌─────────────────────┐         ┌─────────────────────┐
│      EduPlan        │         │    Sito innform.eu  │
│   (Admin Panel)     │         │    (Frontend)       │
├─────────────────────┤         ├─────────────────────┤
│                     │         │                     │
│  Admin modifica     │         │  useRealtimeCourses │
│  corso/percorso     │         │  useRealtimePaths   │
│         │           │         │         ▲           │
│         ▼           │         │         │           │
│  Database Trigger   │ ──────► │  Broadcast Channel  │
│         │           │ WebSocket│  "public-data"     │
│         ▼           │         │         │           │
│  Broadcast Event    │         │         ▼           │
│  "courses:updated"  │         │  Aggiorna UI        │
│                     │         │  istantaneamente    │
└─────────────────────┘         └─────────────────────┘
```

## Configurazione su EduPlan

### 1. Abilitare Realtime sul Progetto

Nel dashboard Supabase di EduPlan:

1. Vai su **Database > Replication**
2. Abilita Realtime per le tabelle:
   - `courses`
   - `learning_paths`
   - `lessons` (opzionale)

### 2. Creare la Funzione di Broadcast

Crea una nuova Edge Function `broadcast-update`:

```typescript
// supabase/functions/broadcast-update/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface BroadcastPayload {
  type: 'courses:updated' | 'courses:single' | 'paths:updated' | 'lessons:updated'
  data?: unknown
  timestamp: string
  id?: string
  slug?: string
}

Deno.serve(async (req) => {
  // Verifica autenticazione (solo chiamate interne)
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.includes(Deno.env.get('BROADCAST_SECRET')!)) {
    return new Response('Unauthorized', { status: 401 })
  }

  const payload: BroadcastPayload = await req.json()

  // Invia broadcast al canale "public-data"
  const channel = supabase.channel('public-data')

  await channel.send({
    type: 'broadcast',
    event: payload.type,
    payload: {
      ...payload,
      timestamp: new Date().toISOString(),
    },
  })

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

### 3. Creare Database Triggers

Crea trigger che invocano la funzione broadcast quando i dati cambiano:

```sql
-- Trigger per corsi
CREATE OR REPLACE FUNCTION notify_course_update()
RETURNS TRIGGER AS $$
DECLARE
  payload JSON;
BEGIN
  -- Solo per corsi pubblicati
  IF NEW.status = 'published' OR OLD.status = 'published' THEN
    payload := json_build_object(
      'type', 'courses:updated',
      'id', NEW.id,
      'slug', NEW.website_slug,
      'timestamp', NOW()
    );

    -- Chiama Edge Function
    PERFORM
      net.http_post(
        url := current_setting('app.supabase_url') || '/functions/v1/broadcast-update',
        headers := json_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.broadcast_secret')
        )::jsonb,
        body := payload::jsonb
      );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER course_update_trigger
AFTER INSERT OR UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION notify_course_update();

-- Trigger per percorsi
CREATE OR REPLACE FUNCTION notify_path_update()
RETURNS TRIGGER AS $$
DECLARE
  payload JSON;
BEGIN
  IF NEW.status = 'published' OR OLD.status = 'published' THEN
    payload := json_build_object(
      'type', 'paths:updated',
      'id', NEW.id,
      'timestamp', NOW()
    );

    PERFORM
      net.http_post(
        url := current_setting('app.supabase_url') || '/functions/v1/broadcast-update',
        headers := json_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.broadcast_secret')
        )::jsonb,
        body := payload::jsonb
      );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER path_update_trigger
AFTER INSERT OR UPDATE ON learning_paths
FOR EACH ROW
EXECUTE FUNCTION notify_path_update();
```

### 4. Configurare Variabili d'Ambiente

Nel progetto EduPlan Supabase:

```env
# .env o Supabase Secrets
BROADCAST_SECRET=your-secret-key-here
```

### 5. Abilitare pg_net Extension

Per permettere chiamate HTTP dai trigger:

```sql
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Configura URL base
ALTER DATABASE postgres SET app.supabase_url = 'https://ikjqbmjyjuhkwtdvxjai.supabase.co';
ALTER DATABASE postgres SET app.broadcast_secret = 'your-secret-key-here';
```

## Configurazione sul Sito (innform.eu)

### File Creati

1. **`src/lib/supabase-realtime.ts`** - Client Realtime
2. **`src/hooks/useRealtimeCourses.ts`** - Hook corsi con Realtime
3. **`src/hooks/useRealtimePaths.ts`** - Hook percorsi con Realtime

### Utilizzo

Sostituisci gli hook esistenti con quelli Realtime:

```tsx
// PRIMA (polling)
import { usePublicCourses } from '../hooks/usePublicCourses';

// DOPO (realtime)
import { useRealtimeCourses } from '../hooks/useRealtimeCourses';

function CoursesPage() {
  // Stesso utilizzo, con info aggiuntive
  const {
    courses,
    loading,
    error,
    isRealtime,        // true se connesso via Realtime
    connectionStatus,  // 'connected' | 'polling' | 'disconnected'
  } = useRealtimeCourses();

  return (
    <div>
      {/* Indicatore stato connessione (opzionale) */}
      {isRealtime && <span className="text-green-500">● Live</span>}

      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
```

### Fallback Automatico

Gli hook gestiscono automaticamente il fallback:

1. **Realtime attivo**: Aggiornamenti istantanei, nessun polling
2. **Realtime disconnesso**: Polling ogni 5 minuti
3. **Window focus**: Refresh automatico se dati > 1 minuto

## Tipi di Eventi Broadcast

| Evento | Trigger | Payload |
|--------|---------|---------|
| `courses:updated` | Lista corsi cambiata | `{ type, timestamp }` |
| `courses:single` | Singolo corso modificato | `{ type, id, slug, timestamp }` |
| `paths:updated` | Percorsi modificati | `{ type, timestamp }` |
| `lessons:updated` | Calendario lezioni modificato | `{ type, course_id, timestamp }` |
| `sync:full` | Richiesta sync completo | `{ type, timestamp }` |

## Stima Risparmio Egress

### Scenario: 100 utenti attivi/giorno, 5 modifiche/giorno

**Con Polling (60s):**
```
100 utenti × 1440 richieste/giorno × 50KB = 7.2 GB/giorno
```

**Con Realtime:**
```
100 utenti × 1 fetch iniziale × 50KB = 5 MB
+ 5 broadcast × 2KB × 100 utenti = 1 MB
= 6 MB/giorno
```

**Risparmio: ~99.9%**

## Troubleshooting

### Realtime non si connette

1. Verifica `VITE_SUPABASE_ANON_KEY` nel `.env`
2. Controlla la console per errori WebSocket
3. Verifica che Realtime sia abilitato su Supabase

### Broadcast non arrivano

1. Verifica i trigger nel database EduPlan
2. Controlla i log della Edge Function `broadcast-update`
3. Verifica che `pg_net` sia abilitato

### Fallback a polling attivo inaspettatamente

1. La connessione WebSocket potrebbe essere bloccata da firewall/proxy
2. Verifica la stabilità della connessione internet
3. Il fallback è normale in ambienti con restrizioni di rete

## Migrazione Componenti Esistenti

### Esempio: CourseDetail.tsx

**Prima (polling):**
```tsx
// src/components/CourseDetail.tsx - riga 15
import { usePublicCourse, useInvalidateCoursesCache, useCourseLessons } from '../hooks/usePublicCourses';

// Nel componente
const { course: liveCourse, loading: liveLoading } = usePublicCourse({
  slug: courseSlug,
  pollingInterval: 60000,  // Polling ogni 60 secondi
  enabled: true,
});
```

**Dopo (realtime):**
```tsx
// Cambia solo l'import
import { useRealtimeCourse } from '../hooks/useRealtimeCourses';
import { useCourseLessons, useInvalidateCoursesCache } from '../hooks/usePublicCourses';

// Nel componente - stessa interfaccia + info extra
const {
  course: liveCourse,
  loading: liveLoading,
  isRealtime,  // NUOVO: true se connesso via WebSocket
} = useRealtimeCourse({
  slug: courseSlug,
  enabled: true,
  // pollingInterval non serve più!
});

// Opzionale: mostra indicatore live
{isRealtime && <span className="text-green-500 text-xs">● Live</span>}
```

### Esempio: Courses.tsx (lista corsi)

**Prima:**
```tsx
import { usePublicCourses } from '../hooks/usePublicCourses';

const { courses, loading } = usePublicCourses({
  pollingInterval: 60000,
});
```

**Dopo:**
```tsx
import { useRealtimeCourses } from '../hooks/useRealtimeCourses';

const {
  courses,
  loading,
  isRealtime,
  connectionStatus,  // 'connected' | 'polling' | 'disconnected'
} = useRealtimeCourses();

// Mostra stato connessione nella UI (opzionale)
<div className="text-xs text-gray-500">
  {connectionStatus === 'connected' && '● Aggiornamenti live attivi'}
  {connectionStatus === 'polling' && '○ Aggiornamenti ogni 5 min'}
</div>
```

### Migrazione Graduale

Puoi migrare i componenti uno alla volta:

1. **Fase 1**: Migra `Courses.tsx` (lista principale)
2. **Fase 2**: Migra `CourseDetail.tsx` (dettaglio corso)
3. **Fase 3**: Migra `ProgramDetail.tsx` (percorsi formativi)

Gli hook vecchi continuano a funzionare, permettendo una migrazione senza rischi.

---

## Test

Per testare manualmente il broadcast:

```bash
# Da terminale (richiede supabase CLI)
supabase functions invoke broadcast-update \
  --body '{"type":"courses:updated","timestamp":"2024-01-01T00:00:00Z"}'
```

Oppure dalla console JavaScript del browser:

```javascript
// Verifica stato connessione
import { getConnectionStatus } from './lib/supabase-realtime';
console.log(getConnectionStatus());
```
