import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Clock, MessageSquare, Users, BookOpen, Code, Settings } from 'lucide-react';
import ownerPhoto from '../assets/owner-photo.jpeg';

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
      quote: "The booking custom portal they built has completely saved our front-desk operation. Absolutely seamless client experience and clean code.",
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

  return (
    <div className="home-container fade-in">
      {/* Hero Section - Dual Focus */}
      <section className="hero-section container" style={{ padding: '5rem 0 3rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0, 102, 255, 0.08) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }}></div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', marginBottom: '3rem' }}>
          {/* Left: Text Content */}
          <div>
            <span className="section-subtitle" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1.5rem', background: 'rgba(0, 102, 255, 0.05)', padding: '0.5rem 1.25rem', borderRadius: '50px', border: '1px solid rgba(0, 102, 255, 0.15)' }}>
              <Sparkles size={14} style={{ color: 'var(--primary-glow)' }} />
              TECH SOLUTIONS & STUDENT SERVICES
            </span>
            
            <h1 style={{ fontSize: '3rem', lineHeight: '1.2', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
              Tech Solutions & Student Services: <span className="gradient-text">Two Sides of the Same Expert Coin</span>
            </h1>
            
            <p style={{ fontSize: '1.15rem', maxWidth: '100%', margin: '0 0 2.5rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} style={{ color: 'var(--primary-glow)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Plagiarism-Free</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} style={{ color: 'var(--primary-glow)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Secure Payments</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} style={{ color: 'var(--primary-glow)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Data Privacy</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} style={{ color: 'var(--primary-glow)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Fast Support</span>
              </div>
            </div>
          </div>

          {/* Right: Owner Profile Card */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
              width: '100%',
              maxWidth: '340px',
              background: 'var(--bg-pure)',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              boxShadow: 'var(--card-shadow-hover)',
              transition: 'all 0.3s ease'
            }}>
              {/* Photo Container */}
              <div style={{
                width: '100%',
                height: '280px',
                background: 'linear-gradient(135deg, rgba(0, 102, 255, 0.15), rgba(0, 102, 255, 0.08))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img src={ownerPhoto} alt="Phathutshedzo Mamagau - IT Student & Founder" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {/* Info Container */}
              <div style={{
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Phathutshedzo Mamagau</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary-glow)', fontWeight: 600, marginBottom: '0.75rem' }}>ICT Diploma | UMP (Class 2026)</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>Founder & Lead Developer. Combining enterprise-grade tech expertise with affordable student support services.</p>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    display: 'inline-block',
                    background: 'rgba(0, 102, 255, 0.1)',
                    color: 'var(--primary-glow)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}>React & Vite</span>
                  <span style={{
                    display: 'inline-block',
                    background: 'rgba(0, 102, 255, 0.1)',
                    color: 'var(--primary-glow)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}>Full Stack</span>
                  <span style={{
                    display: 'inline-block',
                    background: 'rgba(0, 102, 255, 0.1)',
                    color: 'var(--primary-glow)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}>Entrepreneur</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .hero-section > div {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* Social Proof Strip */}
      <section style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '3rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {proofStats.map((stat, idx) => (
              <div key={idx}>
                <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary-glow)', marginBottom: '0.5rem' }}>
                  {stat.metric}
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Services Section with Tabs */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-dark)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Our Expertise</span>
            <h2>Professional Tech Solutions & Student Services</h2>
            <p>Specialized services tailored to your exact needs.</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveServiceTab('tech')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                border: activeServiceTab === 'tech' ? 'none' : '1px solid var(--border-color)',
                background: activeServiceTab === 'tech' ? 'var(--primary-glow)' : 'var(--bg-deep)',
                color: activeServiceTab === 'tech' ? 'white' : 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontSize: '0.95rem'
              }}
            >
              Tech Solutions
            </button>
            <button
              onClick={() => setActiveServiceTab('student')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '50px',
                border: activeServiceTab === 'student' ? 'none' : '1px solid var(--border-color)',
                background: activeServiceTab === 'student' ? 'var(--primary-glow)' : 'var(--bg-deep)',
                color: activeServiceTab === 'student' ? 'white' : 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontSize: '0.95rem'
              }}
            >
              Student Services
            </button>
          </div>

          {/* Tech Solutions Cards */}
          {activeServiceTab === 'tech' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              <div className="glass-card">
                <Code size={40} style={{ color: 'var(--primary-glow)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Business Website Design</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>High-fidelity marketing sites optimized for leads and conversions.</p>
                <button onClick={() => setActiveTab('tech-solutions')} className="neon-glow-btn" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem', padding: '0.6rem' }}>
                  Learn More
                </button>
              </div>
              <div className="glass-card">
                <Settings size={40} style={{ color: 'var(--primary-glow)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Custom Web Applications</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Dynamic portals with databases, dashboards, and automation.</p>
                <button onClick={() => setActiveTab('tech-solutions')} className="neon-glow-btn" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem', padding: '0.6rem' }}>
                  Learn More
                </button>
              </div>
              <div className="glass-card">
                <Users size={40} style={{ color: 'var(--primary-glow)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Mobile Applications</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>iOS and Android apps that engage customers directly.</p>
                <button onClick={() => setActiveTab('tech-solutions')} className="neon-glow-btn" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem', padding: '0.6rem' }}>
                  Learn More
                </button>
              </div>
            </div>
          )}

          {/* Student Services Cards */}
          {activeServiceTab === 'student' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              <div className="glass-card">
                <BookOpen size={40} style={{ color: 'var(--primary-glow)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Assignment & Essay Help</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Professional academic support and guidance from a university tutor.</p>
                <button onClick={() => setActiveTab('student-services')} className="neon-glow-btn" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem', padding: '0.6rem' }}>
                  Learn More
                </button>
              </div>
              <div className="glass-card">
                <Code size={40} style={{ color: 'var(--primary-glow)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Coding Project Help</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Debugging, optimization, and step-by-step explanations.</p>
                <button onClick={() => setActiveTab('student-services')} className="neon-glow-btn" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem', padding: '0.6rem' }}>
                  Learn More
                </button>
              </div>
              <div className="glass-card">
                <Settings size={40} style={{ color: 'var(--primary-glow)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Microsoft Office Support</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Quick installation and app activation assistance.</p>
                <button onClick={() => setActiveTab('student-services')} className="neon-glow-btn" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem', padding: '0.6rem' }}>
                  Learn More
                </button>
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button onClick={() => setActiveTab(activeServiceTab === 'tech' ? 'tech-solutions' : 'student-services')} className="neon-outline-btn">
              View All Services <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Dual Tabs */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg-deep)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Feedback</span>
            <h2>What People Say</h2>
            <p>Real experiences from clients and students we've helped.</p>
          </div>

          {/* Testimonial Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveServiceTab('tech')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '50px',
                border: activeServiceTab === 'tech' ? 'none' : '1px solid var(--border-color)',
                background: activeServiceTab === 'tech' ? 'var(--primary-glow)' : 'transparent',
                color: activeServiceTab === 'tech' ? 'white' : 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Tech Clients
            </button>
            <button
              onClick={() => setActiveServiceTab('student')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '50px',
                border: activeServiceTab === 'student' ? 'none' : '1px solid var(--border-color)',
                background: activeServiceTab === 'student' ? 'var(--primary-glow)' : 'transparent',
                color: activeServiceTab === 'student' ? 'white' : 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              Students
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {allTestimonials.map((t, idx) => (
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

      {/* Final CTA Section */}
      <section className="section-padding container" style={{ textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '4rem 2rem', maxWidth: '850px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Ready to get started?</h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem', color: 'var(--text-secondary)' }}>
            Whether you need a business website or student academic support, we're here to help. Get a free quote or chat with us now.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('contact')} className="neon-glow-btn">
              Get Free Quote <ArrowRight size={16} />
            </button>
            <a href="https://wa.me/27613991212?text=Hi! I'm interested in your services." target="_blank" rel="noopener noreferrer" className="neon-outline-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={16} /> Chat Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
