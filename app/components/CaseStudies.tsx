'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { CaseRow } from './CaseRow';
import { Section, SectionHeading } from './ui/section';
import cases from '@/app/data/cases.json';
import { GOALS, trackGoal } from '@/app/analytics';

// Какие работы и в каком порядке показывать на главной. Остальные живут на /cases.
const FEATURED = ['sapian', 'cookmyfridge', 'goatrock', 'pings'];

export function CaseStudies() {
  const { t } = useTranslation();

  const featured = FEATURED.map((id) => cases.find((project) => project.id === id)!);

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
          onClick={() => trackGoal(GOALS.casesViewAll)}
          className="mt-28 inline-block border-b border-hairline pb-1 text-small text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {t('caseStudies.viewAll')}
        </Link>
      </div>
    </Section>
  );
}
