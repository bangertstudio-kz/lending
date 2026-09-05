import { Geist, Geist_Mono, Unbounded } from 'next/font/google';

// Один источник шрифтов на оба роутера. Сайт рендерится через Pages Router
// (pages/_app.tsx); app/layout.tsx обслуживает только /api и 404, поэтому
// переменные должны подключаться в обоих местах из одного определения.
//
// subsets обязательно включает 'cyrillic': без него русский текст
// откатывается на системный шрифт.
export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic'],
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'cyrillic'],
});

export const display = Unbounded({
  variable: '--font-display-family',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '600'],
});

// Для App Router (layout.tsx) — классы вешаются прямо на <html>, то есть на :root.
export const fontVariables = `${geistSans.variable} ${geistMono.variable} ${display.variable}`;
