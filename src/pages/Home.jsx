import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Clock, MessageSquare, Users, BookOpen, Code, Settings, Star } from 'lucide-react';
import ownerPhoto from '../assets/owner-photo.jpeg';
import StatCounter from '../components/StatCounter';

export default function Home({ setActiveTab }) {
  const [activeServiceTab, setActiveServiceTab] = useState('tech');

  const techTestimonials = [
    {
      quote: "SaxsProjects turned our brick-and-mortar storefront into a high-converting digital shop in under 3 weeks. Incredible post-launch support!",
      author: "Sarah K.",
      role: "Founder, BrewLocal Coffee",
      rating: 5
    },
    {
      quote: "The custom booking portal they built has completely saved our front-desk operation. Absolutely seamless client experience and clean code.",
      author: "Marcus J.",
      role: "Operations Director, FitFlow Gyms",
      rating: 5
    }
  ];

  const studentTestimonials = [
    {
      quote: "I was struggling with my coding assignment until I reached out. The step-by-step guidance was exactly what I needed to understand the concepts.",
      author: "Thabo L.",
      role: "Computer Science Student",
      rating: 5
    },
    {
      quote: "SaxsProjects helped me structure my essay perfectly. Professional service at affordable rates!",
      author: "Lindy M.",
      role: "English Literature Student",
      rating: 5
    }
  ];

  const allTestimonials = activeServiceTab === 'tech' ? techTestimonials : studentTestimonials;

  const proofStats = [
    { metric: "50+", label: "Clients Served" },
    { metric: "100+", label: "Students Helped" },
    { metric: "10+", label: "Subjects Covered" },
    { metric: "5★", label: "Rating Average" }
  ];

  const techServices = [
    { icon: Code, title: 'Business Website Design', desc: 'High-fidelity marketing sites optimized for leads, SEO, and conversions — built to work for you 24/7.' },
    { icon: Settings, title: 'Custom Web Applications', desc: 'Dynamic portals with databases, dashboards, and automation for your workflows.' },
    { icon: Users, title: 'Mobile Applications', desc: 'iOS and Android apps that engage customers directly, wherever they are.' }
  ];

  const studentServices = [
    { icon: BookOpen, title: 'Assignment & Essay Help', desc: 'Professional academic support and structured guidance from a real university tutor — with integrity at the core.' },
    { icon: Code, title: 'Coding Project Help', desc: 'Debugging, optimization, and clear step-by-step explanations so you actually understand your work.' },
    { icon: Settings, title: 'Microsoft Office Support', desc: 'Quick installation, setup, and app activation assistance to get you productive fast.' }
  ];

  const services = activeServiceTab === 'tech' ? techServices : studentServices;
  const servicesTarget = activeServiceTab === 'tech' ? 'tech-solutions' : 'learning-support';

  return (
    <div className="home-container">
      {/* Hero Section - Dark, dual focus */}
      <section className="hero-dark">
        <div className="container fade-in" style={{ padding: '6rem 0 7rem' }}>
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '3.5rem', alignItems: 'center' }}>
            {/* Left: Text Content */}
            <div>
              <span className="eyebrow-dark" style={{ marginBottom: '1.75rem' }}>
                <Sparkles size={14} />
                Tech Solutions &amp; Student Services
              </span>

              <h1 style={{ fontSize: '3.25rem', lineHeight: 1.12, fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
                Two sides of the same <span className="gradient-text">expert coin</span>
              </h1>

              <p style={{ fontSize: '1.15rem', maxWidth: '520px', margin: '0 0 2.5rem', lineHeight: 1.7 }}>
                From business websites to assignment support — we've got you covered. SaxsProjects delivers expert tech solutions for businesses and professional academic support for students.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={() => setActiveTab('tech-solutions')} className="neon-glow-btn">
                  Get a Free Quote <ArrowRight size={16} />
                </button>
                <a href="https://wa.me/27613991212?text=Hi! I need help with student services." target="_blank" rel="noopener noreferrer" className="neon-outline-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={16} /> Student Help
                </a>
              </div>

              {/* Trust Badges - Hero */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '3rem', maxWidth: '460px' }}>
                {[
                  { icon: ShieldCheck, label: 'Plagiarism-Free' },
                  { icon: ShieldCheck, label: 'Secure Payments' },
                  { icon: ShieldCheck, label: 'Data Privacy' },
                  { icon: Clock, label: 'Fast Support' }
                ].map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Icon size={18} style={{ color: '#4d94ff', flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#dbe6f7' }}>{b.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Owner Profile Card */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{
                width: '100%',
                maxWidth: '350px',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '22px',
                border: '1px solid rgba(123, 170, 255, 0.28)',
                overflow: 'hidden',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45), 0 0 50px rgba(0, 102, 255, 0.18)',
                backdropFilter: 'blur(6px)'
              }}>
                <div style={{ width: '100%', height: '290px', overflow: 'hidden', position: 'relative' }}>
                  <img src={ownerPhoto} alt="Phathutshedzo Mamagau - IT Student & Founder" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11, 24, 48, 0.7), transparent 55%)' }}></div>
                </div>
                <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>Phathutshedzo Mamagau</h3>
                  <p style={{ fontSize: '0.85rem', color: '#80b3ff', fontWeight: 600, marginBottom: '0.75rem' }}>ICT Diploma | UMP (Class 2026)</p>
                  <p style={{ fontSize: '0.8rem', color: '#aebbcf', lineHeight: 1.6, marginBottom: '1.25rem' }}>Founder &amp; Lead Developer. Combining enterprise-grade tech expertise with affordable student support.</p>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {['React & Vite', 'Full Stack', 'Entrepreneur'].map((tag, i) => (
                      <span key={i} style={{ display: 'inline-block', background: 'rgba(77, 148, 255, 0.16)', color: '#9cc4ff', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600, border: '1px solid rgba(77, 148, 255, 0.25)' }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - animated counters */}
      <section className="container" style={{ marginTop: '-3rem', position: 'relative', zIndex: 2, marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.25rem' }}>
          {proofStats.map((stat, idx) => (
            <StatCounter key={idx} value={stat.metric} label={stat.label} />
          ))}
        </div>
      </section>

      {/* Dual Services Section with Bento Grid */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-dark)' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">Our Expertise</span>
            <h2>Professional Tech Solutions &amp; Student Services</h2>
            <p>Specialized services tailored to your exact needs.</p>
          </div>

          {/* Segmented toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
            <div className="seg">
              <button onClick={() => setActiveServiceTab('tech')} className={`seg-btn ${activeServiceTab === 'tech' ? 'active' : ''}`}>
                Tech Solutions
              </button>
              <button onClick={() => setActiveServiceTab('student')} className={`seg-btn ${activeServiceTab === 'student' ? 'active' : ''}`}>
                Student Services
              </button>
            </div>
          </div>

          {/* Bento grid */}
          <div className="bento">
            {services.map((s, i) => {
              const Icon = s.icon;
              const isFeature = i === 0;
              return (
                <div
                  key={i}
                  className={`bento-item reveal delay-${i + 1} ${isFeature ? 'feature dark' : ''}`}
                  style={{ display: 'flex', flexDirection: 'column' }}
                >
                  <div className="icon-chip"><Icon size={isFeature ? 28 : 24} /></div>
                  <h3 style={{ fontSize: isFeature ? '1.6rem' : '1.2rem', marginBottom: '0.6rem' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem', flexGrow: 1 }}>{s.desc}</p>
                  <button
                    onClick={() => setActiveTab(servicesTarget)}
                    className={isFeature ? 'neon-glow-btn' : 'neon-outline-btn'}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    Learn More <ArrowRight size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button onClick={() => setActiveTab(servicesTarget)} className="neon-outline-btn">
              View All Services <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">Social Proof</span>
            <h2>What People Say</h2>
            <p>Real outcomes from {activeServiceTab === 'tech' ? 'businesses we have built for' : 'students we have supported'}.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: '950px', margin: '0 auto' }}>
            {allTestimonials.map((t, idx) => (
              <div key={idx} className="bento-item reveal" style={{ padding: '2.25rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={18} style={{ color: '#facc15', fill: '#facc15' }} />
                  ))}
                </div>
                <p style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>"{t.quote}"</p>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.author}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--primary-glow)', fontWeight: 600 }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - dark band */}
      <section className="section-padding container">
        <div className="reveal" style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          padding: '4.5rem 2rem',
          textAlign: 'center',
          background: 'radial-gradient(60% 120% at 50% 0%, rgba(0, 102, 255, 0.35), transparent 60%), linear-gradient(160deg, #101e35, #0b1830)',
          border: '1px solid rgba(77, 148, 255, 0.25)',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)'
        }}>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem', color: '#ffffff' }}>Ready to get started?</h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem', color: '#aebbcf' }}>
            Whether you need a business website or student academic support, we're here to help. Get a free quote or chat with us now.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('contact')} className="neon-glow-btn">
              Get Free Quote <ArrowRight size={16} />
            </button>
            <a href="https://wa.me/27613991212?text=Hi! I'm interested in your services." target="_blank" rel="noopener noreferrer" className="neon-outline-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', color: '#cfe0ff', borderColor: 'rgba(123,170,255,0.5)' }}>
              <MessageSquare size={16} /> Chat Now
            </a>
          </div>
        </div>
      </section>

      {/* Responsive: stack hero on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-dark h1 { font-size: 2.5rem !important; }
        }
      `}</style>
    </div>
  );
}
