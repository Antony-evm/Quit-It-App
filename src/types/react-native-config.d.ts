declare module 'react-native-config' {
  export interface NativeConfig {
    STYTCH_PROJECT_ID?: string;
    STYTCH_PUBLIC_TOKEN?: string;
  }

  export const Config: NativeConfig;
}
