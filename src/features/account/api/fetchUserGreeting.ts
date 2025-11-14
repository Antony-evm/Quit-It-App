import type { UserGreeting } from '../types';
import { getGreeting } from './accountStore';
import { withMockLatency } from './mockNetwork';

export const fetchUserGreeting = async (): Promise<UserGreeting> =>
  withMockLatency(() => getGreeting());
