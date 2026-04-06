# Next.js Migration Design

**Date:** 2026-04-06
**Approach:** Variant C — new project via `create-next-app`, then merge into current

---

## Overview

Migrate the current React/Vite landing page (`bangertstudio`) to Next.js (Pages Router) with SSR and a server-side API route for projects data. Work happens in a new sibling folder `bangertstudio-next/`, then gets merged back into `bangertstudio/`.

---

## Scaffolding

Create new project at `/my_project/bangertstudio-next/`:

```bash
npx create-next-app@latest bangertstudio-next \
  --typescript --tailwind --eslint \
  --no-app --no-src-dir --import-alias "@/*"
```

---

## File Structure

```
bangertstudio-next/
  pages/
    _app.tsx          — global styles + i18n init
    _document.tsx     — custom HTML document
    index.tsx         — main page with getServerSideProps
    api/
      projects.ts     — API route serving projects from JSON
  components/         — copied from src/app/components/ (minimal changes)
  styles/             — copied from src/styles/
  locales/            — en.json, ru.json (unchanged)
  public/             — static assets: case2.jpg, case3.jpg, case4.png, image.png
  data/
    projects.json     — projects array extracted from CaseStudies.tsx
  i18n.ts             — with SSR-safe localStorage fix
  next.config.ts
```

---

## Data Flow

```
pages/index.tsx
  └─ getServerSideProps()
       └─ fetch('/api/projects')
            └─ pages/api/projects.ts → reads data/projects.json
  └─ passes projects[] as props to <CaseStudies projects={projects} />
```

`data/projects.json` holds the projects array currently hardcoded in `CaseStudies.tsx`.  
The API route shape: `GET /api/projects` → `Project[]`

In the future, replace file read with a DB call — page and component stay unchanged.

---

## Component Changes

- **`CaseStudies.tsx`** — remove hardcoded `projects` array, accept `projects: Project[]` as prop
- **`i18n.ts`** — guard `localStorage` with `typeof window !== 'undefined'` to prevent SSR crash

All other components are copied as-is (Pages Router does not require `'use client'`).

---

## Dependencies

Copy all dependencies from current `package.json` into the new project:
- `motion`, `i18next`, `react-i18next`, `@radix-ui/*`, `lucide-react`, `embla-carousel-react`, `lottie-react`, etc.
- Remove: `@tailwindcss/vite`, `@vitejs/plugin-react`, `vite`
- Tailwind v4 integration: `@tailwindcss/postcss` in `postcss.config.mjs`

---

## i18n SSR Fix

Current `i18n.ts` crashes on server due to `localStorage`:

```ts
// Before
const savedLanguage = localStorage.getItem('language') || 'ru';

// After
const savedLanguage = (typeof window !== 'undefined'
  ? localStorage.getItem('language')
  : null) || 'ru';
```

---

## Out of Scope

- Next.js `<Image>` component (keep `<img>` for now)
- Internationalized routing (`next-i18next`)
- Database integration (file-based JSON is sufficient for now)
