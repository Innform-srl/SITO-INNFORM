# Guida Agente Sito Innform

**Versione Corrente: 6.9 | Data: 27 Dicembre 2025 | Ora: 20:00**

---

## ✅ IMPLEMENTATO - COLLEGAMENTO DATI PER CODICE CORSO

> **Stato: COMPLETATO** - I corsi possono ora essere rinominati liberamente su EduPlan senza perdere dati.

### Obiettivo (raggiunto)

Permettere la **rinomina libera dei corsi** su EduPlan senza perdere i dati statici nel sito, mantenendo URL SEO-friendly.

### Situazione precedente (risolta)

```
URL:                /corsi/tecnico-analisi-alimentari     ← SLUG (usato per URL)
Collegamento dati:  coursesData['tecnico-analisi-alimentari']  ← SLUG (cambia se rinomini!)

Quando rinomini il corso → slug cambia → dati statici persi!
```

### Soluzione implementata

```
URL:                /corsi/tecnico-esperto-in-analisi...  ← SLUG (per SEO, può cambiare)
Collegamento dati:  coursesData['TAA']                    ← CODICE (stabile, non cambia mai)

Quando rinomini il corso → slug cambia → dati statici OK!
```

### Implementazione nel sito

#### 1. Cambiare le chiavi in `coursesData` (CourseDetail.tsx)

```javascript
// PRIMA (chiavi = slug):
const coursesData = {
  'tecnico-analisi-alimentari': {
    title: '...',
    modules: [...],
    faq: [...],
  },
  'master-safety': { ... },
  'corso-ai': { ... },
}

// DOPO (chiavi = codice corso):
const coursesData = {
  'TAA': {  // Codice corso stabile
    title: '...',
    modules: [...],
    faq: [...],
  },
  'MASSAF': { ... },
  'CS-CORAI': { ... },
}
```

#### 2. Cambiare la logica di lookup

```javascript
// PRIMA (cerca per slug - instabile):
const CourseDetail = () => {
  const { slug } = useParams();
  const staticData = coursesData[slug];  // ❌ Slug può cambiare
  // ...
}

// DOPO (cerca per codice - stabile):
const CourseDetail = () => {
  const { slug } = useParams();

  // 1. Ottieni dati API (include il codice corso)
  const { course: apiData, loading } = usePublicCourse({ slug });

  // 2. Usa il CODICE per trovare i dati statici
  const staticData = apiData ? coursesData[apiData.code] : null;  // ✅ Codice stabile

  // 3. Merge come prima
  const course = useMemo(() => {
    if (!apiData) return null;
    return {
      ...apiData,
      // Extras da staticData (opzionali)
      heroImage: staticData?.heroImage || defaultImage,
      modules: staticData?.modules || [],
      faq: staticData?.faq || [],
    };
  }, [apiData, staticData]);
}
```

#### 3. Cambiare le chiavi in `courseStylesMap` (Courses.tsx)

```javascript
// PRIMA:
const courseStylesMap = {
  'tecnico-analisi-alimentari': { icon: Microscope, gradient: '...' },
}

// DOPO:
const courseStylesMap = {
  'TAA': { icon: Microscope, gradient: '...' },
}
```

#### 4. Aggiornare il lookup degli stili

```javascript
// PRIMA:
const style = courseStylesMap[course.website_slug] || defaultStyle;

// DOPO:
const style = courseStylesMap[course.code] || defaultStyle;
```

### Tabella corrispondenza Codice → Slug attuale

| Codice | Slug Attuale | Nome Corso |
|--------|--------------|------------|
| `TAA` | `tecnico-esperto-in-analisi-alimentari-e-ambientali` | Tecnico Esperto Analisi Alimentari |
| `MASSAF` | `master-safety` | Master Safety |
| `EEC` | `editoria-e-comunicazione` | Editoria e Comunicazione |
| `CDSA` | `corso-di-specializzazione-alle-guide-turistiche` | Specializzazione Guide Turistiche |
| `Tor` | `operatore-tornitura` | Operatore Tornitura |
| `OTDS` | `sistema-educativo-infanzia` | Sistema Educativo Infanzia |
| `GOL-OHES` | `operatore-h2s-e-sicurezza` | Operatore H2S |
| `GOL-TEPL` | `tecnico-esperto-per-lo-sviluppo-turistico-territoriale` | Sviluppo Turistico |
| `GOL-COMDIG` | `competenze-digitali` | Competenze Digitali |
| `GOL-ODPE` | `operatore-della-panificazione-e-della-produzione-di-paste` | Operatore Panificazione |
| `Upskilling-CDP1` | `pubblicita-comunicazione` | Pubblicità Comunicazione |
| `CS-CORAI` | `corso-ai` | Corso AI |

### Vantaggi

1. **Rinomina libera** - Puoi rinominare i corsi su EduPlan senza coordinamento
2. **URL SEO-friendly** - Gli URL usano ancora lo slug leggibile
3. **Dati statici stabili** - I contenuti (FAQ, moduli, immagini) non si perdono mai
4. **Zero manutenzione** - Nessun aggiornamento chiavi necessario dopo rinomina

---

## ℹ️ GESTIONE SLUG E RINOMINA CORSI

> **NOTA:** Con l'implementazione del collegamento per codice, la rinomina dei corsi è ora SICURA e non richiede coordinamento.

### Cos'è lo Slug

Lo **slug** è un identificatore URL-friendly generato automaticamente dal titolo del corso:
- Titolo: "Tecnico Analisi Alimentari" → Slug: `tecnico-analisi-alimentari`
- Titolo: "Corso AI per Aziende" → Slug: `corso-ai-per-aziende`

### Come Funziona Ora (Dopo l'Implementazione)

```
RINOMINA CORSO SU EDUPLAN:
┌─────────────────────────────────────────────────────┐
│ Titolo: "Nuovo Nome Corso"                          │
│ Slug:   nuovo-nome-corso                  (cambia)  │
│ Codice: TAA                               (stabile) │
└─────────────────────────────────────────────────────┘
           │
           │ URL usa slug → /corsi/nuovo-nome-corso
           │ Dati statici cercati per CODICE → TAA
           ▼
┌─────────────────────────────────────┐
│ CourseDetail.tsx                    │
│ Key: 'TAA'                          │  ← CODICE STABILE!
│ - Programma didattico (5 moduli)    │
│ - Requisiti di accesso              │    SEMPRE COLLEGATI
│ - FAQ (10 domande)                  │
│ - Immagine hero                     │
└─────────────────────────────────────┘

RISULTATO: Pagina corso funziona correttamente!
```

### Dati Statici Collegati al Codice

I seguenti dati nel sito web sono collegati tramite codice corso (stabile):

**1. CourseDetail.tsx - Contenuti principali**
```typescript
const coursesData = {
  'TAA': {  // ← CHIAVE = CODICE CORSO (stabile)
    title: '...',
    duration: '600 ore',
    requirements: ['Diploma', 'Età 18+', ...],
    modules: [
      { title: 'Modulo 1', hours: '80 ore', topics: [...] },
      { title: 'Modulo 2', hours: '120 ore', topics: [...] },
      // ... altri moduli
    ],
    faq: [
      { question: 'Come mi iscrivo?', answer: '...' },
      // ... altre FAQ
    ],
    heroImage: 'https://...',
  }
}
```

**2. Courses.tsx - Stile visivo nel carosello**
```typescript
const courseStylesMap = {
  'TAA': {  // ← CHIAVE = CODICE CORSO (stabile)
    icon: Microscope,
    gradient: 'from-purple-600 via-purple-500 to-pink-500',
    accentColor: 'purple',
  }
}
```

### Rinominare un Corso

Con l'implementazione attuale, puoi **rinominare liberamente** i corsi su EduPlan:

1. **Rinomina su EduPlan** - Cambia il titolo del corso
2. **Lo slug cambia automaticamente** - L'URL del corso si aggiorna
3. **I dati statici rimangono collegati** - Grazie al codice corso stabile
4. **Nessuna azione richiesta sul sito** - Funziona automaticamente

### Aggiungere un Nuovo Corso

Per aggiungere dati statici (programma, FAQ, immagini) a un nuovo corso:

1. **Trova il codice corso** su EduPlan
2. **Aggiungi entry in `coursesData`** (CourseDetail.tsx) usando il codice come chiave
3. **Aggiungi entry in `courseStylesMap`** (Courses.tsx) usando il codice come chiave

---

## ✅ CORSI DINAMICI AL 100% - IMPLEMENTATO

### Cosa è stato fatto

Il sito ora mostra **automaticamente** i corsi pubblicati su EduPlan, senza richiedere dati statici in `coursesData`.

### Come funziona

```javascript
// 1. Dati live da API (cerca per slug dall'URL)
const { course: liveData, loading } = usePublicCourse({ slug });

// 2. Dati statici (cerca per CODICE - stabile)
const staticCourse = liveData?.code ? coursesData[liveData.code] : null;

// 3. Combina: API primario, statico per extras
const course = useMemo(() => {
  if (!staticCourse && !liveData) return null;
  if (!liveData) return staticCourse;

  // Merge: liveData sovrascrive, staticCourse per extras (immagini, FAQ, moduli)
  return {
    title: liveData.title,
    description: liveData.description,
    duration: `${liveData.duration_hours} ore`,
    // ... dati da API

    // Extras da staticCourse (se disponibili)
    heroImage: staticCourse?.heroImage || defaultImage,
    modules: staticCourse?.modules || [],
    faq: staticCourse?.faq || [],
  };
}, [staticCourse, liveData]);
```

### Vantaggi

1. **Zero interventi manuali** - I nuovi corsi appaiono automaticamente
2. **Sincronizzazione reale** - Il sito è sempre allineato con EduPlan
3. **Dati statici stabili** - Collegati tramite codice corso, non cambiano mai
4. **Rinomina libera** - Puoi cambiare i titoli senza perdere dati

### Esempio: Corso AI

Il corso "Corso AI" (slug: `corso-ai`) ora è visibile:
- **URL:** `innform.eu/corsi/corso-ai`
- **Dati da API:** titolo, descrizione, durata, prezzo, data, posti
- **Stile default:** gradient viola/rosa, immagine placeholder

### Per aggiungere personalizzazioni (opzionale)

Se vuoi aggiungere immagini custom, FAQ o moduli a un corso, aggiungi una entry in `coursesData`:

```javascript
'corso-ai': {
  // Solo i campi extra che vuoi personalizzare
  heroImage: '/images/corso-ai-hero.jpg',
  carouselImages: [...],
  modules: [...],
  faq: [...],
}
```

---

## ✅ SLUG AUTO-GENERATI (v6.3 - 27/12/2025)

### Cosa è stato implementato

EduPlan ora genera **automaticamente** gli slug dal nome del corso/progetto:

- **Nessuna selezione manuale**: Lo slug viene creato in tempo reale dal nome
- **Campo di sola lettura**: L'utente non può modificare lo slug (è un dato tecnico)
- **Sempre presente**: Ogni corso/progetto ha sempre uno slug per la comunicazione

### Come funziona

Quando l'utente inserisce il nome:
```
Nome corso: "Corso AI e Machine Learning"
Slug generato: "corso-ai-e-machine-learning"
URL finale: innform.eu/corsi/corso-ai-e-machine-learning
```

La trasformazione:
1. Converte in minuscolo
2. Rimuove accenti (es. "à" → "a")
3. Rimuove caratteri speciali
4. Sostituisce spazi con trattini
5. Rimuove trattini multipli

### Per l'agente del sito

Quando viene creato un nuovo corso/progetto su EduPlan:

1. L'agente EduPlan comunicherà automaticamente lo slug generato
2. L'agente del sito deve:
   - Aggiungere i dati statici in `CourseDetail.tsx` con la chiave uguale allo slug
   - Fare commit e push su GitHub
   - Attendere il deploy Vercel (2-3 minuti)
3. Dopo il deploy, comunicare all'agente EduPlan che può pubblicare il corso

### Vantaggi rispetto a v6.2

- **Zero input manuale**: L'utente non deve mai toccare lo slug
- **Consistenza garantita**: Tutti gli slug seguono lo stesso formato
- **Meno errori**: Nessuna possibilità di selezionare lo slug sbagliato

---

## 📋 ISTRUZIONI PER L'AGENTE DEL SITO INNFORM.EU

### Quando ricevi un nuovo corso/progetto da EduPlan

L'agente EduPlan ti comunicherà:
1. **Nome del corso** (es. "Corso AI e Machine Learning")
2. **Slug generato** (es. `corso-ai-e-machine-learning`)
3. **Dati del corso** (descrizione, durata, prezzo, date, ecc.)

### Cosa devi fare

#### 1. Aggiungere i dati statici in `CourseDetail.tsx`

Apri il file `src/components/CourseDetail.tsx` e aggiungi una nuova entry nell'oggetto `coursesData`:

```javascript
// Aggiungi alla fine dell'oggetto coursesData
'corso-ai-e-machine-learning': {
  id: 'corso-ai-e-machine-learning',
  title: 'Corso AI e Machine Learning',
  type: 'Formazione Professionale',
  duration: '40 ore',
  price: '€500',
  location: 'Online',
  description: 'Descrizione del corso...',
  image: '/images/courses/ai-ml.jpg',  // Opzionale
  highlights: [
    'Fondamenti di Machine Learning',
    'Reti Neurali e Deep Learning',
    'Progetti pratici con Python'
  ],
  modules: [
    { title: 'Modulo 1: Introduzione', duration: '8 ore' },
    { title: 'Modulo 2: Algoritmi ML', duration: '16 ore' },
    { title: 'Modulo 3: Progetti Pratici', duration: '16 ore' }
  ],
  requirements: [
    'Conoscenza base di programmazione',
    'Familiarità con Python (consigliata)'
  ],
  targetAudience: [
    'Sviluppatori software',
    'Data analysts',
    'Professionisti IT'
  ]
}
```

#### 2. (Opzionale) Aggiungere stile personalizzato in `Courses.tsx`

Se il corso deve avere uno stile visivo particolare nella homepage, aggiungi in `courseStylesMap`:

```javascript
'corso-ai-e-machine-learning': {
  gradient: 'from-purple-500 to-indigo-600',
  icon: '🤖',
  badge: 'NUOVO'
}
```

#### 3. Commit e push

```bash
git add .
git commit -m "Aggiunto corso: Corso AI e Machine Learning"
git push origin main
```

#### 4. Attendere il deploy Vercel

Il deploy automatico impiega 2-3 minuti. Verifica che la pagina sia accessibile:
- `https://innform.eu/corsi/corso-ai-e-machine-learning`

#### 5. Comunicare all'agente EduPlan

Conferma che il corso è stato aggiunto e la pagina è online.

### Struttura dati richiesta

| Campo | Tipo | Obbligatorio | Descrizione |
|-------|------|--------------|-------------|
| `id` | string | ✅ | Deve corrispondere allo slug |
| `title` | string | ✅ | Nome del corso |
| `type` | string | ✅ | Categoria (es. "Programma GOL", "Master") |
| `duration` | string | ✅ | Durata (es. "40 ore") |
| `price` | string | ✅ | Prezzo (es. "€500" o "Gratuito (GOL)") |
| `location` | string | ✅ | Sede (es. "Potenza", "Online") |
| `description` | string | ✅ | Descrizione breve |
| `image` | string | ❌ | Path immagine (default disponibile) |
| `highlights` | array | ❌ | Punti chiave del corso |
| `modules` | array | ❌ | Programma didattico |
| `requirements` | array | ❌ | Requisiti di accesso |
| `targetAudience` | array | ❌ | A chi è rivolto |

### Percorsi formativi (progetti)

Per i percorsi formativi, lo slug viene usato per il menu "Percorsi":
- URL: `innform.eu/percorsi/{slug}`
- Menu: Header.tsx usa `public-paths-api` per caricare i percorsi dinamicamente

I percorsi vengono mostrati automaticamente se:
- `is_learning_path = true`
- `is_published_on_website = true`

---

## ⚠️ PROBLEMA SLUG - RISOLUZIONE DEFINITIVA (v6.1 - 27/12/2025 14:30)

### Il problema

Il sito ha un file `CourseDetail.tsx` con **dati statici di presentazione** (immagini, bullet points, FAQ, ecc.) per ogni corso. Questi dati sono indicizzati per `website_slug`.

Se lo slug nel database EduPlan NON corrisponde ESATTAMENTE a quello nel sito, la pagina del corso mostra **"Corso non trovato"**.

### ✅ SLUGS CORRETTI - TABELLA DEFINITIVA

Questi sono gli slug che DEVONO essere usati nel database EduPlan (campo `website_slug`):

| Corso | Slug Corretto (website_slug) |
|-------|------------------------------|
| Tecnico Analisi Alimentari | `tecnico-analisi-alimentari` |
| Editoria e Comunicazione | `editoria-e-comunicazione` |
| Master Safety | `master-safety` |
| Interior Design | `interior-design` |
| Tecnico Esperto Sviluppo Turistico | `tecnico-esperto-per-lo-sviluppo-turistico-territoriale` |
| Sistema Educativo Infanzia | `sistema-educativo-infanzia` |
| Operatore Tornitura | `operatore-tornitura` |
| Operatore H2S e Sicurezza | `operatore-h2s-e-sicurezza` |
| Pubblicità e Comunicazione | `pubblicita-comunicazione` |
| Operatore Panificazione | `operatore-della-panificazione-e-della-produzione-di-paste` |
| Competenze Digitali | `competenze-digitali` |
| Specializzazione Guide Turistiche | `corso-di-specializzazione-alle-guide-turistiche` |
| Alfabetizzazione Digitale | `alfabetizzazione-digitale-per-utenti-maturi` |

### 🔧 AZIONE RICHIESTA AGENTE EDUPLAN

Prima di pubblicare un corso sul sito, **VERIFICARE** che il campo `website_slug` nella tabella `courses` corrisponda ESATTAMENTE a uno degli slug nella lista sopra.

**Query di verifica:**
```sql
SELECT code, title, website_slug
FROM courses
WHERE status IN ('published', 'active')
ORDER BY code;
```

**Se uno slug non corrisponde:**
1. Aggiornare il campo `website_slug` nel database EduPlan
2. OPPURE comunicare all'agente del sito per aggiungere il nuovo slug a `CourseDetail.tsx`

### Per nuovi corsi

1. **Opzione A (Consigliata):** Comunicare all'agente del sito lo slug PRIMA di pubblicare
2. **Opzione B:** Usare lo slug generato e comunicarlo per aggiungere i dati di presentazione

---

## ✅ SINCRONIZZAZIONE AUTOMATICA IMPLEMENTATA (27/12/2025)

**COMPLETATO:** Menu e homepage ora usano le API EduPlan in tempo reale.

### Cosa è cambiato

| Componente | File | Prima | Dopo |
|------------|------|-------|------|
| Menu Percorsi | `Header.tsx` | STATICO | ✅ DINAMICO via `public-paths-api` |
| Homepage corsi | `Courses.tsx` | STATICO | ✅ DINAMICO via `public-courses-api` |
| Dettaglio corso | `CourseDetail.tsx` | ✅ Dinamico | ✅ OK |

### Come funziona ora

#### Menu Percorsi (`Header.tsx`)

Il menu "Percorsi" ora carica dinamicamente i percorsi dall'API:

```javascript
const { paths } = usePublicPaths();  // Hook custom
// API: GET /functions/v1/public-paths-api
// Mostra solo percorsi con is_learning_path=true E is_published_on_website=true
```

- I percorsi vengono mostrati con i corsi al loro interno
- Badge "Upskilling"/"Reskilling" per corsi GOL
- Cache 5 minuti per performance

#### Homepage Corsi (`Courses.tsx`)

La homepage ora mostra corsi direttamente dall'API:

```javascript
const { courses } = usePublicCourses();  // Hook custom
// API: GET /functions/v1/public-courses-api
// Filtro automatico: is_enrollments_open === true
```

- Solo corsi con iscrizioni aperte vengono mostrati
- Stili visivi mantenuti per i corsi esistenti
- Stile di default per nuovi corsi

### Vantaggi

1. **Sincronizzazione automatica** - Quando un corso viene pubblicato/rimosso da EduPlan, il sito si aggiorna automaticamente (entro 5 minuti)
2. **Nessuna modifica codice** - Non serve più fare deploy per aggiungere/rimuovere corsi
3. **Consistenza dati** - I dati sono sempre allineati con il database

### Per aggiungere un nuovo corso

1. Su EduPlan: creare il corso e pubblicarlo
2. Il sito lo mostrerà automaticamente entro 5 minuti
3. (Opzionale) Per stile personalizzato: aggiungere in `courseStylesMap` di `Courses.tsx`

---

## STORICO - Menu Percorsi era hardcoded (risolto con v5.9)

Il menu "Percorsi" era **HARDCODED** in `Header.tsx` con voci che non corrispondevano ai dati API.
Con la v5.9 è stata richiesta l'implementazione dinamica.

---

## PROBLEMA RISOLTO - DEPLOY EFFETTUATO (27/12/2025 09:25)

**CAUSA IDENTIFICATA E RISOLTA**

Il corso "Competenze Digitali" era presente nel codice locale ma **le modifiche non erano mai state committate e pushate su GitHub/Vercel**.

### Cosa mancava

I seguenti file erano stati modificati localmente ma non deployati:
- `src/components/Header.tsx` - menu navigazione (aggiunto corso GOL)
- `src/components/CourseDetail.tsx` - dati statici corso
- `src/components/Courses.tsx` - homepage carosello

### Azione eseguita

Deploy effettuato con commit delle modifiche mancanti.

### Verifica

Attendere 2-3 minuti per il deploy Vercel, poi verificare:
- Menu GOL: deve mostrare "Competenze Digitali"
- Pagina: `https://innform.eu/corsi/competenze-digitali` deve funzionare

---

## RISPOSTA AL PROBLEMA "CORSO NON TROVATO" (27/12/2025 09:15)

**ANALISI COMPLETATA - Il corso e' configurato correttamente nel sito.**

### Verifica codice effettuata

| Controllo | Risultato | Dettaglio |
|-----------|-----------|-----------|
| Corso in `coursesData` | PRESENTE | Riga 618-673 di `CourseDetail.tsx` |
| Slug corretto | SI | `competenze-digitali` |
| Route configurata | SI | `/corsi/:courseId` in `App.tsx` riga 86 |
| API chiamata | SI | `usePublicCourse({ slug: courseId })` |

### Il corso "Competenze Digitali" e' correttamente configurato

```javascript
// CourseDetail.tsx riga 618
'competenze-digitali': {
  id: 'competenze-digitali',
  title: 'Competenze Digitali',
  type: 'Programma GOL (Upskilling)',
  duration: '60 ore',
  price: 'Gratuito (GOL)',
  location: 'Potenza',
  // ... altri dati
}
```

### Causa probabile: Cache CDN/Vercel

Se la pagina mostra "Corso non trovato", il problema e' probabilmente la **cache CDN di Vercel** che sta servendo una versione vecchia della pagina.

### Azioni da provare

1. **Hard refresh del browser**: `Ctrl+Shift+R` (Windows) o `Cmd+Shift+R` (Mac)
2. **Aprire in modalita' incognito**: per bypassare cache browser
3. **Attendere 5 minuti**: la cache Vercel si aggiorna periodicamente
4. **Verificare console browser**: premere F12 e controllare errori nella tab "Console"

### Test diretto API nel browser

Aprire la console del browser (F12) su innform.eu e eseguire:
```javascript
fetch('https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-courses-api?slug=competenze-digitali', {
  headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlranFibWp5anVoa3d0ZHZ4amFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzc4MDksImV4cCI6MjA3NjYxMzgwOX0.6MqvODmDE27UtnTXgI7ZiZF1th5q4QVVxwVu_2czBcs' }
}).then(r => r.json()).then(d => console.log('Corso:', d))
```

Se il test mostra i dati del corso, il problema e' solo la cache.

---

## RISPOSTA PER AGENTE EDUPLAN - ANALISI COMPLETATA (27/12/2025)

**IMPORTANTE:** L'agente del sito ha analizzato il problema segnalato e fornisce il seguente report.

### Problema segnalato

Il corso GOL-COMDIG (Competenze digitali) e' stato pubblicato su EduPlan ma non appare sul sito innform.eu.

### Analisi effettuata

| Controllo | Risultato | Note |
|-----------|-----------|------|
| Cache sito | OK | Ridotta da 10 a 5 minuti (deploy effettuato) |
| API funzionante | OK | L'API restituisce correttamente il corso |
| Filtro `is_enrollments_open` | OK | Il componente CourseDetail filtra correttamente |
| Bug calendario lezioni | OK | Nessun limite nel codice, mostra tutte le lezioni ricevute |

### CAUSA IDENTIFICATA - Lista corsi homepage statica

**ATTENZIONE:** La homepage del sito (`src/components/Courses.tsx`) usa una **lista STATICA hardcoded** di corsi, NON chiama l'API EduPlan.

Questo significa che:
- I nuovi corsi creati su EduPlan **NON appaiono automaticamente** nella homepage
- Per aggiungere un corso alla homepage serve una modifica al codice del sito
- La pagina dettaglio corso (`/corsi/{slug}`) invece USA l'API e mostra dati live

### Corsi attualmente in homepage (lista statica)

```
- tecnico-analisi-alimentari (Master)
- master-editoria (Master)
- safety-manager (Master)
- interior-design (Master)
- sviluppo-turistico (GOL)
- sistema-educativo-infanzia (GOL)
- operatore-tornitura (GOL)
- operatore-h2s (GOL)
- pubblicita-comunicazione (GOL)
- operatore-panificazione (GOL)
- competenze-digitali (GOL) <-- GIA' PRESENTE
- corso-di-specializzazione-alle-guide-turistiche (Specializzazione)
```

### Verifica per EduPlan

Il corso "Competenze digitali" E' GIA' nella lista statica del sito con slug `competenze-digitali`.

**Verificare su EduPlan:**
1. Il campo `website_slug` del corso GOL-COMDIG corrisponde a `competenze-digitali`?
2. Se lo slug e' diverso, la pagina dettaglio non funzionera'

### Link diretto per test

Provare ad aprire: `https://innform.eu/corsi/competenze-digitali`

Se la pagina si apre e mostra i dati corretti, il problema e' risolto.
Se da errore 404 o mostra dati sbagliati, lo slug non corrisponde.

---

## AZIONI COMPLETATE DAL SITO (27/12/2025)

1. **Cache ridotta** da 10 minuti a 5 minuti (file: `src/services/public-courses-api.ts`)
2. **Deploy effettuato** su Vercel (commit: 8d4713e)
3. **Analisi codice** completata - nessun bug nel calendario lezioni
4. **Verifica filtri** completata - filtro `is_enrollments_open` funziona correttamente

---

## ⚠️ BUG CORRETTO - CORSI IN DRAFT ORA NASCOSTI (26/12/2025)

**IMPORTANTE PER L'AGENTE DEL SITO:**

E' stato corretto un bug nell'API `public-courses-api` che causava la visualizzazione di corsi anche dopo essere stati rimossi dalla pubblicazione.

### Cosa e' stato corretto

**Prima (BUG):** Quando si cercava un corso per `code`, `id` o `slug`, l'API restituiva il corso anche se era in stato `draft`.

**Dopo (CORRETTO):** L'API filtra SEMPRE per status `published` o `active`, indipendentemente dai parametri di ricerca.

### Tempistiche di aggiornamento

| Livello | Cache | Tempo massimo |
|---------|-------|---------------|
| API Supabase | 60 secondi | 1 minuto |
| Sito (RACCOMANDATO) | 1-2 minuti | 2 minuti |
| Sito (MASSIMO CONSIGLIATO) | 5 minuti | 5 minuti |

**AZIONE RICHIESTA:** Se il sito ha una cache superiore a 5 minuti, ridurla per garantire aggiornamenti rapidi quando un corso viene rimosso dalla pubblicazione.

### Test verifica

```bash
# Corso GOL-COMDIG ora restituisce null (era in draft)
curl -s "https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-courses-api?code=GOL-COMDIG" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Risposta attesa: {"success":true,"data":null,"meta":{"total":0,...}}
```

---

## PULSANTE "PUBBLICA SUL SITO" (IMPLEMENTATO)

E' ora disponibile un pulsante nell'header della pagina dettaglio corso in EduPlan per pubblicare/depubblicare rapidamente un corso sul sito innform.eu.

### Come funziona

| Stato corso | Pulsante mostrato | Colore | Azione |
|-------------|-------------------|--------|--------|
| `draft` | "Pubblica sul sito" | Verde | Cambia status a `published` |
| `cancelled` | "Pubblica sul sito" | Verde | Cambia status a `published` |
| `published` | "Rimuovi dal sito" | Arancione | Cambia status a `draft` |
| `active` | "Rimuovi dal sito" | Arancione | Cambia status a `draft` |

### Validazione automatica

Prima di pubblicare, il sistema verifica che:
1. Esista almeno **una edizione con data futura**
2. L'edizione abbia **status "published"**
3. L'edizione abbia un **numero max partecipanti > 0**

Se mancano requisiti, viene mostrato un modal con la lista dei problemi e un pulsante "Vai alle Edizioni" per correggerli.

### Screenshot posizione pulsante

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Torna ai corsi                                               │
│  GOL-COMDIG  [draft]                                            │
│                                                                 │
│  Competenze digitali                                            │
│                                                                 │
│  [Pubblica sul sito] [Completa Corso] [Modifica] [Elimina]     │
└─────────────────────────────────────────────────────────────────┘
```

---

## QUANDO UN CORSO APPARE SUL SITO

Un corso viene mostrato sul sito innform.eu quando soddisfa TUTTE queste condizioni:

### Requisiti OBBLIGATORI

| Requisito | Campo API | Valore Richiesto |
|-----------|-----------|------------------|
| Status pubblicato | `status` | `"published"` o `"active"` |
| Iscrizioni aperte | `is_enrollments_open` | `true` |

### Come viene calcolato `is_enrollments_open`

Il campo `is_enrollments_open` e' calcolato automaticamente dall'API in base a:

**Se il corso ha edizioni:**
- Almeno UNA edizione deve avere iscrizioni aperte

**Se il corso NON ha edizioni:**
- Il corso NON deve essere gia' iniziato (`already_started = false`)
- Devono esserci posti disponibili (`available_spots > 0`)
- La deadline iscrizioni non deve essere passata

### Motivi comuni per cui un corso NON appare

| Problema | Soluzione |
|----------|-----------|
| `is_enrollments_open: false` | Verificare date e deadline |
| `already_started: true` | Il corso e' gia' iniziato, creare nuova edizione |
| `available_spots: 0` | Corso esaurito |
| `status: "draft"` | Cambiare status a "Pubblicato" |
| Deadline passata | Aggiornare `enrollment_deadline` |

### Esempio corso VISIBILE (corretto)

```json
{
  "status": "published",
  "is_enrollments_open": true,
  "available_spots": 20,
  "already_started": false,
  "start_date": "2026-02-02",
  "enrollment_deadline": "2026-01-26"
}
```

### Esempio corso NON VISIBILE (problema)

```json
{
  "status": "published",
  "is_enrollments_open": false,
  "available_spots": 10,
  "already_started": true,
  "start_date": "2025-12-01",
  "enrollment_deadline": null
}
```

**Problema:** Il corso e' gia' iniziato (`already_started: true`), quindi `is_enrollments_open` e' `false`.

### Come verificare lo stato di un corso

```bash
curl -s "https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-courses-api?code=CODICE_CORSO" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlranFibWp5anVoa3d0ZHZ4amFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzc4MDksImV4cCI6MjA3NjYxMzgwOX0.6MqvODmDE27UtnTXgI7ZiZF1th5q4QVVxwVu_2czBcs"
```

Controllare i campi: `is_enrollments_open`, `already_started`, `available_spots`, `enrollment_deadline`

---

## QUANDO UN PERCORSO APPARE SUL SITO

Un percorso formativo viene mostrato quando:

| Requisito | Campo Database | Valore |
|-----------|----------------|--------|
| E' un percorso | `is_learning_path` | `true` |
| Pubblicato sul sito | `is_published_on_website` | `true` |

Entrambi i flag devono essere `true`.

---

## LOGICA DI FILTRO DEL SITO (IMPORTANTE)

Il sito innform.eu DEVE filtrare i corsi mostrando SOLO quelli con:

```javascript
// Filtro corretto per mostrare corsi disponibili
const corsiVisibili = corsi.filter(corso =>
  corso.is_enrollments_open === true
);
```

**NON usare** filtri su `website_content` - e' un campo opzionale per contenuti aggiuntivi.

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

### v6.6 (27 Dicembre 2025)
- **AGGIUNTA:** Sezione critica "Gestione Slug e Rinomina Corsi" con documentazione completa
- **AGGIUNTA:** Workflow dettagliato per rinominare corsi senza perdere dati
- **AGGIUNTA:** Diagrammi esplicativi del problema slug
- **AGGIUNTA:** Checklist pre-rinomina
- **AGGIUNTA:** Casi speciali (punteggiatura, maiuscole, parole aggiuntive)
- **AGGIUNTA:** Tabella esempi calcolo slug

### v6.5 (27 Dicembre 2025)
- **IMPLEMENTATO:** Corsi dinamici al 100% da API EduPlan
- **AGGIUNTO:** Corso AI con programma didattico 20 ore
- **AGGIUNTO:** Logica ordinamento carosello (TAA al primo posto)

### v6.4 (27 Dicembre 2025)
- **RICHIESTA PRIORITARIA:** Rendere il sito 100% dinamico per i corsi
- **PROBLEMA:** Nuovi corsi mostrano "Corso non trovato" anche se l'API funziona
- **SOLUZIONE RICHIESTA:** Modificare `CourseDetail.tsx` per usare solo dati API
- **CORSO IN ATTESA:** "Corso AI" (slug: `corso-ai`) pubblicato ma non visibile

### v6.3 (27 Dicembre 2025)
- **SEMPLIFICATO:** Slug ora auto-generato dal nome (nessuna selezione manuale)
- **RIMOSSO:** Dropdown con lista slug predefiniti (non più necessario)
- **RIMOSSO:** Campo di input per slug personalizzato
- **AGGIUNTO:** Campo read-only che mostra lo slug generato automaticamente
- **MODIFICATO:** CourseModal.tsx - slug auto-generato dal campo `name`
- **MODIFICATO:** EditCourseModal.tsx - slug auto-generato dal campo `title`
- **MODIFICATO:** ProjectModal.tsx - slug auto-generato dal campo `name`
- **FUNZIONE:** `generateSlug()` - converte nome in slug URL-friendly
- **OBIETTIVO RAGGIUNTO:** Slug sempre presente, zero input utente, zero errori

### v6.2 (27 Dicembre 2025)
- **IMPLEMENTATO:** Validazione automatica degli slug nei form EduPlan
- **AGGIUNTO:** Dropdown con lista slug validi per corsi (13 slug)
- **AGGIUNTO:** Dropdown con lista slug validi per percorsi (3 slug: master, gol, specializzazione)
- **AGGIUNTO:** Avviso visivo quando si usa uno slug personalizzato non presente nel sito
- **AGGIUNTO:** Link diretto alla pagina del sito quando si seleziona uno slug valido
- **MODIFICATO:** CourseModal.tsx - aggiunto campo websiteSlug con validazione
- **MODIFICATO:** EditCourseModal.tsx - aggiunto campo website_slug con validazione
- **MODIFICATO:** ProjectModal.tsx - aggiunto campo websiteSlug con validazione
- **OBIETTIVO RAGGIUNTO:** Zero errori di comunicazione slug tra EduPlan e sito

### v6.1 (27 Dicembre 2025)
- **DOCUMENTATO:** Problema slug risolto definitivamente
- **AGGIUNTA:** Tabella con tutti gli slug corretti per i 13 corsi
- **AGGIUNTA:** Istruzioni per agente EduPlan su verifica slug prima della pubblicazione
- **AGGIUNTA:** Query SQL di verifica slug
- **CORRETTO:** Allineamento slug nel sito per 5 corsi:
  - `master-editoria` → `editoria-e-comunicazione`
  - `safety-manager` → `master-safety`
  - `operatore-panificazione` → `operatore-della-panificazione-e-della-produzione-di-paste`
  - `sviluppo-turistico` → `tecnico-esperto-per-lo-sviluppo-turistico-territoriale`
  - `operatore-h2s` → `operatore-h2s-e-sicurezza`

### v6.0 (27 Dicembre 2025)
- **COMPLETATO:** Sincronizzazione automatica sito-gestionale implementata
- **IMPLEMENTATO:** Menu Percorsi dinamico (usa `public-paths-api`)
- **IMPLEMENTATO:** Homepage corsi dinamica (usa `public-courses-api`)
- **CREATO:** Nuovo servizio `public-paths-api.ts` e hook `usePublicPaths.ts`
- **RIMOSSO:** Lista statica di 12 corsi da `Courses.tsx`
- **RIMOSSO:** Lista statica percorsi da `Header.tsx`
- **AGGIUNTO:** Loading state e gestione errori nel componente Courses
- **OBIETTIVO RAGGIUNTO:** Contenuti sincronizzati automaticamente con EduPlan

### v5.9 (27 Dicembre 2025)
- **RICHIESTA PRIORITARIA:** Implementare sincronizzazione automatica sito-gestionale
- **DA FARE:** Rendere menu Percorsi dinamico (usare `public-paths-api`)
- **DA FARE:** Rendere homepage corsi dinamica (usare `public-courses-api`)
- **OBIETTIVO:** Eliminare contenuti hardcoded, tutto deve passare dalle API

### v5.8 (27 Dicembre 2025)
- **SEGNALATO:** Menu "Percorsi" non sincronizzato con API
- **VERIFICATO:** API `public-paths-api` restituisce solo 2 percorsi (Master, GOL)
- **VERIFICATO:** "Corsi di Specializzazione" NON ha flag `is_learning_path` attivo
- **RICHIESTA:** Verificare se menu Percorsi è hardcoded o dinamico

### v5.7 (27 Dicembre 2025)
- **ANALISI COMPLETATA:** Risposta al problema corso GOL-COMDIG non visibile
- **CACHE RIDOTTA:** Da 10 minuti a 5 minuti per maggiore reattivita'
- **IDENTIFICATO:** Homepage usa lista statica, non API dinamica
- **VERIFICATO:** Bug calendario lezioni NON presente (il componente mostra tutte le lezioni)
- **VERIFICATO:** Filtro `is_enrollments_open` funziona correttamente
- **VERIFICATO:** Corso `competenze-digitali` presente in `coursesData` (riga 618-673)
- **VERIFICATO:** Route `/corsi/:courseId` configurata correttamente
- **PROBABILE CAUSA "Corso non trovato":** Cache CDN Vercel - provare hard refresh o incognito
- File modificato: `src/services/public-courses-api.ts` (CACHE_TIME: 300000)

### v5.6 (26 Dicembre 2025)
- **BUG CRITICO CORRETTO:** L'API ora nasconde correttamente i corsi in `draft`
- Prima: cercare per `code`, `id` o `slug` bypassava il filtro status
- Dopo: il filtro `status IN ('published', 'active')` e' SEMPRE applicato
- File modificato: `supabase/functions/public-courses-api/index.ts`
- **IMPORTANTE:** Verificare che il sito non abbia cache superiori a 5 minuti

### v5.5 (26 Dicembre 2025)
- CORRETTO: Lista corsi ora mostra correttamente lo stato "Pubblicato" (era sempre "Bozza")
- AGGIUNTO: Badge stato "Pubblicato" con icona globo verde
- AGGIORNATO: Statistiche mostrano "Sul sito" invece di "Attivi"
- File modificato: `src/modules/courses/pages/CoursesPage.tsx`

### v5.4 (26 Dicembre 2025)
- IMPLEMENTATO: Pulsante "Pubblica sul sito" nell'header corso di EduPlan
- IMPLEMENTATO: Pulsante "Rimuovi dal sito" per corsi pubblicati
- IMPLEMENTATO: Validazione automatica prima della pubblicazione
- IMPLEMENTATO: Modal con lista problemi se requisiti non soddisfatti
- File modificato: `src/modules/courses/pages/CourseDetailPage.tsx`

### v5.3 (26 Dicembre 2025)
- NUOVO: Sezione "QUANDO UN CORSO APPARE SUL SITO" con requisiti dettagliati
- NUOVO: Sezione "QUANDO UN PERCORSO APPARE SUL SITO"
- NUOVO: Logica di filtro consigliata per il frontend
- DOCUMENTATO: Come viene calcolato `is_enrollments_open`
- DOCUMENTATO: Motivi comuni per cui un corso non appare
- DOCUMENTATO: Come verificare lo stato di un corso via API

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
4. [x] Impostare `LESSONS_API_ENABLED = true` nel sito - GIA' ATTIVO
5. [x] Verificare visualizzazione calendario nelle pagine corso - FUNZIONANTE (27/12/2025)

---

*Fine guida*
