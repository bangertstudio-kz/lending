'use client';

import { motion, useScroll, useSpring } from 'motion/react';

/** Тонкая линия прогресса под шапкой. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="absolute inset-x-0 bottom-0 h-px origin-left bg-accent"
    />
  );
}
