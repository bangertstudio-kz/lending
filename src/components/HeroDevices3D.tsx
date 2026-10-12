'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';

const ICONS = '/assets/hero';

interface HeroDevices3DProps {
  heroRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
  scrollYProgress?: MotionValue<number>;
}

export function HeroDevices3D({ heroRef, scrollYProgress: externalProgress }: HeroDevices3DProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  // Определение десктопа для включения 3D-параллакса мыши
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // 1. Привязка к скроллу секции Hero (из пропса или через target)
  const { scrollYProgress: internalProgress } = useScroll(
    heroRef ? { target: heroRef, offset: ['start start', 'end start'] } : {}
  );
  const activeProgress = externalProgress ?? internalProgress;

  // Физическое сглаживание скролла (пружина) для кино-эффекта без рывков
  const smoothScroll = useSpring(activeProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.0005,
  });

  // 2. Интерактивный 3D-наклон от курсора мыши (Desktop)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springMouseX = useSpring(mouseX, { stiffness: 75, damping: 20 });
  const springMouseY = useSpring(mouseY, { stiffness: 75, damping: 20 });

  useEffect(() => {
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Нормализация координат от -1 до 1
      const normalizedX = (e.clientX / innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / innerHeight) * 2 - 1;
      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDesktop, mouseX, mouseY]);

  // Трансформации наклона от мыши (в градусах)
  const mouseTiltX = useTransform(springMouseY, [-1, 1], [10, -10]);
  const mouseTiltY = useTransform(springMouseX, [-1, 1], [-12, 12]);
  const glareX = useTransform(springMouseX, [-1, 1], [-120, 120]);
  const glareY = useTransform(springMouseY, [-1, 1], [-80, 80]);

  // 3. Кинематографические трансформации скролла
  // 3D-поворот девайсов в пространстве при скролле вниз
  const scrollRotateX = useTransform(smoothScroll, [0, 0.5, 1], [0, 16, 26]);
  const scrollRotateY = useTransform(smoothScroll, [0, 0.5, 1], [-2, 10, -8]);
  const scrollRotateZ = useTransform(smoothScroll, [0, 0.5, 1], [-0.5, 3, 5]);

  // Динамический зум и вылет вперед в Z-пространстве
  const scrollScale = useTransform(smoothScroll, [0, 0.45, 1], [1, 1.07, 0.94]);
  const scrollTranslateY = useTransform(smoothScroll, [0, 1], [0, 75]);
  const scrollTranslateZ = useTransform(smoothScroll, [0, 0.5, 1], [0, 80, -40]);

  // Расхождение слоев (Parallax Separation):
  // Стеклянная подложка отлетает глубже назад с другой скоростью
  const glassTranslateY = useTransform(smoothScroll, [0, 1], [0, 130]);
  const glassRotateX = useTransform(smoothScroll, [0, 1], [0, 22]);
  const glassScale = useTransform(smoothScroll, [0, 1], [1, 0.88]);
  const glassOpacity = useTransform(smoothScroll, [0, 0.7, 1], [1, 0.75, 0.3]);

  // Портальная подсветка за девайсами (разгорается при скролле)
  const glowScale = useTransform(smoothScroll, [0, 0.45, 1], [0.95, 1.45, 1.1]);
  const glowOpacity = useTransform(smoothScroll, [0, 0.4, 0.85, 1], [0.45, 0.95, 0.7, 0.2]);
  const glowTranslateY = useTransform(smoothScroll, [0, 1], [0, 45]);

  // Суммируем поворот от скролла и мыши для идеального синергетического 3D
  const totalRotateX = useTransform(
    [scrollRotateX, mouseTiltX],
    ([sX, mX]) => (Number(sX) || 0) + (Number(mX) || 0)
  );
  const totalRotateY = useTransform(
    [scrollRotateY, mouseTiltY],
    ([sY, mY]) => (Number(sY) || 0) + (Number(mY) || 0)
  );

  return (
    <div
      className="relative mx-auto mt-4 sm:mt-6 aspect-[783/522] w-full max-w-[420px] sm:max-w-[540px] xl:absolute xl:right-0 xl:left-auto xl:top-1/2 xl:-translate-y-1/2 xl:mt-0 xl:w-[46%] xl:max-w-[760px]"
      style={{ perspective: 1200 }}
    >
      {/* 1. Портальное свечение (Ambient Volumetric Glow) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-4 sm:-inset-10 -z-20 rounded-full blur-[70px]"
        style={{
          background:
            'radial-gradient(55% 55% at 50% 50%, rgba(210, 249, 73, 0.28) 0%, rgba(217, 165, 102, 0.18) 45%, transparent 75%)',
          scale: glowScale,
          opacity: glowOpacity,
          y: glowTranslateY,
        }}
      />

      {/* Вторичный световой импульс по контуру */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[20%] left-[10%] h-[60%] w-[80%] -z-15 rounded-full blur-[90px]"
        style={{
          background: 'radial-gradient(circle, rgba(210, 249, 73, 0.15) 0%, transparent 70%)',
          scale: glowScale,
        }}
      />

      {/* 2. Стеклянная подложка с эффектом Glassmorphism (на десктопе с плавным градиентным растворением снизу) */}
      <motion.div
        aria-hidden
        className="hidden xl:block absolute top-[28.5%] left-[-3.7%] w-[107.4%] h-[68%] rounded-[24px] bg-[rgba(217,217,217,0.14)] shadow-[inset_1px_1px_0_rgba(255,255,255,0.4),0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-[8px] [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]"
        style={{
          transformStyle: 'preserve-3d',
          y: glassTranslateY,
          rotateX: glassRotateX,
          scale: glassScale,
          opacity: glassOpacity,
        }}
      >
        {/* Интерактивный световой блик на стекле (следует за курсором) */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden opacity-60"
        >
          <motion.div
            className="absolute -inset-[50%] blur-[40px]"
            style={{
              background:
                'radial-gradient(circle at center, rgba(255, 255, 255, 0.18) 0%, rgba(210, 249, 73, 0.08) 35%, transparent 65%)',
              x: glareX,
              y: glareY,
            }}
          />
        </motion.div>
      </motion.div>

      {/* 3. Главный 3D-слой с девайсами (Левитация + Скролл-ротация + Мышь) */}
      <motion.div
        className="relative size-full will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
          rotateX: totalRotateX,
          rotateY: totalRotateY,
          rotateZ: scrollRotateZ,
          scale: scrollScale,
          y: scrollTranslateY,
          z: scrollTranslateZ,
        }}
      >
        {/* Нулевая гравитация (Idle Floating): девайсы парят в пространстве */}
        <motion.div
          className="relative size-full"
          animate={
            isDesktop
              ? {
                  y: [0, -10, 0],
                  rotateZ: [0, 0.8, 0],
                }
              : undefined
          }
          transition={{
            duration: 6.5,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          <Image
            src={`${ICONS}/devices.png`}
            alt="Bangert Studio — разработка мобильных приложений для iOS и Android и веб-сервисов"
            fill
            priority
            sizes="(min-width: 1280px) 45vw, 100vw"
            className="object-contain object-center select-none pointer-events-none [filter:drop-shadow(0_276px_38px_rgba(241,227,200,0.01))_drop-shadow(0_177px_35px_rgba(241,227,200,0.06))_drop-shadow(0_44px_22px_rgba(241,227,200,0.34))_drop-shadow(0_11px_12px_rgba(241,227,200,0.39))]"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
