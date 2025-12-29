# Guida SEO Completa - Innform.eu

Checklist operativa per ottimizzare il ranking su Google. Basata sulle best practices implementate nel progetto.

---

## 1. Structured Data (JSON-LD)

### 1.1 Schema Organization (index.html)
Verifica che `index.html` contenga gli schema:
- [ ] `EducationalOrganization` - info azienda, rating aggregato
- [ ] `LocalBusiness` - indirizzo, orari, coordinate GPS

```json
{
  "@type": "EducationalOrganization",
  "name": "Nome Azienda",
  "aggregateRating": {
    "ratingValue": "4.8",
    "reviewCount": "673"
  }
}
```

### 1.2 Schema per Pagine Corsi
Ogni pagina corso deve avere `CourseSchema`:

```tsx
<CourseSchema
  name="Nome Corso"
  description="Descrizione corso..."
  provider="Nome Ente"
  url="/corsi/slug-corso"
  educationalLevel="Qualifica Professionale"
/>
```

**File da controllare:**
- `src/components/CourseDetail.tsx`
- `src/components/ProgramDetail.tsx`

### 1.3 FAQ Schema per Featured Snippets
Per apparire nei box "Le persone chiedono anche":

```tsx
<FAQSchema items={[
  { question: "Domanda?", answer: "Risposta..." }
]} />
```

**File:** `src/components/FAQPage.tsx`

### 1.4 Review Schema per Testimonials
Aggiunge stelle nei risultati di ricerca:

```tsx
<ReviewsSchema testimonials={[
  { text: "...", author: "Nome", role: "Corso" }
]} />
```

**File:** `src/components/Testimonials.tsx`

---

## 2. Meta Tags Dinamici

### 2.1 Componente SEOHead
Ogni pagina deve usare `SEOHead`:

```tsx
<SEOHead
  title="Titolo Pagina - Brand"
  description="Descrizione 150-160 caratteri con keyword principale"
  url="/percorso-pagina"
  image="/og-image.jpg"  // opzionale
/>
```

### 2.2 Checklist Meta Tags
- [ ] `title` - Max 60 caratteri, keyword all'inizio
- [ ] `description` - 150-160 caratteri, call-to-action
- [ ] `canonical` - URL canonico per evitare duplicati
- [ ] `og:title`, `og:description`, `og:image` - per social
- [ ] `twitter:card` - per Twitter/X

---

## 3. Sitemap e Indicizzazione

### 3.1 Generare Sitemap
```bash
node scripts/generate-sitemap.js
```

### 3.2 Struttura sitemap.xml
```xml
<url>
  <loc>https://sito.com/pagina</loc>
  <lastmod>2025-01-15</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

### 3.3 Priority Guidelines
| Tipo Pagina | Priority | Changefreq |
|-------------|----------|------------|
| Homepage | 1.0 | weekly |
| Corsi/Programmi | 0.9 | weekly |
| News (lista) | 0.9 | daily |
| Chi Siamo | 0.8 | monthly |
| FAQ | 0.7 | monthly |
| News (singola) | 0.6 | monthly |
| Privacy/Cookie | 0.3 | yearly |

### 3.4 Aggiornare Corsi nella Sitemap
Modificare array in `scripts/generate-sitemap.js`:

```javascript
const knownCourses = [
  'slug-corso-1',
  'slug-corso-2',
  // Aggiungere nuovi corsi qui
];
```

---

## 4. Performance e Core Web Vitals

### 4.1 Largest Contentful Paint (LCP)
- [ ] Preconnect a risorse esterne
- [ ] Preload font critici
- [ ] Ottimizzare immagini hero

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preload" href="/font.woff2" as="font" crossorigin>
```

### 4.2 Cumulative Layout Shift (CLS)
- [ ] Specificare dimensioni immagini (width/height o aspect-ratio)
- [ ] Usare `loading="lazy"` per immagini below-the-fold
- [ ] Usare `decoding="async"` per immagini

```tsx
<img
  src="image.jpg"
  width={800}
  height={600}
  loading="lazy"
  decoding="async"
  alt="Descrizione"
/>
```

### 4.3 First Input Delay (FID)
- [ ] Minimizzare JavaScript bloccante
- [ ] Code splitting per route
- [ ] Defer script non critici

---

## 5. Contenuti e Keyword

### 5.1 Struttura Heading
```
H1 - Titolo principale (uno solo per pagina)
  H2 - Sezioni principali
    H3 - Sottosezioni
```

### 5.2 Keyword Research
Usare strumenti:
- Google Search Console (query esistenti)
- Google Trends
- Ubersuggest / SEMrush

### 5.3 Keyword Placement
- [ ] Nel `<title>`
- [ ] Nella `<meta description>`
- [ ] Nell'H1
- [ ] Nel primo paragrafo
- [ ] In almeno un H2
- [ ] Nell'URL (slug)
- [ ] Nell'alt delle immagini

---

## 6. Link Building Interno

### 6.1 Struttura Link
- [ ] Header: link a pagine principali
- [ ] Footer: link a tutte le sezioni
- [ ] Breadcrumb su pagine interne
- [ ] Link contestuali nel contenuto

### 6.2 Anchor Text
Usare testo descrittivo:
```tsx
// Bene
<Link to="/corsi/analisi-alimentari">
  Corso Analisi Alimentari
</Link>

// Male
<Link to="/corsi/analisi-alimentari">
  Clicca qui
</Link>
```

---

## 7. Mobile e Accessibilità

### 7.1 Mobile-First
- [ ] Design responsive
- [ ] Touch target >= 44px
- [ ] Font leggibile (min 16px)
- [ ] Viewport corretto

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 7.2 Accessibilità (a11y)
- [ ] Alt text su tutte le immagini
- [ ] Contrasto colori WCAG AA
- [ ] Focus visibile su elementi interattivi
- [ ] Label su form input

---

## 8. File Tecnici

### 8.1 robots.txt
```
User-agent: *
Allow: /
Sitemap: https://www.innform.eu/sitemap.xml
```

### 8.2 manifest.json
```json
{
  "name": "Innform",
  "short_name": "Innform",
  "theme_color": "#9300FF",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/"
}
```

---

## 9. Monitoraggio

### 9.1 Google Search Console
- [ ] Verificare proprietà sito
- [ ] Inviare sitemap
- [ ] Monitorare errori indicizzazione
- [ ] Controllare Core Web Vitals

### 9.2 Google Analytics 4
- [ ] Tracciare conversioni (form contatto)
- [ ] Monitorare bounce rate
- [ ] Analizzare pagine di ingresso

### 9.3 Test Periodici
- [ ] Google PageSpeed Insights
- [ ] Mobile-Friendly Test
- [ ] Rich Results Test (structured data)

---

## 10. Checklist Rapida Pre-Deploy

```
[ ] SEOHead su ogni pagina
[ ] Schema JSON-LD appropriato
[ ] Immagini ottimizzate con alt
[ ] Sitemap aggiornata
[ ] robots.txt corretto
[ ] Link interni funzionanti
[ ] Mobile responsive
[ ] Core Web Vitals verdi
[ ] Meta description univoche
[ ] URL puliti e descrittivi
```

---

## Risorse Utili

- [Google Search Console](https://search.google.com/search-console)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org](https://schema.org/)
- [Web.dev SEO Guide](https://web.dev/learn/seo/)

---

*Ultimo aggiornamento: Dicembre 2025*
