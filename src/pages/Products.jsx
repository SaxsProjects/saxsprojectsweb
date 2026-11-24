import { Wallet, Bus, GraduationCap, Brain, ScanEye, ArrowRight, MessageSquare, CheckCircle } from 'lucide-react';
import { whatsappLink } from '../config/business';

// Products SaxsProjects designs and builds itself. Keep the wording in step with
// the Company Profile ("Selected Products and Projects"). Status labels must stay
// honest: only call something "Live" once real customers use it.
const PRODUCTS = [
  {
    icon: <Wallet size={36} />,
    name: 'Ukhona Pay',
    status: 'In development',
    summary: 'Payment and financial identity platform for minibus taxi drivers and informal vendors.',
    points: ['Digital payments for cash-based businesses', 'Transaction history that builds a financial record', 'Built for low-cost Android phones'],
    tags: ['Fintech', 'Web', 'API'],
  },
  {
    icon: <Bus size={36} />,
    name: 'TapRide',
    status: 'In development',
    summary: 'Smart-card and mobile fare payment system for bus transport, with a driver validator app.',
    points: ['One branded card per bus operator', 'Driver validator app that taps NFC cards', 'Fare rules, top-ups and daily operator reports'],
    tags: ['Transport', 'NFC', 'Android'],
  },
  {
    icon: <GraduationCap size={36} />,
    name: 'EduConnectZA',
    status: 'In development',
    summary: 'Learning management platform for South African schools and learners.',
    points: ['Classes, lessons and assignments in one place', 'Separate views for learners, teachers and schools', 'Works on phones as well as computers'],
    tags: ['Education', 'Web app'],
  },
  {
    icon: <Brain size={36} />,
    name: 'QuestKids & BrainBox',
    status: 'In development',
    summary: 'Curriculum-aligned learning and quiz applications for learners.',
    points: ['CAPS-aligned questions and lessons', 'Games and quizzes that explain the answers', 'Progress tracking for learners and parents'],
    tags: ['Education', 'Mobile'],
  },
  {
    icon: <ScanEye size={36} />,
    name: 'AI Monitoring Suite',
    status: 'Prototype',
    summary: 'Image-recognition systems for waste management, fire detection, potholes, crop health and PPE compliance.',
    points: ['Spots problems in photos and camera feeds', 'Dashboards that turn reports into action', 'Adaptable to a municipality, farm or site'],
    tags: ['AI', 'Computer vision', 'IoT'],
  },
];

const statusStyle = (status) => ({
  display: 'inline-block',
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  padding: '0.25rem 0.6rem',
  borderRadius: '50px',
  color: status === 'Prototype' ? '#9a6700' : 'var(--primary-glow)',
  background: status === 'Prototype' ? 'rgba(212, 167, 44, 0.12)' : 'rgba(0, 102, 255, 0.08)',
  border: `1px solid ${status === 'Prototype' ? 'rgba(212, 167, 44, 0.35)' : 'rgba(0, 102, 255, 0.2)'}`,
});

export default function Products({ setActiveTab }) {
  return (
    <div className="fade-in">
      <section className="container" style={{ padding: '6rem 0 3rem', textAlign: 'center' }}>
        <span className="section-subtitle">Our Products</span>
        <h1 style={{ fontSize: 'clamp(2.1rem, 6vw, 3.25rem)', lineHeight: 1.2, fontWeight: 900, margin: '1rem 0 1.25rem', letterSpacing: '-0.03em' }}>
          Products we <span className="gradient-text">design and build</span>
        </h1>
        <p style={{ fontSize: '1.15rem', maxWidth: '720px', margin: '0 auto', color: 'var(--text-secondary)' }}>
          Alongside client work, we build our own products for South African transport, payments, education and public
          services. Interested in a pilot or a demo? Talk to us.
        </p>
      </section>

      <section className="section-padding" style={{ paddingTop: '1rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
            {PRODUCTS.map((p) => (
              <article key={p.name} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ color: 'var(--primary-glow)' }} aria-hidden="true">{p.icon}</div>
                  <span style={statusStyle(p.status)}>{p.status}</span>
                </div>
                <h2 style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>{p.name}</h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>{p.summary}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', flexGrow: 1 }}>
                  {p.points.map((pt) => (
                    <li key={pt} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={14} style={{ color: 'var(--primary-glow)', flexShrink: 0, marginTop: '0.2rem' }} aria-hidden="true" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {p.tags.map((t) => (
                    <span key={t} className="tech-badge">{t}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="glass-card" style={{ marginTop: '3rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>Want one of these for your organisation?</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto 1.5rem' }}>
              We can run a pilot, adapt a product to your operation, or build something new on the same foundations.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={whatsappLink("Hi SaxsProjects, I'd like to know more about your products.")}
                target="_blank"
                rel="noopener noreferrer"
                className="neon-glow-btn"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <MessageSquare size={16} /> Chat on WhatsApp
              </a>
              <button type="button" onClick={() => setActiveTab('contact')} className="neon-outline-btn">
                Ask for a demo <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
