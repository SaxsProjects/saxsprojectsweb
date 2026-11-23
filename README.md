<p align="center"><img src=".github/assets/banner.svg" width="100%" alt="SAXS Projects banner"/></p>

# SAXS Projects — Business Website

The official website of **SAXS Projects**, a South African software studio building web apps, automation and tech solutions for businesses and students.

**Live site:** https://www.saxsprojects.co.za

## Features

- Pages: Home, Tech Solutions, Learning Support, Pricing (with quote calculator), About, How We Work, Guides, Contact, Privacy Policy (POPIA) and Terms of Service, each at its own URL
- Contact form and free-consultation requests that work with or without the backend (falls back to WhatsApp / email so no lead is lost)
- All business details and prices in one place: [`src/config/business.js`](src/config/business.js) and [`src/config/pricing.js`](src/config/pricing.js)
- SEO: per-page titles and descriptions, Google structured data, `sitemap.xml` and `robots.txt` generated at build time
- Client portal (Firebase sign-in) and an optional Node.js/Express backend for stored leads, email, projects and invoices

**Launching the business?** See [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md).

## Tech stack

| Layer    | Tools |
|----------|-------|
| Frontend | React 19, Vite, React Router, lucide-react |
| Backend  | Node.js, Express, MongoDB (Mongoose), Firebase Admin, Google APIs, Nodemailer |
| Hosting  | Vercel (frontend) |

## Getting started

Requirements: Node.js 20 or newer and npm.

```bash
git clone https://github.com/SaxsProjects/saxsprojectsweb.git
cd saxsprojectsweb
npm ci
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # production build into dist/
npm run preview    # serve the production build locally
npm run lint       # ESLint
```

### Connecting the backend (optional)

The website runs fine on its own. To use the backend, set `VITE_API_URL` (see [`.env.example`](.env.example)) to the backend's URL, e.g. in `.env.local` for development or in Vercel's environment variables for production.

```bash
cd backend
npm ci
cp .env.example .env   # then fill it in
npm start
```

Every variable the backend reads is documented in [`backend/.env.example`](backend/.env.example). In production (`NODE_ENV=production`) the backend refuses portal logins unless Firebase Admin is configured, and rejects enquiries unless SMTP is configured, so the website falls back to WhatsApp/email instead of losing the lead.

More detail: [BACKEND_GUIDE.md](BACKEND_GUIDE.md), [TESTING.md](TESTING.md), [QUICK_REFERENCE.md](QUICK_REFERENCE.md).

## Project structure

```
src/
  config/       business details, prices and page list (edit these first)
  pages/        site pages (Home, Tech Solutions, Pricing, Contact, ...)
  components/   shared components (WhatsApp button, Google login)
  lib/          backend client and consultation-slot helpers
  assets/       logos and images
backend/        Express API, Mongoose models, integrations
public/         icons, share image, manifest
vercel.json     SPA routing and security headers for Vercel
```

## Contributing

Issues and pull requests are welcome. See the organisation's [contributing guide](https://github.com/SaxsProjects/.github/blob/main/CONTRIBUTING.md) and report security issues privately as described in [SECURITY.md](https://github.com/SaxsProjects/.github/blob/main/SECURITY.md).

## Contact

- Website: https://www.saxsprojects.co.za
- Email: saxsprojects.dev@gmail.com

© SAXS Projects. All rights reserved.
