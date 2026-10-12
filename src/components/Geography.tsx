'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { GOALS, trackGoal } from '@/src/analytics';
import { Kicker, LimeButton, goToContact } from './ui/block';
import { Magnetic } from './ui/Magnetic';
import { TextScrub } from './ui/TextScrub';

const ASSETS = '/assets/geography';

// Порядок совпадает с geography.cities в локалях.
// x/y — % от карты 848×364: долгота/широта линейно на рамку контура (91–757 × 0–364 ≈ 46.49–87.32°E, 55.44–40.57°N).
// Фото, кроме Алматы (из макета), — Wikimedia Commons; credit обязателен по лицензии CC BY-SA.
const CITIES = [
  { photo: 'almaty.png', x: 69.21, y: 82.04 },
  { photo: 'astana.jpg', x: 58.74, y: 28.72, credit: 'Dauren Nabijan, CC0', source: 'Astana_Esil_view.jpg' },
  { photo: 'shymkent.jpg', x: 55.16, y: 88.23, credit: 'ほっきー, CC0', source: 'Shymkent_independence_square_in_2023.jpg' },
  { photo: 'karaganda.jpg', x: 61.9, y: 37.86, credit: 'Grin1372Go, CC BY-SA 3.0', source: 'Г._Караганда._Дворец_культуры_горняков_проспект_Б-Жирау_(ранее_пр.Советский).jpg' },
  { photo: 'aktobe.jpg', x: 31.27, y: 34.7, credit: 'Mheidegger, CC BY-SA 4.0', source: 'St._Nicolas_Cathedral_Aktobe_and_Nur_Ghasyr_mosque.jpg' },
  { photo: 'atyrau.jpg', x: 21.18, y: 56.15, credit: 'Zhanna Lorde, CC BY-SA 4.0', source: 'Урал_река.jpg' },
  { photo: 'aktau.jpg', x: 19.73, y: 79.29, credit: 'Vita86, CC BY-SA 3.0', source: 'Aktau_panorama_at_day.jpg' },
  { photo: 'pavlodar.jpg', x: 69.36, y: 21.18, credit: 'Djenalinov, CC BY-SA 4.0', source: 'Вид_на_центральную_набережную_города_Павлодара.jpg' },
];

export function Geography() {
  const { t } = useTranslation();
  const cities = t('geography.cities', { returnObjects: true }) as string[];
  const [active, setActive] = useState(0);
  const city = CITIES[active];

  // Координаты хаба в Алматы
  const hub = CITIES[0];

  return (
    <section id="geography" className="relative scroll-mt-32 bg-ink font-montserrat text-white">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-6 py-20 lg:px-20">
        <div className="flex flex-col gap-3">
          <Kicker>{t('geography.eyebrow')}</Kicker>
          <h2 className="text-[clamp(2.25rem,3.125vw,3.75rem)] leading-[1.1333] font-semibold tracking-[-0.06em] uppercase">
            <span className="block">
              {t('geography.title1')}
              <span className="text-lime">{t('geography.accent1')}</span>
            </span>
            <span className="block">
              {t('geography.title2')}
              <span className="text-lime">{t('geography.accent2')}</span>
            </span>
          </h2>
          <TextScrub
            text={t('geography.lead')}
            className="text-[18px] leading-7 tracking-[-0.02em] opacity-60 lg:text-[20px] max-w-[960px]"
          />
        </div>

        {/* В ряд — только с 1440px: правой части нужно ≥600px под список и фото. Ширины делят место 848:872, как в макете. */}
        <div className="flex flex-col gap-10 min-[1440px]:flex-row">
          {/* 848×364 из макета; SVG без сохранения пропорций — держим их через aspect. */}
          <div className="relative mx-auto aspect-[848/364] w-full max-w-[848px] min-[1440px]:mx-0 min-[1440px]:w-auto min-[1440px]:min-w-0 min-[1440px]:flex-[848_1_0] min-[1440px]:self-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${ASSETS}/kazakhstan.svg`} alt="" width={848} height={364} className="size-full" />

            {/* Живые световые соединительные дуги от Алматы к городам */}
            <svg
              className="pointer-events-none absolute inset-0 size-full overflow-hidden"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              {active !== 0 && (
                <g>
                  {/* Фоновая дуга свечения */}
                  <path
                    d={`M ${hub.x} ${hub.y} Q ${(hub.x + city.x) / 2} ${(hub.y + city.y) / 2 - 12} ${city.x} ${city.y}`}
                    fill="none"
                    stroke="#D2F949"
                    strokeWidth="0.6"
                    strokeDasharray="2 2"
                    className="opacity-70"
                  />
                  {/* Импульс света вдоль дуги */}
                  <path
                    d={`M ${hub.x} ${hub.y} Q ${(hub.x + city.x) / 2} ${(hub.y + city.y) / 2 - 12} ${city.x} ${city.y}`}
                    fill="none"
                    stroke="#D2F949"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    className="opacity-90 blur-[0.6px]"
                  />
                </g>
              )}
            </svg>

            {CITIES.map((c, i) => (
              <button
                key={c.photo}
                type="button"
                aria-label={cities[i]}
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
                className="group absolute flex size-8 -translate-1/2 cursor-pointer items-center justify-center"
              >
                {/* Радарная пульсация активной точки */}
                {i === active && (
                  <span className="pointer-events-none absolute -inset-2 rounded-full border border-lime animate-ping opacity-60" />
                )}
                {/* Кольцо 18px + точка 8px */}
                <span
                  className={`flex items-center justify-center rounded-full border border-lime transition-all ${
                    i === active ? 'size-7 shadow-[0_0_16px_rgba(210,249,73,0.7)]' : 'size-[18px] group-hover:size-5'
                  }`}
                >
                  <span className={`rounded-full bg-lime transition-all ${i === active ? 'size-3' : 'size-2'}`} />
                </span>
              </button>
            ))}
          </div>

          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center min-[1440px]:flex-[872_1_0]">
            <div className="flex flex-col gap-3 sm:px-5">
              <h3 className="text-[24px] leading-8 font-semibold tracking-[-0.02em]">{t('geography.citiesTitle')}</h3>
              <ul className="flex flex-wrap gap-x-5 sm:flex-col sm:gap-x-0">
                {cities.map((city, i) => (
                  <li key={city}>
                    <button
                      type="button"
                      aria-pressed={i === active}
                      onClick={() => setActive(i)}
                      className={`flex cursor-pointer items-center gap-2.5 py-2 text-[14px] leading-6 font-medium tracking-[-0.02em] uppercase transition-opacity ${
                        i === active ? 'text-lime' : 'opacity-40 hover:opacity-80'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {i === active && <img src={`${ASSETS}/dot.svg`} alt="" width={4} height={4} />}
                      {city}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex min-h-[320px] flex-1 flex-col justify-end self-stretch overflow-hidden rounded-[12px] p-6 lg:p-10">
              <AnimatePresence initial={false}>
                <motion.div
                  key={city.photo}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={`${ASSETS}/${city.photo}`}
                    alt=""
                    fill
                    sizes="(min-width: 1440px) 30vw, (min-width: 640px) 60vw, 100vw"
                    className="object-cover"
                    priority
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/80 pointer-events-none" />
                </motion.div>
              </AnimatePresence>

              {city.source && (
                <a
                  href={`https://commons.wikimedia.org/wiki/File:${city.source}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 right-4 z-10 text-[10px] leading-4 opacity-50 transition-opacity hover:opacity-90"
                >
                  {city.credit}
                </a>
              )}
              <p className="relative z-10 text-[36px] leading-none font-bold tracking-[-0.06em] uppercase lg:text-[48px]">
                {cities[active]}
              </p>
            </div>
          </div>
        </div>

        <div aria-hidden className="h-px rounded-[4px] bg-white opacity-40" />

        <div className="flex flex-col gap-3">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
            <p className="text-[20px] leading-7 tracking-[-0.02em] whitespace-pre-line lg:text-[24px]">
              {t('geography.outro')}
            </p>
            <Magnetic strength={0.3}>
              <LimeButton
                onClick={() => {
                  trackGoal(GOALS.heroCtaConsultation, { place: 'geography' });
                  goToContact();
                }}
              >
                {t('geography.cta')}
              </LimeButton>
            </Magnetic>
          </div>
          <p className="text-[14px] leading-6 tracking-[-0.02em]">{t('geography.note')}</p>
        </div>
      </div>
    </section>
  );
}

