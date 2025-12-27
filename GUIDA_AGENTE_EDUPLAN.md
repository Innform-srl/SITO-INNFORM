# Guida Agente EduPlan

**Versione: 2.0 | Data: 27 Dicembre 2025**

---

## ⚠️ IMPORTANTE: GESTIONE SLUG E RINOMINA CORSI

### Il Problema

Il sito web usa lo **slug** (generato automaticamente dal titolo del corso) per:
1. URL delle pagine (`/corsi/{slug}`)
2. Collegare i dati API con i dati di presentazione statici (immagini, FAQ, moduli)

**Se rinomini un corso su EduPlan, lo slug cambia e i dati statici del sito non sono più collegati!**

### Cosa succede quando rinomini un corso

```
PRIMA: "Tecnico Analisi Alimentari" → slug: "tecnico-analisi-alimentari"
DOPO:  "Tecnico Esperto in Analisi Alimentari e Ambientali" → slug: "tecnico-esperto-in-analisi-alimentari-e-ambientali"
```

**Risultato:** I dati statici del sito (programma didattico, requisiti, immagini, FAQ) erano collegati al vecchio slug e ora non vengono più trovati.

### Procedura OBBLIGATORIA per rinominare un corso

1. **PRIMA** di rinominare su EduPlan, comunica all'agente del sito:
   - Nome attuale del corso
   - Nuovo nome del corso
   - Slug attuale e nuovo slug generato

2. **L'agente del sito** aggiornerà tutti i riferimenti in:
   - `CourseDetail.tsx` (dati statici)
   - `Courses.tsx` (stili e ordinamento)
   - `ProgramEnrollment.tsx` (form iscrizione)

3. **DOPO** la conferma dell'agente del sito, puoi rinominare su EduPlan

4. **Verifica** che il corso sia ancora visibile correttamente sul sito

### Esempio di comunicazione corretta

```
AGENTE EDUPLAN → AGENTE SITO:

Devo rinominare il corso:
- NOME ATTUALE: "Tecnico Analisi Alimentari"
- NUOVO NOME: "Tecnico Esperto in Analisi Alimentari e Ambientali"
- SLUG ATTUALE: tecnico-analisi-alimentari
- NUOVO SLUG: tecnico-esperto-in-analisi-alimentari-e-ambientali
- CODICE CORSO: TAA

Per favore aggiorna i riferimenti nel sito prima che io proceda.
```

### Soluzione futura

In futuro il sistema userà il **codice corso** (es: "TAA", "EEC") invece dello slug per collegare i dati. Questo permetterà di rinominare i corsi senza problemi.

---

## PANORAMICA

Questa guida documenta l'integrazione tra il sito web Innform e le API pubbliche di EduPlan. L'agente EduPlan gestisce il backend (Supabase Edge Functions) che fornisce dati in tempo reale al sito.

---

## ARCHITETTURA

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│   SITO WEB      │────▶│  SUPABASE EDGE       │────▶│   DATABASE      │
│   (React)       │     │  FUNCTIONS           │     │   (PostgreSQL)  │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
                              │
                              ├── public-courses-api
                              ├── public-paths-api
                              └── public-lessons-api
```

---

## API ENDPOINTS

### Base URL
```
https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/
```

### Header Richiesto (tutti gli endpoint)
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlranFibWp5anVoa3d0ZHZ4amFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzc4MDksImV4cCI6MjA3NjYxMzgwOX0.6MqvODmDE27UtnTXgI7ZiZF1th5q4QVVxwVu_2czBcs
```

---

## 1. ENDPOINT CORSI

### GET /public-courses-api

Restituisce la lista dei corsi pubblicati.

#### Parametri Query

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `id` | UUID | Filtra per ID corso |
| `slug` | string | Filtra per website_slug (CONSIGLIATO) |
| `code` | string | Filtra per codice corso (deprecato) |
| `category` | string | Filtra per categoria |
| `type` | string | Filtra per tipo (course/path) |
| `limit` | number | Limite risultati |
| `offset` | number | Offset paginazione |

#### Risposta Tipo

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "code": "CDSA",
      "title": "Corso di Specializzazione alle Guide Turistiche",
      "description": "...",
      "website_slug": "corso-specializzazione-guide-turistiche",
      "price": 480,
      "location": "Matera",
      "duration_hours": 50,
      "max_participants": 36,
      "enrolled_count": 0,
      "available_spots": 36,
      "start_date": "2026-01-19",
      "end_date": "2026-03-22",
      "enrollment_deadline": "2026-01-18",
      "is_enrollments_open": true,
      "teacher": null,
      "coordinator": {
        "name": "Maria Sansone",
        "email": "ma.78.sans@gmail.com",
        "phone": "3314264530"
      },
      "badges": {
        "last_spots": false,
        "enrollments_open": true,
        "starting_soon": false,
        "deadline_soon": false,
        "sold_out": false,
        "new_course": true,
        "has_multiple_editions": true,
        "already_started": false
      },
      "editions": [...]
    }
  ],
  "meta": {
    "total": 10,
    "limit": 50,
    "offset": 0,
    "timestamp": "2025-12-26T10:00:00.000Z"
  }
}
```

---

## 2. ENDPOINT PERCORSI

### GET /public-paths-api

Restituisce i percorsi formativi pubblicati.

#### Parametri e risposta simili a /public-courses-api

---

## 3. ENDPOINT LEZIONI

### GET /public-lessons-api

Restituisce il calendario lezioni di un corso.

#### Parametri Query

| Parametro | Tipo | Obbligatorio | Descrizione |
|-----------|------|--------------|-------------|
| `course_id` | UUID | Si | ID del corso |
| `edition_id` | UUID | No | Filtra per edizione specifica |

#### Esempio Chiamata

```bash
curl -X GET \
  'https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-lessons-api?course_id=0abdc976-9998-4b4b-80b8-2810a7cd768e' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

#### Risposta

```json
{
  "success": true,
  "data": [
    {
      "date": "2026-02-23",
      "start_time": "15:30",
      "end_time": "20:30",
      "title": "Lezione",
      "description": "Aula: ONLINE"
    },
    {
      "date": "2026-03-02",
      "start_time": "15:30",
      "end_time": "20:30",
      "title": "Lezione",
      "description": "Aula: ONLINE"
    }
  ],
  "meta": {
    "total": 9,
    "course_id": "0abdc976-9998-4b4b-80b8-2810a7cd768e",
    "edition_id": null,
    "timestamp": "2025-12-26T10:00:00.000Z"
  }
}
```

#### Struttura Lezione

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `date` | string | Data (YYYY-MM-DD) |
| `start_time` | string | Ora inizio (HH:MM) |
| `end_time` | string | Ora fine (HH:MM) |
| `title` | string | Dal campo `notes` o "Lezione" di default |
| `description` | string/null | Aula/location |

---

## CAMPI PRINCIPALI API CORSI

### Corso (livello principale)

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `id` | string | UUID univoco |
| `code` | string | Codice corso |
| `title` | string | Titolo |
| `description` | string | Descrizione HTML |
| `website_slug` | string | Slug per URL (auto-generato) |
| `price` | number | Prezzo EUR |
| `location` | string | Sede |
| `duration_hours` | number | Durata ore |
| `max_participants` | number | Posti totali |
| `enrolled_count` | number | Iscritti |
| `available_spots` | number | Posti disponibili |
| `start_date` | string | Data inizio |
| `end_date` | string | Data fine |
| `enrollment_deadline` | string | Scadenza iscrizioni |
| `is_enrollments_open` | boolean | Iscrizioni aperte |
| `teacher` | object/null | Docente |
| `coordinator` | object/null | Coordinatore pubblicato |
| `badges` | object | Flag per badge UI |
| `editions` | array | Edizioni del corso |

### Coordinatore

| Campo | Tipo |
|-------|------|
| `name` | string |
| `email` | string |
| `phone` | string |

**NOTA:** `coordinator` e' `null` se non pubblicato dall'admin.

### Badges

| Campo | Descrizione |
|-------|-------------|
| `new_course` | Corso nuovo |
| `last_spots` | Ultimi posti (<20% disponibili) |
| `sold_out` | Esaurito |
| `enrollments_open` | Iscrizioni aperte |
| `starting_soon` | Inizia entro 7 giorni |
| `deadline_soon` | Scadenza iscrizioni entro 3 giorni |
| `has_multiple_editions` | Ha piu' edizioni |
| `already_started` | Gia' iniziato |

---

## REGOLE IMPORTANTI

### 1. Usare sempre campi a livello corso

```javascript
// CORRETTO
const spots = course.available_spots;
const coordinator = course.coordinator;

// SBAGLIATO - non usare editions[]
const spots = course.editions[0].available_spots;
```

### 2. Slug vs Code

```javascript
// CONSIGLIATO - usa slug
const course = await getCourseBySlug('corso-specializzazione-guide');

// DEPRECATO - evita code
const course = await getCourseByCode('CDSA');
```

### 3. Coordinatore opzionale

```javascript
// Mostra solo se pubblicato
if (course.coordinator) {
  console.log(course.coordinator.name);
}
```

---

## TABELLE DATABASE

### Tabella `lessons` (usata da public-lessons-api)

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `id` | UUID | PK |
| `course_id` | UUID | FK -> courses |
| `edition_id` | UUID | FK -> course_editions |
| `date` | date | Data lezione |
| `start_time` | time | Ora inizio |
| `end_time` | time | Ora fine |
| `notes` | text | Usato come titolo |
| `location` | text | Aula/sede |
| `status` | enum | scheduled/cancelled/completed |

**Query usata dall'endpoint:**
```sql
SELECT date, start_time, end_time, notes, location
FROM lessons
WHERE course_id = ? AND status = 'scheduled'
ORDER BY date, start_time
```

---

## DEPLOY EDGE FUNCTIONS

### Struttura file Supabase

```
supabase/
└── functions/
    ├── public-courses-api/
    │   └── index.ts
    ├── public-paths-api/
    │   └── index.ts
    └── public-lessons-api/
        └── index.ts
```

### Comando deploy

```bash
supabase functions deploy public-lessons-api
```

### Variabili ambiente richieste

- `SUPABASE_URL` (automatico)
- `SUPABASE_ANON_KEY` (automatico)
- `SUPABASE_SERVICE_ROLE_KEY` (per query DB)

---

## CACHING

### Lato API (Edge Function)
- Cache-Control header: 60 secondi

### Lato Client (Sito Web)
- Cache in memoria: 10 minuti
- Polling automatico: 60 secondi

### Invalidare cache client
```javascript
import { invalidateCache, invalidateLessonsCache } from './services/public-courses-api';

// Dopo iscrizione
invalidateCache();
invalidateLessonsCache();
```

---

## TROUBLESHOOTING

### Problema: Lezioni non visualizzate

1. **Verificare risposta API**
   ```bash
   curl -X GET \
     'https://...supabase.co/functions/v1/public-lessons-api?course_id=UUID' \
     -H 'Authorization: Bearer TOKEN'
   ```

2. **Controllare console browser**
   - Log `[useCourseLessons] Lezioni ricevute dall'API:`
   - Log `[LessonCalendar] Lezioni ricevute:`

3. **Verificare status lezioni**
   - Solo `status = 'scheduled'` vengono restituite

4. **Cache**
   - Hard refresh: Ctrl+Shift+R
   - O chiamare `invalidateLessonsCache()`

### Problema: Coordinatore non visibile

1. Verificare che sia pubblicato in EduPlan
2. Controllare risposta API: `coordinator` deve essere oggetto, non `null`

### Problema: Posti errati

1. Usare sempre `course.available_spots`, mai `editions[].available_spots`
2. Verificare che le iscrizioni siano collegate all'edizione corretta

---

## CHANGELOG

### v1.0 (26 Dicembre 2025)
- Documentazione iniziale
- API corsi, percorsi e lezioni

---

## CONTATTI

Per modifiche alle Edge Functions o al database, contattare il team EduPlan.

---

*Fine guida*
