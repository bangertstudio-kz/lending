# Редизайн «Премиальная студия» — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перевести весь сайт bangertstudio.kz на тёплую угольную дизайн-систему с засечной дисплейной типографикой и переписать копирайт с описания процесса на выгоду клиента.

**Architecture:** Дизайн-система объявляется в блоке `@theme` в `app/globals.css` — Tailwind v4 сам публикует из него CSS-переменные и утилиты. Компоненты перестают задавать цвета и кегли вручную и потребляют токены. Общая раскладка секций выносится в примитивы `app/components/ui/section.tsx`. Весь копирайт остаётся в `app/locales/{ru,en}.json` и сверяется скриптом.

**Tech Stack:** Next.js 16.2.4 (pages router), React 19.2.4, Tailwind CSS v4, motion 12, react-i18next 17, zustand 5, next/font/google.

**Spec:** `docs/superpowers/specs/2026-09-06-premium-redesign-design.md`

## Global Constraints

- **Токены — единственный источник цвета.** Новый и изменённый код не использует
  `text-white/60`, `border-white/10`, `bg-black`, `bg-zinc-*`, `bg-neutral-*`.
  Только классы от токенов: `text-fg`, `text-muted`, `text-faint`, `bg-bg`,
  `bg-surface`, `bg-raised`, `border-hairline`, `text-accent`.
- **Акцент `--accent` максимум 3 раза на экран.** Разрешён для надзаголовков
  (eyebrow), ключевых цифр и hover-состояний. В заливку кнопок акцент не идёт —
  главный CTA кремовый (`bg-fg text-bg`).
- **Заголовки `h1`/`h2` — только `font-display` (Playfair Display).** `h3` и ниже —
  `font-sans` (Geist).
- **Кегли берутся из шкалы** (`text-display`, `text-h1`, `text-h2`, `text-h3`,
  `text-body-lg`, `text-body`, `text-small`). Утилиты `text-4xl`, `text-6xl`,
  `text-xl` в переработанных компонентах не используются.
- **Разрешённые факты в текстах:** количество проектов и ссылок на App Store —
  вычисляются из `app/data/cases.json`; число пакетов, загрузки и лайки —
  из `/api/packages`; «10+ лет» опыта; «срок и бюджет известны до старта».
- **Запрещено в текстах:** выдуманные числа клиентов/проектов/процентов, отзывы,
  названия компаний-клиентов, обещания срока в неделях или днях, обещания
  времени ответа.
- **Каждый ключ существует и в `ru.json`, и в `en.json`.** Проверяется
  `npm run check:locales`.
- **Никакой TDD-цикл не применяется:** в проекте нет тестового раннера, и
  заводить его в рамках визуального редизайна — вне задачи. Роль автопроверки
  играют `npm run check:locales`, `npm run build` и `npm run lint`; каждая
  задача заканчивается ими.
- **Не трогать:** `app/api/*`, `app/store/*`, `app/data/calculator.json`,
  логику расчёта калькулятора, скрипт Яндекс.Метрики в `app/layout.tsx`.

---

## File Structure

| Файл | Ответственность |
|---|---|
| `app/globals.css` | Токены цвета, типографическая шкала, базовые стили. Единственное место, где объявляются цвета. |
| `app/layout.tsx` | Подключение шрифтов (Geist + Geist Mono + Playfair Display), CSS-переменные шрифтов. |
| `app/components/ui/section.tsx` | Примитивы раскладки: `Section`, `SectionHeading`, `Eyebrow`. Переиспользуются всеми секциями. |
| `app/components/ProofBar.tsx` | Полоса доказательств: считает цифры из cases-стора и packages-стора. |
| `app/components/*.tsx` | Секции, переведённые на токены и примитивы. |
| `pages/*` | Страницы: порядок секций, метаданные, раскладка. |
| `app/locales/{ru,en}.json` | Весь копирайт. |
| `scripts/check-locales.mjs` | Автопроверка паритета ключей между локалями. |

---

### Task 1: Дизайн-система — токены, шрифты, типографическая шкала

Фундамент. Всё остальное зависит от классов, которые появляются здесь.

**Files:**
- Modify: `app/globals.css` (переписывается целиком)
- Modify: `app/layout.tsx:1-20`

**Interfaces:**
- Consumes: ничего
- Produces: Tailwind-классы `bg-bg`, `bg-surface`, `bg-raised`, `text-fg`,
  `text-muted`, `text-faint`, `text-accent`, `bg-accent`, `border-hairline`,
  `border-hairline-strong`, `font-display`, `font-sans`, `font-mono`,
  `text-display`, `text-h1`, `text-h2`, `text-h3`, `text-body-lg`, `text-body`,
  `text-small`. Все последующие задачи используют только их.

- [ ] **Step 1: Заменить `app/globals.css` целиком**

```css
@import "tailwindcss";

/* В Tailwind v4 палитра объявляется прямо в @theme: он сам публикует
   CSS-переменные и генерирует утилиты. Обёртка :root + `@theme inline`
   с теми же именами дала бы циклическую ссылку. */
@theme {
  /* Поверхности — тёплый уголь вместо чистого чёрного */
  --color-bg: #0A0908;
  --color-surface: #121010;
  --color-raised: #1A1716;

  /* Линии */
  --color-hairline: rgba(245, 242, 237, 0.08);
  --color-hairline-strong: rgba(245, 242, 237, 0.16);

  /* Текст — тёплый белый, не стерильный #FFF */
  --color-fg: #F5F2ED;
  --color-muted: #A39C93;
  --color-faint: #6E665D;

  /* Акцент — приглушённая латунь. Максимум 3 появления на экран. */
  --color-accent: #D9A566;
  --color-accent-soft: rgba(217, 165, 102, 0.12);

  /* Шрифты. Переменные --font-playfair / --font-geist-* приходят из
     next/font и объявлены на <html> в app/layout.tsx. */
  --font-display: var(--font-playfair), Georgia, serif;
  --font-sans: var(--font-geist-sans), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;

  /* Типографическая шкала. Кегли задаются здесь, не в компонентах. */
  --text-display: clamp(2.75rem, 6vw, 4.5rem);
  --text-display--line-height: 1.05;
  --text-display--letter-spacing: -0.02em;

  --text-h1: clamp(2.25rem, 4.5vw, 3.25rem);
  --text-h1--line-height: 1.1;
  --text-h1--letter-spacing: -0.015em;

  --text-h2: clamp(1.875rem, 3.5vw, 2.5rem);
  --text-h2--line-height: 1.15;
  --text-h2--letter-spacing: -0.01em;

  --text-h3: 1.25rem;
  --text-h3--line-height: 1.35;

  --text-body-lg: 1.125rem;
  --text-body-lg--line-height: 1.6;

  --text-body: 1rem;
  --text-body--line-height: 1.6;

  --text-small: 0.875rem;
  --text-small--line-height: 1.5;
}

@layer base {
  * {
    border-color: var(--color-hairline);
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-fg);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }

  ::selection {
    background-color: var(--color-accent);
    color: var(--color-bg);
  }

  :focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}

/* Тёплая радиальная подсветка. Псевдоэлемент вкладывается внутрь @utility —
   писать `@utility glow-warm::before` нельзя, это не имя утилиты. */
@utility glow-warm {
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(
      60% 50% at 50% 0%,
      var(--color-accent-soft) 0%,
      transparent 70%
    );
  }
}
```

Что удалено намеренно: правило `h1..h4 { line-height: 1.5 }` (рыхлый крупный
кегль), `background-color: #000 !important` (блокировало систему токенов),
неиспользуемый блок `.dark` и токены светлой темы, `@custom-variant dark`.

Две ловушки Tailwind v4, на которые стоит обратить внимание при правке:
имена в `@theme` не должны ссылаться сами на себя через `var()` того же
имени, а `@utility` принимает только имя утилиты — псевдоэлементы
вкладываются внутрь через `&::before`.

- [ ] **Step 2: Подключить шрифты в `app/layout.tsx`**

Заменить блок импортов и объявлений шрифтов (строки 1–14):

```tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers';

// subsets обязательно включает 'cyrillic': без него весь русский текст
// рендерится системным запасным шрифтом.
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'cyrillic'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
});
```

- [ ] **Step 3: Прокинуть переменную Playfair в `<html>`**

В том же файле заменить className у `<html>`:

```tsx
<html
  lang="ru"
  className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
>
```

Тег `<body>` и блок `<Script id="yandex-metrika">` не трогать.

- [ ] **Step 4: Проверить сборку**

Run: `npm run build`
Expected: сборка проходит. Ожидаемо: страницы временно выглядят сломанно —
компоненты ещё используют старые классы `bg-black`/`text-white`. Это нормально,
их чинят задачи 4–12.

- [ ] **Step 5: Убедиться, что кириллица едет в Geist**

Run: `npm run dev`, открыть `http://localhost:3000`, в DevTools выбрать любой
русский текст → вкладка Computed → `font-family`.
Expected: применяется `__Geist_*`, а не системный fallback.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat(design): тёплая угольная палитра, типографическая шкала, кириллица в Geist"
```

---

### Task 2: Примитивы раскладки секций

Убирает копипаст `py-24 px-6` + центрированный `text-4xl mb-16` из шести секций.

**Files:**
- Create: `app/components/ui/section.tsx`

**Interfaces:**
- Consumes: токены и классы из Task 1
- Produces:
  - `<Section id?: string, tone?: 'bg' | 'surface' | 'raised', glow?: boolean, size?: 'default' | 'compact', className?: string, children>`
  - `<Eyebrow icon?: LucideIcon, children>`
  - `<SectionHeading align?: 'center' | 'left', eyebrow?: ReactNode, title: ReactNode, subtitle?: ReactNode, className?: string>`

- [ ] **Step 1: Создать `app/components/ui/section.tsx`**

```tsx
'use client';

import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
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
        size === 'compact' ? 'py-10' : 'py-28 md:py-32',
        TONE_CLASS[tone],
        glow && 'glow-warm',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ icon: Icon, children }: { icon?: LucideIcon; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-accent text-small font-mono uppercase tracking-[0.18em]">
      {Icon ? <Icon className="w-3.5 h-3.5" aria-hidden /> : null}
      {children}
    </span>
  );
}

export function SectionHeading({
  align = 'center',
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
    <motion.div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center max-w-2xl mx-auto' : 'items-start text-left',
        className,
      )}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow}
      <h2 className="font-display text-h2 text-fg text-balance">{title}</h2>
      {subtitle ? <p className="text-body-lg text-muted text-pretty">{subtitle}</p> : null}
    </motion.div>
  );
}
```

- [ ] **Step 2: Проверить типы и сборку**

Run: `npm run build`
Expected: сборка проходит, ошибок типов в `section.tsx` нет.

- [ ] **Step 3: Commit**

```bash
git add app/components/ui/section.tsx
git commit -m "feat(ui): примитивы Section, Eyebrow, SectionHeading"
```

---

### Task 3: Скрипт сверки локалей и переписанный копирайт

Копирайт идёт до компонентов: компоненты будут ссылаться на новые ключи
(`caseStudies.subtitle`, `proof.*`), поэтому ключи должны существовать раньше.

**Files:**
- Create: `scripts/check-locales.mjs`
- Modify: `package.json` (добавить скрипт)
- Modify: `app/locales/ru.json`
- Modify: `app/locales/en.json`

**Interfaces:**
- Consumes: ничего
- Produces: ключи `proof.projects`, `proof.appstore`, `proof.packages`,
  `proof.years`, `caseStudies.subtitle`, `caseStudies.inAppStore`,
  `services.subtitle`; переписанные значения существующих ключей.
  Команда `npm run check:locales`.

- [ ] **Step 1: Написать проверку паритета ключей**

Create `scripts/check-locales.mjs`:

```js
import { readFileSync } from 'node:fs';

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value && typeof value === 'object' && !Array.isArray(value)
      ? flatten(value, path)
      : [[path, value]];
  });

const load = (locale) =>
  new Map(flatten(JSON.parse(readFileSync(`app/locales/${locale}.json`, 'utf8'))));

const ru = load('ru');
const en = load('en');

const onlyRu = [...ru.keys()].filter((key) => !en.has(key));
const onlyEn = [...en.keys()].filter((key) => !ru.has(key));
const empty = [...ru, ...en].filter(([, value]) => typeof value === 'string' && !value.trim());

if (onlyRu.length || onlyEn.length || empty.length) {
  if (onlyRu.length) console.error('Есть в ru, нет в en:\n  ' + onlyRu.join('\n  '));
  if (onlyEn.length) console.error('Есть в en, нет в ru:\n  ' + onlyEn.join('\n  '));
  if (empty.length) console.error('Пустые значения:\n  ' + empty.map(([k]) => k).join('\n  '));
  process.exit(1);
}

console.log(`Локали синхронны: ${ru.size} ключей в ru и en.`);
```

- [ ] **Step 2: Зарегистрировать скрипт**

В `package.json` в блок `"scripts"` добавить строку:

```json
"check:locales": "node scripts/check-locales.mjs"
```

- [ ] **Step 3: Запустить проверку на текущих файлах**

Run: `npm run check:locales`
Expected: `Локали синхронны: 250 ключей в ru и en.`

- [ ] **Step 4: Переписать русский копирайт**

В `app/locales/ru.json` заменить перечисленные ключи. Остальные (в частности
~150 ключей `calculator.features.*` и `calculator.team.*` — это названия функций
и ролей) не трогать.

```jsonc
"hero": {
  "title": "Превращаем идею в ",
  "title1": "работающий продукт",
  "title2": " — а не в затянувшийся проект",
  "subtitle": "Мобильная и веб-разработка полного цикла. Срок и бюджет вы знаете до старта работ — не после.",
  "ctaConsultation": "Обсудить проект",
  "ctaWork": "Смотреть работы"
},
"proof": {
  "projects": "проектов в портфолио",
  "appstore": "приложений в App Store",
  "packages": "открытых решений",
  "years": "лет в разработке"
},
"services": {
  "title": "Что мы делаем",
  "subtitle": "Полный цикл: от требований до публикации и поддержки после релиза.",
  "iosDev": {
    "title": "Приложение в App Store",
    "description": "Берём на себя сборку, требования Apple и публикацию — вам не нужно разбираться в ревью."
  },
  "androidDev": {
    "title": "Android без отдельного бюджета",
    "description": "При заказе iOS-версии Android-сборка идёт без дополнительной оплаты."
  },
  "webDev": {
    "title": "Сайт, который приносит заявки",
    "description": "Лендинги, корпоративные сайты и веб-сервисы с упором на скорость загрузки, SEO и конверсию."
  },
  "uiux": {
    "title": "Интерфейс, понятный без инструкции",
    "description": "Проектируем экраны так, чтобы пользователь доходил до целевого действия, а не закрывал приложение."
  },
  "analytics": {
    "title": "Считаем объём до первой строчки кода",
    "description": "Фиксируем требования заранее, чтобы вы не платили дважды за переделку на середине проекта."
  },
  "maintenance": {
    "title": "Приложение не останется без присмотра",
    "description": "Обновляем под новые версии iOS и Android, чтобы через полгода оно не перестало запускаться."
  }
},
"caseStudies": {
  "title": "Работы",
  "subtitle": "Приложения, которые уже стоят у пользователей на телефонах.",
  "platform": "Платформа",
  "results": "Результаты",
  "viewSite": "Открыть проект",
  "viewAll": "Все проекты",
  "inAppStore": "В App Store"
},
"contact": {
  "title": "Расскажите о проекте",
  "subtitle": "Опишите задачу в двух словах — вернёмся с оценкой и уточняющими вопросами в рабочее время.",
  "name": "Имя",
  "email": "Email",
  "company": "Компания",
  "description": "Описание проекта",
  "send": "Отправить",
  "howContactWithYou": "Как с вами связаться?",
  "getInTouch": "Или напишите напрямую",
  "reachOut": "Выберите удобный канал — отвечаем в рабочее время.",
  "sent": "Заявка отправлена!",
  "sendError": "Ошибка отправки. Попробуйте ещё раз.",
  "sending": "Отправка..."
},
"footer": {
  "description": "Мобильная и веб-разработка полного цикла",
  "services": "Услуги",
  "company": "Компания",
  "about": "О нас",
  "careers": "Карьера",
  "blog": "Блог",
  "contact": "Контакты",
  "legal": "Правовая информация",
  "privacy": "Политика конфиденциальности",
  "terms": "Условия использования",
  "rights": "Все права защищены",
  "news": "Новости",
  "writeToUs": "Написать"
}
```

В блоке `calculator.cta` заменить:

```jsonc
"badge": "Оценка за 30 секунд",
"title": "Узнайте бюджет до первого созвона",
"subtitle": "Опишите идею — получите вилку бюджета, срок и состав команды. Без звонков и регистрации.",
"button": "Рассчитать",
"note": "Бесплатно · Без регистрации · Результат сразу"
```

В блоке `packages.home` заменить:

```jsonc
"badge": "Открытый код",
"title": "Ваш проект начинается не с нуля",
"subtitle": "Часть кода вашего приложения уже написана, протестирована и работает в реальных проектах. Мы публикуем её открыто — и переиспользуем в вашем продукте.",
"cta": "Посмотреть решения"
```

- [ ] **Step 5: Переписать английский копирайт**

Те же ключи в `app/locales/en.json`:

```jsonc
"hero": {
  "title": "We turn an idea into a ",
  "title1": "working product",
  "title2": " — not a project that drags on",
  "subtitle": "Full-cycle mobile and web development. You know the timeline and the budget before the work starts, not after.",
  "ctaConsultation": "Discuss your project",
  "ctaWork": "See our work"
},
"proof": {
  "projects": "projects shipped",
  "appstore": "apps on the App Store",
  "packages": "open-source solutions",
  "years": "years of development"
},
"services": {
  "title": "What we do",
  "subtitle": "Full cycle: from requirements to release and support after launch.",
  "iosDev": {
    "title": "An app on the App Store",
    "description": "We handle the build, Apple's requirements and the release — you never touch the review process."
  },
  "androidDev": {
    "title": "Android at no extra cost",
    "description": "Order the iOS version and the Android build comes with it, at no additional charge."
  },
  "webDev": {
    "title": "A site that brings in leads",
    "description": "Landing pages, corporate sites and web services built for load speed, SEO and conversion."
  },
  "uiux": {
    "title": "An interface that needs no manual",
    "description": "We design screens so users reach the action you care about instead of closing the app."
  },
  "analytics": {
    "title": "We scope it before the first line of code",
    "description": "Requirements are locked down early, so you don't pay twice for a rewrite halfway through."
  },
  "maintenance": {
    "title": "Your app won't be left unattended",
    "description": "We keep it current with new iOS and Android releases, so it doesn't stop launching six months from now."
  }
},
"caseStudies": {
  "title": "Work",
  "subtitle": "Apps that are already on users' phones.",
  "platform": "Platform",
  "results": "Results",
  "viewSite": "Open project",
  "viewAll": "All projects",
  "inAppStore": "On the App Store"
},
"contact": {
  "title": "Tell us about your project",
  "subtitle": "Describe the task in a couple of lines — we'll come back with an estimate and follow-up questions during business hours.",
  "name": "Name",
  "email": "Email",
  "company": "Company",
  "description": "Project description",
  "send": "Send",
  "howContactWithYou": "How should we reach you?",
  "getInTouch": "Or reach out directly",
  "reachOut": "Pick whichever channel suits you — we reply during business hours.",
  "sent": "Request sent!",
  "sendError": "Failed to send. Please try again.",
  "sending": "Sending..."
},
"footer": {
  "description": "Full-cycle mobile and web development",
  "services": "Services",
  "company": "Company",
  "about": "About",
  "careers": "Careers",
  "blog": "Blog",
  "contact": "Contact",
  "legal": "Legal",
  "privacy": "Privacy Policy",
  "terms": "Terms of Use",
  "rights": "All rights reserved",
  "news": "News",
  "writeToUs": "Write to us"
}
```

`calculator.cta` в `en.json`:

```jsonc
"badge": "A 30-second estimate",
"title": "Know the budget before the first call",
"subtitle": "Describe your idea and get a budget range, a timeline and a team breakdown. No calls, no sign-up.",
"button": "Estimate",
"note": "Free · No sign-up · Instant result"
```

`packages.home` в `en.json`:

```jsonc
"badge": "Open source",
"title": "Your project doesn't start from zero",
"subtitle": "Part of your app's code is already written, tested and running in real projects. We publish it openly — and reuse it in your product.",
"cta": "See the solutions"
```

- [ ] **Step 6: Проверить паритет и отсутствие запрещённых утверждений**

Run: `npm run check:locales`
Expected: `Локали синхронны: 257 ключей в ru и en.`

Run: `grep -nE "недел|weeks?|100\+|[0-9]+%|отзыв" app/locales/ru.json app/locales/en.json | grep -v "calculator.results\|calculator.features\|weeks"`
Expected: совпадений с обещаниями сроков или процентов нет (строка
`calculator.results.weeks` — это подпись единицы измерения в калькуляторе,
она остаётся).

- [ ] **Step 7: Commit**

```bash
git add scripts/check-locales.mjs package.json app/locales/ru.json app/locales/en.json
git commit -m "feat(copy): продающий копирайт от выгоды клиента + сверка локалей"
```

---

### Task 4: Header, Logo, Footer на токенах

Общая обвязка всех страниц — переводится до секций, чтобы дальше визуально
сравнивать результат на реальном фоне.

**Files:**
- Modify: `app/components/Header.tsx:39-46, 58-64, 96-113`
- Modify: `app/components/Logo.tsx:12-16`
- Modify: `app/components/Footer.tsx:20-90`

**Interfaces:**
- Consumes: токены из Task 1
- Produces: ничего для последующих задач

- [ ] **Step 1: Header — фон, границы, цвета ссылок**

В `app/components/Header.tsx` заменить класс шапки (условие `isScrolled`):

```tsx
className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
  isScrolled ? 'bg-bg/80 backdrop-blur-xl border-b border-hairline' : 'bg-transparent'
}`}
```

Класс десктопных ссылок (`motion.a` внутри `hidden md:flex`):

```tsx
className="text-muted hover:text-fg transition-colors text-small font-medium"
```

Кнопка бургера:

```tsx
className="md:hidden text-fg p-2"
```

Подложка мобильного меню и панель:

```tsx
className="absolute inset-0 bg-bg/90 backdrop-blur-xl"
```

```tsx
className="absolute top-20 left-6 right-6 bg-raised border border-hairline p-6"
```

Ссылки в мобильном меню:

```tsx
className="text-muted hover:text-fg transition-colors text-body-lg font-medium py-2 border-b border-hairline last:border-0"
```

И разделитель над переключателем языка: `className="pt-4 border-t border-hairline"`.

- [ ] **Step 2: Logo — тёплый белый вместо чистого**

В `app/components/Logo.tsx` заменить `<span>`:

```tsx
<span className="text-fg text-h3 font-display tracking-tight">
  Bangert<span className="text-faint">Studio</span>
</span>
```

- [ ] **Step 3: Footer — поверхность и цвета**

В `app/components/Footer.tsx` заменить тег footer:

```tsx
<footer className="bg-surface border-t border-hairline py-16 px-6">
```

Описание под логотипом: `className="text-muted text-small mt-3"`.

Почтовая ссылка: `className="text-muted hover:text-accent transition-colors"`.

Все три соц-ссылки: `className="text-faint hover:text-accent transition-colors"`.

Нижняя строка копирайта: обёртка
`className="mt-12 pt-8 border-t border-hairline text-center"`, текст
`className="text-faint text-small"`.

- [ ] **Step 4: Проверить**

Run: `npm run build && npm run lint`
Expected: сборка проходит, новых ошибок линта нет.

- [ ] **Step 5: Commit**

```bash
git add app/components/Header.tsx app/components/Logo.tsx app/components/Footer.tsx
git commit -m "feat(design): шапка, логотип и подвал на токенах"
```

---

### Task 5: Hero и полоса доказательств

**Files:**
- Modify: `app/components/Hero.tsx` (переписывается целиком)
- Create: `app/components/ProofBar.tsx`

**Interfaces:**
- Consumes: `Section` из Task 2; ключи `hero.*` и `proof.*` из Task 3;
  `useCasesStore` (`app/store/casesStore.ts`), `usePackagesStore`
  (`app/store/packagesStore.ts`)
- Produces: `<ProofBar />` — без пропсов, считает всё сам

- [ ] **Step 1: Переписать `app/components/Hero.tsx`**

```tsx
'use client';

import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useTranslation } from 'react-i18next';

export function Hero() {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const y = useTransform(scrollY, [0, 400], [0, 60]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="hero"
      className="glow-warm relative min-h-[92vh] flex items-center justify-center overflow-hidden px-6"
    >
      <motion.div className="relative z-10 max-w-4xl mx-auto py-32 text-center" style={{ opacity, y }}>
        <motion.h1
          className="font-display text-display text-fg text-balance mb-8"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {t('hero.title')}
          <span className="text-accent italic">{t('hero.title1')}</span>
          {t('hero.title2')}
        </motion.h1>

        <motion.p
          className="text-body-lg text-muted max-w-xl mx-auto mb-12 text-pretty"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {t('hero.subtitle')}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            onClick={() => scrollTo('contact')}
            className="group inline-flex items-center gap-2 bg-fg text-bg px-7 py-3.5 text-small font-semibold hover:bg-accent transition-colors"
          >
            {t('hero.ctaConsultation')}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => scrollTo('case-studies')}
            className="inline-flex items-center gap-2 border border-hairline-strong text-fg px-7 py-3.5 text-small font-semibold hover:border-accent hover:text-accent transition-colors"
          >
            {t('hero.ctaWork')}
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
```

Заметки: `min-h-screen` заменён на `min-h-[92vh]`, чтобы край следующей секции
подглядывал снизу и приглашал скроллить. Компонент `Button` из `ui/button.tsx`
здесь не используется — его варианты завязаны на мёртвые токены светлой темы
(`bg-primary`, `border-input`); переводить его в рамках этой задачи не нужно.

- [ ] **Step 2: Создать `app/components/ProofBar.tsx`**

Числа считаются из данных: в `cases.json` ссылок на App Store сейчас пять, и
захардкоженная шестёрка была бы неправдой.

```tsx
'use client';

import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useCasesStore } from '@/app/store/casesStore';
import { usePackagesStore } from '@/app/store/packagesStore';

export function ProofBar() {
  const { t } = useTranslation();
  const { cases, fetch: fetchCases } = useCasesStore();
  const { packages, fetch: fetchPackages } = usePackagesStore();

  useEffect(() => {
    fetchCases();
    fetchPackages();
  }, [fetchCases, fetchPackages]);

  const appStoreCount = cases.filter((item) => item.site.includes('apps.apple.com')).length;

  const items = [
    { value: cases.length, label: t('proof.projects') },
    { value: appStoreCount, label: t('proof.appstore') },
    { value: packages.length, label: t('proof.packages') },
    { value: '10+', label: t('proof.years') },
  ];

  return (
    <motion.div
      className="border-y border-hairline bg-surface"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <dl className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-hairline">
        {items.map((item) => (
          <div key={item.label} className="py-8 px-4 text-center">
            <dt className="font-mono text-h2 text-accent tabular-nums">
              {typeof item.value === 'number' && item.value === 0 ? '—' : item.value}
            </dt>
            <dd className="text-faint text-small leading-snug mt-1">{item.label}</dd>
          </div>
        ))}
      </dl>
    </motion.div>
  );
}
```

- [ ] **Step 3: Проверить**

Run: `npm run build && npm run lint`
Expected: проходит.

- [ ] **Step 4: Убедиться, что цифры реальные**

Run: `node -e "const c=require('./app/data/cases.json'); console.log('cases:',c.length,'appstore:',c.filter(x=>x.site.includes('apps.apple.com')).length)"`
Expected: `cases: 10 appstore: 5`. Эти же числа должны появиться в полосе
после подключения в Task 7.

- [ ] **Step 5: Commit**

```bash
git add app/components/Hero.tsx app/components/ProofBar.tsx
git commit -m "feat(design): новый Hero и полоса доказательств из реальных данных"
```

---

### Task 6: Кейсы на главной

**Files:**
- Modify: `app/components/CaseStudies.tsx` (переписывается целиком)

**Interfaces:**
- Consumes: `Section`, `SectionHeading` из Task 2; ключи `caseStudies.*` из Task 3
- Produces: ничего

- [ ] **Step 1: Переписать `app/components/CaseStudies.tsx`**

Карусель заменяется сеткой: три горизонтальные стрелки-карусели подряд на
тёмном фоне читаются тяжело, а сетка из шести работ даёт доказательство сразу.

```tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Section, SectionHeading } from './ui/section';
import { useCasesStore } from '@/app/store/casesStore';

export function CaseStudies() {
  const { t } = useTranslation();
  const { cases, fetch } = useCasesStore();

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <Section id="case-studies" tone="surface">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          align="left"
          title={t('caseStudies.title')}
          subtitle={t('caseStudies.subtitle')}
          className="mb-14"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cases.slice(0, 6).map((project, index) => (
            <motion.a
              key={project.name}
              href={project.site}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-raised border border-hairline hover:border-accent transition-colors"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
            >
              <div className="aspect-[4/3] overflow-hidden bg-surface">
                <ImageWithFallback
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>

              <div className="p-6 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-fg text-h3">{project.name}</h3>
                  <ArrowUpRight className="w-4 h-4 text-faint group-hover:text-accent transition-colors shrink-0 mt-1" />
                </div>

                <p className="text-muted text-small leading-relaxed flex-1">{project.description}</p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="font-mono text-faint text-xs border border-hairline px-2 py-0.5">
                    {project.platform}
                  </span>
                  {project.site.includes('apps.apple.com') && (
                    <span className="font-mono text-accent text-xs border border-accent/40 bg-accent-soft px-2 py-0.5">
                      {t('caseStudies.inAppStore')}
                    </span>
                  )}
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 text-muted hover:text-accent text-small border-b border-hairline hover:border-accent pb-1 transition-colors"
          >
            {t('caseStudies.viewAll')}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Проверить, что карусель больше нигде не нужна**

Run: `grep -rn "ui/carousel" app pages`
Expected: совпадений нет. Если так — удалить неиспользуемый файл:

```bash
git rm app/components/ui/carousel.tsx
```

Если совпадения есть — файл оставить.

- [ ] **Step 3: Проверить**

Run: `npm run build && npm run lint`
Expected: проходит. Если удалён `carousel.tsx`, убедиться, что
`embla-carousel-react` больше не импортируется: `grep -rn "embla" app pages`.

- [ ] **Step 4: Commit**

```bash
git add -A app/components/CaseStudies.tsx app/components/ui
git commit -m "feat(design): кейсы сеткой с бейджем App Store"
```

---

### Task 7: Услуги, порядок секций на главной, чистка мёртвого кода

**Files:**
- Modify: `app/components/Services.tsx` (переписывается целиком)
- Modify: `pages/index.tsx:1-50`
- Modify: `app/components/MobileScrollButton.tsx:8`

**Interfaces:**
- Consumes: `Section`, `SectionHeading` из Task 2; `ProofBar` из Task 5;
  ключи `services.*` из Task 3
- Produces: финальный порядок секций главной

- [ ] **Step 1: Переписать `app/components/Services.tsx` с асимметричной раскладкой**

Заголовок уезжает влево и залипает, список идёт справа — это ломает вертикаль
из одинаковых центрированных секций.

```tsx
'use client';

import { Apple, Smartphone, Palette, Shield, Globe, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Section, SectionHeading } from './ui/section';

const services = [
  { icon: Apple, titleKey: 'services.iosDev.title', descriptionKey: 'services.iosDev.description' },
  { icon: Smartphone, titleKey: 'services.androidDev.title', descriptionKey: 'services.androidDev.description' },
  { icon: Globe, titleKey: 'services.webDev.title', descriptionKey: 'services.webDev.description' },
  { icon: Palette, titleKey: 'services.uiux.title', descriptionKey: 'services.uiux.description' },
  { icon: BarChart3, titleKey: 'services.analytics.title', descriptionKey: 'services.analytics.description' },
  { icon: Shield, titleKey: 'services.maintenance.title', descriptionKey: 'services.maintenance.description' },
];

export function Services() {
  const { t } = useTranslation();

  return (
    <Section id="services">
      <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
        <SectionHeading
          align="left"
          title={t('services.title')}
          subtitle={t('services.subtitle')}
          className="lg:sticky lg:top-32 lg:self-start"
        />

        <div className="grid gap-px bg-hairline border border-hairline sm:grid-cols-2">
          {services.map((service, index) => (
            <motion.article
              key={service.titleKey}
              className="group bg-bg hover:bg-raised transition-colors p-7 flex flex-col gap-4"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (index % 2) * 0.06 }}
            >
              <service.icon
                className="w-5 h-5 text-faint group-hover:text-accent transition-colors"
                aria-hidden
              />
              <h3 className="text-fg text-h3 text-balance">{t(service.titleKey)}</h3>
              <p className="text-muted text-small leading-relaxed">{t(service.descriptionKey)}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Пересобрать главную**

В `pages/index.tsx` удалить строку 6 (`import { WhyChooseUs } ...`) — компонент
импортируется, но не рендерится. Добавить импорт `ProofBar` и изменить порядок:
услуги теперь идут до калькулятора, потому что считать стоимость раньше, чем
клиент узнал состав услуг, — преждевременно.

Блок разметки заменить на:

```tsx
<div className="min-h-screen bg-bg relative">
  <Header />
  <div className="relative">
    <Hero />
    <ProofBar />
    <CaseStudies />
    <Services />
    <CalculatorCTA />
    <DevSolutions />
    <ContactForm />
    <Footer />
  </div>
  <MobileScrollButton />
</div>
```

Импорты в шапке файла привести к:

```tsx
import { Header } from '../app/components/Header';
import { Hero } from '../app/components/Hero';
import { ProofBar } from '../app/components/ProofBar';
import { CaseStudies } from '../app/components/CaseStudies';
import { Services } from '../app/components/Services';
import { CalculatorCTA } from '../app/components/CalculatorCTA';
import { DevSolutions } from '../app/components/DevSolutions';
import { ContactForm } from '../app/components/ContactForm';
import { Footer } from '../app/components/Footer';
import { MobileScrollButton } from '../app/components/MobileScrollButton';
```

- [ ] **Step 3: Починить список секций в `MobileScrollButton.tsx`**

Строка 8 перечисляет `why-choose-us` и `testimonials`, которых на странице нет —
кнопка листает в никуда. Заменить на реальные id в новом порядке:

```tsx
const sections = ['hero', 'case-studies', 'services', 'contact'];
```

- [ ] **Step 4: Проверить**

Run: `npm run build && npm run lint`
Expected: проходит, предупреждения о неиспользуемом импорте `WhyChooseUs` больше нет.

- [ ] **Step 5: Проверить прокрутку вручную**

Run: `npm run dev`, открыть главную на ширине 390px, нажать плавающую кнопку
четыре раза.
Expected: прокрутка идёт hero → кейсы → услуги → контакты, кнопка исчезает внизу.

- [ ] **Step 6: Commit**

```bash
git add app/components/Services.tsx app/components/MobileScrollButton.tsx pages/index.tsx
git commit -m "feat(design): асимметричные услуги, новый порядок секций, чистка мёртвого кода"
```

---

### Task 8: Калькулятор-CTA и DevSolutions

**Files:**
- Modify: `app/components/CalculatorCTA.tsx:28-95`
- Modify: `app/components/DevSolutions.tsx:44-140`

**Interfaces:**
- Consumes: `Section`, `SectionHeading`, `Eyebrow` из Task 2; ключи
  `calculator.cta.*` и `packages.home.*` из Task 3
- Produces: ничего

- [ ] **Step 1: CalculatorCTA — акцентная секция**

В `app/components/CalculatorCTA.tsx` заменить импорты и разметку. Секция
получает `tone="raised"` и подсветку — это единственный блок такого тона на
главной, за счёт чего он читается как призыв.

Добавить к импортам:

```tsx
import { Section, SectionHeading, Eyebrow } from './ui/section';
```

Заменить внешний `<section className="py-24 px-6 bg-black">` на
`<Section tone="raised" glow>`, а закрывающий `</section>` — на `</Section>`.

Заголовочный блок (`motion.div` с бейджем, h2 и p) заменить на:

```tsx
<SectionHeading
  eyebrow={<Eyebrow icon={Sparkles}>{t('calculator.cta.badge')}</Eyebrow>}
  title={t('calculator.cta.title')}
  subtitle={t('calculator.cta.subtitle')}
  className="mb-10"
/>
```

Рамку поля ввода заменить на:

```tsx
<div className="border border-hairline bg-bg focus-within:border-accent transition-colors">
```

Само поле:

```tsx
className="w-full bg-transparent px-6 pt-6 pb-4 text-fg placeholder:text-faint resize-none focus:outline-none text-body"
```

Счётчик символов: `className="text-faint text-xs font-mono"`.

Кнопку:

```tsx
className="flex items-center gap-2 bg-fg text-bg px-6 py-2.5 text-small font-semibold hover:bg-accent transition-colors"
```

Нижнюю подпись: `className="text-center text-faint text-xs mt-4"`.

- [ ] **Step 2: DevSolutions — под систему**

В `app/components/DevSolutions.tsx` добавить импорт:

```tsx
import { Section, SectionHeading, Eyebrow } from './ui/section';
```

Заменить `<section className="py-24 px-6 bg-black">` на `<Section tone="surface">`
и закрывающий тег на `</Section>`.

Заголовочный блок заменить на:

```tsx
<SectionHeading
  eyebrow={<Eyebrow icon={Boxes}>{t('packages.home.badge')}</Eyebrow>}
  title={t('packages.home.title')}
  subtitle={t('packages.home.subtitle')}
  className="mb-12"
/>
```

Полосу статистики:

```tsx
className="grid grid-cols-3 border-y border-hairline divide-x divide-hairline mb-12"
```

Значение статистики: `className="font-mono text-h2 text-accent mb-1 tabular-nums"`,
подпись: `className="text-faint text-xs leading-snug"`.

В блоке преимуществ: иконка `className="w-5 h-5 text-accent mb-4"`, заголовок
`className="text-fg text-h3 mb-2"`, текст
`className="text-muted text-small leading-relaxed"`.

Кнопку CTA:

```tsx
className="inline-flex items-center gap-2 bg-fg text-bg px-6 py-3 text-small font-semibold hover:bg-accent transition-colors"
```

- [ ] **Step 3: Проверить**

Run: `npm run build && npm run lint`
Expected: проходит.

- [ ] **Step 4: Проверить, что акцент не расплылся**

Run: `grep -c "text-accent\|bg-accent\|border-accent" app/components/DevSolutions.tsx`
Expected: не больше 6 совпадений на компонент (иконки преимуществ + цифры +
hover CTA). Если больше — сократить: правило «не больше трёх появлений на экран».

- [ ] **Step 5: Commit**

```bash
git add app/components/CalculatorCTA.tsx app/components/DevSolutions.tsx
git commit -m "feat(design): калькулятор-CTA и open-source блок на токенах"
```

---

### Task 9: Секция контактов

**Files:**
- Modify: `app/components/ContactForm.tsx:10-60`
- Modify: `app/components/ContactInlineForm.tsx`
- Modify: `app/components/ContactLinks.tsx:26-45`

**Interfaces:**
- Consumes: `Section` из Task 2; ключи `contact.*` из Task 3
- Produces: ничего

- [ ] **Step 1: Прочитать текущую форму**

Run: `cat app/components/ContactInlineForm.tsx`
Нужно увидеть точные классы полей перед заменой — форма содержит состояния
отправки и ошибок, их логику трогать нельзя.

- [ ] **Step 2: ContactForm — обёртка**

В `app/components/ContactForm.tsx` добавить импорт `import { Section } from './ui/section';`,
заменить `<section id="contact" className="bg-black py-24 px-6">` на
`<Section id="contact" tone="bg">`, закрывающий тег — на `</Section>`.

Заголовки обеих колонок: `className="font-display text-h2 text-fg mb-4"`.
Подписи под ними: `className="text-muted text-body mb-8"`.

- [ ] **Step 3: ContactInlineForm — поля**

Все текстовые поля и `textarea` привести к единому классу (логику отправки,
обработчики и состояния не менять):

```tsx
className="w-full bg-surface border border-hairline px-4 py-3 text-fg text-body placeholder:text-faint focus:border-accent focus:outline-none transition-colors"
```

Кнопку отправки:

```tsx
className="inline-flex items-center justify-center gap-2 bg-fg text-bg px-7 py-3.5 text-small font-semibold hover:bg-accent transition-colors disabled:opacity-40 disabled:pointer-events-none"
```

Сообщение об успехе — `className="text-accent text-small"`, об ошибке —
`className="text-red-400 text-small"`.

- [ ] **Step 4: ContactLinks — карточки каналов**

В `app/components/ContactLinks.tsx` заменить классы у `<a>`:

```tsx
className="flex items-center gap-4 p-4 bg-surface border border-hairline hover:border-accent transition-colors group"
```

Кружок иконки: `className="bg-raised p-3 rounded-full group-hover:bg-accent-soft transition-colors"`,
сама иконка: `className="w-5 h-5 text-muted group-hover:text-accent transition-colors"`.

Название канала: `className="text-faint text-xs font-mono uppercase tracking-wider"`,
значение: `className="text-fg text-small"`.

- [ ] **Step 5: Проверить отправку формы**

Run: `npm run build && npm run dev`, заполнить форму на главной и отправить.
Expected: появляется текст `contact.sent`, запрос уходит на `/api/contact`
(видно во вкладке Network). Логика не должна была измениться.

- [ ] **Step 6: Commit**

```bash
git add app/components/ContactForm.tsx app/components/ContactInlineForm.tsx app/components/ContactLinks.tsx
git commit -m "feat(design): секция контактов на токенах"
```

---

### Task 10: Страница /cases

**Files:**
- Modify: `pages/cases/index.tsx:36-95`

**Interfaces:**
- Consumes: ключи `caseStudies.*` из Task 3
- Produces: ничего

- [ ] **Step 1: Заменить список на крупную сетку**

Превью 96×96 в строке 66 делает работы мелкими и дешёвыми. Заменить блок
`<main>` целиком:

```tsx
<main className="max-w-6xl mx-auto px-6 pt-36 pb-28">
  <motion.h1
    className="font-display text-h1 text-fg mb-4"
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    {t('caseStudies.title')}
  </motion.h1>

  <motion.p
    className="text-muted text-body-lg mb-16 max-w-xl"
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.1 }}
  >
    {t('caseStudies.subtitle')}
  </motion.p>

  {loading && <p className="text-faint text-center text-small">{t('packages.loading')}</p>}
  {error && <p className="text-red-400 text-center text-small">{error}</p>}

  {!loading && !error && (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cases.map((project, index) => (
        <motion.a
          key={project.name}
          href={project.site}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col bg-surface border border-hairline hover:border-accent transition-colors"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.05 }}
        >
          <div className="aspect-[4/3] overflow-hidden bg-raised">
            <ImageWithFallback
              src={project.image}
              alt={project.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </div>

          <div className="p-6 flex flex-col gap-3 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-fg text-h3">{project.name}</h2>
              <ArrowUpRight className="w-4 h-4 text-faint group-hover:text-accent transition-colors shrink-0 mt-1" />
            </div>

            <p className="text-muted text-small leading-relaxed flex-1">{project.description}</p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="font-mono text-faint text-xs border border-hairline px-2 py-0.5">
                {project.platform}
              </span>
              {project.site.includes('apps.apple.com') && (
                <span className="font-mono text-accent text-xs border border-accent/40 bg-accent-soft px-2 py-0.5">
                  {t('caseStudies.inAppStore')}
                </span>
              )}
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  )}
</main>
```

Добавить в импорты файла: `import { ArrowUpRight } from 'lucide-react';`
Заменить обёртку страницы `<div className="min-h-screen bg-black">` на
`<div className="min-h-screen bg-bg">`.

- [ ] **Step 2: Проверить**

Run: `npm run build && npm run lint`
Expected: проходит.

Run: `npm run dev`, открыть `/cases`.
Expected: 10 карточек, у пяти — бейдж «В App Store».

- [ ] **Step 3: Commit**

```bash
git add pages/cases/index.tsx
git commit -m "feat(design): страница кейсов крупной сеткой"
```

---

### Task 11: Страница /packages

**Files:**
- Modify: `pages/packages/index.tsx:45-140`

**Interfaces:**
- Consumes: токены Task 1; ключи `packages.*` (не менялись в Task 3, кроме
  `packages.home.*`)
- Produces: ничего

- [ ] **Step 1: Привести страницу к системе**

Заменить обёртку `<div className="min-h-screen bg-black">` на
`<div className="min-h-screen bg-bg">`.

Заголовок:

```tsx
className="font-display text-h1 text-fg text-center mb-4"
```

Подзаголовок:

```tsx
className="text-muted text-body leading-relaxed text-center max-w-2xl mx-auto mb-16"
```

Состояния: загрузка — `className="text-faint text-center text-small"`,
ошибка — `className="text-red-400 text-center text-small"`.

Карточка пакета:

```tsx
className="flex flex-col bg-surface border border-hairline p-6 hover:border-accent transition-colors"
```

Имя пакета: `className="text-fg text-h3 font-mono"`.
Бейджи версии и SDK: `className="font-mono text-xs text-faint border border-hairline px-2 py-0.5"`.
Описание: `className="text-muted text-small leading-relaxed mb-5 flex-1"`.
Строка метрик: `className="flex items-center flex-wrap gap-x-5 gap-y-2 text-faint text-xs font-mono mb-5"`.
Ссылки внизу карточки: `className="flex items-center gap-1 text-muted hover:text-accent text-xs border-b border-hairline hover:border-accent pb-px transition-colors"`.

- [ ] **Step 2: Проверить**

Run: `npm run build && npm run lint && npm run dev`
Expected: `/packages` показывает 12 пакетов с живыми метриками.

- [ ] **Step 3: Commit**

```bash
git add pages/packages/index.tsx
git commit -m "feat(design): страница пакетов на токенах"
```

---

### Task 12: Страница /calculator

**Files:**
- Modify: `pages/calculator/index.tsx`
- Modify: `app/components/Calculator/CostCalculator.tsx`
- Modify: `app/components/Calculator/ProjectInput.tsx`
- Modify: `app/components/Calculator/StageSelector.tsx`
- Modify: `app/components/Calculator/FeatureSelector.tsx`
- Modify: `app/components/Calculator/EstimationResults.tsx`

**Interfaces:**
- Consumes: токены Task 1
- Produces: ничего

- [ ] **Step 1: Прочитать все шесть файлов перед правкой**

Run: `wc -l pages/calculator/index.tsx app/components/Calculator/*.tsx`
Затем прочитать каждый. Здесь живёт логика расчёта и запрос к
`/api/calculator/recommend` — трогаются только классы.

- [ ] **Step 2: Заменить цветовые классы по всем шести файлам**

Соответствия — механическая замена, ничего кроме классов:

| Было | Стало |
|---|---|
| `bg-black`, `bg-neutral-950`, `bg-zinc-950` | `bg-bg` |
| `bg-zinc-900`, `bg-white/[0.03]` | `bg-surface` |
| `bg-white/5` | `bg-raised` |
| `border-white/10` | `border-hairline` |
| `border-white/20`, `border-white/30` | `border-hairline-strong` |
| `text-white` | `text-fg` |
| `text-white/70`, `text-white/60`, `text-white/50` | `text-muted` |
| `text-white/40`, `text-white/30`, `text-white/25`, `text-white/20` | `text-faint` |
| `hover:border-white/30` | `hover:border-accent` |
| `bg-white text-black` (кнопки) | `bg-fg text-bg hover:bg-accent` |

Заголовки уровня страницы дополнительно получают `font-display`, кегли
заменяются на шкалу: `text-4xl` → `text-h1`, `text-2xl`/`text-xl` → `text-h2`
для секционных заголовков и `text-h3` для карточек, `text-sm` → `text-small`.

Все числовые значения (стоимость, часы, недели, размер команды) в
`EstimationResults.tsx` получают `font-mono tabular-nums`, а ключевая цифра
бюджета — `text-accent`.

- [ ] **Step 3: Проверить, что старых классов не осталось**

Run: `grep -rnE "bg-black|bg-zinc|bg-neutral|text-white/|border-white/" pages/calculator app/components/Calculator`
Expected: пусто.

- [ ] **Step 4: Проверить работу расчёта**

Run: `npm run build && npm run dev`, открыть `/calculator`, выбрать стадию,
пару фич, нажать расчёт.
Expected: результат считается как раньше, кнопка «Анализировать с ИИ» шлёт
запрос на `/api/calculator/recommend`.

- [ ] **Step 5: Commit**

```bash
git add pages/calculator/index.tsx app/components/Calculator
git commit -m "feat(design): калькулятор на токенах"
```

---

### Task 13: Финальная верификация и зачистка

**Files:**
- Modify: `app/layout.tsx` (metadata description)
- Modify: `pages/index.tsx` (Head)

**Interfaces:**
- Consumes: всё предыдущее
- Produces: готовый сайт

- [ ] **Step 1: Найти остатки старых классов по всему проекту**

Run: `grep -rnE "bg-black|bg-zinc-|bg-neutral-|text-white/[0-9]|border-white/[0-9]" app pages --include="*.tsx" | grep -v "app/components/WhyChooseUs.tsx"`
Expected: пусто. `WhyChooseUs.tsx` исключён намеренно — компонент нигде не
рендерится и в объём редизайна не входит.

- [ ] **Step 2: Обновить мета-описания под новый копирайт**

В `app/layout.tsx` заменить `metadata`:

```tsx
export const metadata: Metadata = {
  title: 'Bangert Studio — Mobile & Web Development',
  description:
    'Full-cycle mobile and web development. You know the timeline and the budget before the work starts.',
};
```

В `pages/index.tsx` в блоке `<Head>` заменить значения `description`,
`og:description` и `twitter:description` на:

```
Мобильная и веб-разработка полного цикла. Срок и бюджет вы знаете до старта работ — не после.
```

Заголовки (`<title>`, `og:title`, `twitter:title`) и `og:image` не менять.

- [ ] **Step 3: Прогнать все проверки**

Run: `npm run check:locales && npm run lint && npm run build`
Expected: все три проходят без ошибок.

- [ ] **Step 4: Проверить обе локали вручную**

Run: `npm run dev`, пройти главную, `/cases`, `/packages`, `/calculator`
на русском, затем переключить язык в шапке и пройти те же четыре страницы.
Expected: ни одного сырого ключа вида `services.iosDev.title` на экране,
кириллица везде в Geist, заголовки в Playfair.

- [ ] **Step 5: Проверить мобильную ширину**

Run: в DevTools ширина 390px, пройти главную.
Expected: нет горизонтальной прокрутки, полоса доказательств в две колонки,
кейсы в одну, услуги в одну, шапка-бургер работает.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx pages/index.tsx
git commit -m "feat(seo): мета-описания под новый копирайт"
```

---

## Self-Review

**Покрытие спека:**

| Требование спека | Задача |
|---|---|
| Палитра тёплого угля, токены | 1 |
| Удаление `#000 !important` | 1 |
| Playfair Display + кириллица в Geist | 1 |
| Типографическая шкала, снятие `line-height: 1.5` | 1 |
| Ритм секций, чередование подложек | 2, 5–9 |
| Полоса доказательств с вычисляемыми числами | 5 |
| Порядок: услуги выше калькулятора | 7 |
| Асимметричная раскладка услуг | 7 |
| Копирайт по формуле «выгода» | 3 |
| Только проверяемые факты | 3 (шаг 6 — grep-проверка), 5 (шаг 4) |
| Синхронность ru/en | 3 (`check:locales`), 13 |
| `/cases` крупной сеткой + бейдж App Store | 10 |
| `/packages` под систему | 11 |
| `/calculator` под систему, логика цела | 12 |
| Не трогать API, сторы, Метрику | границы задач 8, 9, 12 |
| Проверка: build, lint, обе локали | 13 |

**Отклонение от спека, зафиксированное осознанно:** спек называл цифру
«6 в App Store». В `cases.json` ссылок на `apps.apple.com` пять. Task 5
считает число из данных, поэтому на сайте окажется 5 — правда важнее спека.

**Известный остаток:** `app/components/WhyChooseUs.tsx` и ключи
`whyChooseUs.*` остаются со старым корпоративным текстом. Компонент нигде не
рендерится (Task 7 удаляет мёртвый импорт), в объём редизайна не входит.
Если он понадобится — это отдельная задача.
