import React from 'react';
import { Monitor, ShoppingBag, Terminal, Smartphone, Check, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Services({ setActiveTab }) {
  const serviceList = [
    {
      icon: <Monitor size={40} style={{ color: 'var(--primary-glow)' }} />,
      title: "Small Business Website",
      range: "R2,800 – R4,300 ZAR",
      time: "10 – 14 Days",
      summary: "High-performance digital presence built to capture leads, rank on Google, and engage local users. Fully customizable with or without databases.",
      deliverables: [
        "Standard (No DB): R2,800 ZAR (3-5 static marketing pages)",
        "Standard (With DB): R3,200 ZAR (Adds contact storage & simple forms)",
        "Top Tier (No DB): R3,500 ZAR (Premium animations & complex layouts)",
        "Top Tier (With DB): R4,300 ZAR (Adds custom content managers & user logs)",
        "100% Mobile responsive layout design",
        "Basic WCAG accessibility & SEO setup"
      ]
    },
    {
      icon: <Terminal size={40} style={{ color: 'var(--primary-glow)' }} />,
      title: "Web Application",
      range: "R5,000 – R5,500 ZAR",
      time: "14 – 21 Days",
      summary: "Highly interactive web portals designed for data management, client workflows, invoicing systems, or synced schedule panels.",
      deliverables: [
        "Small Data Scale: R5,000 ZAR (Structured document queries & workflows)",
        "Big Data Scale: R5,500 ZAR (Scalable records, logs & aggregations)",
        "Interactive Developer-Client Dashboard Portal",
        "Secure user authentication keys & permission controls",
        "Live consultation synchronizers (localStorage demo synced)",
        "Custom APIs & automated invoice ledgers"
      ]
    },
    {
      icon: <Smartphone size={40} style={{ color: 'var(--primary-glow)', filter: 'drop-shadow(0 0 8px rgba(0, 102, 255, 0.15))' }} />,
      title: "Mobile Application",
      range: "R6,000 – R8,000 ZAR",
      time: "21 – 30 Days",
      summary: "Native-feeling iOS and Android mobile app designed to put your business directly into customers' pockets.",
      deliverables: [
        "Mobile App (No DB): R6,000 ZAR (Information catalog & static profiles)",
        "Mobile App (With DB): R8,000 ZAR (Adds real-time cloud data & user accounts)",
        "Cross-platform React Native / Flutter architecture",
        "App Store & Google Play submission consultation",
        "Push notifications & message setups",
        "Interactive dashboard integrations"
      ]
    }
  ];

  return (
    <div className="services-container fade-in container section-padding">
      <div className="section-header">
        <span className="section-subtitle">Services & Scope</span>
        <h2>What We Build</h2>
        <p>Bespoke digital solutions with clear scopes, timelines, and outcomes. No mystery billing, no hidden fees.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '3rem' }}>
        {serviceList.map((s, idx) => (
          <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '12px', background: 'var(--bg-deep)', border: '1px solid var(--border-color)' }}>
                  {s.icon}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>ESTIMATED INVESTMENT</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>From {s.range.split('–')[0].trim()} +</p>
                </div>
              </div>

              <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{s.title}</h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{s.summary}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                <Clock size={16} style={{ color: 'var(--primary-glow)' }} /> Delivery Timeline: {s.time}
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '2.5rem' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Scope & Deliverables</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none' }}>
                  {s.deliverables.map((del, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0, marginTop: '0.2rem' }} />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => setActiveTab('pricing')} className="neon-glow-btn" style={{ flexGrow: 1, justifyContent: 'center' }}>
                Calculate Estimated Quote <ArrowRight size={16} />
              </button>
              <button onClick={() => setActiveTab('contact')} className="neon-outline-btn" style={{ flexGrow: 1, justifyContent: 'center' }}>
                Inquire Directly
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Service Standards */}
      <div className="glass-card" style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', border: '1px solid var(--border-color)' }}>
        <div>
          <h4 style={{ color: 'var(--primary-glow)', fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} /> Clean Hand-off
          </h4>
          <p style={{ fontSize: '0.875rem' }}>Complete design, code assets, domain setup, and cloud dashboard accesses are 100% yours. No proprietary platform code-lock.</p>
        </div>
        <div>
          <h4 style={{ color: 'var(--primary-glow)', fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} /> Post-Launch Training
          </h4>
          <p style={{ fontSize: '0.875rem' }}>Every launch includes custom pre-recorded video guides showing you exactly how to operate, edit, and audit your dashboard or website contents.</p>
        </div>
        <div>
          <h4 style={{ color: 'var(--primary-glow)', fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} /> Unlimited Support
          </h4>
          <p style={{ fontSize: '0.875rem' }}>Your initial 30 days are fully protected. Need small edits, layout adjustments, or code updates? We handle it immediately without charge.</p>
        </div>
      </div>
    </div>
  );
}
