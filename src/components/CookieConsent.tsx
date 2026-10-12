'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'bangert_cookie_consent';

export function CookieConsent() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        // Небольшая задержка перед показом плашки для плавности восприятия
        const timer = setTimeout(() => setIsOpen(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage недоступен в инкогнито или заблокирован политикой
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {
      // ignore
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'declined');
    } catch {
      // ignore
    }
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          role="dialog"
          aria-label="Cookie consent"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed bottom-6 left-6 right-6 z-50 sm:right-auto sm:max-w-[420px]"
        >
          <div className="relative flex flex-col gap-4 rounded-[20px] border border-white/12 bg-[#121212]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl font-montserrat text-white">
            <button
              type="button"
              onClick={handleClose}
              aria-label={t('cookies.close')}
              className="absolute top-4 right-4 rounded-full p-1 text-white/40 transition-colors hover:text-white"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-start gap-3.5 pr-6">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-lime/30 bg-lime/10 text-lime">
                <Cookie className="size-4" />
              </span>
              <p className="text-[13px] leading-5 text-white/70">
                {t('cookies.text')}
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-end pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="cursor-pointer rounded-[30px] border border-white/15 px-4 py-2 text-[12px] font-medium tracking-[-0.01em] uppercase text-white/70 transition-colors hover:border-white/30 hover:text-white"
              >
                {t('cookies.close')}
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="cursor-pointer rounded-[30px] bg-lime px-5 py-2 text-[12px] font-semibold tracking-[-0.01em] uppercase text-ink transition-opacity hover:opacity-85 shadow-[0_0_16px_rgba(210,249,73,0.3)]"
              >
                {t('cookies.accept')}
              </button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
