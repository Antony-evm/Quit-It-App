import type { QuitDate, UpdateQuitDatePayload } from '../types';
import { setQuitDate } from './accountStore';
import { withMockLatency } from './mockNetwork';

export const updateQuitDate = async (
  payload: UpdateQuitDatePayload,
): Promise<QuitDate> => withMockLatency(() => setQuitDate(payload));
