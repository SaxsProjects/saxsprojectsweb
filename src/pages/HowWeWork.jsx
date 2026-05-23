import React, { useState, useEffect } from 'react';
import { CalendarRange, Sparkles, LayoutGrid, Cpu, Rocket, HelpCircle, CheckCircle, Zap } from 'lucide-react';

export default function HowWeWork() {
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const totalScroll = documentHeight - windowHeight;
      const progress = (scrollTop / totalScroll) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-animate active step based on scroll
  useEffect(() => {
    const stepIndex = Math.min(Math.floor((scrollProgress / 100) * steps.length), steps.length - 1);
    setActiveStep(stepIndex);
  }, [scrollProgress]);

  const steps = [
    {
      num: "01",
      icon: <CalendarRange size={24} style={{ color: 'var(--primary-glow)' }} />,
      title: "Discovery & Strategy",
      duration: "Days 1–3",
      description: "We host an introductory 15-minute consultation to fully map out your goals, target clients, preferred visual style, and needed third-party integrations (CRM, Booking, E-commerce).",
      deliverable: "Custom scope assessment document & fixed project estimate."
    },
    {
      num: "02",
      icon: <Sparkles size={24} style={{ color: 'var(--secondary-glow)' }} />,
      title: "Proposal & Architecture",
      duration: "Days 3–5",
      description: "We lock down fixed, transparent milestones, delivery dates, and clean guarantees. We also outline the technical setup (DB schema, auth rules, visual layout plans).",
      deliverable: "Standardized agreement with 100% money-back structural guarantee."
    },
    {
      num: "03",
      icon: <LayoutGrid size={24} style={{ color: 'var(--primary-glow)' }} />,
      title: "High-Fidelity Design",
      duration: "Week 2",
      description: "We construct custom graphic layouts showcasing exact color combinations, glassmorphism card aesthetics, tech icons, and headings. You verify before we write code.",
      deliverable: "Responsive Figma prototype links for feedback loops."
    },
    {
      num: "04",
      icon: <Cpu size={24} style={{ color: 'var(--secondary-glow)' }} />,
      title: "Clean Code Development",
      duration: "Weeks 3–4",
      description: "Our core engineering phase. We code the designs into a high-performance framework (like React or Vite), write clean responsive Vanilla CSS, integrate databases, and configure SEO schemas.",
      deliverable: "Active staging URL updated daily to inspect progress."
    },
    {
      num: "05",
      icon: <Rocket size={24} style={{ color: 'var(--primary-glow)', filter: 'drop-shadow(0 0 8px rgba(0, 102, 255, 0.2))' }} />,
      title: "Launch & Training",
      duration: "Launch Day",
      description: "We direct your custom domains, deploy compiled codebases onto high-performance CDN architectures, configure SSL/security compliance, and run SEO submission hooks.",
      deliverable: "Live website launch + custom pre-recorded dashboard training videos."
    },
    {
      num: "06",
      icon: <CheckCircle size={24} style={{ color: 'var(--secondary-glow)' }} />,
      title: "30-Day Support Hub",
      duration: "Ongoing",
      description: "After launch, we do not disappear. You get 30 days of complete support. Need text adjustments, button changes, or simple package audits? We handle them immediately.",
      deliverable: "Dedicated email & WhatsApp chat line for rapid resolution."
    }
  ];

  return (
    <div className="howwework-container fade-in container section-padding">
      <div className="section-header">
        <span className="section-subtitle">Execution Pipeline</span>
        <h2>How We Work</h2>
        <p>A structured, high-transparency process from initial brief to post-launch optimization. You remain updated at every checkpoint.</p>
      </div>

      {/* Live Progress Visualization */}
      <div className="glass-card" style={{ marginBottom: '3rem', padding: '2rem', background: 'rgba(0, 102, 255, 0.03)', border: '1px solid var(--primary-glow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Page Scroll Progress</p>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-glow)', margin: 0 }}>{Math.round(scrollProgress)}%</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Zap size={16} style={{ color: 'var(--primary-glow)' }} />
            Current Step: {activeStep + 1} / {steps.length}
          </div>
        </div>

        {/* Progress bar with animated fill */}
        <div style={{ position: 'relative', height: '8px', background: 'var(--bg-deep)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <div 
            style={{ 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--primary-glow), var(--primary-neon))',
              width: `${scrollProgress}%`,
              transition: 'width 0.1s linear',
              boxShadow: '0 0 20px rgba(0, 102, 255, 0.3)'
            }}
          ></div>
        </div>

        {/* Step indicators - clickable */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: '0.5rem', marginTop: '1.25rem' }}>
          {steps.map((s, idx) => (
            <div 
              key={idx}
              onClick={() => window.scrollTo({ top: (idx / steps.length) * (document.documentElement.scrollHeight - window.innerHeight), behavior: 'smooth' })}
              style={{ 
                padding: '0.5rem', 
                borderRadius: '6px', 
                background: idx <= activeStep ? 'rgba(0, 102, 255, 0.1)' : 'var(--bg-deep)',
                border: idx <= activeStep ? '1px solid var(--primary-glow)' : '1px solid var(--border-color)',
                cursor: 'pointer',
                textAlign: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: idx <= activeStep ? 'var(--primary-glow)' : 'var(--text-secondary)',
                transition: 'all 0.3s ease'
              }}
            >
              Step {s.num}
            </div>
          ))}
        </div>
      </div>

      {/* Main Timeline */}
      <div className="timeline">
        {steps.map((s, idx) => {
          const isLeft = idx % 2 === 0;
          const isActive = idx === activeStep;
          return (
            <div 
              key={idx} 
              className={`timeline-item ${isLeft ? 'left' : 'right'}`}
              style={{ opacity: idx <= activeStep ? 1 : 0.6, transition: 'opacity 0.3s ease' }}
            >
              <div 
                className="timeline-content"
                style={{
                  background: isActive ? 'rgba(0, 102, 255, 0.08)' : 'var(--bg-pure)',
                  border: isActive ? '1px solid var(--primary-glow)' : '1px solid var(--border-color)',
                  boxShadow: isActive ? '0 0 20px rgba(0, 102, 255, 0.15)' : 'none',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <span className="timeline-number" style={{ animation: isActive ? 'pulse 2s infinite' : 'none' }}>{s.num}</span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ 
                    padding: '0.5rem', 
                    borderRadius: '8px', 
                    background: isActive ? 'rgba(0, 102, 255, 0.15)' : 'rgba(0, 102, 255, 0.03)', 
                    border: isActive ? '1px solid var(--primary-glow)' : '1px solid var(--border-color)',
                    transition: 'all 0.3s ease'
                  }}>
                    {s.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{s.title}</h3>
                    <span className="tech-badge" style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', marginTop: '0.2rem', background: isActive ? 'rgba(0, 102, 255, 0.1)' : 'rgba(0, 102, 255, 0.05)', color: isActive ? 'var(--primary-glow)' : 'var(--text-muted)' }}>{s.duration}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{s.description}</p>
                
                <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-glow)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>KEY DELIVERABLE</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.15rem' }}>{s.deliverable}</p>
                </div>

                {idx <= activeStep && (
                  <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--primary-glow)', fontWeight: 600 }}>
                    <CheckCircle size={16} /> Completed
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* IT Student Badge */}
      <div style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0, 102, 255, 0.05)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <Sparkles size={20} style={{ color: 'var(--primary-glow)' }} />
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>Built by an IT Student</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: '0.15rem 0 0 0', fontWeight: 700 }}>Live timeline with scroll-based progression & interactive step indicators</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% {
            text-shadow: 0 0 0 rgba(0, 102, 255, 0.4);
          }
          50% {
            text-shadow: 0 0 10px rgba(0, 102, 255, 0.6);
          }
          100% {
            text-shadow: 0 0 0 rgba(0, 102, 255, 0.4);
          }
        }
      `}</style>
    </div>
  );
}
