'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { Section, SectionHeading, Eyebrow } from './ui/section';
import { GOALS, trackGoal } from '@/app/analytics';

export function CalculatorCTA() {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    const brief = description.trim();
    trackGoal(GOALS.calculatorCtaSubmit, { withBrief: brief.length > 0, briefLength: brief.length });
    const query = brief ? `?description=${encodeURIComponent(brief)}` : '';
    router.push(`/calculator${query}`);
  };
  
  return (
    <Section tone="raised" glow>
      <div className="relative z-10 mx-auto max-w-3xl">
        <SectionHeading
          align="center"
          eyebrow={<Eyebrow>{t('calculator.cta.badge')}</Eyebrow>}
          title={t('calculator.cta.title')}
          subtitle={t('calculator.cta.subtitle')}
          className="mb-10"
        />

        <div className="border border-hairline bg-bg transition-colors focus-within:border-accent">
          <label htmlFor="calculator-brief" className="sr-only">
            {t('calculator.description')}
          </label>
          <textarea
            id="calculator-brief"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={t('calculator.cta.placeholder')}
            rows={4}
            className="w-full resize-none bg-transparent px-6 pb-4 pt-6 text-body text-fg placeholder:text-faint focus:outline-none"
          />
          <div className="flex items-center justify-between gap-4 px-6 pb-5">
            <span className="text-xs text-faint">
              {description.length > 0
                ? t('calculator.cta.charsLength', { length: description.length })
                : t('calculator.cta.optional')}
            </span>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-fg px-6 py-3 text-small font-medium text-bg transition-colors hover:bg-accent"
            >
              {t('calculator.cta.button')}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-faint">{t('calculator.cta.note')}</p>
      </div>
    </Section>
  );
}
