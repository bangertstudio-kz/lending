'use client';

import type { ReactNode } from 'react';

/** Обычная стабильная кнопка без притягивания к курсору. */
export function MagneticButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer ${className ?? ''}`}
    >
      {children}
    </button>
  );
}
