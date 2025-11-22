import { AppError, ErrorSeverity } from './types';

export interface ErrorLogEntry {
  error: AppError;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  additionalContext?: Record<string, any>;
}

export class ErrorLogger {
  private static instance: ErrorLogger;
  private logs: ErrorLogEntry[] = [];
  private maxLogEntries = 100;

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  async log(
    error: AppError,
    context?: {
      userId?: string;
      sessionId?: string;
      userAgent?: string;
      additionalContext?: Record<string, any>;
    },
  ): Promise<void> {
    const logEntry: ErrorLogEntry = {
      error,
      ...context,
    };

    // Add to in-memory logs
    this.logs.push(logEntry);

    // Keep only the most recent entries
    if (this.logs.length > this.maxLogEntries) {
      this.logs = this.logs.slice(-this.maxLogEntries);
    }

    // Console logging based on severity
    this.consoleLog(error);

    // TODO: In production, send critical and high severity errors to a remote logging service
    if (
      error.severity === ErrorSeverity.CRITICAL ||
      error.severity === ErrorSeverity.HIGH
    ) {
      await this.sendToRemoteLogging(logEntry);
    }
  }

  private consoleLog(error: AppError): void {
    const logMethod = this.getConsoleMethod(error.severity);
    const logData = {
      code: error.code,
      category: error.category,
      severity: error.severity,
      userMessage: error.userMessage,
      technicalMessage: error.technicalMessage,
      context: error.context,
      timestamp: error.timestamp,
      stack: error.stack,
    };

    logMethod(`[${error.severity.toUpperCase()}] ${error.code}:`, logData);
  }

  private getConsoleMethod(severity: ErrorSeverity): typeof console.log {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return console.error;
      case ErrorSeverity.HIGH:
        return console.error;
      case ErrorSeverity.MEDIUM:
        return console.warn;
      case ErrorSeverity.LOW:
        return console.info;
      default:
        return console.log;
    }
  }

  private async sendToRemoteLogging(logEntry: ErrorLogEntry): Promise<void> {
    try {
      // TODO: Implement remote logging service integration
      // This could be services like Sentry, LogRocket, Bugsnag, etc.

      // For now, just console log that we would send this to remote service
      console.log('🔄 Would send to remote logging service:', {
        code: logEntry.error.code,
        severity: logEntry.error.severity,
        category: logEntry.error.category,
        timestamp: logEntry.error.timestamp,
      });

      // Example implementation for a remote service:
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry),
      // });
    } catch (loggingError) {
      console.error(
        'Failed to send error to remote logging service:',
        loggingError,
      );
    }
  }

  getLogs(): ErrorLogEntry[] {
    return [...this.logs];
  }

  getLogsByCategory(category: string): ErrorLogEntry[] {
    return this.logs.filter(log => log.error.category === category);
  }

  getLogsBySeverity(severity: ErrorSeverity): ErrorLogEntry[] {
    return this.logs.filter(log => log.error.severity === severity);
  }

  clearLogs(): void {
    this.logs = [];
  }

  getLogsSummary(): {
    total: number;
    bySeverity: Record<ErrorSeverity, number>;
    byCategory: Record<string, number>;
    recent: ErrorLogEntry[];
  } {
    const bySeverity = Object.values(ErrorSeverity).reduce((acc, severity) => {
      acc[severity] = this.getLogsBySeverity(severity).length;
      return acc;
    }, {} as Record<ErrorSeverity, number>);

    const byCategory = this.logs.reduce((acc, log) => {
      acc[log.error.category] = (acc[log.error.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recent = this.logs.slice(-10); // Last 10 errors

    return {
      total: this.logs.length,
      bySeverity,
      byCategory,
      recent,
    };
  }
}
