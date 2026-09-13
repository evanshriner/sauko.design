import { useEffect } from 'react';
import { Pages } from '../interfaces/pages';

const SITE_ORIGIN = 'https://sauko.io';

export interface PageSEOMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  ogImage?: string;
  jsonLd?: object;
}

export const PAGE_SEO_CONFIG: Record<Pages, PageSEOMetadata> = {
  [Pages.Home]: {
    title:
      'sauko — applied signals | Detroit Audio Engineering & Software Consulting',
    description:
      'sauko applied signals: Motor City & Detroit audio engineering, analogue restoration, and software consulting.',
    canonicalUrl: `${SITE_ORIGIN}/`,
    robots: 'index, follow',
    ogImage: `${SITE_ORIGIN}/apple-touch-icon.png`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Sauko',
      url: `${SITE_ORIGIN}/`,
      description:
        'Applied signals: Detroit audio engineering and software consulting.',
      knowsAbout: [
        'Motor City Audio Engineering',
        'Analogue Audio Restoration',
        'AI Desloppification',
        'Software Architecture Recovery',
      ],
    },
  },
  [Pages.AIDesloppification]: {
    title: 'AI desloppification & codebase recovery | sauko',
    description:
      'Human-led stabilization and architecture for AI-accelerated software. We turn fragile AI prototypes into systems your team can explain, test, and safely operate.',
    canonicalUrl: `${SITE_ORIGIN}/ai-desloppification`,
    robots: 'index, follow',
    ogImage: `${SITE_ORIGIN}/apple-touch-icon.png`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'AI desloppification & system recovery',
      provider: {
        '@type': 'Organization',
        name: 'Sauko',
        url: `${SITE_ORIGIN}/`,
      },
      serviceType: 'Software Engineering & Architecture',
      description:
        'System assessment, structural stabilization, and ownership transfer for AI-accelerated software.',
      url: `${SITE_ORIGIN}/ai-desloppification`,
    },
  },
  [Pages.AudioEngineering]: {
    title: 'Detroit Audio Engineering, Mixing & Analogue Restoration | sauko',
    description:
      'Rooted in Detroit with over a decade of Motor City audio engineering, mixing, mastering, and archival analogue restoration. Detroit soul, without compromise.',
    canonicalUrl: `${SITE_ORIGIN}/audio-engineering`,
    robots: 'index, follow',
    ogImage: `${SITE_ORIGIN}/images/restoration_equipment.png`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Sauko Audio Engineering',
      url: `${SITE_ORIGIN}/audio-engineering`,
      description:
        'Detroit audio engineering, mixing, mastering, and archival analogue tape restoration.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Detroit',
        addressRegion: 'MI',
        addressCountry: 'US',
      },
      areaServed: [
        { '@type': 'AdministrativeArea', name: 'Detroit' },
        { '@type': 'AdministrativeArea', name: 'Motor City' },
        { '@type': 'AdministrativeArea', name: 'Worldwide' },
      ],
      knowsAbout: [
        'Motor City Audio Engineering',
        'Archival Audio Restoration',
        'Analogue Tape Transfer',
        'Stem Mixing and Mastering',
      ],
    },
  },
  [Pages.Software]: {
    title: 'software lab | sauko',
    description: 'Independent products and selected web design.',
    canonicalUrl: `${SITE_ORIGIN}/software`,
    robots: 'noindex, nofollow',
  },
};

function updateMetaTag(
  attributeName: 'name' | 'property',
  attributeValue: string,
  content: string,
) {
  let element = document.querySelector<HTMLMetaElement>(
    `meta[${attributeName}="${attributeValue}"]`,
  );
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateCanonicalLink(url: string) {
  let element = document.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }
  element.setAttribute('href', url);
}

function updateJsonLd(jsonLd?: object) {
  const SCRIPT_ID = 'structured-data-json-ld';
  let scriptElement = document.getElementById(
    SCRIPT_ID,
  ) as HTMLScriptElement | null;

  if (!jsonLd) {
    if (scriptElement) {
      scriptElement.remove();
    }
    return;
  }

  if (!scriptElement) {
    scriptElement = document.createElement('script');
    scriptElement.id = SCRIPT_ID;
    scriptElement.type = 'application/ld+json';
    document.head.appendChild(scriptElement);
  }

  scriptElement.textContent = JSON.stringify(jsonLd);
}

export function usePageSEO(currentPage: Pages) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const config = PAGE_SEO_CONFIG[currentPage] ?? PAGE_SEO_CONFIG[Pages.Home];

    // Document title
    document.title = config.title;

    // Meta descriptions and crawler directives
    updateMetaTag('name', 'description', config.description);
    updateMetaTag('name', 'robots', config.robots);

    // Canonical link
    updateCanonicalLink(config.canonicalUrl);

    // Open Graph
    updateMetaTag('property', 'og:title', config.title);
    updateMetaTag('property', 'og:description', config.description);
    updateMetaTag('property', 'og:url', config.canonicalUrl);
    updateMetaTag('property', 'og:type', 'website');
    updateMetaTag('property', 'og:site_name', 'sauko');
    if (config.ogImage) {
      updateMetaTag('property', 'og:image', config.ogImage);
    }

    // Twitter Cards
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', config.title);
    updateMetaTag('name', 'twitter:description', config.description);
    if (config.ogImage) {
      updateMetaTag('name', 'twitter:image', config.ogImage);
    }

    // Structured data (JSON-LD)
    updateJsonLd(config.jsonLd);
  }, [currentPage]);
}
