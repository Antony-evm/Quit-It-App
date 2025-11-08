export type DebugLogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface DebugLogEntry {
  id: string;
  timestamp: number;
  level: DebugLogLevel;
  scope: string;
  message: string;
  payload?: unknown;
}

type DebugLogSubscriber = () => void;

const MAX_LOGS = 200;

let logs: DebugLogEntry[] = [];
const subscribers = new Set<DebugLogSubscriber>();

const notifySubscribers = () => {
  subscribers.forEach((listener) => {
    listener();
  });
};

const pushLog = (
  level: DebugLogLevel,
  scope: string,
  message: string,
  payload?: unknown,
) => {
  const entry: DebugLogEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    level,
    scope,
    message,
    payload,
  };

  logs = [...logs.slice(Math.max(logs.length - (MAX_LOGS - 1), 0)), entry];

  const consoleMethod =
    level === 'error'
      ? console.error
      : level === 'warn'
        ? console.warn
        : console.log;

  if (payload !== undefined) {
    consoleMethod(`[${scope}] ${message}`, payload);
  } else {
    consoleMethod(`[${scope}] ${message}`);
  }

  notifySubscribers();
};

export const debugLogger = {
  debug: (scope: string, message: string, payload?: unknown) =>
    pushLog('debug', scope, message, payload),
  info: (scope: string, message: string, payload?: unknown) =>
    pushLog('info', scope, message, payload),
  warn: (scope: string, message: string, payload?: unknown) =>
    pushLog('warn', scope, message, payload),
  error: (scope: string, message: string, payload?: unknown) =>
    pushLog('error', scope, message, payload),
  subscribe: (listener: DebugLogSubscriber) => {
    subscribers.add(listener);
    return () => {
      subscribers.delete(listener);
    };
  },
  getLogs: () => logs,
  clear: () => {
    logs = [];
    notifySubscribers();
  },
};

