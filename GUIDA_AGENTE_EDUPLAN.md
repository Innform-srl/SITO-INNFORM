# Guida Agente EduPlan

**Versione: 2.2 | Data: 27 Dicembre 2025**

---

## ⚠️ IMPORTANTE: Prima di Rinominare un Corso

**LEGGI LA SEZIONE COMPLETA IN:** [GUIDA_INTEGRAZIONE_SITO_WEB.md](GUIDA_INTEGRAZIONE_SITO_WEB.md) → Sezione "CRITICO: GESTIONE SLUG E RINOMINA CORSI"

### Riassunto Rapido

Quando rinomini un corso su EduPlan, lo slug cambia e i dati statici del sito (programma, FAQ, immagini) non sono più collegati.

**Procedura:**
1. PRIMA di rinominare → comunica all'agente del sito
2. Attendi conferma aggiornamento
3. DOPO la conferma → rinomina su EduPlan
4. Verifica il corso sul sito

**Template comunicazione:**
```
RICHIESTA RINOMINA CORSO

NOME ATTUALE: "[nome attuale]"
NUOVO NOME:   "[nuovo nome]"
SLUG ATTUALE: [slug-attuale]
NUOVO SLUG:   [nuovo-slug]
CODICE CORSO: [CODICE]

Aggiorna i riferimenti nel sito prima che io proceda.
```

---

## API Endpoints

### Base URL
```
https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/
```

### Header Richiesto
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlranFibWp5anVoa3d0ZHZ4amFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzc4MDksImV4cCI6MjA3NjYxMzgwOX0.6MqvODmDE27UtnTXgI7ZiZF1th5q4QVVxwVu_2czBcs
```

### Endpoints Disponibili

| Endpoint | Descrizione |
|----------|-------------|
| `GET /public-courses-api` | Lista corsi pubblicati |
| `GET /public-paths-api` | Lista percorsi formativi |
| `GET /public-lessons-api?course_id=UUID` | Calendario lezioni |

---

## Regole Importanti

### 1. Usare sempre campi a livello corso
```javascript
// CORRETTO
const spots = course.available_spots;
const coordinator = course.coordinator;

// SBAGLIATO
const spots = course.editions[0].available_spots;
```

### 2. Slug vs Code
```javascript
// CONSIGLIATO - usa slug per ricerche
const course = await getCourseBySlug('corso-specializzazione-guide');
```

### 3. Coordinatore opzionale
```javascript
if (course.coordinator) {
  console.log(course.coordinator.name);
}
```

---

## Caching

| Livello | Durata |
|---------|--------|
| API (Edge Function) | 60 secondi |
| Client (Sito Web) | 5 minuti |
| Polling automatico | 60 secondi |

---

## Deploy Edge Functions

```bash
supabase functions deploy public-courses-api
supabase functions deploy public-paths-api
supabase functions deploy public-lessons-api
```

---

## Documentazione Completa

Per informazioni dettagliate su:
- Struttura risposta API
- Campi disponibili
- Troubleshooting
- Gestione slug e rinomina corsi

**Vedi:** [GUIDA_INTEGRAZIONE_SITO_WEB.md](GUIDA_INTEGRAZIONE_SITO_WEB.md)

---

*Fine guida*
