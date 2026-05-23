import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, ShieldCheck, Calendar, Rocket } from 'lucide-react';

export default function Pricing({ setActiveTab, setPrefilledQuote }) {
  // Calculator States
  const [platformType, setPlatformType] = useState('website'); // 'website', 'webapp', 'mobile'
  const [webTier, setWebTier] = useState('standard');          // 'standard', 'top'
  const [hasDatabase, setHasDatabase] = useState(false);
  const [dataScale, setDataScale] = useState('small');         // 'small', 'big'

  const [estCost, setEstCost] = useState(2800);
  const [estDays, setEstDays] = useState(10);

  // Recalculate whenever selections change
  useEffect(() => {
    let cost = 0;
    let days = 10;

    if (platformType === 'website') {
      if (webTier === 'standard') {
        cost = hasDatabase ? 3400 : 2800;
        days = hasDatabase ? 14 : 10;
      } else if (webTier === 'top') {
        cost = hasDatabase ? 4400 : 3800;
        days = hasDatabase ? 20 : 16;
      }
    } else if (platformType === 'webapp') {
      cost = dataScale === 'small' ? 5000 : 5500;
      days = dataScale === 'small' ? 21 : 28;
    } else if (platformType === 'mobile') {
      cost = hasDatabase ? 8600 : 6000;
      days = hasDatabase ? 30 : 21;
    }

    setEstCost(cost);
    setEstDays(days);
  }, [platformType, webTier, hasDatabase, dataScale]);

  const handleApplyQuote = () => {
    let detailsLabel = "";
    if (platformType === 'website') {
      detailsLabel = `${webTier === 'standard' ? 'Standard Tier' : 'Top Tier'} Website (${hasDatabase ? 'With DB' : 'No DB'})`;
    } else if (platformType === 'webapp') {
      detailsLabel = `Web App (${dataScale === 'small' ? 'Small Data Scale' : 'Big Data Scale'})`;
    } else if (platformType === 'mobile') {
      detailsLabel = `Mobile App (${hasDatabase ? 'With DB' : 'No DB'})`;
    }

    const config = {
      type: platformType === 'website' ? 'Small Business Website' : platformType === 'webapp' ? 'Web Application' : 'Mobile Application',
      pages: detailsLabel,
      featureList: [
        platformType === 'website' && hasDatabase ? 'SQLite/MongoDB Database' : null,
        platformType === 'website' && webTier === 'top' ? 'Top Tier Premium Assets' : null,
        platformType === 'webapp' ? `Node/Express Backend (${dataScale === 'small' ? 'Small Data' : 'Big Data'})` : null,
        platformType === 'mobile' ? `React Native / Flutter Framework (${hasDatabase ? 'Cloud DB' : 'Local Only'})` : null,
        'SEO optimization & schema config'
      ].filter(Boolean),
      price: `R${estCost} ZAR`,
      deposit: estCost * 0.5,
      balance: estCost * 0.5,
      timeline: `${estDays} Days`
    };
    
    // Save to shared parent state so Contact page can ingest it
    setPrefilledQuote(config);
    
    // Switch to contact tab
    setActiveTab('contact');
  };

  return (
    <div className="pricing-container fade-in container section-padding">
      <div className="section-header">
        <span className="section-subtitle">Flexible Investments</span>
        <h2>Transparent Pricing</h2>
        <p>Choose an established package or construct a custom-tailored configuration in South African Rand (ZAR) using our real-time project builder.</p>
      </div>

      {/* Package Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
        
        {/* Tier 1 */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span className="tech-badge" style={{ marginBottom: '1rem' }}>Standard Web</span>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Small Business Web</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>For local agencies, retailers, and static business listings.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>R2,800</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ZAR Base</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--primary-glow)', fontWeight: 600 }}>R1,400 deposit to start • Up to R4,400 for top-tier with DB</p>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0 }} /> Standard No DB: R2,800 ZAR</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0 }} /> Standard With DB: R3,400 ZAR (+R600)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0 }} /> Top Tier No DB: R3,800 ZAR (+R1,000)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0 }} /> Top Tier With DB: R4,400 ZAR (+R1,600)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0 }} /> 100% SEO Schema & Meta Setup</li>
            </ul>
          </div>

          <button onClick={() => { setPlatformType('website'); setWebTier('standard'); setHasDatabase(false); }} className="neon-outline-btn" style={{ width: '100%', justifyContent: 'center' }}>
            Select Website Calculator
          </button>
        </div>

        {/* Tier 2 */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '2px solid var(--primary-glow)', boxShadow: 'var(--card-shadow-hover)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="tech-badge" style={{ background: 'rgba(0, 102, 255, 0.1)', color: 'var(--primary-glow)' }}>Core Stack</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-glow)', fontWeight: 700 }}>POPULAR</span>
            </div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Web Application</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>For automated scheduling calendars, customer dashboards, and custom databases.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>R5,000</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ZAR Base</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--primary-glow)', fontWeight: 600 }}>R2,500 deposit to start • Up to R5,500 for big data</p>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0 }} /> Small Data Scale: R5,000 ZAR</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0 }} /> Big Data Scale: R5,500 ZAR</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0 }} /> Interactive Client Tracking Portal</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0 }} /> Secure client login credentials</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0 }} /> Live messaging & milestone logs</li>
            </ul>
          </div>

          <button onClick={() => { setPlatformType('webapp'); setDataScale('small'); }} className="neon-glow-btn" style={{ width: '100%', justifyContent: 'center' }}>
            Select Web App Calculator <ArrowRight size={16} />
          </button>
        </div>

        {/* Tier 3 */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span className="tech-badge" style={{ background: 'rgba(16, 30, 53, 0.08)', border: '1px solid rgba(16,30,53,0.2)', color: 'var(--secondary-glow)', marginBottom: '1rem' }}>Bespoke Mobile</span>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Mobile Application</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>For iOS and Android custom apps built with React Native / Flutter.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>R6,000</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ZAR Base</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--primary-glow)', fontWeight: 600 }}>R3,000 deposit to start • Up to R8,600 with Cloud DB (+R600)</p>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0 }} /> Mobile App (No DB): R6,000 ZAR</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0 }} /> Mobile App (With DB): R8,600 ZAR</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0 }} /> Cross-platform compilation UI</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0 }} /> Secure customer profile logs</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0 }} /> Push notifications consultation</li>
            </ul>
          </div>

          <button onClick={() => { setPlatformType('mobile'); setHasDatabase(false); }} className="neon-outline-btn" style={{ width: '100%', justifyContent: 'center' }}>
            Select Mobile Calculator
          </button>
        </div>

      </div>

      {/* Quote Calculator */}
      <section className="glass-card" style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-color)' }}>
        <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', textAlign: 'center' }}>⚡ Dynamic ZAR Project Calculator</h3>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem', fontSize: '0.95rem' }}>
          Customize your requirements below to instantly generate the project cost, required development deposit, and estimated timelines.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Step 1: Select Platform Type */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-glow)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                1. Select Core Solution Type
              </label>
              <select 
                value={platformType} 
                onChange={(e) => setPlatformType(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-pure)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.8rem 1rem', borderRadius: '8px', outline: 'none', fontSize: '0.9rem', fontWeight: 600 }}
              >
                <option value="website">Small Business Website (R2,800 - R4,300)</option>
                <option value="webapp">Custom Web Application (R5,000 - R5,500)</option>
                <option value="mobile">Custom Mobile Application (R6,000 - R8,000)</option>
              </select>
            </div>

            {/* Step 2: Custom Toggles Based on Solution Type */}
            <div style={{ background: 'var(--bg-pure)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-glow)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                2. Configure Requirements
              </label>

              {platformType === 'website' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Web Tier Selector */}
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Website Tier:</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => setWebTier('standard')}
                        style={{ flex: 1, background: webTier === 'standard' ? 'rgba(0, 102, 255, 0.08)' : 'var(--bg-deep)', border: webTier === 'standard' ? '1.5px solid var(--primary-glow)' : '1px solid var(--border-color)', color: webTier === 'standard' ? 'var(--primary-glow)' : 'var(--text-primary)', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                      >
                        Standard Tier
                      </button>
                      <button
                        onClick={() => setWebTier('top')}
                        style={{ flex: 1, background: webTier === 'top' ? 'rgba(0, 102, 255, 0.08)' : 'var(--bg-deep)', border: webTier === 'top' ? '1.5px solid var(--primary-glow)' : '1px solid var(--border-color)', color: webTier === 'top' ? 'var(--primary-glow)' : 'var(--text-primary)', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                      >
                        Top Tier (+R1,000)
                      </button>
                    </div>
                  </div>

                  {/* Database Toggle */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                    <input 
                      type="checkbox" 
                      checked={hasDatabase} 
                      onChange={() => setHasDatabase(!hasDatabase)} 
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary-glow)' }} 
                    />
                    <div>
                      <span style={{ fontWeight: 600, display: 'block' }}>Include Structured Database (+R600)</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>For user accounts, blogging, and contact logs</span>
                    </div>
                  </label>
                </div>
              )}

              {platformType === 'webapp' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.25rem', fontWeight: 600 }}>Data Scale Operations:</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setDataScale('small')}
                      style={{ flex: 1, background: dataScale === 'small' ? 'rgba(0, 102, 255, 0.08)' : 'var(--bg-deep)', border: dataScale === 'small' ? '1.5px solid var(--primary-glow)' : '1px solid var(--border-color)', color: dataScale === 'small' ? 'var(--primary-glow)' : 'var(--text-primary)', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      Small Data Scale (R5,000)
                    </button>
                    <button
                      onClick={() => setDataScale('big')}
                      style={{ flex: 1, background: dataScale === 'big' ? 'rgba(0, 102, 255, 0.08)' : 'var(--bg-deep)', border: dataScale === 'big' ? '1.5px solid var(--primary-glow)' : '1px solid var(--border-color)', color: dataScale === 'big' ? 'var(--primary-glow)' : 'var(--text-primary)', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      Big Data Scale (+R500)
                    </button>
                  </div>
                </div>
              )}

              {platformType === 'mobile' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Database Toggle */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={hasDatabase} 
                      onChange={() => setHasDatabase(!hasDatabase)} 
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary-glow)' }} 
                    />
                    <div>
                      <span style={{ fontWeight: 600, display: 'block' }}>Real-time Database Sync (+R600)</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Enables profile syncing, chat, and cloud operations</span>
                    </div>
                  </label>
                </div>
              )}

            </div>
          </div>

          {/* Results Summary with Upfront Deposit breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="glass-card" style={{ background: 'var(--bg-pure)', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: 'var(--card-shadow)' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CALCULATED PROJECT QUOTE</p>
              
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem', color: 'var(--primary-glow)' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1 }}>R {estCost.toLocaleString()}</span>
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 700 }}>ZAR</span>
              </div>

              {/* Payment Split Layout */}
              <div style={{ background: 'rgba(0, 102, 255, 0.03)', padding: '1.25rem', borderRadius: '8px', border: '1px dashed rgba(0, 102, 255, 0.3)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary-glow)' }}>50% Upfront Deposit:</span>
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>R {(estCost * 0.5).toLocaleString()} ZAR</span>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '-0.25rem', marginBottom: '0.25rem' }}>Paid to initiate core coding and layout structures.</p>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>50% Balance on Delivery:</span>
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>R {(estCost * 0.5).toLocaleString()} ZAR</span>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '-0.25rem' }}>Paid after final review and before active production launch.</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '0.85rem 0' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>TIMELINE</p>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center', marginTop: '0.25rem' }}>
                    <Calendar size={14} style={{ color: 'var(--primary-glow)' }} /> {estDays} Days
                  </p>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>ENVIRONMENT</p>
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center', marginTop: '0.25rem' }}>
                    <Rocket size={14} style={{ color: 'var(--primary-glow)' }} /> Vercel / AWS
                  </p>
                </div>
              </div>

              <button onClick={handleApplyQuote} className="neon-glow-btn" style={{ justifyContent: 'center', width: '100%' }}>
                Apply Calculator To Contact Form <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
