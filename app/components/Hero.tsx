'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useTranslation } from 'react-i18next';

export function Hero() {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();

  const opacity = useTransform(scrollY, [0, 420], [1, 0]);
  const lift = useTransform(scrollY, [0, 420], [0, 70]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  // Единственная неинтерактивная анимация на сайте: один вход на загрузке.
  const enter = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      id="hero"
      className="glow-warm relative flex min-h-[90vh] items-center overflow-hidden px-6"
    >
      <motion.div
        className="relative z-10 mx-auto w-full max-w-5xl py-32"
        style={reduceMotion ? undefined : { opacity, y: lift }}
      >
        <motion.h1
          className="font-display font-semibold text-display text-fg text-balance max-w-[16ch]"
          {...enter(0.05)}
        >
          {t('hero.title')}
        </motion.h1>

        <motion.p
          className="mt-8 max-w-[52ch] text-body-lg text-muted text-pretty"
          {...enter(0.18)}
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div className="mt-12 flex flex-col gap-3 sm:flex-row" {...enter(0.3)}>
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
        </motion.div>
      </motion.div>
    </section>
  );
}
