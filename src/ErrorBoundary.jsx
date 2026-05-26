import React from 'react'; // ErrorBoundary extends React.Component, so this is needed

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // Optionally send to monitoring here
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <h1 style={{ color: 'var(--primary-glow)' }}>Something went wrong</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{this.state.error && this.state.error.toString()}</p>
          <pre style={{ textAlign: 'left', maxWidth: '900px', margin: '1.5rem auto', background: 'var(--card-bg)', padding: '1rem', borderRadius: '8px' }}>{this.state.info && this.state.info.componentStack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
