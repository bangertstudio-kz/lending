'use client';

import { useState, useRef, type ReactNode, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  size?: number;
}

/**
 * Карточка с эффектом Spotlight (мягкая световая подсветка за курсором в стиле Vercel / Linear).
 * Освещает внутренний объем карточки и ее границы в точке взаимодействия.
 */
export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(210, 249, 73, 0.12)',
  size = 360,
}: SpotlightCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 200, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group/spotlight relative overflow-hidden ${className}`}
    >
      {/* Световое пятно за курсором */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
        }}
      >
        <motion.div
          className="absolute rounded-full blur-[30px]"
          style={{
            width: size,
            height: size,
            x: springX,
            y: springY,
            translateX: -size / 2,
            translateY: -size / 2,
            background: `radial-gradient(circle, ${spotlightColor} 0%, transparent 70%)`,
          }}
        />
      </motion.div>

      {/* Контент карточки */}
      {children}
    </div>
  );
}
