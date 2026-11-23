import React from 'react'; // ErrorBoundary extends React.Component, so this is needed
import { business, whatsappLink } from './config/business';

// Shows visitors a friendly message (never a stack trace) if a page crashes.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '6rem 1.5rem', textAlign: 'center', maxWidth: '560px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Sorry, something went wrong on this page</h1>
          <p style={{ marginBottom: '2rem' }}>
            Please reload, or reach us directly and we&apos;ll help right away.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/" className="neon-glow-btn">Back to home</a>
            <a href={whatsappLink()} className="neon-outline-btn" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
            or email <a href={`mailto:${business.contact.email}`} style={{ color: 'var(--primary-neon)' }}>{business.contact.email}</a>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
