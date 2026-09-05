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
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-20">
        <SectionHeading
          title={t('services.title')}
          subtitle={t('services.subtitle')}
          className="lg:sticky lg:top-32 lg:self-start"
        />

        {/* Сетка на зазорах: границы рисует фон, а не рамка у каждой карточки —
            меньше линий, плотнее блок. */}
        <div className="grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
          {services.map((key) => (
            <article key={key} className="flex flex-col gap-3 bg-bg p-7 transition-colors hover:bg-raised">
              <h3 className="font-display font-semibold text-h3 text-fg text-balance">
                {t(`services.${key}.title`)}
              </h3>
              <p className="text-small leading-relaxed text-muted">
                {t(`services.${key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
