'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useSpring } from 'motion/react';
import { useTranslation } from 'react-i18next';
import cases from '@/src/data/cases.json';
import { GOALS, trackGoal } from '@/src/analytics';
import { Kicker, More } from './ui/block';
import { Magnetic } from './ui/Magnetic';
import { TextScrub } from './ui/TextScrub';

const IMAGES = '/assets/home-cases';

const caseById = (id: string) => cases.find((project) => project.id === id)!;

// У этих кейсов есть обложки из макета главной; у остальных — картинка из cases.json.
export const HOME_COVERS = ['manovermetal', 'sapian', 'luna'];
export const caseCover = (project: { id: string; image: string }) =>
  HOME_COVERS.includes(project.id) ? `${IMAGES}/${project.id}.png` : project.image;

/** Карточка-ссылка на кейс с интерактивным 3D-наклоном и внутренним параллаксом */
export function CaseCard({
  id,
  gradient,
  className,
  innerClassName,
  sizes,
  src,
  place = 'home',
  children,
}: {
  id: string;
  gradient: string;
  className: string;
  innerClassName?: string;
  sizes: string;
  src?: string;
  place?: 'home' | 'cases';
  children: React.ReactNode;
}) {
  const project = caseById(id);
  const cardRef = useRef<HTMLAnchorElement>(null);

  const rotateX = useSpring(0, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 22 });
  const imgX = useSpring(0, { stiffness: 180, damping: 22 });
  const imgY = useSpring(0, { stiffness: 180, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    rotateX.set(-y * 7);
    rotateY.set(x * 7);
    imgX.set(-x * 12);
    imgY.set(-y * 12);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    imgX.set(0);
    imgY.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className={className}>
      <Link
        ref={cardRef}
        href={`/cases/${id}`}
        onClick={() =>
          trackGoal(GOALS.caseOpen, { name: project.name, platform: project.platform, place })
        }
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`group relative isolate flex size-full flex-col justify-end overflow-hidden rounded-[12px] text-white will-change-transform transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] ${
          innerClassName ?? (place === 'cases' ? 'p-5 sm:p-6 lg:p-6 2xl:p-8' : 'p-6 lg:p-10')
        }`}
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="absolute inset-0 size-full pointer-events-none"
        >
          <motion.div style={{ x: imgX, y: imgY, scale: 1.06 }} className="absolute -inset-4 size-[calc(100%+32px)]">
            <Image
              src={src ?? caseCover(project)}
              alt={`${project.name} — проект Bangert Studio (${project.platform})`}
              fill
              sizes={sizes}
              className="-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </motion.div>
        </motion.div>
        <div aria-hidden className={`pointer-events-none absolute inset-0 z-[1] ${gradient}`} />
        <div className="relative z-10 size-full flex flex-col justify-end">
          {children}
        </div>
      </Link>
    </div>
  );
}

export const cardTitle = 'text-[32px] leading-none font-bold tracking-[-0.06em] uppercase lg:text-[48px]';

export function CaseStudies() {
  const { t } = useTranslation();

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

        <div className="flex flex-col gap-5 xl:flex-row">
          <CaseCard
            id="manovermetal"
            gradient="bg-[linear-gradient(180deg,rgba(10,9,8,0.96)_0%,rgba(10,9,8,0.92)_60%,rgba(10,9,8,0.96)_100%)] xl:bg-[linear-gradient(90deg,#0A0908_0%,#0A0908_48%,rgba(10,9,8,0.7)_65%,transparent_85%)]"
            sizes="(min-width: 1280px) 67vw, 100vw"
            // Формат 16:9 для идеального соответствия пропорциям изображений проектов
            className="min-h-[380px] gap-2.5 rounded-[12px] ring-1 ring-lime/50 shadow-[0_4px_24px_rgba(210,249,73,0.18)] aspect-[16/9] sm:min-h-0 xl:w-[calc(66.666%-10px)] xl:shrink-0"
          >
            <span className="flex max-w-[620px] flex-col gap-2.5">
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

          <div className="grid gap-5 sm:grid-cols-2 xl:flex xl:w-[calc(33.333%-10px)] xl:flex-col xl:justify-between">
            <CaseCard
              id="sapian"
              gradient="bg-[linear-gradient(180deg,transparent_20%,rgba(0,0,0,0.65)_55%,#000_92%)]"
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="aspect-[16/9] w-full min-h-[220px] sm:min-h-0"
            >
              <span className="flex flex-wrap items-end justify-between gap-x-6">
                <span className={cardTitle}>{caseById('sapian').name}</span>
                <More label={t('caseStudies.home.more')} />
              </span>
            </CaseCard>
            <CaseCard
              id="luna"
              gradient="bg-[linear-gradient(180deg,transparent_20%,rgba(0,0,0,0.6)_55%,#000_92%)]"
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="aspect-[16/9] w-full min-h-[220px] sm:min-h-0"
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
