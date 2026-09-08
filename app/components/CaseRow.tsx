'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ImageWithFallback } from './figma/ImageWithFallback';
import type { Case } from '@/app/store/casesStore';
import { GOALS, trackGoal } from '@/app/analytics';

export function CaseRow({ project, index }: { project: Case; index: number }) {
  const { t } = useTranslation();
  const rowRef = useRef<HTMLAnchorElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  // Изображение движется медленнее рамки — кадр «дышит» при прокрутке.
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ['start end', 'end start'],
  });
  const parallax = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  // Метка едет за курсором с небольшой инерцией.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const labelX = useSpring(pointerX, { stiffness: 350, damping: 30, mass: 0.4 });
  const labelY = useSpring(pointerY, { stiffness: 350, damping: 30, mass: 0.4 });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    pointerX.set(event.clientX - rect.left);
    pointerY.set(event.clientY - rect.top);
  };

  const flipped = index % 2 === 1;

  return (
    <a
      ref={rowRef}
      href={project.site}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackGoal(GOALS.caseOpen, { name: project.name, platform: project.platform, place: 'home' })
      }
      className="group grid items-start gap-10 md:grid-cols-12 md:gap-20"
    >
      <div
        ref={frameRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        className={`reveal-wipe relative overflow-hidden bg-surface md:col-span-6 ${
          flipped ? 'md:order-2 md:col-start-7' : ''
        }`}
      >
        <motion.div style={reduceMotion ? undefined : { y: parallax }} className="will-change-transform">
          <ImageWithFallback
            src={project.image}
            alt={project.name}
            className="aspect-square w-full scale-[1.14] object-cover"
          />
        </motion.div>

        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-10 flex h-24 w-24 items-center justify-center rounded-full bg-fg px-3 text-center text-xs font-medium text-bg"
          style={{ x: labelX, y: labelY, translateX: '-50%', translateY: '-50%' }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.6 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {t('caseStudies.viewSite')}
        </motion.span>
      </div>

      <div
        className={`md:sticky md:top-32 md:col-span-5 md:self-start ${
          flipped ? 'md:order-1 md:col-start-1' : ''
        }`}
      >
        <span className="font-mono text-small tabular-nums text-faint">
          {String(index + 1).padStart(2, '0')}
        </span>

        <h3 className="mt-5 font-display font-semibold text-h2 text-fg transition-colors group-hover:text-accent">
          {project.name}
        </h3>

        <p className="mt-6 text-body text-muted">
          {t(`caseStudies.items.${project.id}`, { defaultValue: project.description })}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="border border-hairline px-2 py-0.5 text-xs text-faint">
            {project.platform}
          </span>
          {project.site.includes('apps.apple.com') && (
            <span className="border border-accent/40 bg-accent-soft px-2 py-0.5 text-xs text-accent">
              {t('caseStudies.inAppStore')}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
