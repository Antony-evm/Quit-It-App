import type { SmokingTarget, UpdateSmokingTargetPayload } from '../types';
import { setSmokingTarget } from './accountStore';
import { withMockLatency } from './mockNetwork';

export const updateSmokingTarget = async (
  payload: UpdateSmokingTargetPayload,
): Promise<SmokingTarget> => withMockLatency(() => setSmokingTarget(payload));
