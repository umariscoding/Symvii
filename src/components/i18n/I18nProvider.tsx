'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';
import { useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const currentLanguage = useAppSelector((state) => state.language.currentLanguage);

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage]);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
} 