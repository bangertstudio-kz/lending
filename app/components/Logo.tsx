'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

// Переход на главную идёт через next/link — он сохраняет активную локаль.
// С обычным <a href="/#hero"> клик по логотипу сбрасывал язык на дефолтный.
const MotionLink = motion.create(Link);

export function Logo() {
  return (
    <MotionLink
      href="/#hero"
      className="flex items-center gap-3"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/image.png" alt="Bangert Studio Logo" className="h-10 w-10 object-contain" />
      <span className="font-display font-semibold text-fg text-h3 tracking-tight">
        Bangert<span className="text-faint">Studio</span>
      </span>
    </MotionLink>
  );
}
