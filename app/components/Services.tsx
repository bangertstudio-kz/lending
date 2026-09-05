'use client';

import { useTranslation } from 'react-i18next';
import { Section, SectionHeading } from './ui/section';

const services = [
  'iosDev',
  'androidDev',
  'webDev',
  'uiux',
  'analytics',
  'maintenance',
] as const;

export function Services() {
  const { t } = useTranslation();

  return (
    <Section id="services" tone="surface">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-28">
        <SectionHeading
          title={t('services.title')}
          subtitle={t('services.subtitle')}
          className="lg:sticky lg:top-32 lg:self-start"
        />

        {/* Сетка на зазорах: границы рисует фон, а не рамка у каждой карточки —
            меньше линий, плотнее блок. */}
        <div className="grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
          {services.map((key) => (
            <article key={key} className="group relative isolate overflow-hidden bg-bg p-10">
              {/* Заливка выезжает снизу — вместо простой смены цвета фона */}
              <span
                aria-hidden
                className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-raised transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100"
              />
              <div className="flex flex-col gap-4">
                <h3 className="font-display font-semibold text-h3 text-fg text-balance transition-colors duration-300 group-hover:text-accent">
                  {t(`services.${key}.title`)}
                </h3>
                <p className="text-small leading-relaxed text-muted">
                  {t(`services.${key}.description`)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
