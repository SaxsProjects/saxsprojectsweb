import React, { useState } from 'react';
import { Code, Eye, ExternalLink, Award, FileText, CheckCircle2 } from 'lucide-react';

export default function Portfolio() {
  const [activeTabMap, setActiveTabMap] = useState({
    brewlocal: 'demo', // 'demo' or 'code'
    fitflow: 'demo'
  });

  // Demo States
  const [stamps, setStamps] = useState(3);
  const [classesBooked, setClassesBooked] = useState([]);
  const [memberRegistered, setMemberRegistered] = useState(false);

  const toggleTab = (project, tab) => {
    setActiveTabMap(prev => ({
      ...prev,
      [project]: tab
    }));
  };

  // BrewLocal Actions
  const addStamp = () => {
    if (stamps < 5) {
      setStamps(prev => prev + 1);
    } else {
      alert("🎉 Loyalty reward unlocked! Your next espresso is 100% Free!");
      setStamps(0);
    }
  };

  // FitFlow Booking Actions
  const classesList = [
    { id: 1, name: "Sunrise Vinyasa Yoga", time: "07:30 AM", spots: 4 },
    { id: 2, name: "HIIT Endurance Circuit", time: "12:00 PM", spots: 2 },
    { id: 3, name: "Power Barbell Strength", time: "06:30 PM", spots: 0 }
  ];

  const handleBook = (cls) => {
    if (cls.spots === 0) return;
    if (classesBooked.includes(cls.id)) {
      setClassesBooked(prev => prev.filter(id => id !== cls.id));
    } else {
      setClassesBooked(prev => [...prev, cls.id]);
    }
  };

  // Code Snippets Mockup
  const codeSnippets = {
    brewlocal: `// BrewLocal Loyalty Engine
import React, { useState } from 'react';

export default function LoyaltyEngine({ customerId }) {
  const [stamps, setStamps] = useState(0);
  const STAMP_LIMIT = 6;

  const handleOrder = async (item) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ customerId, item })
    });
    if (res.ok) {
      setStamps(prev => (prev + 1) % STAMP_LIMIT);
    }
  };

  return (
    <div className="loyalty-hub">
      <h3>Loyalty Stamp Hub</h3>
      <div className="grid">
        {[...Array(STAMP_LIMIT)].map((_, i) => (
          <div key={i} className={i < stamps ? 'stamp active' : 'stamp'} />
        ))}
      </div>
      {stamps === 0 && <p className="success">Reward Unlocked!</p>}
    </div>
  );
}`,
    fitflow: `// FitFlow Class Booking Hook
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useClassScheduler(userId) {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*, gym_classes(*)')
      .eq('user_id', userId);
    setBookings(data || []);
  };

  const bookClass = async (classId) => {
    const { error } = await supabase
      .from('bookings')
      .insert({ user_id: userId, class_id: classId });
    if (!error) fetchBookings();
  };

  return { bookings, bookClass };
}`
  };

  return (
    <div className="portfolio-container fade-in container section-padding">
      <div className="section-header">
        <span className="section-subtitle">Case Studies & Concepts</span>
        <h2>High-Impact Engineering</h2>
        <p>Explore some of our custom-coded concept projects. Click through the "Live Demo" tab to interact with fully functional prototypes, or check the "Code snippet" tab to inspect the codebase structure.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
        
        {/* Project 1: BrewLocal Coffee */}
        <div className="glass-card" style={{ padding: '3rem', borderLeft: '4px solid var(--primary-neon)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="tech-badge" style={{ marginBottom: '1rem' }}>Active Loyalty Prototype</span>
                <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>BrewLocal Coffee</h3>
                <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
                  A custom-engineered mobile loyalty application and ordering portal designed for local coffee shops to bypass high third-party app commission charges.
                </p>
                <div className="glass-card" style={{ background: 'rgba(0, 102, 255, 0.02)', padding: '1rem 1.5rem', marginBottom: '2rem', border: '1px dashed var(--border-color)' }}>
                  <p style={{ fontWeight: 700, color: 'var(--primary-glow)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={16} /> CLIENT OUTCOME
                  </p>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.25rem' }}>
                    Increased repeat customer visits by 30% and direct local app sales by 22% in the first 90 days.
                  </p>
                </div>
              </div>

              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>TECH STACK</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="tech-badge">React</span>
                  <span className="tech-badge">Node.js</span>
                  <span className="tech-badge">MongoDB</span>
                  <span className="tech-badge">Express</span>
                  <span className="tech-badge">Stripe API</span>
                </div>
              </div>
            </div>

            {/* Interactive Panel */}
            <div className="glass-card" style={{ background: 'var(--bg-deep)', padding: '1.5rem', borderRadius: '12px' }}>
              {/* Tab Selector */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem', gap: '1rem' }}>
                <button 
                  onClick={() => toggleTab('brewlocal', 'demo')} 
                  style={{ background: activeTabMap.brewlocal === 'demo' ? 'rgba(0, 102, 255, 0.08)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: activeTabMap.brewlocal === 'demo' ? 'var(--primary-glow)' : 'var(--text-secondary)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600 }}
                >
                  <Eye size={14} /> Live Interactive Demo
                </button>
                <button 
                  onClick={() => toggleTab('brewlocal', 'code')} 
                  style={{ background: activeTabMap.brewlocal === 'code' ? 'rgba(0, 102, 255, 0.08)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: activeTabMap.brewlocal === 'code' ? 'var(--primary-glow)' : 'var(--text-secondary)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600 }}
                >
                  <Code size={14} /> GitHub Code Snippet
                </button>
              </div>

              {/* Tab Contents */}
              {activeTabMap.brewlocal === 'demo' ? (
                <div className="fade-in" style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>SIMULATOR: Click "Buy Coffee" to earn loyalty stamps in real-time!</p>
                  
                  <div style={{ background: 'var(--bg-pure)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', maxWidth: '280px', margin: '0 auto', boxShadow: 'var(--card-shadow)' }}>
                    <p style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '1rem' }}>☕ BREWLOCAL LOYALTY</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', margin: '1.5rem 0' }}>
                      {[...Array(6)].map((_, i) => (
                        <div 
                          key={i} 
                          style={{ 
                            height: '50px', 
                            borderRadius: '50%', 
                            border: i < stamps ? '2px solid var(--primary-glow)' : '2px dashed var(--border-color)', 
                            background: i < stamps ? 'rgba(0, 102, 255, 0.08)' : 'transparent',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontWeight: 800,
                            color: i < stamps ? 'var(--primary-glow)' : 'var(--text-muted)',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease',
                            boxShadow: i < stamps ? '0 0 10px rgba(0, 102, 255, 0.15)' : 'none'
                          }}
                        >
                          {i < stamps ? '☕' : i + 1}
                        </div>
                      ))}
                    </div>

                    <p style={{ fontSize: '0.8rem', marginBottom: '1rem', color: stamps === 5 ? 'var(--primary-glow)' : 'var(--text-secondary)' }}>
                      {stamps === 5 ? "⚠️ 1 STAMP LEFT FOR FREE ESPRESSO!" : `${6 - stamps} stamps left to earn free reward.`}
                    </p>

                    <button onClick={addStamp} className="neon-glow-btn" style={{ fontSize: '0.8rem', padding: '0.6rem 1.2rem', width: '100%', justifyContent: 'center' }}>
                      Buy Local Coffee ($4.50)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="fade-in">
                  <pre style={{ margin: 0, padding: '1rem', background: 'var(--bg-dark)', borderRadius: '8px', overflowX: 'auto', textAlign: 'left', border: '1px solid var(--border-color)' }}>
                    <code style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                      {codeSnippets.brewlocal}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Project 2: FitFlow Gyms */}
        <div className="glass-card" style={{ padding: '3rem', borderLeft: '4px solid var(--secondary-neon)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="tech-badge" style={{ background: 'rgba(255, 0, 122, 0.08)', border: '1px solid rgba(255, 0, 122, 0.2)', color: 'var(--secondary-neon)', marginBottom: '1rem' }}>Active Scheduler Prototype</span>
                <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>FitFlow Gyms</h3>
                <p style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>
                  A high-fidelity custom client booking portal designed for boutique gym spaces, fitness clubs, and yoga spaces, automating client management and checkout flows.
                </p>
                <div className="glass-card" style={{ background: 'rgba(255, 0, 122, 0.02)', padding: '1rem 1.5rem', marginBottom: '2rem', border: '1px dashed var(--border-color)' }}>
                  <p style={{ fontWeight: 700, color: '#FF007A', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Award size={16} /> CLIENT OUTCOME
                  </p>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.25rem' }}>
                    Reduced administrative billing hours by 45% and increased total group bookings by 18% inside 60 days.
                  </p>
                </div>
              </div>

              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>TECH STACK</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="tech-badge" style={{ background: 'rgba(255, 0, 122, 0.05)', color: '#FF79C6', border: '1px solid rgba(255, 0, 122, 0.15)' }}>Next.js</span>
                  <span className="tech-badge" style={{ background: 'rgba(255, 0, 122, 0.05)', color: '#FF79C6', border: '1px solid rgba(255, 0, 122, 0.15)' }}>Supabase DB</span>
                  <span className="tech-badge" style={{ background: 'rgba(255, 0, 122, 0.05)', color: '#FF79C6', border: '1px solid rgba(255, 0, 122, 0.15)' }}>Stripe Hooks</span>
                  <span className="tech-badge" style={{ background: 'rgba(255, 0, 122, 0.05)', color: '#FF79C6', border: '1px solid rgba(255, 0, 122, 0.15)' }}>Tailwind CSS</span>
                </div>
              </div>
            </div>

            {/* Interactive Panel */}
            <div className="glass-card" style={{ background: 'var(--bg-deep)', padding: '1.5rem', borderRadius: '12px' }}>
              {/* Tab Selector */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem', gap: '1rem' }}>
                <button 
                  onClick={() => toggleTab('fitflow', 'demo')} 
                  style={{ background: activeTabMap.fitflow === 'demo' ? 'rgba(255, 0, 122, 0.08)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: activeTabMap.fitflow === 'demo' ? '#FF007A' : 'var(--text-secondary)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600 }}
                >
                  <Eye size={14} /> Live Interactive Demo
                </button>
                <button 
                  onClick={() => toggleTab('fitflow', 'code')} 
                  style={{ background: activeTabMap.fitflow === 'code' ? 'rgba(255, 0, 122, 0.08)' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: activeTabMap.fitflow === 'code' ? '#FF007A' : 'var(--text-secondary)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600 }}
                >
                  <Code size={14} /> GitHub Code Snippet
                </button>
              </div>

              {/* Tab Contents */}
              {activeTabMap.fitflow === 'demo' ? (
                <div className="fade-in" style={{ padding: '0.5rem 0' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'center' }}>SIMULATOR: Click to book slots into daily studio sessions!</p>
                  
                  <div style={{ background: 'var(--bg-pure)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', maxWidth: '360px', margin: '0 auto', boxShadow: 'var(--card-shadow)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <p style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.9rem' }}>🧘 FITFLOW STUDIO</p>
                      <span style={{ fontSize: '0.75rem', color: '#FF007A', fontWeight: 600 }}>TODAY'S CLASSES</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      {classesList.map((cls) => {
                        const isBooked = classesBooked.includes(cls.id);
                        const isFull = cls.spots === 0;
                        return (
                          <div 
                            key={cls.id} 
                            style={{ 
                              background: isBooked ? 'rgba(255, 0, 122, 0.05)' : 'var(--bg-deep)', 
                              border: isBooked ? '1px solid #FF007A' : '1px solid var(--border-color)', 
                              borderRadius: '8px', 
                              padding: '0.75rem 1rem',
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              transition: 'all 0.2s'
                            }}
                          >
                            <div style={{ textAlign: 'left' }}>
                              <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600 }}>{cls.name}</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cls.time} • {isFull ? '0 spots left' : `${cls.spots - (isBooked ? 1 : 0)} spots left`}</p>
                            </div>
                            
                            <button 
                              onClick={() => handleBook(cls)}
                              disabled={isFull && !isBooked}
                              style={{
                                background: isBooked ? '#FF007A' : 'transparent',
                                border: isBooked ? 'none' : isFull ? '1px solid transparent' : '1px solid #FF007A',
                                color: isBooked ? '#FFF' : isFull ? 'var(--text-muted)' : '#FF007A',
                                borderRadius: '4px',
                                padding: '0.3rem 0.6rem',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: isFull && !isBooked ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              {isBooked ? 'Cancel' : isFull ? 'Full' : 'Book'}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {classesBooked.length > 0 && (
                      <div className="fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FF007A', fontSize: '0.8rem', fontWeight: 600, background: 'rgba(255,0,122,0.05)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(255,0,122,0.1)' }}>
                        <CheckCircle2 size={14} /> You have booked {classesBooked.length} classes today!
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="fade-in">
                  <pre style={{ margin: 0, padding: '1rem', background: 'var(--bg-dark)', borderRadius: '8px', overflowX: 'auto', textAlign: 'left', border: '1px solid var(--border-color)' }}>
                    <code style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                      {codeSnippets.fitflow}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
