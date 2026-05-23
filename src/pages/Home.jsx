import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Award, Phone, HelpCircle } from 'lucide-react';

export default function Home({ setActiveTab }) {
  const testimonials = [
    {
      quote: "SaxsProjects turned our brick-and-mortar storefront into a high-converting digital shop in under 3 weeks. Incredible post-launch support!",
      author: "Sarah K.",
      role: "Founder, BrewLocal Coffee",
      rating: 5
    },
    {
      quote: "The booking custom portal they built has completely saved our front-desk operation. Absolutely seamless client experience and clean code.",
      author: "Marcus J.",
      role: "Operations Director, FitFlow Gyms",
      rating: 5
    }
  ];

  return (
    <div className="home-container fade-in">
      {/* Hero Section */}
      <section className="hero-section container" style={{ padding: '6rem 0 4rem', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 102, 255, 0.08) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }}></div>
        
        <span className="section-subtitle" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto 1.5rem', background: 'rgba(0, 102, 255, 0.05)', padding: '0.5rem 1.25rem', borderRadius: '50px', border: '1px solid rgba(0, 102, 255, 0.15)' }}>
          <Sparkles size={14} className="primary-neon" style={{ color: 'var(--primary-glow)' }} />
          DIGITAL FOUNDATIONS FOR GROWING BUSINESSES
        </span>
        
        <h1 style={{ fontSize: '3.5rem', lineHeight: '1.2', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
          We build websites & apps that help <span className="gradient-text">small businesses grow.</span>
        </h1>
        
        <p style={{ fontSize: '1.25rem', maxWidth: '750px', margin: '0 auto 2.5rem', color: 'var(--text-secondary)' }}>
          Professional digital foundations tailored for growing enterprises. Get transparent pricing, money-back guarantees, and dedicated post-launch support with no hidden fees.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('contact')} className="neon-glow-btn">
            Book a free 15-min consultation <ArrowRight size={16} />
          </button>
          <a href="tel:0714135824" className="neon-outline-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={16} /> Call now
          </a>
        </div>

        {/* Trust Badges Grid */}
        <div className="trust-badge-row" style={{ marginTop: '5rem' }}>
          <div className="trust-badge">
            <ShieldCheck size={20} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Transparent Pricing</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>No surprise invoices, fixed rates</p>
            </div>
          </div>
          <div className="trust-badge">
            <ShieldCheck size={20} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Money-Back Guarantee</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>100% risk-free scope agreement</p>
            </div>
          </div>
          <div className="trust-badge">
            <Clock size={20} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Support Included</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>30 days post-launch updates</p>
            </div>
          </div>
          <div className="trust-badge">
            <HelpCircle size={20} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>No Hidden Fees</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>You own 100% of your systems</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Summary Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Our Capabilities</span>
            <h2>Core Solutions</h2>
            <p>From simple business websites to high-scale custom web and mobile systems.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="glass-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Small Business Websites</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>High-fidelity marketing sites, mobile-first layouts, search engine optimized, and custom capture forms.</p>
              <span className="tech-badge">From R2,800 ZAR</span>
            </div>
            <div className="glass-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Custom Web Applications</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Dynamic databases, customer portals, billing synchronizations, and automated booking calendars.</p>
              <span className="tech-badge">From R5,000 ZAR</span>
            </div>
            <div className="glass-card">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Mobile Applications</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Cross-platform iOS and Android apps with secure authentication, databases, and push notifications.</p>
              <span className="tech-badge">From R6,000 ZAR</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button onClick={() => setActiveTab('services')} className="neon-outline-btn">
              Explore Services & Pricing Tiers
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Reviews</span>
            <h2>What Clients Say</h2>
            <p>We work closely with small businesses, turning their requirements into functional realities.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {testimonials.map((t, idx) => (
              <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} style={{ color: '#FFB020', fontSize: '1.2rem' }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)', flexGrow: 1 }}>"{t.quote}"</p>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{t.author}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signal Action */}
      <section className="section-padding container" style={{ textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '4rem 2rem', maxWidth: '850px', margin: '0 auto', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Ready to launch your digital foundation?</h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Let’s discuss your vision. Get a completely transparent quote, outline of stages, and target dates. Absolutely zero commitment required.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('contact')} className="neon-glow-btn">
              Schedule Consultation <ArrowRight size={16} />
            </button>
            <a href="tel:0714135824" className="neon-outline-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} /> Call now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

