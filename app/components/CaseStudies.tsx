'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { CaseRow } from './CaseRow';
import { Section, SectionHeading } from './ui/section';
import cases from '@/app/data/cases.json';

// Крупным планом показываем только те работы, у которых исходник это выдержит.
// Мелкие картинки живут в сетке на /cases, где они не разваливаются.
const LARGE_ENOUGH = new Set([
  '/assets/case1.png',
  '/assets/case2.jpg',
  '/assets/case3.jpg',
  '/assets/case4.png',
  '/assets/case6.png',
  '/assets/case10.jpg',
  '/assets/case12.png',
]);

export function CaseStudies() {
  const { t } = useTranslation();

  const featured = cases.filter((project) => LARGE_ENOUGH.has(project.image)).slice(0, 6);

  return (
    <Section id="case-studies" tone="bg">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          title={t('caseStudies.title')}
          subtitle={t('caseStudies.subtitle')}
          className="mb-24"
        />

        <div className="flex flex-col gap-28 md:gap-40">
          {featured.map((project, index) => (
            <CaseRow key={project.name} project={project} index={index} />
          ))}
        </div>

        <Link
          href="/cases"
          className="mt-28 inline-block border-b border-hairline pb-1 text-small text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {t('caseStudies.viewAll')}
        </Link>
      </div>
    </Section>
  );
}
