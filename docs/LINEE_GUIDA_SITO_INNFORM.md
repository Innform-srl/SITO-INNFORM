# LINEE GUIDA COMPLETE - SITO INNFORM

## Indice

1. [Panoramica Generale](#1-panoramica-generale)
2. [Stack Tecnologico](#2-stack-tecnologico)
3. [Architettura del Sistema](#3-architettura-del-sistema)
4. [Struttura del Progetto](#4-struttura-del-progetto)
5. [Pagine e Routing](#5-pagine-e-routing)
6. [Componenti Principali](#6-componenti-principali)
7. [Servizi e API](#7-servizi-e-api)
8. [Sistema Realtime](#8-sistema-realtime)
9. [Gestione Corsi e Programmi](#9-gestione-corsi-e-programmi)
10. [Sistema Form e Iscrizioni](#10-sistema-form-e-iscrizioni)
11. [Integrazioni Esterne](#11-integrazioni-esterne)
12. [SEO e Performance](#12-seo-e-performance)
13. [Mobile e Accessibilità](#13-mobile-e-accessibilità)
14. [Configurazione e Deploy](#14-configurazione-e-deploy)

---

## 1. Panoramica Generale

### Cos'è SITO-INNFORM

SITO-INNFORM è il sito web ufficiale di Innform, un ente di formazione professionale. Il sito offre:

- **Catalogo corsi** con informazioni in tempo reale (posti disponibili, prezzi, date)
- **Programmi formativi** (Master, GOL, Specializzazione)
- **Sistema di iscrizione online** integrato con EduPlan
- **News e blog** aziendale
- **Pagine istituzionali** (Chi siamo, Progetti, Contatti)

### Target Utenti

| Utente | Obiettivo |
|--------|-----------|
| Studenti/Professionisti | Cercare e iscriversi a corsi |
| Disoccupati | Accedere al Programma GOL (gratuito) |
| Laureati | Iscriversi a Master di specializzazione |
| Aziende | Richiedere formazione aziendale |

---

## 2. Stack Tecnologico

### Frontend

| Tecnologia | Versione | Utilizzo |
|------------|----------|----------|
| **React** | 18.3.1 | Framework UI principale |
| **TypeScript** | 5.x | Type safety |
| **Vite** | 6.3.5 | Build tool e dev server |
| **React Router** | 6.x | Routing client-side |
| **Tailwind CSS** | 3.x | Styling utility-first |

### UI Components

| Libreria | Descrizione |
|----------|-------------|
| **Radix UI** | 30+ componenti accessibili headless |
| **shadcn/ui** | Componenti pre-stilizzati su Radix |
| **Lucide React** | 487+ icone SVG |
| **Motion** | Animazioni fluide (ex Framer Motion) |
| **Embla Carousel** | Carousel touch-friendly |

### Backend/Database

| Servizio | Funzione |
|----------|----------|
| **Supabase** | Database PostgreSQL, Realtime, Edge Functions |
| **EduPlan** | Training Management System (TMS) integrato |

### Form e Validazione

| Libreria | Utilizzo |
|----------|----------|
| **React Hook Form** | Gestione form performante |
| **Zod** | Schema validation (opzionale) |

---

## 3. Architettura del Sistema

### Architettura Ibrida Realtime + Polling

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│  Components ←→ Hooks (useRealtimeCourses) ←→ Services (API)     │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE EDGE FUNCTIONS                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │public-courses-api│ │public-paths-api │  │public-lessons-api│ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE DATABASE (PostgreSQL)                │
│  ┌────────┐  ┌───────────┐  ┌───────┐  ┌───────┐  ┌───────────┐ │
│  │courses │  │enrollments│  │students│ │ leads │  │   paths   │ │
│  └────────┘  └───────────┘  └───────┘  └───────┘  └───────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE REALTIME                             │
│           Broadcast Channel: "public-data"                       │
│           Eventi: courses:updated, paths:updated                 │
└─────────────────────────────────────────────────────────────────┘
```

### Flusso Dati

1. **Fetch Iniziale**: L'app carica i dati tramite Edge Functions
2. **Cache Locale**: I dati vengono memorizzati in cache (TTL 5 minuti)
3. **Realtime Sync**: Sottoscrizione al canale broadcast per aggiornamenti
4. **Fallback Polling**: Se Realtime disconnesso, polling ogni 5 minuti
5. **Invalidazione**: Cache invalidata su eventi broadcast

---

## 4. Struttura del Progetto

```
SITO-INNFORM/
├── public/                     # Asset statici
│   ├── favicon.ico
│   ├── manifest.json           # PWA manifest
│   ├── robots.txt              # SEO robots
│   └── sitemap.xml             # Sitemap generato
│
├── scripts/
│   └── generate-sitemap.js     # Script generazione sitemap
│
├── src/
│   ├── components/             # Componenti React (80+)
│   │   ├── ui/                 # Componenti UI base (shadcn)
│   │   ├── figma/              # Componenti da design Figma
│   │   ├── Header.tsx          # Navigazione principale
│   │   ├── Footer.tsx          # Footer sito
│   │   ├── Hero.tsx            # Hero section homepage
│   │   ├── Courses.tsx         # Catalogo corsi
│   │   ├── Programs.tsx        # Sezione programmi
│   │   ├── CourseDetail.tsx    # Dettaglio singolo corso
│   │   ├── ProgramDetail.tsx   # Dettaglio programma
│   │   ├── CourseLiveInfo.tsx  # Info realtime corsi
│   │   ├── LessonCalendar.tsx  # Calendario lezioni
│   │   ├── EduPlanForms.tsx    # Form iscrizione/contatti
│   │   └── ...
│   │
│   ├── hooks/                  # Hook personalizzati
│   │   ├── usePublicCourses.ts     # Fetch corsi con polling
│   │   ├── useRealtimeCourses.ts   # Corsi con Realtime
│   │   ├── useRealtimePaths.ts     # Percorsi con Realtime
│   │   └── useEduPlanForms.ts      # Gestione form
│   │
│   ├── services/               # Servizi API
│   │   ├── public-courses-api.ts   # API corsi
│   │   ├── public-paths-api.ts     # API percorsi
│   │   └── eduplan-api.ts          # API EduPlan (studenti, iscrizioni)
│   │
│   ├── lib/                    # Utility
│   │   └── supabase-realtime.ts    # Client Realtime configurato
│   │
│   ├── config/                 # Configurazione
│   │   └── eduplan-config.ts       # Config EduPlan
│   │
│   ├── types/                  # Type definitions TypeScript
│   │   └── *.d.ts
│   │
│   ├── styles/                 # CSS globali
│   │   ├── global.css              # Stili base
│   │   ├── mobile.css              # Ottimizzazioni mobile
│   │   └── animations.css          # Animazioni
│   │
│   ├── utils/                  # Utility e dati statici
│   │   └── newsData.ts             # Dati news
│   │
│   ├── App.tsx                 # Root component + routing
│   ├── main.tsx                # Entry point
│   └── index.css               # Import stili
│
├── docs/                       # Documentazione
│   ├── GUIDA_OTTIMIZZAZIONE_SUPABASE.md
│   ├── GUIDA_REALTIME_PER_SITO_INNFORM.md
│   └── ...
│
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

---

## 5. Pagine e Routing

### Mappa Completa delle Route

| Route | Componente | Descrizione |
|-------|------------|-------------|
| `/` | `HomePage` | Homepage con hero, corsi, programmi, servizi |
| `/news` | `NewsPage` | Elenco articoli/news |
| `/news/:newsId` | `NewsDetail` | Singolo articolo |
| `/corsi/:courseId` | `CourseDetail` | Dettaglio corso con iscrizione |
| `/programmi/:programId` | `ProgramDetail` | Dettaglio Master/GOL/Specializzazione |
| `/iscrizione/:slug` | `ProgramEnrollment` | Form pre-iscrizione programma |

### Pagine Chi Siamo

| Route | Componente | Contenuto |
|-------|------------|-----------|
| `/chi-siamo/panoramica` | `AboutOverview` | Presentazione azienda |
| `/chi-siamo/visione-missione` | `AboutVision` | Mission e valori |
| `/chi-siamo/dove-siamo` | `AboutLocation` | Sede e contatti |
| `/chi-siamo/qualita` | `AboutQuality` | Certificazioni |

### Pagine Progetti

| Route | Componente | Progetto |
|-------|------------|----------|
| `/progetti/ti-abilito` | `ProjectTiAbilito` | Abilitazione professionale |
| `/progetti/segni` | `ProjectSegni` | Turismo accessibile |

### Pagine Legali

| Route | Componente |
|-------|------------|
| `/privacy-policy` | `PrivacyPolicy` |
| `/cookie-policy` | `CookiePolicy` |
| `/faq` | `FAQPage` |

### Navigazione

Il routing utilizza **React Router v6** con:

- **Link dinamici**: Generati da API per corsi/percorsi
- **Hash navigation**: `/#corsi`, `/#programmi` per scroll smooth
- **Breadcrumb**: Navigazione gerarchica nelle pagine interne

---

## 6. Componenti Principali

### Layout Components

#### Header (`Header.tsx`)
- Logo con link a homepage
- Menu desktop con dropdown
- **Dropdown "Percorsi"**: Master, GOL, Specializzazione (dati da API)
- **Dropdown "Corsi"**: Lista corsi attivi sincronizzata in realtime
- Menu mobile hamburger
- Link social e contatti

#### Footer (`Footer.tsx`)
- Colonne: Formazione, Chi Siamo, Supporto, Contatti
- Social links (LinkedIn, Facebook, Instagram)
- Copyright e link legali

### Homepage Components

#### Hero (`Hero.tsx`)
- Carousel automatico news (10 secondi)
- Gradient animato di sfondo
- CTA "Scopri i corsi" e "Contattaci"
- Filtro news: solo ultimo mese

#### Courses (`Courses.tsx`)
- **Filtri**: Master, GOL, Specializzazione, Tutti
- **Visualizzazione**: Toggle Carousel/Grid
- **Card corso** con:
  - Immagine con fallback
  - Badge dinamici (Nuovo, Ultimi posti, ecc.)
  - Titolo, categoria, durata
  - Prezzo (o "Gratuito" per GOL)
  - Posti disponibili in tempo reale
- Integrato con `useRealtimeCourses`

#### Programs (`Programs.tsx`)
- Card per ogni programma formativo
- Link a pagina dettaglio
- Icone e descrizioni

### Dettaglio Components

#### CourseDetail (`CourseDetail.tsx`)
Pagina completa di un corso:

```
┌─────────────────────────────────────────────────┐
│  Breadcrumb                                     │
├─────────────────────────────────────────────────┤
│  Carousel Immagini                              │
├─────────────────────────────────────────────────┤
│  Titolo + Badge Live (Esaurito, Ultimi posti)   │
├─────────────────────────────────────────────────┤
│  Info Box: Durata | Prezzo | Categoria          │
├─────────────────────────────────────────────────┤
│  Descrizione completa                           │
├─────────────────────────────────────────────────┤
│  CourseLiveInfo (posti, countdown deadline)     │
├─────────────────────────────────────────────────┤
│  EditionsList (edizioni disponibili)            │
├─────────────────────────────────────────────────┤
│  Tabs: Moduli | Skills | Requisiti              │
├─────────────────────────────────────────────────┤
│  LessonCalendar (prossime lezioni)              │
├─────────────────────────────────────────────────┤
│  FAQ Corso                                      │
├─────────────────────────────────────────────────┤
│  Form Iscrizione                                │
├─────────────────────────────────────────────────┤
│  Corsi Correlati (Carousel)                     │
└─────────────────────────────────────────────────┘
```

#### CourseLiveInfo (`CourseLiveInfo.tsx`)
Componenti per informazioni in tempo reale:

| Componente | Funzione |
|------------|----------|
| `CourseBadgesDisplay` | Badge dinamici (Esaurito, Ultimi posti, Inizia presto, Nuovo) |
| `CourseAvailability` | Barra progresso posti disponibili |
| `DeadlineCountdown` | Countdown alla deadline iscrizione |
| `LiveIndicator` | Pallino verde "corso in diretta" |
| `EditionsList` | Lista edizioni con date e stato |

#### LessonCalendar (`LessonCalendar.tsx`)
- Visualizzazione card per ogni lezione
- Scroll orizzontale su mobile
- Info: data, orario, docente, location
- Limite 3 lezioni o mostra tutte

### Form Components

#### EduPlanForms (`EduPlanForms.tsx`)
Tre form principali:

1. **EnrollmentForm**: Iscrizione corso completa
   - Dati anagrafici (nome, cognome, CF, email, telefono)
   - Indirizzo
   - Selezione edizione
   - Accettazione privacy

2. **ContactForm**: Richiesta informazioni
   - Nome, email, messaggio
   - Selezione corso di interesse

3. **PreEnrollmentForm**: Pre-iscrizione GOL/Master
   - Dati studente + requisiti specifici

---

## 7. Servizi e API

### Public Courses API (`public-courses-api.ts`)

**Endpoint Base**: `https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-courses-api`

#### Funzioni Disponibili

```typescript
// Lista corsi con filtri
getCourses(options?: {
  category?: string;    // 'master' | 'gol' | 'specializzazione'
  type?: string;        // Tipo corso
  status?: string;      // 'active' | 'draft' | etc.
  limit?: number;       // Limite risultati
  offset?: number;      // Paginazione
}): Promise<Course[]>

// Corso per ID (UUID)
getCourseById(id: string, forceRefresh?: boolean): Promise<Course | null>

// Corso per slug (CONSIGLIATO per URL)
getCourseBySlug(slug: string): Promise<Course | null>

// Corso per codice (backward compatible)
getCourseByCode(code: string): Promise<Course | null>

// Lezioni di un corso
getCourseLessons(courseId: string): Promise<Lesson[]>

// Invalida cache locale
invalidateCache(): void
```

#### Struttura Corso

```typescript
interface Course {
  id: string;                    // UUID
  code: string;                  // Codice corso (es: "MS-001")
  title: string;                 // Titolo corso
  website_slug: string;          // Slug per URL
  description: string;           // Descrizione completa
  short_description: string;     // Descrizione breve
  category: string;              // master | gol | specializzazione
  type: string;                  // Tipo specifico
  duration_hours: number;        // Durata in ore
  price: number;                 // Prezzo (0 = gratuito)
  status: string;                // active | draft | archived

  // Campi dinamici (aggiornati in realtime)
  max_students: number;          // Posti totali
  available_spots: number;       // Posti disponibili
  enrollment_deadline: string;   // Deadline iscrizione (ISO date)

  // Media
  featured_image: string;        // URL immagine principale
  gallery: string[];             // Array URL gallery

  // Contenuti
  modules: Module[];             // Moduli formativi
  skills: string[];              // Competenze acquisite
  requirements: string[];        // Requisiti partecipazione
  faq: FAQ[];                    // Domande frequenti

  // Edizioni
  editions: Edition[];           // Edizioni disponibili

  // Metadata
  badges: {
    new_course: boolean;
    popular: boolean;
    limited_seats: boolean;
    starting_soon: boolean;
    sold_out: boolean;
  };

  created_at: string;
  updated_at: string;
}
```

### Public Paths API (`public-paths-api.ts`)

**Endpoint**: `https://ikjqbmjyjuhkwtdvxjai.supabase.co/functions/v1/public-paths-api`

```typescript
// Lista percorsi formativi
getPaths(forceRefresh?: boolean): Promise<LearningPath[]>

// Invalida cache
invalidatePathsCache(): void
```

#### Struttura Percorso

```typescript
interface LearningPath {
  id: string;
  code: string;              // "GOL", "MS", "SPEC"
  title: string;             // "Programma GOL"
  slug: string;              // "gol"
  description: string;
  courses: PathCourse[];     // Corsi nel percorso
  badges: {
    new_path: boolean;
    popular: boolean;
    has_multiple_courses: boolean;
  };
}
```

### EduPlan API (`eduplan-api.ts`)

API per operazioni CRUD su database Supabase.

```typescript
// Servizio Studenti
StudentService.create(student: StudentInput): Promise<Student>
StudentService.update(id: string, data: Partial<Student>): Promise<Student>

// Servizio Iscrizioni
EnrollmentService.create(enrollment: EnrollmentInput): Promise<Enrollment>
EnrollmentService.getByStudent(studentId: string): Promise<Enrollment[]>

// Servizio Lead
LeadService.create(lead: LeadInput): Promise<Lead>

// Eventi Workflow
WorkflowEvents.emit(event: string, payload: any): void
```

---

## 8. Sistema Realtime

### Architettura Realtime

Il sistema utilizza **Supabase Realtime Broadcast** per sincronizzazione istantanea.

```
┌──────────────────────────────────────────────────────────┐
│                    SUPABASE REALTIME                      │
│                                                           │
│    Canale: "public-data"                                  │
│    Eventi:                                                │
│    ├── courses:updated   → Trigger refresh corsi          │
│    ├── paths:updated     → Trigger refresh percorsi       │
│    └── enrollment:created → Aggiorna posti disponibili   │
│                                                           │
└───────────────────────────┬──────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   ┌─────────┐        ┌─────────┐        ┌─────────┐
   │Client 1 │        │Client 2 │        │Client N │
   └─────────┘        └─────────┘        └─────────┘
```

### Hook Realtime

#### useRealtimeCourses

```typescript
const {
  courses,        // Array<Course>
  loading,        // boolean
  error,          // Error | null
  lastUpdated,    // Date
  refetch         // () => Promise<void>
} = useRealtimeCourses({
  category?: string,
  type?: string,
  limit?: number,
  enabled?: boolean
});
```

**Comportamento**:
1. Fetch iniziale via API
2. Sottoscrizione al canale `public-data`
3. Ascolta evento `courses:updated`
4. Su evento: invalida cache + refetch
5. Fallback: polling ogni 5 minuti se disconnesso

#### useRealtimeCourse

```typescript
const {
  course,         // Course | null
  loading,
  error,
  lastUpdated,
  refetch
} = useRealtimeCourse({
  id?: string,
  slug?: string,
  enabled?: boolean
});
```

#### useRealtimeStatus

```typescript
const {
  status,         // 'connected' | 'polling' | 'disconnected'
  isConnected,    // boolean
  isPolling       // boolean
} = useRealtimeStatus();
```

### Client Realtime (`supabase-realtime.ts`)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Canale broadcast
const channel = supabase.channel('public-data')

// Sottoscrizione a eventi
channel.on('broadcast', { event: 'courses:updated' }, (payload) => {
  // Gestisci aggiornamento
})

// Connessione
channel.subscribe()
```

---

## 9. Gestione Corsi e Programmi

### Tipi di Corsi

| Categoria | Descrizione | Prezzo | Target |
|-----------|-------------|--------|--------|
| **Master** | Alta formazione post-laurea | A pagamento | Laureati |
| **GOL** | Garanzia Occupabilità Lavoratori | Gratuito | Disoccupati |
| **Specializzazione** | Formazione avanzata | Variabile | Professionisti |

### Ciclo di Vita Corso

```
┌─────────┐    ┌────────┐    ┌────────┐    ┌──────────┐
│  Draft  │ → │ Active │ → │ Running│ → │ Completed│
└─────────┘    └────────┘    └────────┘    └──────────┘
                   │
                   ▼
              ┌──────────┐
              │ Archived │
              └──────────┘
```

### Edizioni Corso

Un corso può avere più edizioni con date diverse:

```typescript
interface Edition {
  id: string;
  course_id: string;
  code: string;              // "ED-2024-01"
  start_date: string;        // Data inizio
  end_date: string;          // Data fine
  enrollment_deadline: string;
  max_students: number;
  enrolled_students: number;
  available_spots: number;
  instructor: string;        // Docente
  location: string;          // Sede/Online
  status: 'active' | 'full' | 'completed';
}
```

### Badge Dinamici

I badge vengono calcolati automaticamente:

| Badge | Condizione |
|-------|------------|
| `Nuovo` | Creato negli ultimi 30 giorni |
| `Popolare` | Molte iscrizioni |
| `Ultimi Posti` | < 5 posti disponibili |
| `Esaurito` | 0 posti disponibili |
| `Inizia Presto` | Inizio entro 7 giorni |
| `In Corso` | Già iniziato |

### Programmi Formativi

#### Master
- ID: `master`
- Alta formazione specialistica
- Richiede laurea
- Aree: Ambiente, Editoria, Safety, Design

#### GOL (Garanzia Occupabilità Lavoratori)
- ID: `gol`
- 100% Gratuito (finanziato da fondi pubblici)
- Target: disoccupati, inoccupati
- Include indennità di frequenza
- Supporto al placement

#### Specializzazione
- ID: `specializzazione`
- Formazione avanzata settoriale
- Focus: accessibilità, inclusione
- Certificazioni professionali

---

## 10. Sistema Form e Iscrizioni

### Hook Form

```typescript
// Hook per form iscrizione
const { state, submit, reset } = useEnrollmentForm();

// Stato
interface FormState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  success: boolean;
}

// Submit
const handleSubmit = async (formData) => {
  const result = await submit({
    student: {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      fiscal_code: formData.fiscalCode,
    },
    course_id: courseId,
    edition_id: editionId,
    privacy_accepted: true
  });

  if (result) {
    // Iscrizione completata
  }
};
```

### Flusso Iscrizione

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Form Submit │ → │Create/Update│ → │  Create     │
│             │    │  Student    │    │ Enrollment  │
└─────────────┘    └─────────────┘    └─────────────┘
                                            │
                                            ▼
                   ┌─────────────┐    ┌─────────────┐
                   │   Update    │ ← │  Broadcast  │
                   │Available Spots│   │   Event     │
                   └─────────────┘    └─────────────┘
```

### Validazioni Form

| Campo | Validazione |
|-------|-------------|
| Email | Formato valido, unicità |
| Telefono | Formato italiano |
| Codice Fiscale | Lunghezza 16, alfanumerico |
| Privacy | Obbligatorio |

### Stati Iscrizione

| Stato | Descrizione |
|-------|-------------|
| `pending` | In attesa di conferma |
| `confirmed` | Confermata |
| `active` | Corso in frequenza |
| `completed` | Corso completato |
| `withdrawn` | Ritirato |
| `cancelled` | Annullato |

### Stati Pagamento

| Stato | Descrizione |
|-------|-------------|
| `pending` | In attesa |
| `paid` | Pagato |
| `partial` | Pagamento parziale |
| `overdue` | Scaduto |
| `refunded` | Rimborsato |

---

## 11. Integrazioni Esterne

### Supabase

**Progetto ID**: `ikjqbmjyjuhkwtdvxjai`

#### Servizi Utilizzati

| Servizio | Utilizzo |
|----------|----------|
| **Database** | PostgreSQL per tutti i dati |
| **Realtime** | Broadcast per sincronizzazione |
| **Edge Functions** | API serverless |
| **Auth** | Anon key per accesso pubblico |

#### Edge Functions

| Funzione | Endpoint |
|----------|----------|
| `public-courses-api` | `/functions/v1/public-courses-api` |
| `public-paths-api` | `/functions/v1/public-paths-api` |
| `public-lessons-api` | `/functions/v1/public-lessons-api` |

#### Tabelle Database

| Tabella | Contenuto |
|---------|-----------|
| `courses` | Catalogo corsi |
| `editions` | Edizioni corsi |
| `lessons` | Calendario lezioni |
| `paths` | Percorsi formativi |
| `students` | Anagrafica studenti |
| `enrollments` | Iscrizioni |
| `leads` | Contatti/richieste info |

### EduPlan (TMS)

Sistema di Training Management integrato tramite Supabase.

**Funzionalità**:
- Gestione catalogo corsi
- Gestione edizioni e calendario
- Gestione studenti
- Workflow iscrizioni
- Reportistica

### Social Media

| Piattaforma | URL |
|-------------|-----|
| LinkedIn | linkedin.com/company/innform |
| Facebook | facebook.com/innform.eu |
| Instagram | instagram.com/innform_ |

---

## 12. SEO e Performance

### Meta Tags Dinamici

Il componente `SEOHead` gestisce:

```typescript
interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'course';
  jsonLd?: object;
}
```

### Schema JSON-LD

Schemi implementati:

| Schema | Pagina |
|--------|--------|
| `EducationalOrganization` | Globale |
| `LocalBusiness` | Chi Siamo |
| `Course` | Dettaglio corso |
| `FAQPage` | FAQ |
| `BreadcrumbList` | Tutte le pagine |

### Sitemap

Generato automaticamente con `scripts/generate-sitemap.js`:

```javascript
// Script genera sitemap.xml con:
// - Tutte le pagine statiche
// - Tutti i corsi attivi (da API)
// - Tutti i programmi
// - Tutte le news
```

### Performance Optimizations

| Tecnica | Implementazione |
|---------|-----------------|
| **Cache API** | TTL 5 minuti con versioning |
| **Lazy Loading** | Immagini con `loading="lazy"` |
| **Code Splitting** | Route-based con React.lazy |
| **CSS Splitting** | Mobile CSS separato |
| **Prefetch** | Link prefetch per navigation |
| **Debounce** | Su ricerche e filtri |

### Lighthouse Targets

| Metrica | Target |
|---------|--------|
| Performance | > 90 |
| Accessibility | > 95 |
| Best Practices | > 90 |
| SEO | > 95 |

---

## 13. Mobile e Accessibilità

### Responsive Breakpoints

```css
/* Tailwind breakpoints */
sm: 640px    /* Smartphone landscape */
md: 768px    /* Tablet portrait */
lg: 1024px   /* Tablet landscape / small desktop */
xl: 1280px   /* Desktop */
2xl: 1536px  /* Large desktop */
```

### Mobile Optimizations (`mobile.css`)

- **Font sizing**: Ridotto su schermi piccoli
- **Touch targets**: Minimo 48x48px
- **Scroll momentum**: `-webkit-overflow-scrolling: touch`
- **Hover states**: Disabilitati su touch devices
- **Fixed elements**: Ottimizzati per viewport mobile

### Componenti Mobile-Specific

| Componente | Adattamento Mobile |
|------------|-------------------|
| Header | Menu hamburger |
| Courses | 1 colonna, scroll verticale |
| LessonCalendar | Scroll orizzontale |
| Forms | Full width, keyboard ottimizzato |
| Carousel | Swipe gesture |

### Accessibilità (WCAG 2.1 AA)

| Requisito | Implementazione |
|-----------|-----------------|
| **Skip links** | "Vai al contenuto principale" |
| **Focus visible** | Ring outline su tutti gli elementi |
| **ARIA labels** | Su tutti i componenti interattivi |
| **Semantic HTML** | `<main>`, `<nav>`, `<article>`, `<section>` |
| **Color contrast** | Rapporto minimo 4.5:1 |
| **Keyboard nav** | Tab navigation completa |
| **Screen readers** | Testato con NVDA/VoiceOver |

---

## 14. Configurazione e Deploy

### Variabili Ambiente

```env
# Supabase
VITE_SUPABASE_URL=https://ikjqbmjyjuhkwtdvxjai.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# EduPlan Mode
VITE_EDUPLAN_MODE=supabase

# Debug
VITE_DEBUG=true

# Builder.io (CMS opzionale)
VITE_PUBLIC_BUILDER_KEY=97ca4bd...
```

### Scripts NPM

```json
{
  "scripts": {
    "dev": "vite",                                    // Dev server
    "build": "node scripts/generate-sitemap.js && vite build",  // Build prod
    "preview": "vite preview",                        // Preview build
    "sitemap": "node scripts/generate-sitemap.js",   // Solo sitemap
    "lint": "eslint src --ext ts,tsx",               // Linting
    "type-check": "tsc --noEmit"                     // Type check
  }
}
```

### Build Output

```
build/
├── index.html
├── assets/
│   ├── index-[hash].js      # Bundle JS principale
│   ├── index-[hash].css     # Bundle CSS
│   └── [images...]          # Asset ottimizzati
├── manifest.json
├── robots.txt
└── sitemap.xml
```

### Deploy

Il sito può essere deployato su:

| Piattaforma | Configurazione |
|-------------|----------------|
| **Vercel** | Auto-detect Vite |
| **Netlify** | Build: `npm run build`, Publish: `build` |
| **Cloudflare Pages** | Framework: Vite |

### Monitoring

Metriche da monitorare:

- **Realtime connections**: Connessioni Supabase attive
- **API latency**: Tempo risposta Edge Functions
- **Cache hit rate**: Efficienza cache locale
- **Error rate**: Errori form/API
- **Core Web Vitals**: LCP, FID, CLS

---

## Appendice A: Glossario

| Termine | Definizione |
|---------|-------------|
| **EduPlan** | Training Management System backend |
| **GOL** | Garanzia Occupabilità Lavoratori (programma pubblico) |
| **Edge Function** | Funzione serverless Supabase |
| **Realtime Broadcast** | Sistema pub/sub per sync istantanea |
| **Slug** | Identificatore URL-friendly (es: `master-ambiente`) |
| **TTL** | Time To Live (durata cache) |

---

## Appendice B: Contatti Sviluppo

Per modifiche o problemi tecnici:

- **Repository**: SITO-INNFORM
- **Documentazione**: `/docs/`
- **Issue Tracker**: GitHub Issues

---

*Documento generato automaticamente - Ultima revisione: Dicembre 2024*
