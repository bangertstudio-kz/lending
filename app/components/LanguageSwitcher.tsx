'use client';

import { useEffect, useRef, useState } from 'react';
import { Globe } from 'lucide-react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'motion/react';
import { DEFAULT_LOCALE, LOCALES, LOCALE_LABELS, isLocale, type Locale } from '@/app/seo';
import { GOALS, trackGoal } from '@/app/analytics';

interface LanguageSwitcherProps {
  onLanguageChange?: () => void;
}

export function LanguageSwitcher({ onLanguageChange }: LanguageSwitcherProps) {
  const router = useRouter();
  const current = isLocale(router.locale) ? router.locale : DEFAULT_LOCALE;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const select = (locale: Locale) => {
    setOpen(false);
    if (locale === current) return;
    trackGoal(GOALS.langChange, { from: current, to: locale });
    // Язык — часть адреса, а не состояние в браузере: так каждая версия
    // существует по своему URL и попадает в индекс.
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale, scroll: false });
    onLanguageChange?.();
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={LOCALE_LABELS[current]}
        className="flex items-center gap-2 px-3 py-2 text-small text-muted transition-colors hover:text-fg"
      >
        <Globe size={18} aria-hidden />
        <span className="text-sm font-medium uppercase">{current}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full z-50 mt-2 min-w-44 border border-hairline bg-raised py-1"
          >
            {LOCALES.map((locale) => (
              <li key={locale}>
                <button
                  type="button"
                  role="option"
                  aria-selected={locale === current}
                  lang={locale}
                  onClick={() => select(locale)}
                  className={`flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left text-small transition-colors hover:text-accent ${
                    locale === current ? 'text-fg' : 'text-muted'
                  }`}
                >
                  {LOCALE_LABELS[locale]}
                  <span className="font-mono text-xs uppercase text-faint">{locale}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
