/**
 * Script per generare automaticamente sitemap.xml
 * Esegui con: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://www.innform.eu';
const TODAY = new Date().toISOString().split('T')[0];

// Route statiche del sito
const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/news', changefreq: 'daily', priority: '0.9' },
  { path: '/chi-siamo/panoramica', changefreq: 'monthly', priority: '0.8' },
  { path: '/chi-siamo/visione-missione', changefreq: 'monthly', priority: '0.7' },
  { path: '/chi-siamo/dove-siamo', changefreq: 'monthly', priority: '0.7' },
  { path: '/chi-siamo/qualita', changefreq: 'monthly', priority: '0.7' },
  { path: '/progetti/ti-abilito', changefreq: 'monthly', priority: '0.8' },
  { path: '/progetti/segni', changefreq: 'monthly', priority: '0.8' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { path: '/cookie-policy', changefreq: 'yearly', priority: '0.3' },
  { path: '/faq', changefreq: 'monthly', priority: '0.7' },
];

// Funzione per leggere le news da newsData.ts
function getNewsRoutes() {
  try {
    const newsDataPath = path.join(__dirname, '../src/utils/newsData.ts');
    const content = fs.readFileSync(newsDataPath, 'utf-8');

    // Estrai gli ID delle news usando regex
    const idMatches = content.match(/id:\s*(\d+)/g);
    if (!idMatches) return [];

    return idMatches.map(match => {
      const id = match.match(/\d+/)[0];
      return {
        path: `/news/${id}`,
        changefreq: 'monthly',
        priority: '0.6'
      };
    });
  } catch (error) {
    console.warn('Impossibile leggere newsData.ts:', error.message);
    return [];
  }
}

// Corsi noti con i loro slug (sincronizzati con EduPlan API)
// Questi slug corrispondono al campo website_slug su EduPlan
const knownCourses = [
  'tecnico-esperto-in-analisi-alimentari-e-ambientali',
  'esperto-in-efficienza-energetica-e-certificazione',
  'massaggio-shiatsu-e-ayurveda',
  'operatore-del-turismo-per-disabili-sensoriali',
  'corso-di-specializzazione-alle-guide-turistiche',
  'interior-design'
];

// Funzione per leggere i corsi
function getCourseRoutes() {
  return knownCourses.map(slug => ({
    path: `/corsi/${slug}`,
    changefreq: 'weekly',
    priority: '0.9'
  }));
}

// Funzione per leggere i programmi da ProgramDetail.tsx
function getProgramRoutes() {
  try {
    const programDetailPath = path.join(__dirname, '../src/components/ProgramDetail.tsx');
    const content = fs.readFileSync(programDetailPath, 'utf-8');

    // Estrai gli slug dei programmi
    const programMatches = content.match(/['"]([a-z-]+)['"]\s*:\s*\{/g);
    if (!programMatches) return [];

    const slugs = [...new Set(programMatches.map(match => {
      const slug = match.match(/['"]([a-z-]+)['"]/)[1];
      return slug;
    }))];

    return slugs
      .filter(slug => slug.length > 3) // Filtra slug troppo corti
      .map(slug => ({
        path: `/programmi/${slug}`,
        changefreq: 'weekly',
        priority: '0.9'
      }));
  } catch (error) {
    console.warn('Impossibile leggere ProgramDetail.tsx:', error.message);
    return [];
  }
}

// Genera XML della sitemap
function generateSitemapXML(routes) {
  const urlEntries = routes.map(route => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries}
</urlset>
`;
}

// Main
function main() {
  console.log('Generazione sitemap.xml...\n');

  // Raccogli tutte le route
  const newsRoutes = getNewsRoutes();
  const courseRoutes = getCourseRoutes();
  const programRoutes = getProgramRoutes();

  const allRoutes = [
    ...staticRoutes,
    ...newsRoutes,
    ...courseRoutes,
    ...programRoutes
  ];

  // Rimuovi duplicati
  const uniqueRoutes = allRoutes.filter((route, index, self) =>
    index === self.findIndex(r => r.path === route.path)
  );

  console.log(`Route trovate:`);
  console.log(`  - Statiche: ${staticRoutes.length}`);
  console.log(`  - News: ${newsRoutes.length}`);
  console.log(`  - Corsi: ${courseRoutes.length}`);
  console.log(`  - Programmi: ${programRoutes.length}`);
  console.log(`  - Totale: ${uniqueRoutes.length}\n`);

  // Genera e salva sitemap
  const sitemapXML = generateSitemapXML(uniqueRoutes);
  const outputPath = path.join(__dirname, '../public/sitemap.xml');

  fs.writeFileSync(outputPath, sitemapXML);
  console.log(`Sitemap salvata in: ${outputPath}`);

  // Mostra le route
  console.log('\nRoute incluse:');
  uniqueRoutes.forEach(route => {
    console.log(`  ${route.path}`);
  });
}

main();
