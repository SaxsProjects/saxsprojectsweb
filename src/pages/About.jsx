import React from 'react';
import { Cpu, Terminal, Compass, Award, Heart, CheckCircle } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function About() {
  const stack = [
    { name: "Java", role: "Backend & Systems", desc: "Robust object-oriented software, secure enterprise backends, and server-side processing." },
    { name: "Kotlin", role: "Android App Development", desc: "Modern native mobile engineering with clean, concise, and type-safe code architectures." },
    { name: "Python", role: "Scripts & Data Science", desc: "AI automation scripts, custom data pipelines, and fast API microservices." },
    { name: "PHP", role: "Modern & Classic Web", desc: "Laravel routing, database services, and dynamic content management systems." },
    { name: "SQL", role: "Database Engineering", desc: "Structured query optimizations, database normalization, and secure data storage." },
    { name: "JavaScript", role: "Dynamic Logic", desc: "Interactive frontend state, React hooks, and asynchronous client-server communication." },
    { name: "HTML", role: "Semantic Structure", desc: "Accessible structures (WCAG compliant), meta tagging, and SEO crawlable elements." },
    { name: "React Native", role: "Cross-Platform Mobile", desc: "Deploying high-performance native iOS and Android apps from a single codebase." },
    { name: "C++", role: "System Programming", desc: "Performance-oriented memory management, hardware logic, and core systems." },
    { name: "Linux", role: "System Operations", desc: "Server setups, shell commands, automated cron tasks, and hosting configurations." },
    { name: "React", role: "Frontend UI Library", desc: "Reusable component-driven interfaces, reactive state controls, and custom dashboards." },
    { name: "Next.js", role: "SSR & Web Apps", desc: "Server-side rendering, static site generation, rapid loading, and optimized routing." },
    { name: "Node.js", role: "Backend Runtime", desc: "Fast asynchronous Express.js API servers, websocket integrations, and toolchains." },
    { name: "Tailwind CSS", role: "Modern Styling", desc: "Utility-first CSS styling for clean, modern responsive grids and visual interfaces." },
    { name: "MongoDB", role: "NoSQL Database", desc: "Flexible BSON documents for managing client records, invoices, and portal updates." },
    { name: "Firebase", role: "Real-time Cloud", desc: "Real-time communication channels, client authentication systems, and cloud functions." },
    { name: "AWS", role: "Cloud Deployments", desc: "Secure hosting, database backups, file uploads (S3), and production routing." }
  ];

  return (
    <div className="about-container fade-in container section-padding">
      <div className="section-header">
        <span className="section-subtitle">Our Ethos</span>
        <h2>Behind SaxsProjects</h2>
        <p>A partnership model focused on driving real digital value for growing small businesses, freelancers, and startups.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', marginBottom: '6rem', alignItems: 'center' }}>
        {/* Biography text */}
        <div>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={20} className="primary-neon" style={{ color: 'var(--primary-glow)' }} /> A Partner, Not an Agency
          </h3>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
            Large agencies will charge you a premium, delegate your project to junior developers, and lock you into expensive monthly retainers. 
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
            As a dedicated, solo full-stack developer at <strong>SaxsProjects</strong>, I do things differently. I work directly with you to architect a robust digital foundation tailored specifically to your operations. 
          </p>
          <p style={{ fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem' }}>
            I handle the complete lifecycle: visual branding, high-fidelity responsive layouts, database routing, security, domain setup, and ongoing SEO. No corporate middlemen. Just direct, top-tier engineering.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} className="primary-neon" style={{ color: 'var(--primary-glow)' }} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>100% Transparency</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} className="primary-neon" style={{ color: 'var(--primary-glow)' }} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Direct Support Line</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} className="primary-neon" style={{ color: 'var(--primary-glow)' }} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Zero Locked Code</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} className="primary-neon" style={{ color: 'var(--primary-glow)' }} />
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>BLISTERING SPEED</span>
            </div>
          </div>
        </div>

        {/* Visual Badge Card */}
        <div className="glass-card" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '3rem 2.5rem', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'rgba(0, 102, 255, 0.08)', color: 'var(--primary-glow)', fontSize: '0.65rem', fontWeight: 700 }}>VERIFIED DEVELOPER</div>
          
          <div style={{ margin: '0 auto 1.5rem', width: '80px', height: '80px', borderRadius: '50%', background: '#FFFFFF', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '8px' }}>
            <img src={logoImg} alt="SaxsProjects Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          <h4 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Solo Full-Stack Specialist</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--primary-glow)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05rem', marginBottom: '1.5rem' }}>Core System architect</p>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            "I build bespoke websites and custom web systems that run fast, rank high, and allow business owners to focus on what they do best: serving customers."
          </p>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: '1.1' }}>3+</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Years Dev Experience</p>
            </div>
            <div>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: '1.1' }}>100%</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Satisfaction Ratio</p>
            </div>
          </div>
        </div>

      </div>

      {/* Tech Stack Grid */}
      <section>
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <span className="section-subtitle">Our Toolkit</span>
          <h3>Standard Development Stack</h3>
          <p>We choose modern, robust, and highly scalable technologies suitable for rapid deployments and seamless operations.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
          {stack.map((t, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '1.75rem' }}>
              <span className="tech-badge" style={{ fontSize: '0.7rem', marginBottom: '0.75rem' }}>{t.role}</span>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{t.name}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
