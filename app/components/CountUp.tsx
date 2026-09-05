'use client';

import { useEffect, useRef } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';

/**
 * Досчитывает число, когда блок попадает в кадр.
 *
 * На сервере сразу печатается итоговое значение: цифра видна без JS и
 * попадает в разметку для поисковиков. Анимация пишет в textContent
 * напрямую — React про неё не знает, поэтому нет ни лишних рендеров,
 * ни расхождения при гидратации.
 */
export function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduceMotion = useReducedMotion();
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || reduceMotion || !inView || started.current) return;
    started.current = true;

    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = format(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [inView, value, reduceMotion, format]);

  return <span ref={ref}>{format(value)}</span>;
}
