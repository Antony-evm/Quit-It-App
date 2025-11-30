import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';

const resources = {
  en,
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  compatibilityJSON: 'v3', // for android
});

export default i18n;
