import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>
          <h2>System Exception Encountered</h2>
          <p style={{ marginTop: '1rem', color: '#94a3b8' }}>
            {this.state.error?.toString() || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
            style={{ marginTop: '1.5rem' }}
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
