import type { NotificationSchedule } from '../types';
import { getNotificationSchedule } from './accountStore';
import { withMockLatency } from './mockNetwork';

export const fetchNotificationSchedule = async (): Promise<NotificationSchedule> =>
  withMockLatency(() => getNotificationSchedule());
