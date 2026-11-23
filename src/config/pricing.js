// ============================================================================
// SaxsProjects — price list (single source of truth)
// ----------------------------------------------------------------------------
// The Pricing page, the quote calculator, the Tech Solutions and Learning
// Support pages and the Terms of Service all read from here, so a price only
// ever needs changing in one place. Amounts are whole Rands.
// ============================================================================

export const DEPOSIT_RATE = 0.5; // 50% upfront, 50% on delivery

export const formatZAR = (amount) => `R${Math.round(amount).toLocaleString('en-US')}`;

export const formatRange = (min, max) => (min === max ? formatZAR(min) : `${formatZAR(min)} – ${formatZAR(max)}`);

// Build packages offered through the quote calculator.
export const buildPackages = {
  website: {
    name: 'Business Website',
    blurb: 'For local businesses, shops and service providers who need to be found online.',
    days: '10 – 14 days',
    options: {
      'standard-static': { label: 'Standard website', price: 2800, days: 10, detail: '3–5 pages, contact form, mobile-ready, SEO basics' },
      'standard-db': { label: 'Standard website + database', price: 3200, days: 12, detail: 'Adds stored enquiries and simple content forms' },
      'premium-static': { label: 'Premium website', price: 3500, days: 12, detail: 'Custom layouts, richer design and animations' },
      'premium-db': { label: 'Premium website + database', price: 4300, days: 14, detail: 'Adds a content manager and user logins' },
    },
  },
  webapp: {
    name: 'Web Application',
    blurb: 'For booking systems, client portals, dashboards and internal tools.',
    days: '14 – 21 days',
    options: {
      'webapp-small': { label: 'Web app — standard data', price: 5000, days: 14, detail: 'Logins, dashboard, database, core workflows' },
      'webapp-large': { label: 'Web app — larger data', price: 5500, days: 21, detail: 'More records, reporting and integrations' },
    },
  },
  mobile: {
    name: 'Mobile App',
    blurb: 'Android and iOS apps built cross-platform with React Native or Flutter.',
    days: '21 – 30 days',
    options: {
      'mobile-static': { label: 'Mobile app — no cloud data', price: 6000, days: 21, detail: 'Catalogue, profile and information app' },
      'mobile-db': { label: 'Mobile app + cloud database', price: 8000, days: 30, detail: 'Adds user accounts and real-time data' },
    },
  },
};

const allPrices = (pkg) => Object.values(pkg.options).map((o) => o.price);
export const packageMin = (key) => Math.min(...allPrices(buildPackages[key]));
export const packageMax = (key) => Math.max(...allPrices(buildPackages[key]));

// Other tech services (quoted per job).
export const techServices = {
  database: { name: 'Database Design & Management', min: 2500, max: 4000, time: '5 – 10 days' },
  softwareUpdates: { name: 'Computer & Laptop Software Updates', min: 500, max: 1500, time: 'Same day' },
  repairs: { name: 'Computer & Laptop Repairs', min: 200, max: 2000, time: '24 – 48 hours' },
};

// Learning support.
export const studentServices = {
  tutoring: { name: 'Academic Tutoring & Concept Guidance', from: 200, unit: 'per hour' },
  coding: { name: 'Programming & Coding Mentorship', from: 300, unit: 'per hour' },
  assignmentStrategy: { name: 'Assignment Strategy & Guidance', from: 150, unit: 'per session' },
  techSetup: { name: 'Tech Support & Software Setup', from: 250, unit: '' },
};

export const lowestPrice = () =>
  Math.min(
    ...Object.keys(buildPackages).map(packageMin),
    ...Object.values(techServices).map((s) => s.min),
    ...Object.values(studentServices).map((s) => s.from),
  );

export const highestPrice = () => Math.max(...Object.keys(buildPackages).map(packageMax));
