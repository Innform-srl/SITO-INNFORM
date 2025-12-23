# Guida Agente Sito Innform

**Versione Corrente: 4.5 | Data: 22 Dicembre 2025**

---

## AZIONE RICHIESTA

**Mostra le informazioni del coordinatore.** L'API ora restituisce il campo `coordinator` con nome, email e telefono quando il coordinatore e' stato pubblicato.

### Cosa e' cambiato (v4.5)
L'API ora restituisce un nuovo campo `coordinator`:
```json
{
  "coordinator": {
    "name": "Maria Sansone",
    "email": "ma.78.sans@gmail.com",
    "phone": "3314264530"
  }
}
```

**Il coordinatore viene mostrato SOLO se l'admin ha cliccato "Pubblica" nell'app EduPlan.**

### Come mostrare il coordinatore sul sito

Aggiungi una sezione "Coordinatore" o "Referente" nella pagina del corso:

```html
<!-- Esempio HTML -->
<div class="coordinator-section">
  <h3>Coordinatore del Corso</h3>
  <p><strong>Nome:</strong> Maria Sansone</p>
  <p><strong>Email:</strong> <a href="mailto:ma.78.sans@gmail.com">ma.78.sans@gmail.com</a></p>
  <p><strong>Telefono:</strong> <a href="tel:3314264530">331 426 4530</a></p>
</div>
```

**IMPORTANTE:** Mostra questa sezione SOLO se `coordinator` non e' `null`.

---

## CHANGELOG

### v4.5 (22 Dicembre 2025)
- NUOVO: Campo `coordinator` con nome, email e telefono del coordinatore
- Il coordinatore viene mostrato solo se pubblicato dall'admin
- Disponibile sia a livello corso che a livello edizione

### v4.4 (20 Dicembre 2025)
- API AGGIORNATA: ora `editions[].available_spots` e' corretto anche per singola edizione
- Le iscrizioni senza `edition_id` vengono assegnate all'unica edizione disponibile
- Il sito puo' usare indifferentemente i dati corso o edizione

### v4.3 (20 Dicembre 2025)
- BUG CRITICO: Il sito mostrava 18 invece di 16 posti

### v4.2 (20 Dicembre 2025)
- L'API e' gia' corretta, non suggerire fix lato EduPlan

---

## API

**Corsi:**
```
GET https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-courses-api
```

**Percorsi:**
```
GET https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-paths-api
```

**Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlranFibWp5anVoa3d0ZHZ4amFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzc4MDksImV4cCI6MjA3NjYxMzgwOX0.6MqvODmDE27UtnTXgI7ZiZF1th5q4QVVxwVu_2czBcs
```

---

## STRUTTURA RISPOSTA API

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
| `coordinator` | object | **NUOVO** Coordinatore pubblicato |
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

```javascript
// Fetch corso
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

---

## NOTE TECNICHE

- Cache API: 60 secondi
- CORS: abilitato per tutti i domini
- Header Authorization: obbligatorio
- Il coordinatore appare solo dopo che l'admin clicca "Pubblica" in EduPlan

---

*Fine guida*
