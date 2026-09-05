'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { WorkMarquee } from './WorkMarquee';

export function Hero() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  // Единственный оркестрованный вход на сайте.
  const enter = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section id="hero" className="glow-warm relative flex min-h-svh flex-col justify-between overflow-hidden pt-36">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <motion.h1
          className="font-display font-semibold text-display text-fg text-balance max-w-[14ch]"
          {...enter(0.05)}
        >
          {t('hero.title')}
        </motion.h1>

        <motion.div
          className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
          {...enter(0.2)}
        >
          <p className="max-w-[46ch] text-body-lg text-muted text-pretty">{t('hero.subtitle')}</p>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => scrollTo('contact')}
              className="bg-fg px-8 py-4 text-small font-medium text-bg transition-colors hover:bg-accent"
            >
              {t('hero.ctaConsultation')}
            </button>
            <button
              type="button"
              onClick={() => scrollTo('case-studies')}
              className="border border-hairline-strong px-8 py-4 text-small font-medium text-fg transition-colors hover:border-accent hover:text-accent"
            >
              {t('hero.ctaWork')}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Работы попадают на первый экран: студия мобильных приложений должна
          показывать приложения, а не заголовок в пустоте. */}
      <motion.div className="relative z-10 mt-16 pb-10" {...enter(0.4)}>
        <WorkMarquee />
      </motion.div>
    </section>
  );
}
