'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import cases from '@/app/data/cases.json';
import { GOALS, trackGoal } from '@/app/analytics';
import { Kicker, Lead, More } from './ui/block';

const IMAGES = '/assets/home-cases';

const caseById = (id: string) => cases.find((project) => project.id === id)!;

// У этих кейсов есть обложки из макета главной; у остальных — картинка из cases.json.
export const HOME_COVERS = ['manovermetal', 'sapian', 'luna'];
export const caseCover = (project: { id: string; image: string }) =>
  HOME_COVERS.includes(project.id) ? `${IMAGES}/${project.id}.png` : project.image;

/** Карточка-ссылка на кейс: картинка на весь фон, затемнение снизу, контент прижат к низу. */
export function CaseCard({
  id,
  gradient,
  className,
  sizes,
  src,
  place = 'home',
  children,
}: {
  id: string;
  gradient: string;
  className: string;
  sizes: string;
  src?: string;
  place?: 'home' | 'cases';
  children: React.ReactNode;
}) {
  const project = caseById(id);
  return (
    <Link
      href={`/cases/${id}`}
      onClick={() =>
        trackGoal(GOALS.caseOpen, { name: project.name, platform: project.platform, place })
      }
      className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-[12px] p-6 text-white lg:p-10 ${className}`}
    >
      <Image
        src={src ?? caseCover(project)}
        alt={project.name}
        fill
        sizes={sizes}
        className="-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div aria-hidden className={`absolute inset-0 -z-10 ${gradient}`} />
      {children}
    </Link>
  );
}

export const cardTitle = 'text-[32px] leading-none font-bold tracking-[-0.06em] uppercase lg:text-[48px]';

export function CaseStudies() {
  const { t } = useTranslation();

  return (
    <section id="case-studies" className="bg-ink font-montserrat text-white">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-6 py-20 lg:px-20">
        <div className="flex flex-col gap-3">
          <Kicker>{t('caseStudies.home.eyebrow')}</Kicker>
          <h2 className="flex flex-col gap-1 text-[clamp(2.25rem,3.125vw,3.75rem)] leading-none font-semibold tracking-[-0.06em] uppercase">
            <span>{t('caseStudies.home.title1')}</span>
            <span className="text-lime">{t('caseStudies.home.title2')}</span>
          </h2>
          <Lead>{t('caseStudies.home.lead')}</Lead>
        </div>

        <div className="flex flex-col gap-5 xl:flex-row">
          <CaseCard
            id="manovermetal"
            gradient="bg-[linear-gradient(180deg,transparent,#000_83.654%)]"
            sizes="(min-width: 1280px) 60vw, 100vw"
            // Пропорции карточки из макета (1100×540) держим на любой ширине — иначе картинка режется.
            className="min-h-[420px] gap-2.5 shadow-[4px_4px_0_0_var(--color-lime)] md:aspect-[1100/540] md:min-h-0 xl:w-[62.5%] xl:shrink-0"
          >
            <span className="flex flex-col gap-2.5">
              <span className="text-[18px] leading-6 font-semibold tracking-[-0.02em]">
                {t('caseStudies.home.manoverTagline')}
              </span>
              <span className={cardTitle}>{caseById('manovermetal').name}</span>
              <span className="text-[14px] leading-5 font-medium tracking-[-0.02em] opacity-40 2xl:whitespace-pre-line">
                {t('caseStudies.home.manoverText')}
              </span>
            </span>
            <More label={t('caseStudies.home.more')} />
          </CaseCard>

          <div className="grid gap-5 sm:grid-cols-2 xl:flex xl:flex-1 xl:flex-col">
            <CaseCard
              id="sapian"
              gradient="bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.8))]"
              sizes="(min-width: 1280px) 35vw, (min-width: 640px) 50vw, 100vw"
              className="h-[260px] xl:h-auto xl:flex-1"
            >
              <span className="flex flex-wrap items-end justify-between gap-x-6">
                <span className={cardTitle}>{caseById('sapian').name}</span>
                <More label={t('caseStudies.home.more')} />
              </span>
            </CaseCard>
            <CaseCard
              id="luna"
              gradient="bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.8)_83.654%)]"
              sizes="(min-width: 1280px) 35vw, (min-width: 640px) 50vw, 100vw"
              className="h-[260px] xl:h-auto xl:flex-1"
            >
              <span className="flex flex-wrap items-center justify-between gap-x-6">
                <span className={cardTitle}>{caseById('luna').name}</span>
                <More label={t('caseStudies.home.more')} />
              </span>
            </CaseCard>
          </div>
        </div>

        {/* В макете группа прижата вправо с отступом 772px из 1760 — кнопка стоит на месте при любой длине текста. */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-10 lg:justify-end lg:pr-[43.864%]">
          <span className="text-[14px] leading-5 font-medium tracking-[-0.02em] opacity-40">
            {t('caseStudies.home.othersText')}
          </span>
          <Link
            href="/cases"
            onClick={() => trackGoal(GOALS.casesViewAll)}
            className="shrink-0 whitespace-nowrap rounded-[40px] border border-white px-6 py-3 text-center text-[14px] leading-6 font-semibold tracking-[-0.02em] transition-colors hover:border-lime hover:text-lime"
          >
            {t('caseStudies.home.viewAllCases')}
          </Link>
        </div>
      </div>
    </section>
  );
}
