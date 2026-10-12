import { Geist, Geist_Mono, Montserrat, Unbounded } from 'next/font/google';

// Шрифты подключаются в pages/_app.tsx (переменные на :root).
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

export const montserrat = Montserrat({
  variable: '--font-montserrat-family',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
});

// Для App Router (layout.tsx) — классы вешаются прямо на <html>, то есть на :root.
export const fontVariables = `${geistSans.variable} ${geistMono.variable} ${display.variable} ${montserrat.variable}`;
