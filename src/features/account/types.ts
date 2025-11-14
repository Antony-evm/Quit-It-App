export type UserGreeting = {
  firstName: string;
  greeting: string;
};

export type UserEmail = {
  email: string;
  isVerified: boolean;
};

export type SmokingTarget = {
  perDay: number;
  unit: 'cigarettes';
  note?: string;
};

export type QuitDate = {
  isoDate: string; // YYYY-MM-DD
};

export type NotificationSchedule = {
  timezone: string;
  times: string[]; // HH:mm
};

export type UpdateSmokingTargetPayload = {
  perDay: number;
  note?: string;
};

export type UpdateQuitDatePayload = QuitDate;

export type UpdateNotificationSchedulePayload = {
  times: string[];
  timezone?: string;
};
