import { Component } from 'react';

export default class AdventureErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() { return { failed: true }; }

  render() {
    if (this.state.failed) return <main id="main" className="recovery-screen" tabIndex={-1}>
      <h1>Una pequeña pausa en el camino</h1>
      <p>No pudimos cargar esta sorpresa. Comprueba tu conexión y vuelve a intentarlo. El progreso que ya se guardó seguirá aquí.</p>
      <button className="primary-button" onClick={() => window.location.reload()}>Volver a intentarlo</button>
    </main>;
    return this.props.children;
  }
}
