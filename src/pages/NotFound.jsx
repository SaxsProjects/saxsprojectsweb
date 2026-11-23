import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container section-padding fade-in" style={{ textAlign: 'center', maxWidth: '640px' }}>
      <span className="section-subtitle">404</span>
      <h1 style={{ fontSize: '2.25rem', margin: '1rem 0' }}>We couldn&apos;t find that page</h1>
      <p style={{ marginBottom: '2rem' }}>The link may be old or mistyped. Here are some good places to start:</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="neon-glow-btn">Home <ArrowRight size={16} /></Link>
        <Link to="/tech-solutions" className="neon-outline-btn">Tech Solutions</Link>
        <Link to="/contact" className="neon-outline-btn">Contact us</Link>
      </div>
    </div>
  );
}
