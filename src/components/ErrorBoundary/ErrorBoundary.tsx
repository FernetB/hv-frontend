import { Component, type ErrorInfo, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.card}>
            <p className={styles.icon}>⚠</p>
            <h1 className={styles.title}>Something went wrong</h1>
            <p className={styles.message}>
              An unexpected error occurred. Please reload the page to try again.
            </p>
            <button
              className={styles.button}
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function RouteErrorFallback() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <p className={styles.icon}>⚠</p>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.message}>
          An unexpected error occurred. Please reload the page to try again.
        </p>
        <button
          className={styles.button}
          onClick={() => window.location.reload()}
        >
          Reload page
        </button>
      </div>
    </div>
  );
}
