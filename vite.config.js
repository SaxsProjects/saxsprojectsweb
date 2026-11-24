import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { business, fullAddress, legalName } from './src/config/business.js'
import { PAGES } from './src/config/pages.js'

const esc = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Business details for Google (schema.org structured data).
function structuredData() {
  const reg = business.registration
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: business.tradingName,
    ...(reg.legalName ? { legalName: reg.legalName } : {}),
    ...(reg.vatNumber ? { vatID: reg.vatNumber } : {}),
    description: business.shortDescription,
    url: business.siteUrl,
    logo: `${business.siteUrl}/logo.png`,
    image: `${business.siteUrl}/og-image.png`,
    email: business.contact.email,
    telephone: business.contact.phones[0].e164,
    founder: { '@type': 'Person', name: business.founder.name },
    address: {
      '@type': 'PostalAddress',
      ...(business.address.street ? { streetAddress: business.address.street } : {}),
      addressLocality: business.address.town,
      addressRegion: business.address.province,
      ...(business.address.postalCode ? { postalCode: business.address.postalCode } : {}),
      addressCountry: business.address.countryCode,
    },
    areaServed: { '@type': 'Country', name: 'South Africa' },
    currenciesAccepted: 'ZAR',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: business.hours.days,
        opens: business.hours.opens,
        closes: business.hours.closes,
      },
    ],
    sameAs: Object.values(business.social),
  }
  return JSON.stringify(data, null, 2).replace(/</g, '\\u003c')
}

function headTags() {
  const home = PAGES.find((p) => p.path === '/')
  const url = `${business.siteUrl}/`
  const image = `${business.siteUrl}/og-image.png`
  return [
    `<title>${esc(home.title)}</title>`,
    `<meta name="description" content="${esc(home.description)}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(business.tradingName)}" />`,
    `<meta property="og:locale" content="en_ZA" />`,
    `<meta property="og:title" content="${esc(home.title)}" />`,
    `<meta property="og:description" content="${esc(home.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(home.title)}" />`,
    `<meta name="twitter:description" content="${esc(home.description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
    `<script type="application/ld+json">\n${structuredData()}\n    </script>`,
  ].join('\n    ')
}

function noscript() {
  const phone = business.contact.whatsappDisplay
  return `<noscript>
      <div style="padding:2rem;font-family:sans-serif;text-align:center">
        ${esc(legalName())} — ${esc(business.shortDescription)}
        Please enable JavaScript, or contact us on WhatsApp at ${esc(phone)} or email
        <a href="mailto:${esc(business.contact.email)}">${esc(business.contact.email)}</a> (${esc(fullAddress())}).
      </div>
    </noscript>`
}

function sitemap() {
  const today = new Date().toISOString().slice(0, 10)
  const urls = PAGES.filter((p) => !p.noindex)
    .map((p) => `  <url>\n    <loc>${business.siteUrl}${p.path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

function robots() {
  return `User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /callback\n\nSitemap: ${business.siteUrl}/sitemap.xml\n`
}

function siteMetaPlugin() {
  return {
    name: 'saxs-site-meta',
    transformIndexHtml(html) {
      return html.replace('<!--site-head-->', headTags()).replace('<!--site-noscript-->', noscript())
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap() })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots() })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteMetaPlugin()],
})
