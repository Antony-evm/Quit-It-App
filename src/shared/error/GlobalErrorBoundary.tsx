import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorFallback } from './components/ErrorFallback';
import { ErrorLogger } from './ErrorLogger';
import { AppError, ErrorCategory, ErrorSeverity } from './types';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = new AppError({
      code: 'UNHANDLED_RENDER_ERROR',
      category: ErrorCategory.UNKNOWN,
      severity: ErrorSeverity.CRITICAL,
      userMessage: 'An unexpected error occurred.',
      technicalMessage: error.message,
      context: {
        componentStack: errorInfo.componentStack,
        originalError: error,
      },
      retryable: true,
      showToUser: true,
    });

    ErrorLogger.getInstance().log(appError);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <ErrorFallback error={this.state.error} resetError={this.resetError} />
      );
    }

    return this.props.children;
  }
}
