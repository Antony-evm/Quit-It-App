import type { UserEmail } from '../types';
import { getEmail } from './accountStore';
import { withMockLatency } from './mockNetwork';

export const fetchUserEmail = async (): Promise<UserEmail> =>
  withMockLatency(() => getEmail());
