# Cases Page — Design Spec

**Date:** 2026-05-05  
**Status:** Approved

## Overview

Add a dedicated `/cases` page to bangertstudio-next that displays all portfolio projects as a vertical list. Cases are stored in a JSON file and served via a Next.js API route.

## Architecture

### Data Layer

**File:** `app/data/cases.json`

- Contains the full array of case objects (moved from `CaseStudies.tsx`)
- Each object has: `name`, `description`, `platform`, `image` (path to `/assets/`), `site`
- Not publicly accessible directly — only consumed by the API route

### API Route

**File:** `app/api/cases/route.ts`

- `GET /api/cases` — imports `app/data/cases.json` and returns it as JSON via `NextResponse.json()`
- No filtering, no pagination — returns all cases

### Cases Page

**File:** `app/cases/page.tsx`

- Server component
- Fetches from `/api/cases` at build time (static export compatible)
- Layout: full-width vertical list, black background, matching site style
- Page title: `t('caseStudies.title')` centered at top
- Each case item:
  - 100×100px image (left, square, `object-cover`, `grayscale` → `grayscale-0` on hover)
  - Right column: name + platform badge + description + "View Site →" link
  - Separated by `border-bottom border-white/8`
- No individual case detail pages

### Homepage Changes

**File:** `app/components/CaseStudies.tsx`

- Carousel remains unchanged
- Add "View All Projects" button below the carousel navigation arrows, linking to `/cases`

### Header Navigation

**File:** `app/components/Header.tsx`

- Change `{ label: 'header.caseStudies', href: '#case-studies' }` to `{ href: '/cases' }`
- Link becomes a standard `<a>` (no scroll handler needed — navigates to a new page)

### i18n

**Files:** `app/locales/en.json`, `app/locales/ru.json`

- Add `caseStudies.viewAll`: `"View All Projects"` / `"Смотреть все проекты"`

## Files Changed

| Action | File |
|--------|------|
| Create | `app/data/cases.json` |
| Create | `app/api/cases/route.ts` |
| Create | `app/cases/page.tsx` |
| Modify | `app/components/CaseStudies.tsx` |
| Modify | `app/components/Header.tsx` |
| Modify | `app/locales/en.json` |
| Modify | `app/locales/ru.json` |

## Out of Scope

- Individual case detail pages
- Filtering / search by platform
- Pagination
