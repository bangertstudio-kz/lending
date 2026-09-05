'use client';

import { motion } from 'motion/react';

export function Logo() {
  return (
    <motion.a
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
    </motion.a>
  );
}
