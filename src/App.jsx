import { useState } from 'react';
import Home from './pages/Home';
import Services from './pages/Services';
import TechSolutions from './pages/TechSolutions';
import StudentServices from './pages/StudentServices';
import HowWeWork from './pages/HowWeWork';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Blog from './pages/Blog';
import ClientDashboard from './pages/ClientDashboard';
import Contact from './pages/Contact';
import OAuthCallback from './pages/OAuthCallback';
import FloatingWhatsApp from './components/FloatingWhatsApp';

// Removed live chat / Firestore listener imports (chat removed)

// Logo Asset
import logoImg from './assets/logo.png';

// Icons
import { Menu, X, MessageCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeQuote, setPrefilledQuote] = useState(null);
  
  // Check if we're on callback page
  const isOAuthCallback = window.location.pathname === '/callback';

  // Live chat removed — keeping app focused on core navigation and content

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  // Chat handlers removed

  // Render OAuth callback page if on callback path
  if (isOAuthCallback) {
    return <OAuthCallback />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* Navigation Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
          
          {/* Logo */}
          <div onClick={() => handleTabChange('home')} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <img src={logoImg} alt="SaxsProjects" style={{ height: '42px', display: 'block', objectFit: 'contain' }} />
          </div>

          {/* Desktop Nav Links */}
          <nav style={{ display: 'none', gap: '1.5rem', alignItems: 'center' }} className="desktop-nav">
            <button onClick={() => handleTabChange('home')} style={{ background: 'transparent', border: 'none', color: activeTab === 'home' ? 'var(--primary-glow)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>Home</button>
            <button onClick={() => handleTabChange('tech-solutions')} style={{ background: 'transparent', border: 'none', color: activeTab === 'tech-solutions' ? 'var(--primary-glow)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>Tech Solutions</button>
            <button onClick={() => handleTabChange('learning-support')} style={{ background: 'transparent', border: 'none', color: activeTab === 'learning-support' ? 'var(--primary-glow)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>Learning Support</button>
            <button onClick={() => handleTabChange('about')} style={{ background: 'transparent', border: 'none', color: activeTab === 'about' ? 'var(--primary-glow)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>About</button>
            <button onClick={() => handleTabChange('contact')} className="neon-glow-btn" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>Get a Quote</button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            style={{ display: 'block', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fade-in" style={{ background: 'var(--bg-pure)', borderBottom: '1px solid var(--border-color)', padding: '1.5rem 0' }}>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'flex-start' }}>
              <button onClick={() => handleTabChange('home')} style={{ background: 'transparent', border: 'none', color: activeTab === 'home' ? 'var(--primary-glow)' : 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>Home</button>
              <button onClick={() => handleTabChange('tech-solutions')} style={{ background: 'transparent', border: 'none', color: activeTab === 'tech-solutions' ? 'var(--primary-glow)' : 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>Tech Solutions</button>
              <button onClick={() => handleTabChange('learning-support')} style={{ background: 'transparent', border: 'none', color: activeTab === 'learning-support' ? 'var(--primary-glow)' : 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>Learning Support</button>
              <button onClick={() => handleTabChange('about')} style={{ background: 'transparent', border: 'none', color: activeTab === 'about' ? 'var(--primary-glow)' : 'var(--text-primary)', fontSize: '1rem', fontWeight: 600 }}>About</button>
              <button onClick={() => handleTabChange('contact')} className="neon-glow-btn" style={{ width: '100%', justifyContent: 'center' }}>Get a Quote</button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1 }}>
        {activeTab === 'home' && <Home setActiveTab={handleTabChange} />}
        {activeTab === 'tech-solutions' && <TechSolutions setActiveTab={handleTabChange} />}
        {activeTab === 'learning-support' && <StudentServices setActiveTab={handleTabChange} />}
        {activeTab === 'services' && <Services setActiveTab={handleTabChange} />}
        {activeTab === 'how-we-work' && <HowWeWork />}
        {activeTab === 'pricing' && <Pricing setActiveTab={handleTabChange} setPrefilledQuote={setPrefilledQuote} />}
        {activeTab === 'about' && <About />}
        {activeTab === 'blog' && <Blog />}
        {activeTab === 'dashboard' && <ClientDashboard />}
        {activeTab === 'contact' && <Contact activeQuote={activeQuote} clearActiveQuote={() => setPrefilledQuote(null)} setActiveTab={handleTabChange} />}
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)', padding: '4rem 0 2rem' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <img src={logoImg} alt="SaxsProjects" style={{ height: '36px', display: 'block', marginBottom: '1.25rem', objectFit: 'contain' }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Digital foundations for growing businesses. High fidelity code, absolute transparency, money-back protection.</p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--primary-glow)', letterSpacing: '0.05em', marginBottom: '1rem' }}>Expertise</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li>Vite & React Portals</li>
              <li>E-Commerce Integrations</li>
              <li>Next.js Applications</li>
              <li>Client dashboards</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--primary-glow)', letterSpacing: '0.05em', marginBottom: '1rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li onClick={() => handleTabChange('about')} style={{ cursor: 'pointer' }}>Developer Story</li>
              <li onClick={() => handleTabChange('how-we-work')} style={{ cursor: 'pointer' }}>Process Timeline</li>
              <li onClick={() => handleTabChange('blog')} style={{ cursor: 'pointer' }}>SEO Guides</li>
              <li onClick={() => handleTabChange('dashboard')} style={{ cursor: 'pointer' }}>Client Login</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--primary-glow)', letterSpacing: '0.05em', marginBottom: '1rem' }}>Get in Touch</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li><a href="mailto:saxs.solutions25@gmail.com" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>saxs.solutions25@gmail.com</a></li>
              <li>Call: <a href="tel:0714135824" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }}>0714135824</a> / <a href="tel:0613991212" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600 }}>0613991212</a></li>
              <li style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <a href="https://github.com/Saxs-14" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }} title="GitHub - Saxs-14">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                </a>
                <a href="https://facebook.com/saxsprojects" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }} title="Facebook - SaxsProjects">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="https://linkedin.com/in/saxsprojects" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }} title="LinkedIn - SaxsProjects">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="https://wa.me/27613991212" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }} title="WhatsApp"><MessageCircle size={18} /></a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="container" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} SaxsProjects. All rights reserved. • Built with Vite, React & Vanilla CSS.
        </div>
      </footer>

      {/* Live chat removed (floating widget) */}

      {/* Global CSS Responsive Helpers styling injection */}
      <style>{`
        @media screen and (min-width: 769px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />

    </div>
  );
}
