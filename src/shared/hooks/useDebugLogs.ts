import { useSyncExternalStore } from 'react';

import { debugLogger, type DebugLogEntry } from '../logging/debugLogger';

export const useDebugLogs = (): DebugLogEntry[] =>
  useSyncExternalStore(
    debugLogger.subscribe,
    debugLogger.getLogs,
    debugLogger.getLogs,
  );

