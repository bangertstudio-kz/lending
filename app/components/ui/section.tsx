import type { ReactNode } from 'react';
import { cn } from './utils';

type Tone = 'bg' | 'surface' | 'raised';

const TONE_CLASS: Record<Tone, string> = {
  bg: 'bg-bg',
  surface: 'bg-surface',
  raised: 'bg-raised',
};

export function Section({
  id,
  tone = 'bg',
  glow = false,
  size = 'default',
  className,
  children,
}: {
  id?: string;
  tone?: Tone;
  glow?: boolean;
  size?: 'default' | 'compact';
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        'px-6',
        size === 'compact' ? 'py-12' : 'py-24 md:py-32',
        TONE_CLASS[tone],
        glow && 'glow-warm',
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * Короткая подпись над заголовком. Обычный регистр без разрядки:
 * набранный капсом «eyebrow» — типовое украшение, а не информация.
 * Ставим только там, где подпись действительно что-то сообщает.
 */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="text-accent text-small">{children}</span>;
}

export function SectionHeading({
  align = 'left',
  eyebrow,
  title,
  subtitle,
  className,
}: {
  align?: 'center' | 'left';
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center max-w-2xl mx-auto' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow}
      <h2 className="font-display font-semibold text-h2 text-fg text-balance">{title}</h2>
      {subtitle ? (
        <p className="text-body-lg text-muted text-pretty max-w-[58ch]">{subtitle}</p>
      ) : null}
    </div>
  );
}
