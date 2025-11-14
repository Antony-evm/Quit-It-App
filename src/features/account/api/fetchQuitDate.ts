import type { QuitDate } from '../types';
import { getQuitDate } from './accountStore';
import { withMockLatency } from './mockNetwork';

export const fetchQuitDate = async (): Promise<QuitDate> =>
  withMockLatency(() => getQuitDate());
