'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { GOALS, trackGoal } from '@/src/analytics';
import cases from '@/src/data/cases.json';
import { LimeButton } from './ui/block';
import { HeroDevices3D } from './HeroDevices3D';
import { Magnetic } from './ui/Magnetic';
import { SpotlightCard } from './ui/SpotlightCard';

const ICONS = '/assets/hero';

// Число считается из статичного файла, а не из макета: так оно попадает в серверный HTML.
const PROJECT_COUNT = cases.length;

function Icon({ name, size = 24 }: { name: string; size?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`${ICONS}/${name}.svg`} alt="" width={size} height={size} className="shrink-0" />;
}

const Divider = () => <div aria-hidden className="hidden w-px self-stretch rounded-[2px] bg-white/40 xl:block" />;

export function Hero() {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const headerOffset = 130;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative flex min-h-[100dvh] flex-col justify-between overflow-x-clip bg-black font-montserrat text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <Image src={`${ICONS}/bg.png`} alt="" fill preload sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_78.365%,#000_100%),linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6))]" />
      </div>

      <div
        className="relative mx-auto flex size-full max-w-[1920px] flex-1 flex-col justify-between px-6 pt-20 pb-5 sm:px-10 lg:px-16 xl:px-20 xl:pt-[clamp(4.5rem,8vh,6.5rem)] 2xl:pt-28 xl:pb-6 2xl:pb-8"
      >
        <div className="relative flex flex-1 flex-col justify-center xl:flex-row xl:items-center xl:justify-between py-2 sm:py-4 xl:py-0">
          <div
            className="relative z-10 flex max-w-[780px] 2xl:max-w-[831px] flex-col gap-4 sm:gap-6 lg:gap-6 xl:gap-[clamp(1.25rem,2.5vh,2.5rem)]"
          >
            <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 font-medium">
              <p className="text-[12px] sm:text-[14px] leading-5 tracking-[-0.02em] whitespace-pre-line uppercase opacity-40">
                {t('hero.eyebrow')}
              </p>
              <h1 className="text-[clamp(2.75rem,5.2vw,5.5rem)] 2xl:text-[7.5rem] leading-[0.9167] tracking-[-0.06em] uppercase">
                <span className="block">{t('hero.title1')}</span>
                <span className="block text-lime">{t('hero.title2')}</span>
                <span className="block">{t('hero.title3')}</span>
              </h1>
              <p className="text-[15px] sm:text-[17px] lg:text-[18px] 2xl:text-[20px] leading-6 sm:leading-7 2xl:leading-8 tracking-[-0.02em] max-w-[620px] xl:whitespace-pre-line">
                {t('hero.subtitle')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 2xl:gap-10">
              <Magnetic strength={0.25}>
                <LimeButton
                  onClick={() => {
                    trackGoal(GOALS.heroCtaConsultation);
                    scrollTo('contact');
                  }}
                >
                  {t('hero.ctaConsultation')}
                </LimeButton>
              </Magnetic>
              <Magnetic strength={0.3}>
                <button
                  type="button"
                  onClick={() => {
                    trackGoal(GOALS.heroCtaWork);
                    scrollTo('case-studies');
                  }}
                  className="group flex items-center gap-4 2xl:gap-5 text-[14px] leading-6 font-semibold tracking-[-0.02em]"
                >
                  <span className="flex rounded-[40px] border border-white p-[10px] 2xl:p-[11px] transition-colors group-hover:border-lime">
                    <Icon name="play" />
                  </span>
                  {t('hero.ctaWork')}
                </button>
              </Magnetic>
            </div>
          </div>

          <HeroDevices3D heroRef={heroRef} />
        </div>

        <div className="relative shrink-0 flex flex-col gap-3 lg:gap-4 xl:gap-5 pt-3 lg:pt-4">
          <div aria-hidden className="h-px rounded-[4px] bg-white/40" />
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-[13px] 2xl:text-[14px] leading-5 font-medium tracking-[-0.02em] uppercase md:flex md:flex-wrap xl:flex-nowrap md:items-center md:justify-between lg:gap-4 2xl:gap-6">
            <div className="flex w-auto sm:w-[130px] 2xl:w-[160px] shrink-0 flex-col gap-1">
              <div className="flex items-center gap-2 2xl:gap-3">
                <Icon name="build" size={32} />
                <span className="text-[32px] 2xl:text-[40px] leading-10 2xl:leading-12 font-semibold tracking-[-0.02em]">10+</span>
              </div>
              <span className="whitespace-pre-line opacity-40">{t('hero.yearsLabel')}</span>
            </div>
            <Divider />
            <div className="flex w-auto sm:w-[130px] 2xl:w-[160px] shrink-0 flex-col gap-1">
              <div className="flex items-center gap-2 2xl:gap-3">
                <Icon name="stack" size={32} />
                <span className="text-[32px] 2xl:text-[40px] leading-10 2xl:leading-12 font-semibold tracking-[-0.02em]">{PROJECT_COUNT}</span>
              </div>
              <span className="opacity-40">{t('hero.projectsLabel')}</span>
            </div>
            <Divider />
            <div className="flex w-auto sm:w-[160px] 2xl:w-[192px] shrink-0 flex-col gap-1">
              <div className="flex items-center gap-5 2xl:gap-[42px]">
                <Icon name="apple" />
                <Icon name="android" />
                <Icon name="web" />
              </div>
              <span className="whitespace-pre">IOS  /  ANDROID  /  WEB</span>
              <span className="opacity-40">{t('hero.platformsLabel')}</span>
            </div>

            <SpotlightCard className="col-span-2 max-[1280px]:order-last md:max-[1280px]:basis-full xl:flex-1 rounded-[16px] 2xl:rounded-[20px] self-stretch">
              <Link
                href="/calculator"
                onClick={() => trackGoal(GOALS.navClick, { item: '/calculator', place: 'hero' })}
                className="group flex size-full items-center justify-between gap-4 2xl:gap-8 rounded-[inherit] relative bg-[linear-gradient(90deg,rgba(210,249,73,0.2),rgba(210,249,73,0)),linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4))] p-3.5 2xl:p-[21px] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:p-px before:content-[''] before:bg-[linear-gradient(90deg,rgba(210,249,73,0.5),rgba(255,255,255,0.5))] before:[mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)] normal-case transition-all duration-300 hover:brightness-110"
              >
                <span className="flex items-center gap-3">
                  <Icon name="thunder" size={42} />
                  <span className="flex flex-col gap-0.5 leading-snug 2xl:leading-6">
                    <span className="text-[15px] 2xl:text-[18px] font-semibold tracking-[-0.02em]">{t('hero.estimateTitle')}</span>
                    <span className="text-[13px] 2xl:text-[16px] font-normal tracking-[-0.02em] text-white/80">{t('hero.estimateText')}</span>
                  </span>
                </span>
                <span className="flex shrink-0 rounded-[40px] border border-white/20 p-2 2xl:p-[11px] transition-colors group-hover:border-lime">
                  <Icon name="arrow-light" />
                </span>
              </Link>
            </SpotlightCard>

            <Divider />
            <div className="flex shrink-0 flex-col gap-1.5 2xl:gap-3">
              <span className="whitespace-pre-line opacity-40">{t('hero.openSourceLabel')}</span>
              <Magnetic strength={0.25}>
                <Link
                  href="/packages"
                  onClick={() => trackGoal(GOALS.devSolutionsCta, { place: 'hero' })}
                  className="flex w-fit items-center gap-2.5 2xl:gap-3 whitespace-nowrap rounded-[40px] border border-white/12 bg-black/60 px-3.5 py-1.5 2xl:p-[11px] text-[13px] 2xl:text-[14px] leading-6 font-semibold normal-case transition-colors hover:border-lime"
                >
                  <Icon name="cube" />
                  Open Source
                  <Icon name="arrow-light-2" />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
