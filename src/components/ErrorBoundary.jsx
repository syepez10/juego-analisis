import { Component } from 'react';
import { I } from './icons/Icon';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: 40, textAlign: 'center' }}>
          <div style={{ color: 'var(--accent)', marginBottom: 16 }}>{I('alert-triangle', 48, 'var(--accent)')}</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 8 }}>Algo salió mal</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 20, maxWidth: 400, lineHeight: 1.5 }}>
            Ha ocurrido un error inesperado. Recarga la página para continuar.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", cursor: 'pointer' }}
          >
            Recargar página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
