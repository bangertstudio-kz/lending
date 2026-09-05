'use client';

import { useTranslation } from 'react-i18next';
import { MagneticButton } from './MagneticButton';
import { RevealWords } from './RevealWords';
import { WorkMarquee } from './WorkMarquee';

export function Hero() {
  const { t } = useTranslation();

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="hero"
      className="glow-warm relative overflow-hidden pt-36"
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <h1 className="max-w-[19ch] font-display font-semibold text-display text-fg text-balance">
          <RevealWords text={t('hero.title')} />
        </h1>

        <div className="rise mt-10 max-w-[46ch] [animation-delay:450ms]">
          <p className="text-body-lg text-muted text-pretty">{t('hero.subtitle')}</p>

          <div className="mt-11 flex flex-col gap-4 sm:flex-row">
            <MagneticButton
              onClick={() => scrollTo('contact')}
              className="bg-fg px-8 py-4 text-small font-medium text-bg transition-colors hover:bg-accent"
            >
              {t('hero.ctaConsultation')}
            </MagneticButton>
            <button
              type="button"
              onClick={() => scrollTo('case-studies')}
              className="border border-hairline-strong px-8 py-4 text-small font-medium text-fg transition-colors hover:border-accent hover:text-accent"
            >
              {t('hero.ctaWork')}
            </button>
          </div>
        </div>
      </div>

      {/* Работы на первом экране: студия мобильных приложений должна показывать
          приложения, а не заголовок в пустоте. */}
      <div className="rise relative z-10 mt-24 pb-20 [animation-delay:600ms]">
        <WorkMarquee />
      </div>
    </section>
  );
}
