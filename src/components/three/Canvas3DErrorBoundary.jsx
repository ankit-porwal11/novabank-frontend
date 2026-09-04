import { Component } from "react";

export default class Canvas3DErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Swallow silently in the UI — the static fallback covers the visual,
    // and a 3D hero glitch shouldn't ever surface as a user-facing error.
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.warn("Landing hero 3D scene failed, using static fallback:", error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
