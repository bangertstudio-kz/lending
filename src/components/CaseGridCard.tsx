import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useInView } from 'motion/react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GOALS, trackGoal, trackParams } from '@/src/analytics';
import type { Case } from '@/src/store/casesStore';

/**
 * A/B-тест вида карточки кейса — на главной и в сетке /cases. Вариант выпадает посетителю один раз и живёт в localStorage;
 * в Метрику уходит параметром визита ab_case_card и в параметрах цели case_open.
 * Посмотреть конкретный вариант: /cases?ab=glass.
 */
const VARIANTS = ['caption', 'passport', 'glass'] as const;
export type CardVariant = (typeof VARIANTS)[number];
const STORAGE_KEY = 'ab_case_card';

const isVariant = (v: string | null): v is CardVariant => VARIANTS.includes(v as CardVariant);

function readVariant(): CardVariant {
  try {
    const forced = new URLSearchParams(window.location.search).get('ab');
    if (isVariant(forced)) localStorage.setItem(STORAGE_KEY, forced);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isVariant(saved)) return saved;
    const picked = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
    localStorage.setItem(STORAGE_KEY, picked);
    return picked;
  } catch {
    // Хранилище недоступно (приватный режим) — постоянный вариант, чтобы не прыгать между рендерами.
    return 'caption';
  }
}

/** null — на сервере и до гидрации: статическая страница не знает вариант посетителя. */
export function useCardVariant(): CardVariant | null {
  const variant = useSyncExternalStore(
    () => () => {},
    readVariant,
    () => null,
  );
  useEffect(() => {
    if (variant) trackParams({ ab_case_card: variant });
  }, [variant]);
  return variant;
}

const IMAGES = '/assets/home-cases';
// Длительность кроссфейда петли видео, с — совпадает с duration-700 у <video>.
const VIDEO_FADE = 0.7;

/** Первый кадр видео лежит рядом с ним: `luna.mp4` → `luna.jpg`. */
export const videoPoster = (video: string) => video.replace(/\.mp4$/, '.jpg');

// У этих кейсов есть обложки из макета главной; у остальных — картинка из cases.json.
export const HOME_COVERS = ['manovermetal', 'sapian', 'luna'];
// Кейсы с видео — под первым кадром, иначе при проявлении видео картинка скачет.
export const caseCover = (project: { id: string; image: string; video?: string }) =>
  project.video
    ? videoPoster(project.video)
    : HOME_COVERS.includes(project.id)
      ? `${IMAGES}/${project.id}.png`
      : project.image;

/** Обложка кейса; когда карточка видна — поверх неё плавно проявляется видео, если оно есть. */
export function CaseMedia({
  project,
  sizes,
  src,
  preload,
}: {
  project: Case;
  sizes: string;
  src?: string;
  /** Для обложки над сгибом — это LCP страницы. */
  preload?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Два экземпляра одного видео: под конец активного второй стартует с нуля и проявляется поверх —
  // так петля идёт кроссфейдом видео в видео, без вспышки обложки.
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  // Видео грузим только когда карточка доехала до экрана; вне экрана — пауза.
  const inView = useInView(ref, { amount: 0.3 });
  const seen = useInView(ref, { amount: 0.3, once: true });
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRefs.current[active];
    if (inView) video?.play().catch(() => {});
    else video?.pause();
  }, [inView, active]);

  const handleTimeUpdate = (index: number) => (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    if (index !== active || v.duration - v.currentTime > VIDEO_FADE) return;
    const next = videoRefs.current[1 - index];
    if (!next) return;
    next.currentTime = 0;
    next.play().catch(() => {});
    setActive(1 - index);
  };

  return (
    <div ref={ref} className="absolute inset-0">
      <Image
        src={src ?? caseCover(project)}
        alt={`${project.name} — проект Bangert Studio (${project.platforms.join(' / ')})`}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      {project.video &&
        [0, 1].map((index) => (
          <video
            key={index}
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
            // Второй экземпляр нужен только к концу первого — не делим с ним канал на старте.
            src={seen && (index === 0 || playing) ? project.video : undefined}
            muted
            playsInline
            preload={seen ? 'auto' : 'none'}
            aria-hidden
            onPlaying={() => setPlaying(true)}
            onTimeUpdate={handleTimeUpdate(index)}
            // Уходящее видео гаснет с задержкой, когда новое уже проявилось, — обложка не просвечивает.
            className={`absolute inset-0 size-full object-cover transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.03] ${
              playing && index === active ? 'z-[1] opacity-100' : 'opacity-0 delay-700'
            }`}
          />
        ))}
    </div>
  );
}

const name = 'text-[20px] sm:text-[24px] 2xl:text-[28px] leading-tight font-bold tracking-[-0.05em] uppercase';
const featuredName = 'text-[28px] sm:text-[36px] lg:text-[44px] 2xl:text-[48px] leading-none font-bold tracking-[-0.06em] uppercase';

export function CaseGridCard({
  project,
  variant,
  featured,
  aspect = 'aspect-[16/10]',
  sizes = '(min-width: 768px) 50vw, 100vw',
  preload,
  place = 'cases',
  className = '',
}: {
  project: Case;
  variant: CardVariant;
  /** Широкая карточка-витрина: слоган над названием и свой текст вместо описания кейса. */
  featured?: { tagline: string; text: string };
  aspect?: string;
  sizes?: string;
  preload?: boolean;
  place?: 'home' | 'cases';
  className?: string;
}) {
  const { t } = useTranslation();
  const description = featured?.text ?? t(`caseStudies.items.${project.id}`, { defaultValue: project.description });
  const title = featured ? featuredName : name;
  const link = {
    href: `/cases/${project.id}`,
    onClick: () => trackGoal(GOALS.caseOpen, { name: project.name, platform: project.platforms.join(' / '), place, variant }),
  };
  const media = <CaseMedia project={project} sizes={sizes} preload={preload} />;
  const tagline = featured && (
    <span className="text-[16px] sm:text-[18px] leading-6 font-semibold tracking-[-0.02em] text-lime">{featured.tagline}</span>
  );

  if (variant === 'passport') {
    return (
      <Link
        {...link}
        className={`group flex flex-col gap-3.5 rounded-[16px] border border-white/15 bg-white/[0.03] p-3.5 text-white transition-colors duration-300 hover:border-lime/50 ${className}`}
      >
        <span className="flex flex-wrap items-center justify-between gap-3 px-1.5 pt-1">
          <span className="flex flex-col gap-1.5">
            {tagline}
            <span className={title}>{project.name}</span>
          </span>
          <span className="flex gap-1.5">
            {project.platforms.map((p) => (
              <span key={p} className="rounded-[30px] border border-white/15 px-2.5 py-0.5 text-[12px] font-medium opacity-60">
                {p}
              </span>
            ))}
          </span>
        </span>
        <span className={`relative ${aspect} overflow-hidden rounded-[12px] bg-white/5`}>{media}</span>
        <span className="flex items-center justify-between gap-4 px-1.5 pb-1">
          <span className="min-w-0 max-w-[880px] text-[14px] leading-5 font-medium tracking-[-0.02em] opacity-60 line-clamp-2">
            {description}
          </span>
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime text-ink transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight size={20} />
          </span>
        </span>
      </Link>
    );
  }

  if (variant === 'glass') {
    return (
      <Link {...link} className={`group relative block ${aspect} overflow-hidden rounded-[12px] bg-white/5 text-white ${className}`}>
        {media}
        <span className="absolute bottom-3.5 left-3.5 z-[2] flex max-w-[calc(100%-90px)] flex-col gap-0.5 rounded-[12px] border border-white/20 bg-black/45 px-4 py-3 backdrop-blur-md backdrop-saturate-150">
          {featured && <span className="hidden sm:block">{tagline}</span>}
          <span className={featured ? featuredName : 'text-[16px] lg:text-[20px] leading-tight font-bold tracking-[-0.04em] uppercase'}>
            {project.name}
          </span>
          <span className="text-[12px] font-medium opacity-75">{project.platforms.join(' / ')}</span>
        </span>
        <span className="absolute right-3.5 bottom-3.5 z-[2] grid size-13 place-items-center rounded-full bg-lime text-ink transition-transform duration-300 group-hover:scale-105 group-hover:rotate-45">
          <ArrowUpRight size={22} />
        </span>
      </Link>
    );
  }

  return (
    <Link {...link} className={`group flex flex-col gap-4 text-white ${className}`}>
      <span className={`relative ${aspect} overflow-hidden rounded-[12px] bg-white/5 transition-transform duration-500 group-hover:-translate-y-1`}>
        {media}
      </span>
      <span className="flex items-center justify-between gap-4">
        <span className="flex min-w-0 flex-col gap-1">
          {tagline}
          <span className={title}>{project.name}</span>
          <span className="text-[14px] font-medium tracking-[-0.02em] opacity-40">
            {featured ? description : project.platforms.join(' / ')}
          </span>
        </span>
        <span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/20 transition-all duration-300 group-hover:rotate-45 group-hover:border-lime group-hover:bg-lime group-hover:text-ink">
          <ArrowUpRight size={20} />
        </span>
      </span>
    </Link>
  );
}
