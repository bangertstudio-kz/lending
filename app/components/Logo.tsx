'use client';

import { motion } from 'motion/react';

export function Logo({
  handleNavClick,
}: {
  handleNavClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  return (
    <motion.a
      href="/#hero"
      className="flex items-center gap-3"
      onClick={(e) => handleNavClick && handleNavClick(e, '#hero')}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/image.png" alt="Bangert Studio Logo" className="h-10 w-10 object-contain" />
      <span className="text-white text-2xl font-bold tracking-tight">
        Bangert<span className="text-white/60">Studio</span>
      </span>
    </motion.a>
  );
}
