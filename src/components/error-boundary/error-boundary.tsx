import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import "./error-boundary.scss";
import Button from "../ui/button/button";
import Title from "../ui/title/title";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Erreur attrapée par ErrorBoundary :", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <DefaultErrorFallback />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback() {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="error-boundary-fallback">
      <div className="error-content">
        <Title title="Oups ! Une erreur est survenue" className="error-title" />
        <p className="error-description">
          Nous sommes désolés, mais quelque chose s'est mal passé. Notre équipe
          a été notifiée du problème.
        </p>

        <div className="error-actions">
          <Button onClick={handleReload}>Recharger la page</Button>
          <Button onClick={handleGoHome} variant="outline">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
