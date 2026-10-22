import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
          <h2 className="text-3xl font-bold text-red-500 mb-2">Oops!</h2>
          <p className="text-slate-400 mb-6">Something went wrong.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}