'use client';

import { I18nextProvider } from 'react-i18next';
import { DEFAULT_LOCALE, getI18n } from './i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  // App Router обслуживает только /api и 404 — там всегда язык по умолчанию.
  return <I18nextProvider i18n={getI18n(DEFAULT_LOCALE)}>{children}</I18nextProvider>;
}
