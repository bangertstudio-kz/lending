'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Section, SectionHeading } from './ui/section';
import { useCasesStore } from '@/app/store/casesStore';

export function CaseStudies() {
  const { t } = useTranslation();
  const { cases, fetch } = useCasesStore();

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <Section id="case-studies" tone="bg">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          title={t('caseStudies.title')}
          subtitle={t('caseStudies.subtitle')}
          className="mb-14"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cases.slice(0, 6).map((project) => (
            <a
              key={project.name}
              href={project.site}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col border border-hairline bg-surface transition-colors hover:border-hairline-strong"
            >
              <div className="aspect-[4/3] overflow-hidden bg-raised">
                <ImageWithFallback
                  src={project.image}
                  alt={project.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-1 flex-col gap-3 p-6">
                <h3 className="font-display font-semibold text-h3 text-fg">{project.name}</h3>

                <p className="flex-1 text-small leading-relaxed text-muted">
                  {project.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="border border-hairline px-2 py-0.5 text-xs text-faint">
                    {project.platform}
                  </span>
                  {project.site.includes('apps.apple.com') && (
                    <span className="border border-accent/40 bg-accent-soft px-2 py-0.5 text-xs text-accent">
                      {t('caseStudies.inAppStore')}
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>

        <Link
          href="/cases"
          className="mt-12 inline-block border-b border-hairline pb-1 text-small text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {t('caseStudies.viewAll')}
        </Link>
      </div>
    </Section>
  );
}
