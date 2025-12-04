import { ComponentType } from 'react';

import { AccountDetails } from './components/AccountDetails';
import { QuittingPlanDetails } from './components/QuittingPlanDetails';

export const ACCOUNT_SECTIONS = {
  DETAILS: 'details',
  PLAN: 'plan',
  TRIGGERS: 'triggers',
  HABITS: 'habits',
} as const;

export type AccountSectionKey =
  (typeof ACCOUNT_SECTIONS)[keyof typeof ACCOUNT_SECTIONS];

export type AccountSection = AccountSectionKey | null;

type SectionConfig = {
  component?: ComponentType;
  translationKey: string;
  descriptionKey: string;
};

export const SECTION_CONFIG: Record<AccountSectionKey, SectionConfig> = {
  [ACCOUNT_SECTIONS.DETAILS]: {
    component: AccountDetails,
    translationKey: 'account.sections.details',
    descriptionKey: 'account.sections.detailsDescription',
  },
  [ACCOUNT_SECTIONS.PLAN]: {
    component: QuittingPlanDetails,
    translationKey: 'account.sections.plan',
    descriptionKey: 'account.sections.planDescription',
  },
  [ACCOUNT_SECTIONS.TRIGGERS]: {
    translationKey: 'account.sections.triggers',
    descriptionKey: 'account.sections.triggersDescription',
  },
  [ACCOUNT_SECTIONS.HABITS]: {
    translationKey: 'account.sections.habits',
    descriptionKey: 'account.sections.habitsDescription',
  },
};

export const SECTION_ORDER: AccountSectionKey[] = [
  ACCOUNT_SECTIONS.DETAILS,
  ACCOUNT_SECTIONS.PLAN,
  ACCOUNT_SECTIONS.TRIGGERS,
  ACCOUNT_SECTIONS.HABITS,
];
