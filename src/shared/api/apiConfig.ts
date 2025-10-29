import { Platform } from 'react-native';

type MaybeEnv = {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

const removeTrailingSlash = (value: string) => value.replace(/\/$/, '');

const getEnvValue = (key: string): string | undefined =>
  ((globalThis as MaybeEnv | undefined)?.process?.env ?? {})[key];

const resolveFallbackBaseUrl = (): string => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }

  return 'http://localhost:8000';
};

export const resolveApiBaseUrl = (): string => {
  const envUrl =
    getEnvValue('QUESTIONNAIRE_API_BASE_URL') ??
    getEnvValue('API_BASE_URL') ??
    getEnvValue('EXPO_PUBLIC_API_BASE_URL');

  if (envUrl) {
    try {
      return removeTrailingSlash(new URL(envUrl).toString());
    } catch {
      return removeTrailingSlash(envUrl);
    }
  }

  return removeTrailingSlash(resolveFallbackBaseUrl());
};

export const API_BASE_URL = resolveApiBaseUrl();
