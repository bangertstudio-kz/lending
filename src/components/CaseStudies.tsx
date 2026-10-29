'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import cases from '@/src/data/cases.json';
import { GOALS, trackGoal } from '@/src/analytics';
import { Kicker } from './ui/block';
import { Magnetic } from './ui/Magnetic';
import { TextScrub } from './ui/TextScrub';
import { CaseGridCard, useCardVariant } from './CaseGridCard';
import type { Case } from '@/src/store/casesStore';

export const caseById = (id: string): Case => cases.find((project) => project.id === id)!;


export function CaseStudies() {
  const { t } = useTranslation();
  const variant = useCardVariant();

  return (
    <section id="case-studies" className="relative scroll-mt-32 bg-ink font-montserrat text-white">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-6 py-20 lg:px-20">
        <div className="flex flex-col gap-3">
          <Kicker>{t('caseStudies.home.eyebrow')}</Kicker>
          <h2 className="flex flex-col gap-1 text-[clamp(2.25rem,3.125vw,3.75rem)] leading-none font-semibold tracking-[-0.06em] uppercase">
            <span>{t('caseStudies.home.title1')}</span>
            <span className="text-lime">{t('caseStudies.home.title2')}</span>
          </h2>
          <TextScrub
            text={t('caseStudies.home.lead')}
            className="text-[18px] leading-7 tracking-[-0.02em] lg:text-[20px] max-w-[960px]"
          />
        </div>

        {/* До гидрации вариант A/B-теста неизвестен — карточки проявляются, когда он выбран. */}
        <div className={`flex flex-col gap-5 transition-opacity duration-300 xl:flex-row ${variant ? '' : 'opacity-0'}`}>
          <CaseGridCard
            project={caseById('manovermetal')}
            variant={variant ?? 'caption'}
            place="home"
            featured={{ tagline: t('caseStudies.home.manoverTagline'), text: t('caseStudies.home.manoverText') }}
            aspect="aspect-[16/9]"
            sizes="(min-width: 1280px) 67vw, 100vw"
            className="xl:w-[calc(66.666%-10px)] xl:shrink-0"
          />
          <div className="grid gap-5 sm:grid-cols-2 xl:flex xl:w-[calc(33.333%-10px)] xl:flex-col xl:justify-between">
            {['sapian', 'luna'].map((id) => (
              <CaseGridCard
                key={id}
                project={caseById(id)}
                variant={variant ?? 'caption'}
                place="home"
                aspect="aspect-[16/9]"
                sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            ))}
          </div>
        </div>

        {/* В макете группа прижата вправо с отступом 772px из 1760 — кнопка стоит на месте при любой длине текста. */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-10 lg:justify-end lg:pr-[43.864%]">
          <span className="text-[14px] leading-5 font-medium tracking-[-0.02em] opacity-40">
            {t('caseStudies.home.othersText')}
          </span>
          <Magnetic strength={0.3}>
            <Link
              href="/cases"
              onClick={() => trackGoal(GOALS.casesViewAll)}
              className="shrink-0 whitespace-nowrap rounded-[40px] border border-white px-6 py-3 text-center text-[14px] leading-6 font-semibold tracking-[-0.02em] transition-colors hover:border-lime hover:text-lime"
            >
              {t('caseStudies.home.viewAllCases')}
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
