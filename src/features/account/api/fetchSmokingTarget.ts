import type { SmokingTarget } from '../types';
import { getSmokingTarget } from './accountStore';
import { withMockLatency } from './mockNetwork';

export const fetchSmokingTarget = async (): Promise<SmokingTarget> =>
  withMockLatency(() => getSmokingTarget());
