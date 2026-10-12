'use client';

import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GOALS, trackGoal } from '@/src/analytics';
import { Kicker, LimeButton, goToContact } from './ui/block';

const ASSETS = '/assets/faq';

type Item = { q: string; a: string };

/** Ответ раскрывается через grid-rows 0fr → 1fr: анимирует высоту до auto во всех браузерах. */
function Question({ item, open, onToggle }: { item: Item; open: boolean; onToggle: () => void }) {
  const id = useId();
  return (
    <div
      className={`rounded-[12px] border transition-colors duration-200 ${
        open
          ? 'border-white/30 bg-white/[0.03]'
          : 'border-white/15 bg-white/[0.01] hover:border-white/30'
      } px-5 py-3.5 sm:px-6 sm:py-4`}
    >
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="group flex w-full cursor-pointer items-center justify-between gap-4 text-left text-[16px] leading-snug font-medium tracking-[-0.02em] sm:text-[18px] sm:font-semibold"
        >
          <span className="transition-colors group-hover:text-lime/90">{item.q}</span>
          <span className="relative flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-white/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${ASSETS}/closed.svg`}
              alt=""
              width={18}
              height={18}
              className={`transition-all duration-300 ${open ? 'rotate-90 opacity-0' : ''}`}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${ASSETS}/open.svg`}
              alt=""
              width={18}
              height={18}
              className={`absolute transition-all duration-300 ${open ? '' : '-rotate-90 opacity-0'}`}
            />
          </span>
        </button>
      </h3>
      <div
        id={id}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden" inert={!open}>
          <p className="pt-3 text-[14px] leading-relaxed tracking-[-0.01em] text-white/60 sm:text-[15px] lg:text-[16px]">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const { t } = useTranslation();
  const items = t('faq.items', { returnObjects: true }) as Item[];
  const half = Math.ceil(items.length / 2);
  // Открыт один ответ за раз; по умолчанию первый, как в макете.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative scroll-mt-32 bg-ink font-montserrat text-white">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-6 py-20 lg:px-20">
        <div className="flex flex-col gap-3">
          <Kicker>{t('faq.eyebrow')}</Kicker>
          <h2 className="text-[clamp(2.25rem,3.125vw,3.75rem)] leading-[1.1333] font-semibold tracking-[-0.06em] uppercase">
            {t('faq.title')}
            <span className="text-lime">{t('faq.accent')}</span>
          </h2>
        </div>

        {/* Две независимые колонки, как в макете: открытый ответ не сдвигает соседнюю. */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-10">
          {[items.slice(0, half), items.slice(half)].map((column, c) => (
            <div key={c} className="flex min-w-0 flex-1 flex-col gap-3">
              {column.map((item, i) => {
                const index = c * half + i;
                return (
                  <Question
                    key={item.q}
                    item={item}
                    open={openIndex === index}
                    onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div aria-hidden className="h-px bg-white/15" />

        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
            <p className="text-[16px] leading-6 tracking-[-0.02em] whitespace-pre-line sm:text-[18px] lg:text-[20px]">{t('faq.outro')}</p>
            <LimeButton
              onClick={() => {
                trackGoal(GOALS.heroCtaConsultation, { place: 'faq' });
                goToContact();
              }}
            >
              {t('faq.cta')}
            </LimeButton>
          </div>
          <p className="text-[13px] leading-5 tracking-[-0.02em] text-white/40 sm:text-[14px]">{t('faq.note')}</p>
        </div>
      </div>
    </section>
  );
}
