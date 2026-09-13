import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.resolve(__dirname, '../dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');
const SITE_ORIGIN = 'https://sauko.design';

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error('Error: dist/index.html not found. Run "vite build" first.');
  process.exit(1);
}

const baseTemplate = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

const pages = [
  {
    slug: 'ai-desloppification',
    title: 'AI Desloppification & Codebase Recovery | Sauko',
    description:
      'Human-led stabilization and architecture for AI-accelerated software. We turn fragile AI prototypes into systems your team can explain, test, and safely operate.',
    canonical: `${SITE_ORIGIN}/ai-desloppification`,
    ogImage: `${SITE_ORIGIN}/apple-touch-icon.png`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'AI Desloppification & System Recovery',
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
    contentHtml: `
      <main id="ai-isolated-themed" style="max-width: 1200px; margin: 0 auto; padding: 2rem;">
        <header>
          <p style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.75rem;">AI-accelerated software // human-led recovery</p>
          <h1>You shipped the demo. <span>Now make it a system.</span></h1>
          <p>The first version proved the idea. AI helped you reach working software quickly; now it needs the engineering that speed left unresolved. We turn it into a system your team can explain, test, operate, and keep improving.</p>
        </header>
        <section>
          <h2>01 / The expensive part starts after it works</h2>
          <p>AI can compress the path to a working product. It does not remove the need for architecture, verification, and ownership. When generation outpaces understanding, that gap becomes operating risk.</p>
          <h3>Working and operable are different states.</h3>
          <p>Recovery closes the gap between code that produces the right result today and a system a team can explain, test, release, and change tomorrow. We keep the product insight, then make its boundaries, decisions, and failure paths explicit.</p>
        </section>
        <section>
          <h2>02 / System Diagnostics</h2>
          <article>
            <h3>Change anxiety</h3>
            <p>Features arrived quickly, but every change requires rediscovering how the code fits together and what it might break.</p>
            <p><strong>Intervention:</strong> Trace critical workflows, remove duplicate paths, and establish boundaries around behavior worth keeping.</p>
          </article>
          <article>
            <h3>Invisible decisions</h3>
            <p>Responsibilities are scattered across generated abstractions and one-off fixes, so no one can explain why the system behaves as it does.</p>
            <p><strong>Intervention:</strong> Make interfaces and responsibilities explicit, consolidate competing implementations, and record decisions the code needs to preserve.</p>
          </article>
          <article>
            <h3>Fragile delivery</h3>
            <p>The application compiles and demos well, but releases still depend on memory, workarounds, and one person’s context.</p>
            <p><strong>Intervention:</strong> Protect critical behavior with tests, make failures visible, and establish a repeatable release path with explicit rollback.</p>
          </article>
        </section>
        <section>
          <h2>03 / Engagement Path</h2>
          <ol>
            <li><strong>Map the real system:</strong> Trace workflows, separate valuable behavior from accidental structure. (System map + prioritized recovery plan)</li>
            <li><strong>Stabilize the foundation:</strong> Define responsibilities, contracts, tests, and verified release paths. (Bounded architecture + verified release path)</li>
            <li><strong>Ship without relapsing:</strong> Specifications, review standards, and transfer of ownership. (Engineering playbook + transfer of ownership)</li>
          </ol>
        </section>
      </main>
    `,
  },
  {
    slug: 'audio-engineering',
    title: 'Detroit Audio Engineering, Mixing & Analogue Restoration | Sauko',
    description:
      'Rooted in Detroit with over a decade of Motor City audio engineering, mixing, mastering, and archival analogue restoration. Detroit soul, without compromise.',
    canonical: `${SITE_ORIGIN}/audio-engineering`,
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
    contentHtml: `
      <main id="audio-engineering-page" style="max-width: 1200px; margin: 0 auto; padding: 2rem;">
        <header>
          <p style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.75rem;">SIGNAL_ORIGIN // FOUNDATION</p>
          <h1>Detroit soul, without compromise.</h1>
          <p>Rooted in Detroit, sauko brings more than a decade of engineering, mixing, and production experience to music made in the Motor City—from archival restoration to final master.</p>
        </header>
        <section>
          <p style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.75rem;">STAGE_01 // RESTORATION &amp; DIGITIZATION</p>
          <h2>Analogue rescue. Digital precision.</h2>
          <p>Through calibrated, premium hardware chains and transparent digital restoration, we meticulously remove age and noise, delivering master-quality digital files that preserve your audio heritage for generations.</p>
        </section>
        <section>
          <p style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.75rem;">STAGE_02 // MIXING &amp; PRODUCTION</p>
          <h2>Sonic architecture. Creative depth.</h2>
          <p>Whether developing a production or mixing a finished arrangement, we use critical listening, analogue circuitry, and precise digital control to shape tone, space, balance, and dynamics—delivering a coherent mix prepared for mastering without losing its character.</p>
        </section>
        <section>
          <p style="text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.75rem;">STAGE_03 // THE FINAL MASTER</p>
          <h2>Transparent loudness. Global translation.</h2>
          <p>Working from a stereo mix or stems, we refine tonal balance, dynamics, stereo image, and final level for the release—preserving the record’s character across club systems, headphones, streaming, and physical formats.</p>
        </section>
      </main>
    `,
  },
];

for (const page of pages) {
  let html = baseTemplate;

  // Replace Title
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${page.title}</title>`);

  // Replace description
  html = html.replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="description" content="${page.description}" />`,
  );

  // Replace canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/,
    `<link rel="canonical" href="${page.canonical}" />`,
  );

  // Replace Open Graph title and description
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:title" content="${page.title}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:description" content="${page.description}" />`,
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:url" content="${page.canonical}" />`,
  );
  if (page.ogImage) {
    html = html.replace(
      /<meta\s+property="og:image"\s+content="[\s\S]*?"\s*\/?>/,
      `<meta property="og:image" content="${page.ogImage}" />`,
    );
  }

  // Replace Twitter title and description
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="twitter:title" content="${page.title}" />`,
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="twitter:description" content="${page.description}" />`,
  );
  if (page.ogImage) {
    html = html.replace(
      /<meta\s+name="twitter:image"\s+content="[\s\S]*?"\s*\/?>/,
      `<meta name="twitter:image" content="${page.ogImage}" />`,
    );
  }

  // Inject JSON-LD
  const jsonLdScript = `<script type="application/ld+json" id="structured-data-json-ld">${JSON.stringify(page.jsonLd)}</script>`;
  html = html.replace('</head>', `  ${jsonLdScript}\n  </head>`);

  // Inject semantic content inside root div
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${page.contentHtml.trim()}</div>`,
  );

  const targetDir = path.join(DIST_DIR, page.slug);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf-8');
  console.log(`✓ Generated static pre-rendered page: dist/${page.slug}/index.html`);
}

console.log('✓ Verified: dist/software was excluded from static generation.');
