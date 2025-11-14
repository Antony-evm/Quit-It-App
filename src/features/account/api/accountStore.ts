import type {
  NotificationSchedule,
  QuitDate,
  SmokingTarget,
  UpdateNotificationSchedulePayload,
  UpdateQuitDatePayload,
  UpdateSmokingTargetPayload,
  UserEmail,
  UserGreeting,
} from '../types';

type AccountStoreShape = {
  greeting: UserGreeting;
  email: UserEmail;
  smokingTarget: SmokingTarget;
  quitDate: QuitDate;
  notificationSchedule: NotificationSchedule;
};

const accountStore: AccountStoreShape = {
  greeting: {
    firstName: 'Jordan',
    greeting: 'Good afternoon',
  },
  email: {
    email: 'jordan@quitit.app',
    isVerified: true,
  },
  smokingTarget: {
    perDay: 3,
    unit: 'cigarettes',
    note: 'Fewer than yesterday',
  },
  quitDate: {
    isoDate: '2025-12-01',
  },
  notificationSchedule: {
    timezone: 'America/New_York',
    times: ['08:00', '12:30', '18:00'],
  },
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

export const getGreeting = () => clone(accountStore.greeting);
export const getEmail = () => clone(accountStore.email);
export const getSmokingTarget = () => clone(accountStore.smokingTarget);
export const getQuitDate = () => clone(accountStore.quitDate);
export const getNotificationSchedule = () =>
  clone(accountStore.notificationSchedule);

export const setSmokingTarget = (
  payload: UpdateSmokingTargetPayload,
): SmokingTarget => {
  accountStore.smokingTarget = {
    ...accountStore.smokingTarget,
    ...payload,
  };

  return getSmokingTarget();
};

export const setQuitDate = (payload: UpdateQuitDatePayload): QuitDate => {
  accountStore.quitDate = { ...payload };
  return getQuitDate();
};

export const setNotificationSchedule = (
  payload: UpdateNotificationSchedulePayload,
): NotificationSchedule => {
  accountStore.notificationSchedule = {
    ...accountStore.notificationSchedule,
    times: [...payload.times],
    ...(payload.timezone ? { timezone: payload.timezone } : {}),
  };

  return getNotificationSchedule();
};
