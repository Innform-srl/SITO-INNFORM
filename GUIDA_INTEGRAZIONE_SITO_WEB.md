# Guida Agente Sito Innform

**Versione Corrente: 5.2 | Data: 23 Dicembre 2025**

---

## BUG DA CORREGGERE

**Il calendario mostra solo 4 lezioni invece di 9.** L'API restituisce correttamente tutte le 9 lezioni, ma il sito ne visualizza solo alcune.

### Problema riscontrato

- API restituisce: **9 lezioni** (verificato)
- Sito mostra: **4 lezioni** (23 Feb, 2 Mar, 20 Mar, 21 Mar)
- Mancano: 4 Mar, 9 Mar, 16 Mar, 18 Mar, 22 Mar 2026

### Possibili cause da verificare

1. **Limite hardcoded** - Controllare se c'e' un `.slice(0, 4)` o limite nel componente
2. **Filtro date** - Verificare se vengono filtrate solo alcune date
3. **Raggruppamento errato** - Controllare la logica di raggruppamento per mese

### Dove cercare

```
src/components/LessonCalendar.tsx
src/hooks/useCourseLessons.ts
```

### Test API

```bash
curl -X GET \
  'https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-lessons-api?course_id=0abdc976-9998-4b4b-80b8-2810a7cd768e' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

Risposta attesa: `"meta": { "total": 9, ... }`

---

## CHANGELOG

### v5.2 (23 Dicembre 2025)
- BUG SEGNALATO: Il sito mostra solo 4 lezioni su 9
- L'API funziona correttamente (restituisce tutte le 9 lezioni)
- Il problema e' nel codice frontend del sito
- DA FIXARE: Verificare componente LessonCalendar

### v5.1 (23 Dicembre 2025)
- COMPLETATO: Endpoint `public-lessons-api` creato e deployato
- L'endpoint usa la tabella `lessons` esistente (non `course_lessons`)
- Il campo `title` usa il campo `notes` della lezione
- Il campo `description` mostra l'aula/location della lezione

### v5.0 (23 Dicembre 2025)
- NUOVO: Supporto Calendario Lezioni nel sito
- NUOVO: Componente `LessonCalendar` con design moderno
- NUOVO: Hook `useCourseLessons` per polling automatico

### v4.5 (22 Dicembre 2025)
- NUOVO: Campo `coordinator` con nome, email e telefono del coordinatore
- Il coordinatore viene mostrato solo se pubblicato dall'admin
- Disponibile sia a livello corso che a livello edizione

### v4.4 (20 Dicembre 2025)
- API AGGIORNATA: ora `editions[].available_spots` e' corretto anche per singola edizione
- Le iscrizioni senza `edition_id` vengono assegnate all'unica edizione disponibile
- Il sito puo' usare indifferentemente i dati corso o edizione

---

## API ENDPOINTS

### Corsi
```
GET https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-courses-api
```

### Percorsi
```
GET https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-paths-api
```

### Lezioni (ATTIVO)
```
GET https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-lessons-api
```

**Header (per tutti gli endpoint):**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlranFibWp5anVoa3d0ZHZ4amFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzc4MDksImV4cCI6MjA3NjYxMzgwOX0.6MqvODmDE27UtnTXgI7ZiZF1th5q4QVVxwVu_2czBcs
```

---

## ENDPOINT LEZIONI - DOCUMENTAZIONE

### Parametri

| Parametro | Tipo | Obbligatorio | Descrizione |
|-----------|------|--------------|-------------|
| `course_id` | string (UUID) | Si | ID del corso |
| `edition_id` | string (UUID) | No | Filtra per edizione specifica |

### Esempio chiamata

```bash
curl -X GET \
  'https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-lessons-api?course_id=0abdc976-9998-4b4b-80b8-2810a7cd768e' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### Risposta (TUTTE LE 9 LEZIONI)

```json
{
  "success": true,
  "data": [
    { "date": "2026-02-23", "start_time": "15:30", "end_time": "20:30", "title": "Lezione", "description": "Aula: ONLINE" },
    { "date": "2026-03-02", "start_time": "15:30", "end_time": "20:30", "title": "Lezione", "description": "Aula: ONLINE" },
    { "date": "2026-03-04", "start_time": "15:30", "end_time": "20:30", "title": "Lezione", "description": "Aula: ONLINE" },
    { "date": "2026-03-09", "start_time": "15:30", "end_time": "20:30", "title": "Lezione", "description": "Aula: ONLINE" },
    { "date": "2026-03-16", "start_time": "15:30", "end_time": "20:30", "title": "Lezione", "description": "Aula: ONLINE" },
    { "date": "2026-03-18", "start_time": "15:30", "end_time": "20:30", "title": "Lezione", "description": "Aula: ONLINE" },
    { "date": "2026-03-20", "start_time": "15:00", "end_time": "20:00", "title": "Lezione", "description": "Aula: AULA 1 + Laboratorio" },
    { "date": "2026-03-21", "start_time": "09:00", "end_time": "18:00", "title": "Fasce: 09:00-13:00, 14:00-18:00", "description": "Aula: AULA 1 + Laboratorio" },
    { "date": "2026-03-22", "start_time": "09:00", "end_time": "18:00", "title": "Fasce: 09:00-13:00, 14:00-18:00", "description": "Aula: AULA 1 + Laboratorio" }
  ],
  "meta": {
    "total": 9,
    "course_id": "0abdc976-9998-4b4b-80b8-2810a7cd768e",
    "edition_id": null,
    "timestamp": "2025-12-23T17:31:12.227Z"
  }
}
```

### Struttura Lezione

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `date` | string | Data lezione (YYYY-MM-DD) |
| `start_time` | string | Ora inizio (HH:MM) |
| `end_time` | string | Ora fine (HH:MM) |
| `title` | string | Titolo (dal campo `notes` o "Lezione" se vuoto) |
| `description` | string | Aula/location (es. "Aula: ONLINE") o null |

---

## STRUTTURA RISPOSTA API CORSI

```json
{
  "id": "0abdc976-9998-4b4b-80b8-2810a7cd768e",
  "code": "CDSA",
  "title": "Corso di Specializzazione alle Guide Turistiche",
  "price": 480,
  "location": "Matera",
  "duration_hours": 50,
  "max_participants": 36,
  "enrolled_count": 0,
  "available_spots": 36,
  "start_date": "2026-01-19",
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
```

---

## CAMPI DISPONIBILI

### Corso (livello principale)

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `id` | string | ID univoco del corso |
| `code` | string | Codice corso |
| `title` | string | Titolo del corso |
| `description` | string | Descrizione |
| `price` | number | Prezzo in euro |
| `location` | string | Sede del corso |
| `duration_hours` | number | Durata in ore |
| `max_participants` | number | Posti totali |
| `enrolled_count` | number | Iscritti attuali |
| `available_spots` | number | Posti disponibili |
| `start_date` | string | Data inizio (YYYY-MM-DD) |
| `end_date` | string | Data fine |
| `enrollment_deadline` | string | Scadenza iscrizioni |
| `is_enrollments_open` | boolean | Iscrizioni aperte |
| `teacher` | object | Docente (se assegnato) |
| `coordinator` | object | Coordinatore pubblicato |
| `badges` | object | Badge da mostrare |
| `editions` | array | Lista edizioni |

### Coordinatore

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `name` | string | Nome e cognome |
| `email` | string | Email |
| `phone` | string | Numero di telefono |

**NOTA:** Il campo `coordinator` e' `null` se nessun coordinatore e' stato pubblicato.

---

## REGOLA PRINCIPALE

**USA SEMPRE i campi a livello corso (`data.*`), MAI quelli dentro `editions[]`**

| Dato | Campo Corretto |
|------|----------------|
| Posti disponibili | `data.available_spots` |
| Iscritti | `data.enrolled_count` |
| Posti totali | `data.max_participants` |
| Coordinatore | `data.coordinator` |

---

## OUTPUT CORRETTO SUL SITO

```
Posti Disponibili: 36 su 36
Prezzo: €480
Durata: 50 ore
Sede: Matera
Data Inizio: 19 gennaio 2026

Coordinatore: Maria Sansone
Email: ma.78.sans@gmail.com
Telefono: 331 426 4530
```

---

## BADGES

| Flag API | Badge |
|----------|-------|
| `new_course` | NUOVO |
| `last_spots` | Ultimi posti! |
| `sold_out` | Esaurito |
| `enrollments_open` | Iscrizioni aperte |

---

## ESEMPIO CODICE JAVASCRIPT

### Fetch corso
```javascript
const response = await fetch(API_URL + '?code=CDSA', {
  headers: { 'Authorization': 'Bearer ' + API_KEY }
});
const { data: course } = await response.json();

// Mostra coordinatore se presente
if (course.coordinator) {
  console.log('Coordinatore:', course.coordinator.name);
  console.log('Email:', course.coordinator.email);
  console.log('Telefono:', course.coordinator.phone);
}
```

### Fetch lezioni
```javascript
const LESSONS_API_URL = 'https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-lessons-api';

const response = await fetch(LESSONS_API_URL + '?course_id=' + courseId, {
  headers: { 'Authorization': 'Bearer ' + API_KEY }
});
const { data: lessons, meta } = await response.json();

console.log(`Totale lezioni: ${meta.total}`);
lessons.forEach(lesson => {
  console.log(`${lesson.date} ${lesson.start_time}-${lesson.end_time}: ${lesson.title}`);
  if (lesson.description) {
    console.log(`  ${lesson.description}`);
  }
});
```

---

## NOTE TECNICHE

- Cache API: 60 secondi
- CORS: abilitato per tutti i domini
- Header Authorization: obbligatorio
- Il coordinatore appare solo dopo che l'admin clicca "Pubblica" in EduPlan
- Il calendario lezioni appare automaticamente quando `lessons.length > 0`
- Le lezioni vengono ordinate per data e orario (ascendente)
- Solo le lezioni con status "scheduled" vengono restituite

---

## CHECKLIST CALENDARIO LEZIONI

1. [x] ~~Creare tabella `course_lessons` su Supabase~~ - Usa tabella `lessons` esistente
2. [x] Creare Edge Function `public-lessons-api` - COMPLETATO 23/12/2025
3. [x] Testare endpoint con parametro `course_id` - FUNZIONANTE
4. [ ] Impostare `LESSONS_API_ENABLED = true` nel sito
5. [ ] Verificare visualizzazione calendario nelle pagine corso

---

*Fine guida*
