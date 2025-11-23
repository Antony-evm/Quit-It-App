import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  StartupLoading: undefined;
  Auth: { mode?: 'login' | 'signup' } | undefined;
  Questionnaire: undefined;
  Paywall: undefined;
  Home: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
