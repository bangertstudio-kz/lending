# Cases Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dedicated `/cases` page displaying all portfolio projects as a vertical list, with data served from `app/data/cases.json` via a `/api/cases` API route.

**Architecture:** Cases data lives in `app/data/cases.json`. A Next.js API route at `GET /api/cases` imports and returns it. The `/cases` page is a client component that fetches from the API on mount and renders a vertical list. The homepage carousel keeps its existing content but gets a "View All" link.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, react-i18next, motion/react

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `app/data/cases.json` | Source of truth for all case data |
| Create | `app/api/cases/route.ts` | GET endpoint returning cases array |
| Create | `app/cases/page.tsx` | Full `/cases` page — fetches API, renders list |
| Modify | `app/locales/en.json` | Add `caseStudies.viewAll` key |
| Modify | `app/locales/ru.json` | Add `caseStudies.viewAll` key |
| Modify | `app/components/CaseStudies.tsx` | Add "View All" link below carousel |
| Modify | `app/components/Header.tsx` | Change Case Studies nav to link to `/cases` |

---

### Task 1: Create cases data JSON

**Files:**
- Create: `app/data/cases.json`

- [ ] **Step 1: Create the data file**

```json
[
  {
    "name": "Pings Ai",
    "description": "Welcome to Pings AI — your personal feed of handpicked insights, ideas, guides, and wisdom powered by AI.",
    "platform": "iOS",
    "image": "/assets/case1.png",
    "site": "https://apps.apple.com/kz/app/smart-ideas-daily-pings-ai/id6742242937"
  },
  {
    "name": "QOR",
    "description": "QOR is a unified ecosystem where private customers, businesses, security agencies, and independent consultants are brought together on a single platform for instant response.",
    "platform": "iOS / Android / Web",
    "image": "/assets/case11.png",
    "site": "https://digest.qor.oro.ad"
  },
  {
    "name": "Oro",
    "description": "Oro rents your computing power for AI agents. Fair pricing, transparent billing.",
    "platform": "Web / Kubernetes",
    "image": "/assets/case12.png",
    "site": "https://cli.master.oro.ad"
  },
  {
    "name": "Luna Deep",
    "description": "Luna Deep offers music channels for any moment and mood. We gather the best tracks from around the world to bring you inspiration, energy, and the soundtrack to your life.",
    "platform": "iOS / Android",
    "image": "/assets/case2.jpg",
    "site": "https://apps.apple.com/kz/app/luna-deep-prime-music-wave/id6449427218"
  },
  {
    "name": "Equilibrium",
    "description": "Enterprise productivity suite with team collaboration and project management tools",
    "platform": "iOS / Android / Web",
    "image": "/assets/case3.jpg",
    "site": "https://apps.apple.com/kz/app/equilibrium-task-emotion/id6754636249"
  },
  {
    "name": "Sapian",
    "description": "Browse people around you, send a request, and if the interest is mutual, you can start chatting and plan a meeting.",
    "platform": "iOS / Android",
    "image": "/assets/case4.png",
    "site": "https://apps.apple.com/kz/app/sapian-walks-talks-nearby/id6756068831"
  },
  {
    "name": "Ocean",
    "description": "A Cost Per Action (CPA) platform is a service where payment is made only for a specific user action (registration, application, purchase).",
    "platform": "iOS / Android / Web",
    "image": "/assets/case5.png",
    "site": "https://www.figma.com/design/1mMrCM6CuUwmYHlFA4kupl/Ocean?node-id=17-25&t=oKPlh9IpLjY0DjWx-1"
  },
  {
    "name": "Toptom",
    "description": "A B2C/B2B marketplace is a platform where individuals and companies buy and sell goods or services.",
    "platform": "iOS / Android / Web",
    "image": "/assets/case6.png",
    "site": "https://www.figma.com/design/qHvGwxdHvEgZryOkKxzi3d/Toptom?node-id=6053-28716&t=LRLKd76Mt7nkUXeN-1"
  },
  {
    "name": "Eiva",
    "description": "Find fitness clubs, sign up for workouts, and purchase gym memberships",
    "platform": "iOS / Android",
    "image": "/assets/case8.png",
    "site": "https://apps.apple.com/kz/app/eiva/id6474634288"
  },
  {
    "name": "В гостях у Хив",
    "description": "An exclusive health club",
    "platform": "iOS / Android / Web",
    "image": "/assets/case7.png",
    "site": "https://hivclub.ru"
  }
]
```

- [ ] **Step 2: Commit**

```bash
git add app/data/cases.json
git commit -m "feat: add cases data JSON"
```

---

### Task 2: Create API route

**Files:**
- Create: `app/api/cases/route.ts`

- [ ] **Step 1: Create the route file**

```ts
import cases from '@/app/data/cases.json';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(cases);
}
```

- [ ] **Step 2: Verify route works**

Start dev server: `npm run dev`
Open: `http://localhost:3000/api/cases`
Expected: JSON array of 10 case objects

- [ ] **Step 3: Commit**

```bash
git add app/api/cases/route.ts
git commit -m "feat: add GET /api/cases endpoint"
```

---

### Task 3: Add i18n keys

**Files:**
- Modify: `app/locales/en.json`
- Modify: `app/locales/ru.json`

- [ ] **Step 1: Add key to `app/locales/en.json`**

Inside the `"caseStudies"` object, add:
```json
"viewAll": "View All Projects"
```

Result:
```json
"caseStudies": {
  "title": "Our Projects",
  "platform": "Platform",
  "results": "Results",
  "viewSite": "View Site",
  "viewAll": "View All Projects"
}
```

- [ ] **Step 2: Add key to `app/locales/ru.json`**

Inside the `"caseStudies"` object, add:
```json
"viewAll": "Смотреть все проекты"
```

Result:
```json
"caseStudies": {
  "title": "Наши проекты",
  "platform": "Платформа",
  "results": "Результаты",
  "viewSite": "Посмотреть сайт",
  "viewAll": "Смотреть все проекты"
}
```

- [ ] **Step 3: Commit**

```bash
git add app/locales/en.json app/locales/ru.json
git commit -m "feat: add viewAll i18n key for cases page"
```

---

### Task 4: Create the `/cases` page

**Files:**
- Create: `app/cases/page.tsx`

This is a full Next.js page — includes its own Header and Footer (same as the home page), a hero title section, and a vertical list of cases fetched from `/api/cases`.

- [ ] **Step 1: Create `app/cases/page.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useTranslation } from 'react-i18next';

interface Case {
  name: string;
  description: string;
  platform: string;
  image: string;
  site: string;
}

export default function CasesPage() {
  const { t } = useTranslation();
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    fetch('/api/cases')
      .then((res) => res.json())
      .then((data: Case[]) => setCases(data));
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <motion.h1
          className="text-white text-4xl text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {t('caseStudies.title')}
        </motion.h1>

        <div className="flex flex-col">
          {cases.map((project, index) => (
            <motion.a
              key={project.name}
              href={project.site}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-6 py-6 border-b border-white/10 group hover:border-white/30 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-zinc-900">
                <ImageWithFallback
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-white text-lg">{project.name}</h2>
                  <span className="text-xs text-white/40 border border-white/20 px-2 py-0.5 flex-shrink-0">
                    {project.platform}
                  </span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-3">{project.description}</p>
                <span className="text-white/40 text-xs border-b border-white/20 pb-px group-hover:text-white/70 group-hover:border-white/40 transition-colors">
                  {t('caseStudies.viewSite')} →
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Verify the page renders**

Open: `http://localhost:3000/cases`
Expected: page with Header, title "Our Projects", list of 10 cases with images and descriptions, Footer

- [ ] **Step 3: Commit**

```bash
git add app/cases/page.tsx
git commit -m "feat: add /cases page with vertical project list"
```

---

### Task 5: Add "View All" button to homepage CaseStudies

**Files:**
- Modify: `app/components/CaseStudies.tsx`

- [ ] **Step 1: Add the link below the carousel controls**

In `app/components/CaseStudies.tsx`, replace the closing `</div>` after the carousel navigation:

```tsx
<div className="flex justify-center md:justify-start gap-4 mt-8">
  <CarouselPrevious className="static translate-y-0 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-30" />
  <CarouselNext className="static translate-y-0 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-30" />
</div>
```

with:

```tsx
<div className="flex flex-col md:flex-row items-center md:items-center gap-4 mt-8">
  <div className="flex gap-4">
    <CarouselPrevious className="static translate-y-0 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-30" />
    <CarouselNext className="static translate-y-0 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-30" />
  </div>
  <a
    href="/cases"
    className="text-white/60 text-sm border-b border-white/20 pb-px hover:text-white hover:border-white/60 transition-colors"
  >
    {t('caseStudies.viewAll')} →
  </a>
</div>
```

- [ ] **Step 2: Verify on homepage**

Open: `http://localhost:3000`
Scroll to "Our Projects" section.
Expected: carousel with nav arrows + "View All Projects →" link beside them. Clicking the link navigates to `/cases`.

- [ ] **Step 3: Commit**

```bash
git add app/components/CaseStudies.tsx
git commit -m "feat: add View All link to homepage CaseStudies carousel"
```

---

### Task 6: Update Header navigation

**Files:**
- Modify: `app/components/Header.tsx`

- [ ] **Step 1: Change the Case Studies nav item**

In `app/components/Header.tsx`, replace the `navItems` array entry for caseStudies:

```ts
{ label: 'header.caseStudies', href: '#case-studies' },
```

with:

```ts
{ label: 'header.caseStudies', href: '/cases' },
```

- [ ] **Step 2: Update `handleNavClick` to handle page links**

The current `handleNavClick` handler does `document.querySelector(href)` — this works for `#anchor` hrefs but not for `/cases`. Update the handler so that page-level links navigate normally:

```tsx
const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (!href.startsWith('#')) return; // let browser handle page navigation
  e.preventDefault();
  const element = document.querySelector(href);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: elementPosition - 80, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  }
};
```

- [ ] **Step 3: Verify header navigation**

Open `http://localhost:3000`. Click "Case Studies" in the header.
Expected: navigates to `http://localhost:3000/cases`.

Open `http://localhost:3000/cases`. Header should render with all nav links intact.

- [ ] **Step 4: Commit**

```bash
git add app/components/Header.tsx
git commit -m "feat: update header Case Studies link to /cases page"
```
