import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MessageCircle, Mail, Phone, Clock, MapPin } from 'lucide-react';

import Home from './pages/Home';
import TechSolutions from './pages/TechSolutions';
import StudentServices from './pages/StudentServices';
import HowWeWork from './pages/HowWeWork';
import Products from './pages/Products';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Paia from './pages/Paia';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import FloatingWhatsApp from './components/FloatingWhatsApp';

import logoMark from './assets/logo-mark.png';
import { business, legalName, fullAddress, whatsappLink, isVatRegistered } from './config/business';
import { ALIASES, PAGES, pageByKey, pathFor } from './config/pages';

// The client portal pulls in Firebase, so only load it when someone opens it.
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));

const NAV_PAGES = PAGES.filter((p) => p.nav);

function usePageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = PAGES.find((p) => p.path === pathname);
    const title = page ? page.title : 'Page not found | SaxsProjects';
    const description = page ? page.description : business.shortDescription;
    const url = `${business.siteUrl}${page ? page.path : pathname}`;

    document.title = title;
    const setMeta = (selector, attr, value) => {
      const el = document.head.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', url);
    setMeta('meta[name="robots"]', 'content', !page || page.noindex ? 'noindex' : 'index, follow');
  }, [pathname]);
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Link to="/" className="brand" aria-label="SaxsProjects home">
          <img src={logoMark} alt="" width="68" height="34" />
          <span className="brand__word">
            <span className="brand__saxs">saxs</span>projects
          </span>
        </Link>

        <nav className="site-nav" aria-label="Main">
          {NAV_PAGES.map((p) => (
            <NavLink key={p.key} to={p.path} end={p.path === '/'} className="site-nav__link">
              {p.label}
            </NavLink>
          ))}
          <Link to="/contact" className="neon-glow-btn site-nav__cta">
            Get a Quote
          </Link>
        </nav>

        <button
          type="button"
          className="menu-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="mobile-nav fade-in" aria-label="Mobile">
          <div className="container mobile-nav__inner">
            {NAV_PAGES.map((p) => (
              <NavLink key={p.key} to={p.path} end={p.path === '/'} className="site-nav__link">
                {p.label}
              </NavLink>
            ))}
            <NavLink to="/how-we-work" className="site-nav__link">How We Work</NavLink>
            <Link to="/contact" className="neon-glow-btn" style={{ width: '100%', justifyContent: 'center' }}>
              Get a Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  const reg = business.registration;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <Link to="/" className="brand" aria-label="SaxsProjects home">
            <img src={logoMark} alt="" width="60" height="30" />
            <span className="brand__word">
              <span className="brand__saxs">saxs</span>projects
            </span>
          </Link>
          <p className="site-footer__blurb">
            Websites, apps and tech support for growing South African businesses. Fixed quotes, clear timelines, and you
            own what we build.
          </p>
        </div>

        <div>
          <h4 className="site-footer__heading">Services</h4>
          <ul className="site-footer__list">
            <li><Link to="/tech-solutions">Websites &amp; Apps</Link></li>
            <li><Link to="/tech-solutions">Repairs &amp; Software</Link></li>
            <li><Link to="/learning-support">Learning Support</Link></li>
            <li><Link to="/contact">Request a Quote</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="site-footer__heading">Company</h4>
          <ul className="site-footer__list">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/how-we-work">How We Work</Link></li>
            <li><Link to="/blog">Guides</Link></li>
            <li><Link to="/dashboard">Client Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="site-footer__heading">Get in Touch</h4>
          <ul className="site-footer__list">
            <li>
              <Mail size={14} aria-hidden="true" />
              <a href={`mailto:${business.contact.email}`}>{business.contact.email}</a>
            </li>
            {business.contact.phones.map((p) => (
              <li key={p.e164}>
                <Phone size={14} aria-hidden="true" />
                <a href={`tel:${p.e164}`}>{p.display}</a>
                <span className="muted">({p.label})</span>
              </li>
            ))}
            <li>
              <MessageCircle size={14} aria-hidden="true" />
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp {business.contact.whatsappDisplay}</a>
            </li>
            <li>
              <Clock size={14} aria-hidden="true" />
              <span>{business.hours.display}</span>
            </li>
            <li>
              <MapPin size={14} aria-hidden="true" />
              <span>{fullAddress()}</span>
            </li>
          </ul>
          <div className="site-footer__social">
            <a href={business.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            </a>
            <a href={business.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href={business.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="container site-footer__legal">
        <p>
          © {year} {legalName()}. All rights reserved.
          {reg.registrationNumber && <> · Reg. No. {reg.registrationNumber}</>}
          {isVatRegistered() && <> · VAT No. {reg.vatNumber}</>}
        </p>
        <p>
          <Link to="/privacy">Privacy Policy</Link> · <Link to="/paia">PAIA Manual</Link> · <Link to="/terms">Terms of Service</Link>
        </p>
      </div>
    </footer>
  );
}

function PageFallback() {
  return (
    <div className="container section-padding" style={{ textAlign: 'center' }}>
      <p className="muted">Loading…</p>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const [activeQuote, setActiveQuote] = useState(null);

  usePageMeta();

  // Pages were written against a tab-switcher; keep that API but navigate to real URLs.
  const goTo = useCallback((key) => navigate(pathFor(key)), [navigate]);

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollToTop />
      <Header />

      <main id="main" className="app-main">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home setActiveTab={goTo} />} />
            <Route path="/tech-solutions" element={<TechSolutions setActiveTab={goTo} />} />
            <Route path="/products" element={<Products setActiveTab={goTo} />} />
            <Route path="/learning-support" element={<StudentServices setActiveTab={goTo} />} />
            <Route path="/how-we-work" element={<HowWeWork setActiveTab={goTo} />} />
            <Route path="/about" element={<About setActiveTab={goTo} />} />
            <Route path="/blog" element={<Blog setActiveTab={goTo} />} />
            <Route
              path="/contact"
              element={<Contact activeQuote={activeQuote} clearActiveQuote={() => setActiveQuote(null)} />}
            />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/paia" element={<Paia />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/dashboard" element={<ClientDashboard />} />
            {Object.entries(ALIASES).map(([oldKey, newKey]) => (
              <Route key={oldKey} path={`/${oldKey}`} element={<Navigate to={pageByKey(newKey).path} replace />} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
