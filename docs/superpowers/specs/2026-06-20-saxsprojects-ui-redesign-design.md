# SaxsProjects — Full UI/UX Redesign (Design Spec)

**Date:** 2026-06-20
**Branch:** `redesign/ui-ux-overhaul`
**Status:** Approved direction, proof-first rollout

## Goal

Full visual redesign of the SaxsProjects marketing site while keeping it **fully
functional and not affected**. The brand colors from the logo stay: electric blue
`#0066FF` and deep navy `#101E35`. This is a presentation-layer redesign plus a small
number of genuine bug fixes — **no features added, no copy removed**.

## Constraints (non-negotiable)

- **Preserve all functionality.** Keep the existing `activeTab` navigation, every page
  prop (`setActiveTab`, `setPrefilledQuote`, `activeQuote`, `clearActiveQuote`), every
  form handler, every API call (`http://localhost:5000/api` in Contact), every WhatsApp
  deep link (`wa.me/27613991212`), the OAuth `/callback` route, the Firebase/Google auth
  in the dashboards, the floating WhatsApp button, and the Pricing → Contact quote
  hand-off. **Rebuild markup/styles, not logic.**
- **Keep brand colors** (logo blue + navy). May add tints/shades of the same hues.
- **No new pages or features.** Visual redesign + bug fixes only.
- Production build (`npm run build`) must stay green; baseline confirmed passing on
  2026-06-20.

## Chosen direction: Premium dark-hero + bento

- **Dark dramatic heroes** — each page opens with a deep-navy gradient band
  (`#0A1222 → #101E35`) carrying a subtle blue radial glow and faint tech-grid texture.
  Electric blue used as a neon accent: glowing eyebrow pill, gradient headline word,
  glowing primary CTA.
- **Light premium body** — content below the hero returns to the existing light
  slate/white surfaces for trust and readability.
- **Bento grids** — service / "why trust us" / feature sections become asymmetric bento
  layouts (mixed tile sizes, one feature spanning two cells) instead of uniform 3-col
  grids. This is the signature of the new look.
- **Refined system** — tightened type scale (larger, tighter Montserrat hero headings,
  Inter body), consistent spacing rhythm, gradient-border hover sweeps on cards, glowing
  buttons, animated stat counters, and scroll-reveal (fade/slide-in) via
  IntersectionObserver. All motion respects `prefers-reduced-motion`.
- **Scroll-aware navbar** — transparent over the dark hero, solidifies to white + blur
  on scroll so it reads correctly on both dark hero and light body. Animated mobile
  drawer.

## Approach / architecture

- Keep the current architecture exactly (state-based `activeTab`, inline-style + shared
  `index.css` pattern). No router introduced, no data flow changed.
- **Centralize the design system in `src/index.css`**: expand it into reusable component
  classes (`.btn-primary`, `.btn-ghost`/keep `.neon-glow-btn`/`.neon-outline-btn`
  aliases, `.card`, `.bento`, `.bento-item`, `.eyebrow`, `.dark-section`, `.reveal`
  + reveal keyframes, scroll-aware `.nav` states). Migrate scattered inline styles onto
  these where it improves consistency — but never at the cost of changing behavior.
- Add a tiny `useScrollReveal` hook (IntersectionObserver) and a `useCountUp` helper for
  animated stats. Both no-op gracefully under `prefers-reduced-motion`.
- Dashboards (Client + Admin) and OAuth callback: **light refresh only** — restyle
  buttons/cards/colors to match the new system, leave all auth/Firebase/Google logic
  untouched.

## Bug fixes folded into the redesign

1. **Dead Student buttons:** `Home.jsx` uses `setActiveTab('student-services')` (Learn
   More / View All Services) but `App.jsx` only registers that view as
   `'learning-support'` → currently shows a blank page. Fix the tab name.
2. **`fade-in` never defined:** the class is used on every page but no matching CSS/
   keyframes exist, so intended transitions do nothing. Define it (folded into the new
   `.reveal` system).
3. **Dead `App.css`:** leftover Vite-template CSS, not imported anywhere — remove it.

## Scope

In scope (redesigned): Home, Tech Solutions, Learning Support (StudentServices), Pricing,
About, Blog, Contact, plus the shared nav + footer in `App.jsx`. Light refresh:
ClientDashboard, AdminDashboard, OAuthCallback, FloatingWhatsApp, GoogleLoginButton.
(`Services.jsx`, `HowWeWork.jsx`, `Portfolio.jsx` exist but are reachable via footer/tabs
— restyle to match if reachable; verify wiring.)

## Rollout (proof-first)

1. **Baseline** — confirm `npm run build` passes (done) and capture current look.
2. **Proof** — build the new design-system foundation in `index.css` + redesign the
   Home dark hero and first bento section. Review in the running app, adjust.
3. **Rollout** — apply the approved system to every remaining page + nav/footer.
4. **Dashboards** — light refresh.
5. **Verify** — `npm run build` green, dev run, click every nav item / form / WhatsApp
   link / quote hand-off, check mobile breakpoints and reduced-motion.

## Success criteria

- Visibly a new "premium dark-hero + bento" design across all pages, brand colors intact.
- Every interactive element still works (nav, forms, WhatsApp, OAuth, dashboards, quote
  hand-off); the two known bugs are fixed.
- `npm run build` passes; no console errors in dev; responsive on mobile.
