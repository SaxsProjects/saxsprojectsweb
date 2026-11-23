import { CalendarRange, Sparkles, LayoutGrid, Cpu, Rocket, CheckCircle, ArrowRight } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: CalendarRange,
    title: 'Discovery Call',
    duration: 'Days 1–3',
    description:
      'A free 15-minute call to understand your goals, your customers, the look you want and anything we need to connect to (bookings, payments, email, social media).',
    deliverable: 'A clear scope and a fixed written quote.',
  },
  {
    num: '02',
    icon: Sparkles,
    title: 'Proposal & Agreement',
    duration: 'Days 3–5',
    description:
      'We agree the milestones, delivery dates and what is included in writing. Work starts once the 50% deposit is paid.',
    deliverable: 'A signed agreement with milestones, timeline and refund terms.',
  },
  {
    num: '03',
    icon: LayoutGrid,
    title: 'Design',
    duration: 'Week 2',
    description:
      'You see the layout, colours and content structure before any code is written, and you can ask for changes.',
    deliverable: 'A design preview for your feedback and approval.',
  },
  {
    num: '04',
    icon: Cpu,
    title: 'Development',
    duration: 'Weeks 2–4',
    description:
      'We build your site or app with modern, fast technology, connect any databases or forms, and set up the basics for Google search.',
    deliverable: 'A private preview link so you can follow progress.',
  },
  {
    num: '05',
    icon: Rocket,
    title: 'Launch & Handover',
    duration: 'Launch day',
    description:
      'After your final review and the balance payment, we connect your domain, switch on security (SSL), go live and hand over all access.',
    deliverable: 'Your live site or app, plus a short guide on how to use it.',
  },
  {
    num: '06',
    icon: CheckCircle,
    title: '30 Days of Support',
    duration: 'After launch',
    description:
      'For 30 days after launch we fix bugs and make small text or image changes at no charge. Ongoing support plans are available after that.',
    deliverable: 'A direct WhatsApp and email line for quick help.',
  },
];

export default function HowWeWork({ setActiveTab }) {
  return (
    <div className="howwework-container fade-in container section-padding">
      <div className="section-header">
        <span className="section-subtitle">Our Process</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>How we work</h1>
        <p>A simple, transparent process from first call to launch. You always know what happens next and what it costs.</p>
      </div>

      <div className="timeline">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-content">
                <span className="timeline-number" aria-hidden="true">{s.num}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(0, 102, 255, 0.06)', border: '1px solid var(--border-color)' }}>
                    <Icon size={22} style={{ color: 'var(--primary-glow)' }} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>{s.title}</h2>
                    <span className="tech-badge" style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', marginTop: '0.2rem' }}>{s.duration}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.92rem', marginBottom: '1rem' }}>{s.description}</p>
                <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary-neon)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>You get</p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '0.15rem' }}>{s.deliverable}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card" style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem 1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Ready for step one?</h2>
        <p style={{ maxWidth: '520px', margin: '0 auto 1.75rem' }}>Book a free 15-minute call or send us your project details for a fixed quote.</p>
        <button onClick={() => setActiveTab('contact')} className="neon-glow-btn">
          Get a free quote <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
