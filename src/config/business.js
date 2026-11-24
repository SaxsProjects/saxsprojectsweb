// ============================================================================
// SaxsProjects — business details (single source of truth)
// ----------------------------------------------------------------------------
// Every page, the footer, the legal pages, the SEO tags in index.html and the
// structured data Google reads are built from this file. When your company
// registration (CIPC) comes through, fill in the `registration` block below,
// rebuild, and the whole site updates. See LAUNCH_CHECKLIST.md.
//
// This file is plain JavaScript (no JSX, no imports) so vite.config.js can
// read it at build time too.
// ============================================================================

export const business = {
  // Name customers see everywhere.
  tradingName: 'SaxsProjects',
  tagline: 'We build digital solutions',
  shortDescription:
    'South African software studio building business websites, web apps and mobile apps, with tech support and learning support for students.',

  // ---- Company registration ------------------------------------------------
  // Leave a value as null until you have it; the site hides empty fields.
  registration: {
    // Exactly as on your CIPC certificate, e.g. 'SaxsProjects (Pty) Ltd'.
    legalName: null,
    // e.g. 'Private company (Pty) Ltd' or 'Sole proprietor'.
    entityType: null,
    // CIPC enterprise number, e.g. '2026/123456/07'.
    registrationNumber: null,
    // SARS VAT number. Leave null if you are not VAT-registered.
    vatNumber: null,
    // Person responsible for personal information under POPIA.
    // For a small business this is usually the owner / director.
    informationOfficer: 'Phathutshedzo Mamagau',
    // Director(s) as registered with CIPC, e.g. ['Phathutshedzo Mamagau'].
    directors: [],
  },

  founder: {
    name: 'Phathutshedzo Mamagau',
    role: 'Founder & Lead Developer',
  },

  // Login that gets admin rights in the client portal. It must exist as a
  // Firebase Authentication user, and the backend's ADMIN_EMAIL must match.
  adminEmail: 'admin@saxsprojects.co.za',

  // ---- Contact -------------------------------------------------------------
  contact: {
    email: 'info@saxsprojects.co.za',
    phones: [
      { label: 'Primary', display: '071 413 5824', e164: '+27714135824' },
      { label: 'Support & WhatsApp', display: '061 399 1212', e164: '+27613991212' },
    ],
    // International format without "+" for wa.me links.
    whatsapp: '27613991212',
    whatsappDisplay: '+27 61 399 1212',
    responseTime: 'We reply within one business day.',
  },

  address: {
    // Add a street address once you have a business address you are happy to
    // publish. The ECT Act asks online businesses to give a physical address.
    street: null,
    town: 'Thohoyandou',
    province: 'Limpopo',
    postalCode: null,
    country: 'South Africa',
    countryCode: 'ZA',
  },

  hours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00',
    display: 'Mon–Fri, 09:00–17:00 (SAST)',
    timeZone: 'Africa/Johannesburg',
  },

  social: {
    github: 'https://github.com/SaxsProjects',
    facebook: 'https://facebook.com/saxsprojects',
    linkedin: 'https://linkedin.com/in/saxsprojects',
  },

  // Canonical address of the live site (no trailing slash).
  siteUrl: 'https://www.saxsprojects.co.za',

  // Date the legal pages were last reviewed. Update when you change them.
  legalLastUpdated: '23 November 2026',
};

// ---- Helpers ----------------------------------------------------------------

export const legalName = () => business.registration.legalName || business.tradingName;

export const isRegistered = () => Boolean(business.registration.registrationNumber);

export const isVatRegistered = () => Boolean(business.registration.vatNumber);

export const fullAddress = () =>
  [business.address.street, business.address.town, business.address.province, business.address.postalCode, business.address.country]
    .filter(Boolean)
    .join(', ');

export const primaryPhone = () => business.contact.phones[0];

export const whatsappLink = (text) =>
  `https://wa.me/${business.contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const mailtoLink = (subject, body) => {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  // URLSearchParams encodes spaces as "+", which mail clients show literally.
  const query = params.toString().replace(/\+/g, '%20');
  return `mailto:${business.contact.email}${query ? `?${query}` : ''}`;
};

// Prices on the site must include VAT once you are VAT-registered (CPA s23).
export const priceNote = () =>
  isVatRegistered()
    ? 'Prices are given in a written quotation, in South African Rand (ZAR), and include 15% VAT.'
    : 'Prices are given in a written quotation, in South African Rand (ZAR). We are not VAT-registered, so no VAT is added.';
