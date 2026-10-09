'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { GOALS, trackGoal } from '@/app/analytics';
import cases from '@/app/data/cases.json';
import { LimeButton } from './ui/block';

const ICONS = '/assets/hero';

// Число считается из статичного файла, а не из макета: так оно попадает в серверный HTML.
const PROJECT_COUNT = cases.length;

function Icon({ name, size = 24 }: { name: string; size?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`${ICONS}/${name}.svg`} alt="" width={size} height={size} className="shrink-0" />;
}

const Divider = () => <div aria-hidden className="hidden w-px self-stretch rounded-[2px] bg-white/40 min-[1680px]:block" />;

export function Hero() {
  const { t } = useTranslation();

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-black font-montserrat text-white xl:min-h-[960px]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image src={`${ICONS}/bg.png`} alt="" fill preload sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_78.365%,#000_100%),linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6))]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1920px] flex-col px-6 pt-32 pb-10 lg:px-20 xl:min-h-[960px] xl:pt-[158px]">
        <div className="relative flex-1">
          <div className="relative z-10 flex max-w-[831px] flex-col gap-10">
            <div className="flex flex-col gap-4 font-medium">
              <p className="text-[14px] leading-5 tracking-[-0.02em] whitespace-pre-line uppercase opacity-40">
                {t('hero.eyebrow')}
              </p>
              <h1 className="text-[clamp(3.5rem,6.25vw,7.5rem)] leading-[0.9167] tracking-[-0.06em] uppercase">
                <span className="block">{t('hero.title1')}</span>
                <span className="block text-lime">{t('hero.title2')}</span>
                <span className="block">{t('hero.title3')}</span>
              </h1>
              <p className="text-[18px] leading-8 tracking-[-0.02em] lg:text-[20px] xl:whitespace-pre-line">
                {t('hero.subtitle')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
              <LimeButton
                onClick={() => {
                  trackGoal(GOALS.heroCtaConsultation);
                  scrollTo('contact');
                }}
              >
                {t('hero.ctaConsultation')}
              </LimeButton>
              <button
                type="button"
                onClick={() => {
                  trackGoal(GOALS.heroCtaWork);
                  scrollTo('case-studies');
                }}
                className="group flex items-center gap-5 text-[14px] leading-6 font-semibold tracking-[-0.02em]"
              >
                <span className="flex rounded-[40px] border border-white p-[11px] transition-colors group-hover:border-lime">
                  <Icon name="play" />
                </span>
                {t('hero.ctaWork')}
              </button>
            </div>
          </div>

          {/* Координаты из макета 1920: картинка 783×522 со смещением 808/60 от контента. */}
          <div className="relative mx-auto mt-16 aspect-[783/522] w-full max-w-[783px] xl:absolute xl:top-[60px] xl:left-[45.9%] xl:mt-0 xl:w-[44.5%] xl:max-w-none">
            {/* В Figma тут эффект Glass (blur 6 + подсвеченная кромка) — в CSS приближаем. */}
            <div aria-hidden className="absolute top-[28.5%] left-[-3.7%] h-[64.4%] w-[107.4%] rounded-[20px] bg-[rgba(217,217,217,0.2)] shadow-[inset_1px_1px_0_rgba(255,255,255,0.3),inset_-1px_-1px_0_rgba(255,255,255,0.08)] backdrop-blur-[6px]" />
            <Image
              src={`${ICONS}/devices.png`}
              alt=""
              fill
              loading="eager"
              sizes="(min-width: 1280px) 45vw, 100vw"
              // Тень по альфе картинки, как в Figma; box-shadow обводил бы прямоугольник.
              // Blur вдвое меньше фигмовского radius: drop-shadow берёт сигму, сверено по пикселям.
              className="object-cover [filter:drop-shadow(0_276px_38px_rgba(241,227,200,0.01))_drop-shadow(0_177px_35px_rgba(241,227,200,0.06))_drop-shadow(0_44px_22px_rgba(241,227,200,0.34))_drop-shadow(0_11px_12px_rgba(241,227,200,0.39))]"
            />
          </div>
        </div>

        <div className="relative mt-16 flex flex-col gap-[26px] xl:mt-0">
          <div aria-hidden className="h-px rounded-[4px] bg-white/40" />
          {/* В одну строку, как в макете, полоса влезает от ~1680px (646 карточка + 4 колонки + зазоры).
              Ниже — колонки растянуты по краям, а карточка оценки уходит отдельной строкой вниз. */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 text-[14px] leading-5 font-medium tracking-[-0.02em] uppercase md:flex md:items-start md:justify-between md:max-[1680px]:flex-wrap">
            <div className="flex w-[160px] flex-col gap-1">
              <div className="flex items-center gap-3">
                <Icon name="build" size={36} />
                <span className="text-[40px] leading-12 font-semibold tracking-[-0.02em]">10+</span>
              </div>
              <span className="whitespace-pre-line opacity-40">{t('hero.yearsLabel')}</span>
            </div>
            <Divider />
            <div className="flex w-[160px] flex-col gap-1">
              <div className="flex items-center gap-3">
                <Icon name="stack" size={36} />
                <span className="text-[40px] leading-12 font-semibold tracking-[-0.02em]">{PROJECT_COUNT}</span>
              </div>
              <span className="opacity-40">{t('hero.projectsLabel')}</span>
            </div>
            <Divider />
            <div className="flex w-[192px] flex-col gap-1">
              <div className="flex items-center gap-[42px]">
                <Icon name="apple" />
                <Icon name="android" />
                <Icon name="web" />
              </div>
              <span className="whitespace-pre">IOS  /  ANDROID  /  WEB</span>
              <span className="opacity-40">{t('hero.platformsLabel')}</span>
            </div>

            <Link
              href="/calculator"
              onClick={() => trackGoal(GOALS.navClick, { item: '/calculator', place: 'hero' })}
              className="group col-span-2 flex max-[1680px]:order-last md:max-[1680px]:basis-full items-center justify-between gap-8 self-stretch rounded-[20px] relative bg-[linear-gradient(90deg,rgba(210,249,73,0.2),rgba(210,249,73,0)),linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.4))] p-[21px] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:p-px before:content-[''] before:bg-[linear-gradient(90deg,rgba(210,249,73,0.5),rgba(255,255,255,0.5))] before:[mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)] normal-case"
            >
              <span className="flex items-center gap-3">
                <Icon name="thunder" size={52} />
                <span className="flex flex-col gap-1 leading-6">
                  <span className="text-[18px] font-semibold tracking-[-0.02em]">{t('hero.estimateTitle')}</span>
                  <span className="text-[16px] font-normal tracking-[-0.02em]">{t('hero.estimateText')}</span>
                </span>
              </span>
              <span className="flex rounded-[40px] border border-white/20 p-[11px] transition-colors group-hover:border-lime">
                <Icon name="arrow-light" />
              </span>
            </Link>

            <Divider />
            <div className="flex flex-col gap-3">
              <span className="whitespace-pre-line">{t('hero.openSourceLabel')}</span>
              <Link
                href="/packages"
                onClick={() => trackGoal(GOALS.devSolutionsCta, { place: 'hero' })}
                className="flex w-fit items-center gap-3 whitespace-nowrap rounded-[40px] border border-white/12 bg-black/60 p-[11px] leading-6 font-semibold normal-case transition-colors hover:border-lime"
              >
                <Icon name="cube" />
                Open Source
                <Icon name="arrow-light-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
