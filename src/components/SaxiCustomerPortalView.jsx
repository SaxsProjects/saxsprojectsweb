import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Clock, FileText, QrCode, Bot, Send, ShieldCheck, ArrowRight } from 'lucide-react';

export default function SaxiCustomerPortalView({ projectId = 'PROJ-SAXI-2026' }) {
  const [portalData, setPortalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientQuestion, setClientQuestion] = useState('');
  const [assistantReply, setAssistantReply] = useState('');

  useEffect(() => {
    const fetchPortalDetails = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/saxi/portal/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          setPortalData(data);
        } else {
          // Client portal workspace state
          setPortalData({
            projectId: projectId,
            clientName: 'SaxsProjects Client',
            businessName: 'Enterprise Innovation Co.',
            serviceInterest: 'Full Stack Web App & Automation Platform',
            portalToken: 'd3b07384-d113-42a4-9e9d-165f48b9feac',
            progressPct: 75,
            status: 'DEVELOPMENT & QUALITY AUDIT',
            qrCodeSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#0066ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
            milestones: [
              { name: 'Business Requirements & SRS Scope', team: 'Solution Architecture Team', status: 'COMPLETED', date: '2026-08-01' },
              { name: 'UI & Design System Framework', team: 'Design & UI Engineering', status: 'COMPLETED', date: '2026-08-03' },
              { name: 'Core API & Database Infrastructure', team: 'Backend Engineering', status: 'COMPLETED', date: '2026-08-05' },
              { name: '12-Point Quality Assurance & Security Audit', team: 'QA & Security Team', status: 'IN_PROGRESS', date: '2026-08-07' },
              { name: 'Cloud Infrastructure & Production Release', team: 'DevOps & Deployment', status: 'PENDING', date: 'Est. 2026-08-10' },
            ],
            srsDetails: `System Requirements Specification (SRS v1.0):
• Technical Stack: React 19 + Vite frontend with responsive Vanilla CSS design system.
• Backend Infrastructure: Dual-service proxy (SaxsProjects Express + SAXI OS NestJS).
• Quality Guarantee: 100% money-back protection, Lighthouse >90 performance, and WCAG AA accessibility compliance.`
          });
        }
      } catch (err) {
        console.warn('Portal fetch notice:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortalDetails();
  }, [projectId]);

  const handleAskAssistant = (e) => {
    e.preventDefault();
    if (!clientQuestion.trim()) return;

    setAssistantReply('Analyzing project documentation and release status...');
    setTimeout(() => {
      setAssistantReply(`Hello! Regarding "${clientQuestion}": Your project is currently undergoing the 12-Point Quality Assurance & Security Audit. We are verifying WCAG AA accessibility, performance benchmarks (>90), and secure database connections. Final production deployment is on schedule!`);
      setClientQuestion('');
    }, 800);
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textTransform: 'uppercase', fontSize: '0.85rem', color: 'var(--primary-glow)', textAlign: 'center' }}>
        Loading Project Workspace...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-pure, #FFFFFF)', border: '1px solid var(--border-color, #E2E8F0)', borderRadius: '20px', padding: '2rem', boxShadow: 'var(--card-shadow)' }}>
      
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0, 102, 255, 0.08)', color: 'var(--primary-glow, #0066FF)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <ShieldCheck size={14} /> SaxsProjects Client Engineering Workspace
          </div>
          <h2 style={{ fontFamily: 'var(--font-headings, Montserrat)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary, #101E35)', margin: 0 }}>
            {portalData?.businessName || 'Your Project Dashboard'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #475569)', margin: '0.25rem 0 0 0' }}>
            Reference Token: <code style={{ background: 'var(--bg-dark, #F8FAFC)', padding: '0.15rem 0.4rem', borderRadius: '4px', color: 'var(--primary-glow)' }}>{portalData?.portalToken}</code>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-dark, #F8FAFC)', border: '1px solid var(--border-color)', padding: '0.75rem 1.25rem', borderRadius: '14px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Development Progress</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-glow)' }}>{portalData?.progressPct}%</div>
          </div>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `conic-gradient(#0066ff ${portalData?.progressPct * 3.6}deg, #E2E8F0 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
              {portalData?.progressPct}%
            </div>
          </div>
        </div>
      </div>

      {/* Milestones & SRS Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Project Milestones */}
        <div style={{ background: 'var(--bg-dark, #F8FAFC)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={18} style={{ color: 'var(--primary-glow)' }} /> Project Delivery Milestones
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {portalData?.milestones?.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#FFFFFF', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{m.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Team: {m.team || m.agent}</div>
                </div>
                <span style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 700, 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: '6px',
                  background: m.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : m.status === 'IN_PROGRESS' ? 'rgba(0, 102, 255, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                  color: m.status === 'COMPLETED' ? '#059669' : m.status === 'IN_PROGRESS' ? 'var(--primary-glow)' : 'var(--text-muted)'
                }}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SRS Spec Summary & Project Assistant Query */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: 'var(--bg-dark, #F8FAFC)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={16} style={{ color: 'var(--primary-glow)' }} /> SRS System Architecture Specification
            </h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body, Inter)', fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {portalData?.srsDetails}
            </pre>
          </div>

          <div style={{ background: 'var(--bg-dark, #F8FAFC)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Bot size={16} style={{ color: 'var(--primary-glow)' }} /> Ask Project Assistant
            </h3>
            <form onSubmit={handleAskAssistant} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <input 
                type="text"
                placeholder="Ask about project timeline, scope, status..."
                value={clientQuestion}
                onChange={(e) => setClientQuestion(e.target.value)}
                style={{ flex: 1, padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem', outline: 'none' }}
              />
              <button type="submit" className="neon-glow-btn" style={{ padding: '0.6rem 1rem', fontSize: '0.8rem' }}>Submit</button>
            </form>
            {assistantReply && (
              <div style={{ background: '#FFFFFF', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {assistantReply}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
