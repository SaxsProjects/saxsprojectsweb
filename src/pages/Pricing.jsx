import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Calendar, Wallet } from 'lucide-react';
import {
  DEPOSIT_RATE,
  buildPackages,
  formatRange,
  formatZAR,
  packageMax,
  packageMin,
  studentServices,
  techServices,
} from '../config/pricing';
import { priceNote } from '../config/business';

const PACKAGE_ORDER = ['website', 'webapp', 'mobile'];

export default function Pricing({ setActiveTab, setPrefilledQuote }) {
  const [platform, setPlatform] = useState('website');
  const [optionKey, setOptionKey] = useState(Object.keys(buildPackages.website.options)[0]);

  const pkg = buildPackages[platform];
  const option = pkg.options[optionKey] || Object.values(pkg.options)[0];
  const deposit = Math.round(option.price * DEPOSIT_RATE);
  const balance = option.price - deposit;

  const choosePlatform = (key) => {
    setPlatform(key);
    setOptionKey(Object.keys(buildPackages[key].options)[0]);
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleApplyQuote = () => {
    setPrefilledQuote({
      type: pkg.name,
      pages: option.label,
      featureList: [option.detail],
      price: formatZAR(option.price),
      deposit,
      balance,
      timeline: `${option.days} days`,
    });
    setActiveTab('contact');
  };

  return (
    <div className="pricing-container fade-in container section-padding">
      <div className="section-header">
        <span className="section-subtitle">Transparent Pricing</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Clear prices, no surprises</h1>
        <p>
          Every project starts with a written quote. You pay 50% to start and 50% when you&apos;re happy and ready to launch.{' '}
          {priceNote()}
        </p>
      </div>

      {/* Package cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem', marginBottom: '5rem' }}>
        {PACKAGE_ORDER.map((key) => {
          const p = buildPackages[key];
          const featured = key === 'webapp';
          return (
            <div
              key={key}
              className="glass-card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: featured ? '2px solid var(--primary-glow)' : undefined }}
            >
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{p.name}</h2>
                <p style={{ fontSize: '0.88rem', marginBottom: '1.25rem' }}>{p.blurb}</p>
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>FROM</span>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{formatZAR(packageMin(key))}</div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--primary-neon)', fontWeight: 600, marginTop: '0.25rem' }}>
                    {formatZAR(packageMin(key) * DEPOSIT_RATE)} deposit to start · up to {formatZAR(packageMax(key))} · {p.days}
                  </p>
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '2rem' }}>
                  {Object.values(p.options).map((o) => (
                    <li key={o.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <Check size={16} style={{ color: 'var(--primary-glow)', flexShrink: 0, marginTop: '0.2rem' }} aria-hidden="true" />
                      <span>
                        <strong style={{ color: 'var(--text-primary)' }}>{o.label}: {formatZAR(o.price)}</strong>
                        <br />
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{o.detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={() => choosePlatform(key)} className={featured ? 'neon-glow-btn' : 'neon-outline-btn'} style={{ width: '100%', justifyContent: 'center' }}>
                Estimate a {p.name.toLowerCase()} <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Calculator */}
      <section id="calculator" className="glass-card" style={{ background: 'var(--bg-deep)', scrollMarginTop: '96px' }} aria-labelledby="calc-heading">
        <h2 id="calc-heading" style={{ fontSize: '1.6rem', marginBottom: '0.75rem', textAlign: 'center' }}>Quote calculator</h2>
        <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem', fontSize: '0.95rem' }}>
          Pick what you need to see the price, deposit and timeline. Send it to us and we&apos;ll confirm a fixed quote.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <label className="field">
              <span className="field-label">1. What are we building?</span>
              <select className="field-input" value={platform} onChange={(e) => { setPlatform(e.target.value); setOptionKey(Object.keys(buildPackages[e.target.value].options)[0]); }}>
                {PACKAGE_ORDER.map((key) => (
                  <option key={key} value={key}>
                    {buildPackages[key].name} ({formatRange(packageMin(key), packageMax(key))})
                  </option>
                ))}
              </select>
            </label>

            <fieldset style={{ border: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <legend className="field-label" style={{ marginBottom: '0.6rem' }}>2. Choose the option</legend>
              {Object.entries(pkg.options).map(([key, o]) => {
                const selected = key === optionKey;
                return (
                  <label
                    key={key}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'flex-start',
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      background: 'var(--bg-pure)',
                      border: selected ? '1.5px solid var(--primary-glow)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                    }}
                  >
                    <input type="radio" name="calc-option" value={key} checked={selected} onChange={() => setOptionKey(key)} style={{ marginTop: '0.25rem', accentColor: 'var(--primary-glow)' }} />
                    <span style={{ flex: 1 }}>
                      <span style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                        {o.label} <span>{formatZAR(o.price)}</span>
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{o.detail}</span>
                    </span>
                  </label>
                );
              })}
            </fieldset>
          </div>

          <div className="glass-card" style={{ background: 'var(--bg-pure)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignSelf: 'start' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>YOUR ESTIMATE</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary-glow)', lineHeight: 1 }} aria-live="polite">{formatZAR(option.price)}</p>

            <div style={{ background: 'rgba(0, 102, 255, 0.03)', padding: '1.1rem', borderRadius: '8px', border: '1px dashed rgba(0, 102, 255, 0.3)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary-neon)' }}>50% deposit to start</span>
                <strong style={{ color: 'var(--text-primary)' }}>{formatZAR(deposit)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 700 }}>50% balance before launch</span>
                <strong style={{ color: 'var(--text-primary)' }}>{formatZAR(balance)}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><Calendar size={15} style={{ color: 'var(--primary-glow)' }} aria-hidden="true" /> About {option.days} days</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}><Wallet size={15} style={{ color: 'var(--primary-glow)' }} aria-hidden="true" /> 30 days support</span>
            </div>

            <button onClick={handleApplyQuote} className="neon-glow-btn" style={{ justifyContent: 'center', width: '100%' }}>
              Send this estimate to us <ArrowRight size={16} aria-hidden="true" />
            </button>
            <p style={{ fontSize: '0.75rem' }}>
              Estimates are a guide. Your fixed price is confirmed in a written quote before any payment. See our <Link to="/terms" style={{ color: 'var(--primary-neon)', textDecoration: 'underline' }}>Terms</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Other services */}
      <section style={{ marginTop: '5rem' }} aria-labelledby="other-heading">
        <h2 id="other-heading" style={{ fontSize: '1.6rem', textAlign: 'center', marginBottom: '2rem' }}>Other services</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '2rem' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Tech services</h3>
            <table className="legal-table" style={{ margin: 0 }}>
              <tbody>
                {Object.values(techServices).map((s) => (
                  <tr key={s.name}>
                    <th scope="row">{s.name}</th>
                    <td>{formatRange(s.min, s.max)}<br /><span className="muted" style={{ fontSize: '0.8rem' }}>{s.time}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="glass-card">
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Learning support</h3>
            <table className="legal-table" style={{ margin: 0 }}>
              <tbody>
                {Object.values(studentServices).map((s) => (
                  <tr key={s.name}>
                    <th scope="row">{s.name}</th>
                    <td>From {formatZAR(s.from)} {s.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
