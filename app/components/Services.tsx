'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { GOALS, trackGoal } from '@/app/analytics';
import { Kicker, Lead } from './ui/block';
import { SERVICES } from '@/app/data/services';

const ARROW = '/assets/hero/arrow-light.svg';

function toContact(place: string) {
  trackGoal(GOALS.heroCtaConsultation, { place });
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
}

export function Services() {
  const { t } = useTranslation();

  return (
    <section id="services" className="relative isolate overflow-hidden bg-ink font-montserrat text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Image src="/assets/services/bg.png" alt="" fill sizes="100vw" className="object-cover opacity-12" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-ink),rgba(2,2,2,0)_47.115%,var(--color-ink))]" />
      </div>

      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-6 py-20 lg:px-20">
        <div className="flex flex-col gap-3">
          <Kicker>{t('services.eyebrow')}</Kicker>
          <h2 className="text-[clamp(2.25rem,3.125vw,3.75rem)] leading-[1.1333] font-semibold tracking-[-0.06em] uppercase">
            {t('services.title')}
          </h2>
          <Lead className="gap-2.5">{t('services.subtitle')}</Lead>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map(({ key, slug }, i) => (
            <li
              key={key}
              className="relative flex flex-col items-start gap-10 rounded-[12px] border border-white/20 bg-[radial-gradient(300px_280px_at_50%_100%,rgba(20,19,19,0.6),rgba(2,2,2,0))] p-5 transition-colors duration-300 hover:border-lime hover:bg-[radial-gradient(100%_100%_at_0_100%,rgba(210,249,73,0.09),rgba(210,249,73,0))]"
            >
              <div className="flex flex-col gap-5">
                <div className="flex flex-col">
                  <span className="text-[36px] leading-10 font-medium tracking-[-0.06em] text-lime">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-[24px] leading-8 font-semibold tracking-[-0.02em] uppercase">
                    {/* Растянутая ссылка: клик по любой точке карточки открывает услугу. */}
                    <Link href={`/services/${slug}`} className="after:absolute after:inset-0 after:rounded-[12px]">
                      {t(`services.${key}.title`)}
                    </Link>
                  </h3>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[18px] leading-7 tracking-[-0.02em] opacity-60 lg:text-[20px]">
                    {t(`services.${key}.tags`)}
                  </p>
                  <p className="text-[14px] leading-6 tracking-[-0.02em]">{t(`services.${key}.description`)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toContact(`services_${key}`)}
                className="relative z-10 flex items-center gap-2.5 rounded-[40px] border border-white/20 py-3 pr-3 pl-6 text-[14px] leading-6 font-semibold tracking-[-0.02em] whitespace-nowrap transition-colors hover:border-white/60"
              >
                {t('services.cta')}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ARROW} alt="" width={24} height={24} className="shrink-0" />
              </button>
            </li>
          ))}
        </ul>

        <div aria-hidden className="h-px rounded-[4px] bg-white opacity-40" />

        <button
          type="button"
          onClick={() => toContact('services_other')}
          className="group flex w-fit items-center gap-8 rounded-[12px] bg-black/40 text-left"
        >
          <span className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/services/question.svg" alt="" width={52} height={52} className="shrink-0" />
            <span className="flex flex-col gap-1 leading-6">
              <span className="text-[18px] font-semibold tracking-[-0.02em]">{t('services.otherTitle')}</span>
              <span className="text-[16px] tracking-[-0.02em]">{t('services.otherText')}</span>
            </span>
          </span>
          <span className="flex shrink-0 rounded-[40px] border border-white/20 p-3 transition-colors group-hover:border-white/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ARROW} alt="" width={24} height={24} />
          </span>
        </button>
      </div>
    </section>
  );
}
