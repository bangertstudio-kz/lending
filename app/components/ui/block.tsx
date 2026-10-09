import type { ReactNode } from 'react';
import { MagneticButton } from '../MagneticButton';
import { cn } from './utils';

/** Подпись «0X / раздел» с лаймовой линией под ней — шапка блоков нового макета. */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-fit flex-col gap-0.5">
      <span className="text-[14px] leading-6 font-medium tracking-[-0.02em] uppercase opacity-40">{children}</span>
      <span
        aria-hidden
        className="h-px bg-[linear-gradient(90deg,rgba(210,249,73,0.6),rgba(210,249,73,0)),linear-gradient(rgba(255,255,255,0.2),rgba(255,255,255,0.2))]"
      />
    </div>
  );
}

/** Строка-пояснение с лаймовой полосой слева. */
export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('flex gap-3 text-[18px] leading-8 font-medium tracking-[-0.02em] lg:text-[20px]', className)}>
      <span aria-hidden className="w-1 shrink-0 bg-lime" />
      <span className="opacity-60">{children}</span>
    </p>
  );
}

/** Лаймовая кнопка «Обсудить проект» со стрелкой. */
export function LimeButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <MagneticButton
      onClick={onClick}
      className="flex shrink-0 items-center gap-2.5 rounded-[40px] bg-lime whitespace-nowrap px-6 py-3 text-[14px] leading-6 font-semibold tracking-[-0.02em] text-ink transition-opacity hover:opacity-85"
    >
      {children}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/hero/arrow-dark.svg" alt="" width={24} height={24} className="shrink-0" />
    </MagneticButton>
  );
}

/** «Подробнее →» лаймом; стрелка сдвигается при наведении на родителя с классом group. */
export function More({ label }: { label: string }) {
  return (
    <span className="flex shrink-0 items-center gap-3 py-3 text-[14px] leading-6 font-medium tracking-[-0.02em] text-lime uppercase">
      {label}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/home-cases/arrow.svg"
        alt=""
        width={24}
        height={24}
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </span>
  );
}

/** К форме заявки: на главной — плавный скролл, на страницах без формы — переход на /#contact. */
export function goToContact() {
  const form = document.getElementById('contact');
  if (form) form.scrollIntoView({ behavior: 'smooth' });
  else window.location.href = '/#contact';
}
