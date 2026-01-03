import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function SEOHead({
  title,
  description,
  image = 'https://www.innform.eu/og-image.jpg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Innform',
  section,
  tags = []
}: SEOHeadProps) {
  const fullTitle = `${title} | Innform`;
  const fullUrl = url ? `https://www.innform.eu${url}` : 'https://www.innform.eu';

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    updateMetaTag('description', description);
    updateMetaTag('author', author);

    // Open Graph
    updateMetaTag('og:title', fullTitle, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', image, 'property');
    updateMetaTag('og:url', fullUrl, 'property');
    updateMetaTag('og:type', type, 'property');

    // Twitter
    updateMetaTag('twitter:title', fullTitle, 'name');
    updateMetaTag('twitter:description', description, 'name');
    updateMetaTag('twitter:image', image, 'name');

    // Article specific
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, 'property');
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, 'property');
      }
      if (author) {
        updateMetaTag('article:author', author, 'property');
      }
      if (section) {
        updateMetaTag('article:section', section, 'property');
      }
      tags.forEach((tag, index) => {
        updateMetaTag(`article:tag:${index}`, tag, 'property');
      });
    }

    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.href = fullUrl;
    }

    // Cleanup on unmount - restore defaults
    return () => {
      document.title = 'Innform - Centro Formazione Accreditato Basilicata | Corsi, Master e Programma GOL';
    };
  }, [title, description, image, fullUrl, type, publishedTime, modifiedTime, author, section, tags]);

  return null;
}

function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  if (meta) {
    meta.content = content;
  } else {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    meta.content = content;
    document.head.appendChild(meta);
  }
}

// Helper per generare JSON-LD NewsArticle
interface NewsArticleSchemaProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
}

export function NewsArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author = 'Innform',
  url
}: NewsArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "description": description,
    "image": [image],
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Organization",
      "name": author,
      "url": "https://www.innform.eu"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Innform",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.innform.eu/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.innform.eu${url}`
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Helper per generare JSON-LD Course
interface CourseSchemaProps {
  name: string;
  description: string;
  provider?: string;
  duration?: string;
  educationalLevel?: string;
  url: string;
  image?: string;
  price?: number;
  priceCurrency?: string;
  skills?: string[];
  courseMode?: 'online' | 'onsite' | 'blended';
  startDate?: string;
  isAccessibleForFree?: boolean;
}

export function CourseSchema({
  name,
  description,
  provider = 'Innform',
  duration,
  educationalLevel,
  url,
  image,
  price,
  priceCurrency = 'EUR',
  skills,
  courseMode,
  startDate,
  isAccessibleForFree
}: CourseSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": name,
    "description": description,
    "provider": {
      "@type": "EducationalOrganization",
      "name": provider,
      "sameAs": "https://www.innform.eu",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Via della Chimica 87",
        "addressLocality": "Potenza",
        "postalCode": "85100",
        "addressRegion": "Basilicata",
        "addressCountry": "IT"
      }
    },
    "url": `https://www.innform.eu${url}`,
    "inLanguage": "it",
    "availableLanguage": ["it"]
  };

  if (duration) {
    schema.timeRequired = duration;
  }
  if (educationalLevel) {
    schema.educationalLevel = educationalLevel;
  }
  if (image) {
    schema.image = image;
  }
  if (skills && skills.length > 0) {
    schema.teaches = skills;
  }
  if (courseMode) {
    const modeMap = {
      'online': 'https://schema.org/OnlineEventAttendanceMode',
      'onsite': 'https://schema.org/OfflineEventAttendanceMode',
      'blended': 'https://schema.org/MixedEventAttendanceMode'
    };
    schema.hasCourseInstance = {
      "@type": "CourseInstance",
      "courseMode": modeMap[courseMode]
    };
    if (startDate) {
      (schema.hasCourseInstance as Record<string, unknown>).startDate = startDate;
    }
  }
  if (isAccessibleForFree !== undefined) {
    schema.isAccessibleForFree = isAccessibleForFree;
  }
  if (price !== undefined) {
    schema.offers = {
      "@type": "Offer",
      "price": price,
      "priceCurrency": priceCurrency,
      "availability": "https://schema.org/InStock"
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Helper per generare JSON-LD FAQ
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  items: FAQItem[];
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default SEOHead;
