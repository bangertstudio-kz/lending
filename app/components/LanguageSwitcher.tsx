'use client';

import { Globe } from 'lucide-react';
import { useRouter } from 'next/router';
import { motion } from 'motion/react';
import { DEFAULT_LOCALE, isLocale } from '@/app/i18n';

interface LanguageSwitcherProps {
  onLanguageChange?: () => void;
}

export function LanguageSwitcher({ onLanguageChange }: LanguageSwitcherProps) {
  const router = useRouter();
  const current = isLocale(router.locale) ? router.locale : DEFAULT_LOCALE;
  const next = current === 'en' ? 'ru' : 'en';

  const toggleLanguage = () => {
    // Язык — часть адреса, а не состояние в браузере: так английская версия
    // существует по своему URL и попадает в индекс.
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: next, scroll: false });
    onLanguageChange?.();
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 text-small text-muted transition-colors hover:text-fg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={next === 'en' ? 'Switch to English' : 'Переключить на русский'}
      lang={next}
    >
      <Globe size={18} />
      <span className="text-sm font-medium uppercase">{current}</span>
    </motion.button>
  );
}
