# Next.js Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the React/Vite landing page to a new Next.js (Pages Router) project at `/my_project/bangertstudio-next/` with SSR and a server-side API route for projects data.

**Architecture:** Create a fresh Next.js app via `create-next-app`, copy all existing components with minimal changes, extract hardcoded projects into `data/projects.json` served via `pages/api/projects.ts`, and wire up `getServerSideProps` on the index page to pass projects as props.

**Tech Stack:** Next.js 15, Pages Router, TypeScript, Tailwind CSS v4 (`@tailwindcss/postcss`), motion/react, react-i18next, shadcn/ui (Radix), Node.js API routes

---

## File Map

| File | Action | Notes |
|------|--------|-------|
| `pages/_app.tsx` | Create | Imports styles + i18n |
| `pages/_document.tsx` | Create | HTML document wrapper |
| `pages/index.tsx` | Create (replace scaffold) | SSR page with `getServerSideProps` |
| `pages/api/projects.ts` | Create | Returns `Project[]` from JSON |
| `pages/api/hello.ts` | Delete | Scaffolded placeholder |
| `lib/getProjects.ts` | Create | Shared helper for reading projects.json |
| `data/projects.json` | Create | Projects extracted from CaseStudies.tsx |
| `components/` | Copy from `src/app/components/` | All files, flat copy |
| `components/CaseStudies.tsx` | Modify | Remove hardcoded projects, accept `Project[]` props |
| `styles/` | Copy from `src/styles/` | Update `@source` path in tailwind.css |
| `locales/` | Copy from `src/locales/` | en.json, ru.json unchanged |
| `public/` | Copy assets | case2.jpg, case3.jpg, case4.png, image.png |
| `i18n.ts` | Create (modified) | SSR-safe localStorage guard |
| `next.config.ts` | Modify | Add remote image pattern for mzstatic.com |
| `postcss.config.mjs` | Create | `@tailwindcss/postcss` plugin |

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: `/my_project/bangertstudio-next/` (entire scaffold)

- [ ] **Step 1: Run create-next-app**

```bash
cd /Users/aleksandrbangert/my_project && npx create-next-app@latest bangertstudio-next --typescript --eslint --no-tailwind --no-app --no-src-dir --import-alias "@/*"
```

If prompted interactively, answer: TypeScript → Yes, ESLint → Yes, Tailwind → No, src/ dir → No, App Router → No, import alias → @/*.

- [ ] **Step 2: Verify scaffold structure**

```bash
ls /Users/aleksandrbangert/my_project/bangertstudio-next/
```

Expected output includes: `pages/  public/  next.config.ts  package.json  tsconfig.json`

- [ ] **Step 3: Commit scaffold**

```bash
cd /Users/aleksandrbangert/my_project/bangertstudio-next && git add -A && git commit -m "chore: scaffold Next.js project"
```

---

## Task 2: Install all dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install all deps from current project**

```bash
cd /Users/aleksandrbangert/my_project/bangertstudio-next && npm install \
  tailwindcss@4.1.12 @tailwindcss/postcss tw-animate-css \
  motion i18next react-i18next \
  lucide-react \
  @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio \
  @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible \
  @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar \
  @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress \
  @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select \
  @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot \
  @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toggle \
  @radix-ui/react-toggle-group @radix-ui/react-tooltip \
  class-variance-authority clsx tailwind-merge cmdk \
  date-fns embla-carousel-react input-otp lottie-react \
  next-themes react-day-picker \
  react-dnd react-dnd-html5-backend react-hook-form \
  react-popper react-resizable-panels react-responsive-masonry \
  react-slick recharts sonner vaul \
  @emotion/react @emotion/styled @mui/icons-material @mui/material @popperjs/core
```

- [ ] **Step 2: Verify no errors**

Expected: `added N packages` with no peer dependency errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json && git commit -m "chore: add all project dependencies"
```

---

## Task 3: Set up Tailwind v4 + PostCSS

**Files:**
- Create: `postcss.config.mjs`

- [ ] **Step 1: Create postcss.config.mjs**

Create `/Users/aleksandrbangert/my_project/bangertstudio-next/postcss.config.mjs`:

```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
export default config;
```

- [ ] **Step 2: Commit**

```bash
git add postcss.config.mjs && git commit -m "chore: configure PostCSS for Tailwind v4"
```

---

## Task 4: Copy and set up styles

**Files:**
- Create: `styles/fonts.css`
- Create: `styles/tailwind.css`
- Create: `styles/theme.css`
- Create: `styles/index.css`

- [ ] **Step 1: Copy styles directory**

```bash
cp -r /Users/aleksandrbangert/my_project/bangertstudio/src/styles /Users/aleksandrbangert/my_project/bangertstudio-next/styles
```

- [ ] **Step 2: Update @source path in tailwind.css**

Open `styles/tailwind.css`. Change the `@source` line so it scans the Next.js project directories (not `src/`):

```css
@import 'tailwindcss' source(none);
@source '../{pages,components,lib}/**/*.{js,ts,jsx,tsx}';

@import 'tw-animate-css';
```

- [ ] **Step 3: Commit**

```bash
git add styles/ && git commit -m "feat: add styles from original project"
```

---

## Task 5: Copy locales

**Files:**
- Create: `locales/en.json`
- Create: `locales/ru.json`

- [ ] **Step 1: Copy locales**

```bash
cp -r /Users/aleksandrbangert/my_project/bangertstudio/src/locales /Users/aleksandrbangert/my_project/bangertstudio-next/locales
```

- [ ] **Step 2: Commit**

```bash
git add locales/ && git commit -m "feat: add i18n locale files"
```

---

## Task 6: Create SSR-safe i18n.ts

**Files:**
- Create: `i18n.ts`

- [ ] **Step 1: Create i18n.ts**

Create `/Users/aleksandrbangert/my_project/bangertstudio-next/i18n.ts`:

```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
};

const savedLanguage =
  (typeof window !== 'undefined' ? localStorage.getItem('language') : null) || 'ru';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
```

- [ ] **Step 2: Commit**

```bash
git add i18n.ts && git commit -m "feat: add SSR-safe i18n config"
```

---

## Task 7: Copy assets to public/

**Files:**
- Create: `public/case2.jpg`
- Create: `public/case3.jpg`
- Create: `public/case4.png`
- Create: `public/image.png`

- [ ] **Step 1: Copy assets**

```bash
cp /Users/aleksandrbangert/my_project/bangertstudio/src/assets/case2.jpg \
   /Users/aleksandrbangert/my_project/bangertstudio-next/public/case2.jpg

cp /Users/aleksandrbangert/my_project/bangertstudio/src/assets/case3.jpg \
   /Users/aleksandrbangert/my_project/bangertstudio-next/public/case3.jpg

cp /Users/aleksandrbangert/my_project/bangertstudio/src/assets/case4.png \
   /Users/aleksandrbangert/my_project/bangertstudio-next/public/case4.png

cp /Users/aleksandrbangert/my_project/bangertstudio/src/assets/image.png \
   /Users/aleksandrbangert/my_project/bangertstudio-next/public/image.png
```

- [ ] **Step 2: Commit**

```bash
git add public/ && git commit -m "feat: add static assets to public/"
```

---

## Task 8: Copy all components

**Files:**
- Create: `components/` (all files from `src/app/components/`)

- [ ] **Step 1: Copy components**

```bash
cp -r /Users/aleksandrbangert/my_project/bangertstudio/src/app/components \
       /Users/aleksandrbangert/my_project/bangertstudio-next/components
```

- [ ] **Step 2: Fix import alias in all component files**

Components import from `'@/...'` or relative paths. Check if any import from `../../assets/`:

```bash
grep -r "assets/" /Users/aleksandrbangert/my_project/bangertstudio-next/components/
```

Expected: only `CaseStudies.tsx` imports assets (case2Image, case3Image, case4Image) — those will be removed in Task 9.

- [ ] **Step 3: Commit**

```bash
git add components/ && git commit -m "feat: copy all components"
```

---

## Task 9: Create data/projects.json and lib/getProjects.ts

**Files:**
- Create: `data/projects.json`
- Create: `lib/getProjects.ts`

- [ ] **Step 1: Create data/projects.json**

Create `/Users/aleksandrbangert/my_project/bangertstudio-next/data/projects.json`:

```json
[
  {
    "name": "Pings Ai",
    "description": "Welcome to Pings AI — your personal feed of handpicked insights, ideas, guides, and wisdom powered by AI.",
    "platform": "iOS",
    "image": "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/c7/56/d3/c756d329-c04e-aa67-541e-463f3a829f94/Slice_5.jpg/460x998bb-60.jpg",
    "results": ["500K+ downloads", "4.8★ rating", "85% user retention"],
    "site": "https://apps.apple.com/kz/app/smart-ideas-daily-pings-ai/id6742242937"
  },
  {
    "name": "Luna Deep",
    "description": "Luna Deep offers music channels for any moment and mood. We gather the best tracks from around the world to bring you inspiration, energy, and the soundtrack to your life.",
    "platform": "iOS / Android",
    "image": "/case2.jpg",
    "results": ["1M+ users", "$10M GMV", "40% growth MoM", "4.9★ rating"],
    "site": "https://apps.apple.com/kz/app/luna-deep-prime-music-wave/id6449427218"
  },
  {
    "name": "Equilibrium",
    "description": "Enterprise productivity suite with team collaboration and project management tools",
    "platform": "iOS / Android / Web",
    "image": "/case3.jpg",
    "results": ["250+ companies", "99.9% uptime", "SOC 2 compliant"],
    "site": "https://apps.apple.com/kz/app/equilibrium-task-emotion/id6754636249"
  },
  {
    "name": "Sapian",
    "description": "Browse people around you, send a request, and if the interest is mutual, you can start chatting and plan a meeting.",
    "platform": "iOS / Android",
    "image": "/case4.png",
    "results": ["250+ companies", "99.9% uptime", "SOC 2 compliant"],
    "site": "https://apps.apple.com/kz/app/sapian-walks-talks-nearby/id6756068831"
  }
]
```

- [ ] **Step 2: Create lib/getProjects.ts**

Create `/Users/aleksandrbangert/my_project/bangertstudio-next/lib/getProjects.ts`:

```ts
import projectsData from '../data/projects.json';

export interface Project {
  name: string;
  description: string;
  platform: string;
  image: string;
  results: string[];
  site: string;
}

export function getProjects(): Project[] {
  return projectsData as Project[];
}
```

- [ ] **Step 3: Commit**

```bash
git add data/ lib/ && git commit -m "feat: add projects data and getProjects helper"
```

---

## Task 10: Modify CaseStudies.tsx to accept props

**Files:**
- Modify: `components/CaseStudies.tsx`

- [ ] **Step 1: Rewrite CaseStudies.tsx**

Replace the entire contents of `components/CaseStudies.tsx`:

```tsx
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';
import { useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { useTranslation } from 'react-i18next';
import type { Project } from '../lib/getProjects';

interface Props {
  projects: Project[];
}

export function CaseStudies({ projects }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();

  return (
    <section id="case-studies" ref={sectionRef} className="bg-black py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-white text-center mb-16 text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t('caseStudies.title')}
        </motion.h2>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {projects.map((project, index) => (
              <CarouselItem
                key={project.name}
                className="pl-4 md:basis-1/3"
              >
                <motion.div
                  className="border border-white/10 overflow-hidden hover:border-white/30 transition-colors group h-full"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <a
                    href={project.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-pointer"
                  >
                    <div className="aspect-[9/9] bg-zinc-900 overflow-hidden">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white">{project.name}</h3>
                        <span className="text-xs text-white/40 border border-white/20 px-2 py-1">
                          {project.platform}
                        </span>
                      </div>

                      <p className="text-white/60 text-sm mb-4">{project.description}</p>

                      <div className="space-y-2">
                        {project.results.map((result) => (
                          <div key={result} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-white/40 rounded-full" />
                            <span className="text-white/50 text-sm">{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </a>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="flex justify-center md:justify-start gap-4 mt-8">
            <CarouselPrevious
              className="static translate-y-0 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-30"
            />
            <CarouselNext
              className="static translate-y-0 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-30"
            />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/CaseStudies.tsx && git commit -m "feat: CaseStudies accepts projects as props"
```

---

## Task 11: Create pages/api/projects.ts

**Files:**
- Create: `pages/api/projects.ts`

- [ ] **Step 1: Create the API route**

Create `/Users/aleksandrbangert/my_project/bangertstudio-next/pages/api/projects.ts`:

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getProjects, type Project } from '../../lib/getProjects';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Project[]>
) {
  res.status(200).json(getProjects());
}
```

- [ ] **Step 2: Commit**

```bash
git add pages/api/projects.ts && git commit -m "feat: add /api/projects route"
```

---

## Task 12: Create pages/_document.tsx

**Files:**
- Create: `pages/_document.tsx`

- [ ] **Step 1: Create _document.tsx**

Create `/Users/aleksandrbangert/my_project/bangertstudio-next/pages/_document.tsx`:

```tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ru">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add pages/_document.tsx && git commit -m "feat: add custom _document"
```

---

## Task 13: Create pages/_app.tsx

**Files:**
- Create: `pages/_app.tsx`

- [ ] **Step 1: Create _app.tsx**

Create `/Users/aleksandrbangert/my_project/bangertstudio-next/pages/_app.tsx`:

```tsx
import type { AppProps } from 'next/app';
import '../styles/index.css';
import '../i18n';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

- [ ] **Step 2: Commit**

```bash
git add pages/_app.tsx && git commit -m "feat: add _app with global styles and i18n"
```

---

## Task 14: Create pages/index.tsx

**Files:**
- Modify: `pages/index.tsx` (replace scaffold content)

- [ ] **Step 1: Replace pages/index.tsx**

Replace the entire contents of `pages/index.tsx`:

```tsx
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { CaseStudies } from '../components/CaseStudies';
import { Services } from '../components/Services';
import { ContactForm } from '../components/ContactForm';
import { Testimonials } from '../components/Testimonials';
import { Footer } from '../components/Footer';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { MobileScrollButton } from '../components/MobileScrollButton';
import { getProjects, type Project } from '../lib/getProjects';

interface Props {
  projects: Project[];
}

export default function Home({ projects }: Props) {
  return (
    <>
      <Head>
        <title>Bangert Studio</title>
        <meta name="description" content="Professional mobile app development for your business" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-neutral-950 relative">
        <AnimatedBackground />
        <Header />
        <div className="relative">
          <Hero />
          <WhyChooseUs />
          <CaseStudies projects={projects} />
          <Services />
          <ContactForm />
          <Testimonials />
          <Footer />
        </div>
        <MobileScrollButton />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const projects = getProjects();
  return { props: { projects } };
};
```

- [ ] **Step 2: Commit (delete hello.ts scaffold + add index.tsx)**

```bash
git add pages/index.tsx && git rm pages/api/hello.ts && git commit -m "feat: add index page with SSR projects"
```

---

## Task 15: Update next.config.ts

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Update next.config.ts**

Replace the entire contents of `next.config.ts`:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'is1-ssl.mzstatic.com',
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Commit**

```bash
git add next.config.ts && git commit -m "chore: configure next.config with remote image patterns"
```

---

## Task 16: Run dev server and verify

- [ ] **Step 1: Start dev server**

```bash
cd /Users/aleksandrbangert/my_project/bangertstudio-next && npm run dev
```

Expected: `ready - started server on 0.0.0.0:3000`

- [ ] **Step 2: Verify main page**

Open `http://localhost:3000` — should see the landing page with all sections rendered.

- [ ] **Step 3: Verify API route**

```bash
curl http://localhost:3000/api/projects
```

Expected: JSON array with 4 projects.

- [ ] **Step 4: Check for TypeScript errors**

```bash
cd /Users/aleksandrbangert/my_project/bangertstudio-next && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit final state**

```bash
git add -A && git commit -m "feat: Next.js migration complete"
```
