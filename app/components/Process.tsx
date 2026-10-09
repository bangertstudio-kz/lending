'use client';

import { Fragment } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { GOALS, trackGoal } from '@/app/analytics';
import { Kicker, Lead, LimeButton, goToContact } from './ui/block';

const ASSETS = '/assets/process';

// Ширины колонок из макета (1920): описания переносятся ровно как в Figma.
// Тянуться в строку с соединителями шагам есть куда только от 1680px (4 колонки ≈1277 + соединители).
const STEPS = [
  { icon: 'bulb', width: 'min-[1680px]:w-[318px]' },
  { icon: 'nib', width: 'min-[1680px]:w-[336px]' },
  { icon: 'code', width: 'min-[1680px]:w-[317px]' },
  { icon: 'rocket', width: 'min-[1680px]:w-[306px]' },
] as const;

/** Соединитель между шагами: точка + линия с засечкой. Первая точка — активная, с подсветкой. */
function Connector({ active }: { active: boolean }) {
  return (
    <li aria-hidden className="hidden min-w-16 flex-1 items-center py-[30px] min-[1680px]:flex">
      <span className="relative z-10 -mr-2 size-4 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${ASSETS}/${active ? 'dot-active' : 'dot'}.svg`}
          alt=""
          className={active ? 'absolute -inset-3 size-10 max-w-none' : 'size-4'}
        />
      </span>
      <span className="relative h-2 min-w-0 flex-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSETS}/line.svg`} alt="" className="absolute top-[-8.75%] left-[-0.62%] h-[117.5%] w-[101.24%] max-w-none" />
      </span>
    </li>
  );
}

export function Process() {
  const { t } = useTranslation();

  return (
    <section id="process" className="relative isolate overflow-hidden bg-ink font-montserrat text-white">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-6 py-20 lg:px-20">
        {/* В макете 1182×664, прижата к правому краю контента и гаснет книзу. */}
        <div
          aria-hidden
          className="pointer-events-none relative -mx-6 -mb-[30%] aspect-[1182/664] lg:absolute lg:top-0 lg:right-[4.1667%] lg:mx-0 lg:mb-0 lg:w-[61.5625%]"
        >
          <Image src={`${ASSETS}/devices.png`} alt="" fill sizes="(min-width: 1024px) 62vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,2,2,0),var(--color-ink)_61.058%)]" />
        </div>

        <div className="relative flex flex-col gap-3">
          <Kicker>{t('process.eyebrow')}</Kicker>
          <h2 className="text-[clamp(2.25rem,3.125vw,3.75rem)] leading-[1.1333] font-semibold tracking-[-0.06em] uppercase">
            <span className="block">{t('process.title1')}</span>
            <span className="block">{t('process.title2')}</span>
            <span className="block text-lime">{t('process.title3')}</span>
          </h2>
          <Lead className="gap-2.5">{t('process.lead')}</Lead>
        </div>

        {/* max-[1680px]: ограничивает xl диапазоном — иначе xl перебил бы min-[1680px] (он стоит в CSS позже). */}
        <ol className="relative grid gap-12 sm:grid-cols-2 xl:max-[1680px]:grid-cols-4 xl:max-[1680px]:gap-8 min-[1680px]:flex min-[1680px]:items-start min-[1680px]:justify-center min-[1680px]:gap-5">
          {STEPS.map((step, i) => {
            const n = i + 1;
            return (
              <Fragment key={step.icon}>
                {i > 0 && <Connector active={i === 1} />}
                <li className={`flex min-w-0 flex-col gap-5 ${step.width}`}>
                  <div className="flex items-center gap-5">
                    {/* mr компенсирует трекинг после последней цифры: Figma его не считает, CSS — да. */}
                    <span className="mr-[0.06em] text-[68px] leading-[68px] font-medium tracking-[-0.06em] opacity-60">
                      {String(n).padStart(2, '0')}
                    </span>
                    <span
                      className={`flex rounded-[16px] border border-white/12 p-[11px] backdrop-blur-[26px] ${
                        i === 0 ? 'bg-[radial-gradient(circle_79.2px_at_0_100%,rgba(210,249,73,0.09),rgba(210,249,73,0))]' : ''
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${ASSETS}/${step.icon}.svg`} alt="" width={32} height={32} />
                    </span>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-[24px] leading-8 font-semibold tracking-[-0.02em] uppercase">
                        {t(`process.step${n}.title`)}
                      </h3>
                      <p className="text-[18px] leading-7 tracking-[-0.02em] opacity-60 lg:text-[20px]">
                        {t(`process.step${n}.text`)}
                      </p>
                    </div>
                    <ul className="flex flex-wrap gap-3">
                      {[1, 2, 3].map((k) => (
                        <li
                          key={k}
                          className="rounded-[30px] border border-white/20 px-3 py-1 text-[14px] leading-6 tracking-[-0.02em]"
                        >
                          <span className="opacity-60">{t(`process.step${n}.tag${k}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </Fragment>
            );
          })}
        </ol>

        <div aria-hidden className="h-px rounded-[4px] bg-white opacity-40" />

        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <p className="text-[20px] leading-7 tracking-[-0.02em] whitespace-pre-line lg:text-[24px]">
            {t('process.outro')}
          </p>
          <LimeButton
            onClick={() => {
              trackGoal(GOALS.heroCtaConsultation, { place: 'process' });
              goToContact();
            }}
          >
            {t('process.cta')}
          </LimeButton>
        </div>
      </div>
    </section>
  );
}
