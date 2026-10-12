import type { ReactNode } from 'react';

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

/**
 * Обертка для кнопок и ссылок — магнитный эффект отключен для стабильного UX.
 */
export function Magnetic({ children, className = '' }: MagneticProps) {
  return <div className={`inline-flex ${className}`}>{children}</div>;
}
