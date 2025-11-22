export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  NETWORK = 'network',
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  STORAGE = 'storage',
  PERMISSION = 'permission',
  BUSINESS_LOGIC = 'business_logic',
  UNKNOWN = 'unknown',
}

export interface AppErrorDetails {
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  userMessage: string;
  technicalMessage: string;
  context?: Record<string, any>;
  retryable?: boolean;
  showToUser?: boolean;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly userMessage: string;
  public readonly technicalMessage: string;
  public readonly context?: Record<string, any>;
  public readonly retryable: boolean;
  public readonly showToUser: boolean;
  public readonly timestamp: Date;

  constructor(details: AppErrorDetails) {
    super(details.technicalMessage);
    this.name = 'AppError';
    this.code = details.code;
    this.category = details.category;
    this.severity = details.severity;
    this.userMessage = details.userMessage;
    this.technicalMessage = details.technicalMessage;
    this.context = details.context;
    this.retryable = details.retryable ?? false;
    this.showToUser = details.showToUser ?? true;
    this.timestamp = new Date();
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      category: this.category,
      severity: this.severity,
      userMessage: this.userMessage,
      technicalMessage: this.technicalMessage,
      context: this.context,
      retryable: this.retryable,
      showToUser: this.showToUser,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }
}
