import type {
  NotificationSchedule,
  UpdateNotificationSchedulePayload,
} from '../types';
import { setNotificationSchedule } from './accountStore';
import { withMockLatency } from './mockNetwork';

export const updateNotificationSchedule = async (
  payload: UpdateNotificationSchedulePayload,
): Promise<NotificationSchedule> =>
  withMockLatency(() => setNotificationSchedule(payload));
