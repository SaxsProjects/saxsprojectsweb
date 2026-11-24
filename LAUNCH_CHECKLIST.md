# Launch checklist

Everything a customer sees about the business (name, registration and VAT numbers, address, phone numbers, email, hours, prices) now comes from two files:

| File | What's in it |
|---|---|
| [`src/config/business.js`](src/config/business.js) | Company details, contact details, address, hours, social links, site URL |
| [`src/config/pricing.js`](src/config/pricing.js) | Every price on the site, the deposit split, timelines |

Change a value there, push, and the header, footer, contact page, Pricing page, calculator, Privacy Policy, Terms of Service, Google structured data, sitemap and social-share tags all update together.

## The day your registration comes through

Open `src/config/business.js` and fill in the `registration` block exactly as it appears on your CIPC certificate:

```js
registration: {
  legalName: 'SaxsProjects (Pty) Ltd',      // as on the certificate
  entityType: 'Private company (Pty) Ltd',
  registrationNumber: '2026/123456/07',
  vatNumber: null,                           // only once SARS issues one
  informationOfficer: 'Phathutshedzo Mamagau',
  directors: ['Phathutshedzo Mamagau'],
},
```

Commit and push to `main`. When Vercel redeploys, the footer shows "© SaxsProjects (Pty) Ltd · Reg. No. …" and the Terms and Privacy pages show the full company details.

## Before you take your first paying client

- [ ] **Business bank account** in the company's name. Bank details go on invoices only, never on the website.
- [x] **Business email.** The site, README and chatbot now use `info@saxsprojects.co.za` (Zoho Mail). The admin login is `admin@saxsprojects.co.za` (`business.adminEmail` in the site, `ADMIN_EMAIL` on the backend). It needs a matching Firebase Authentication user.
- [ ] **Physical address.** The ECT Act (section 43) asks online businesses to publish a physical address and an address for legal notices. Add `address.street` and `address.postalCode` when you have one you're comfortable publishing.
- [ ] **Read the Terms of Service and Privacy Policy** (`/terms`, `/privacy`). They are a solid starting draft written for South African law (CPA, ECT Act, POPIA), but they make commitments on your behalf: 50/50 payments, two design revision rounds, 30 days' free support, the refund rules, a 3-month repair warranty. Change anything that doesn't match how you work, and have someone with legal knowledge look them over if you can.
- [ ] **Check the prices** in `src/config/pricing.js`. The old site showed different prices on different pages: the Pricing page said R3,400 / R3,800 / R4,400 / R8,600, the Services page said R3,200 / R3,500 / R4,300 / R8,000. The advertised ranges (R2,800–R4,300 and R6,000–R8,000) matched the second set, so that is what's live now.
- [ ] **Check the home-page numbers** (50+ clients, 100+ students, 10+ subjects in `src/pages/Home.jsx`). The Consumer Protection Act prohibits misleading claims, so only show figures you can back up.
- [ ] **Register your Information Officer** with the Information Regulator (POPIA) via the Regulator's online portal at inforegulator.org.za.
- [ ] **VAT.** Leave `vatNumber` as `null` unless you register. If you do register, add the number. The site will then say prices include VAT, so make sure they do.

## Get found on Google

- [ ] Create a free **Google Business Profile** for SaxsProjects (Thohoyandou, Limpopo).
- [ ] Add the site to **Google Search Console** and submit `https://www.saxsprojects.co.za/sitemap.xml`.
- [ ] Share the site link on WhatsApp/Facebook to check the preview card (`public/og-image.png`) appears.

## Going live with the website

The site works with **no backend at all**. The contact form and the "request a call" widget hand the visitor to WhatsApp or their email app with the message already written, so leads arrive on your phone and inbox.

1. Merge this branch to `main`. Vercel deploys it, and `vercel.json` makes direct links like `/pricing` work (they used to 404).
2. On your phone, open the live site, send yourself a test enquiry, and request a test call.

## Optional: switch on the backend (stored leads, email auto-replies, client portal)

Only do this once you're ready to run a server. Until then, leave `VITE_API_URL` unset.

1. Host `backend/` on a Node host. The repo includes a Render Blueprint ([`render.yaml`](render.yaml)): in Render choose **New → Blueprint**, pick this repository, and fill in the secret values it asks for.
2. Set the environment variables listed in [`backend/.env.example`](backend/.env.example). At minimum: `NODE_ENV=production`, `MONGODB_URI`, `ADMIN_EMAIL`, `SMTP_*`, `FRONTEND_URL`, `CORS_ORIGINS`.
   - **Zoho Mail:** `SMTP_HOST=smtppro.zoho.com` (address on your own domain) or `smtp.zoho.com` (free @zoho.com address), `SMTP_PORT=465`, `SMTP_USER=` your full Zoho address, `SMTP_PASS=` an app-specific password from Zoho Accounts → Security → App Passwords. Leave `SMTP_FROM` empty — Zoho only sends from the mailbox you log in with.
   - Run `npm run check:email` on the server: it logs in to Zoho and sends you a test email, with a hint if anything is wrong. Some hosts block outgoing mail ports on free plans; if the check can't connect, try port 587 or ask your host.
3. Paste the Firebase service-account JSON into the `FIREBASE_SERVICE_ACCOUNT` variable (or upload it as a secret file and set `FIREBASE_SERVICE_ACCOUNT_PATH`). Without it, portal logins are refused (this is deliberate: the old code let anyone in as admin when it was missing).
4. Check `https://<your-backend>/api/health` returns `{"ok":true,"database":true,"email":true}`.
5. In Vercel → Project → Settings → Environment Variables, set `VITE_API_URL=https://<your-backend>` and redeploy.

If the backend is down or email fails, the website automatically offers WhatsApp/email instead, so a lead is never silently lost.

## Not changed (worth a decision later)

- `src/pages/AdminDashboard.jsx` and `src/pages/Portfolio.jsx` aren't linked anywhere. Portfolio shows sample projects (BrewLocal, FitFlow). Only publish it once those are replaced with real client work.
- The Google sign-in flow (`/api/auth/google/*`, `src/pages/OAuthCallback.jsx`, `src/components/GoogleLoginButton.jsx`) isn't used by the site. It passes tokens in the URL, so it needs reworking before it is switched on.
