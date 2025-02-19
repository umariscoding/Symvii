'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import esTranslation from '../../public/locales/es/translation.json';
import enTranslation from '../../public/locales/en/translation.json';
import arTranslation from '../../public/locales/ar/translation.json'; 
import deTranslation from '../../public/locales/de/translation.json';
import frTranslation from '../../public/locales/fr/translation.json';
import hiTranslation from '../../public/locales/hi/translation.json';
import jaTranslation from '../../public/locales/ja/translation.json';
import ptTranslation from '../../public/locales/pt/translation.json';
import ruTranslation from '../../public/locales/ru/translation.json';
import urTranslation from '../../public/locales/ur/translation.json';
import zhTranslation from '../../public/locales/zh/translation.json';

const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;

i18next
  .use(initReactI18next)
  .init({
    lng: savedLanguage || 'en', // use saved language or default to 'en'
    fallbackLng: 'en',
    resources: {
      en: {
        translation: enTranslation,
      },
      es: {
        translation: esTranslation,
      },
      ar: {
        translation: arTranslation,
      },
      de: {
        translation: deTranslation,
      },
      fr: {
        translation: frTranslation,
      },
      hi: {
        translation: hiTranslation,
      },
      ja: {
        translation: jaTranslation,
      },
      pt: {
        translation: ptTranslation,
      },
      ru: {
        translation: ruTranslation,
      },
      ur: {
        translation: urTranslation,
      },
      zh: {
        translation: zhTranslation,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next; 