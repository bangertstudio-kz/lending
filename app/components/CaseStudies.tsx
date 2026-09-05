'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ImageWithFallback } from './figma/ImageWithFallback';
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
          className="mb-20"
        />

        <div className="flex flex-col gap-24 md:gap-32">
          {featured.map((project, index) => (
            <a
              key={project.name}
              href={project.site}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid items-center gap-8 md:grid-cols-12 md:gap-14"
            >
              <div
                className={`overflow-hidden bg-surface md:col-span-7 ${
                  index % 2 === 1 ? 'md:order-2 md:col-start-6' : ''
                }`}
              >
                <ImageWithFallback
                  src={project.image}
                  alt={project.name}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                />
              </div>

              <div className={`md:col-span-4 ${index % 2 === 1 ? 'md:order-1 md:col-start-1' : ''}`}>
                <span className="font-mono text-small tabular-nums text-faint">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <h3 className="mt-4 font-display font-semibold text-h2 text-fg transition-colors group-hover:text-accent">
                  {project.name}
                </h3>

                <p className="mt-4 text-body text-muted">{project.description}</p>

                <div className="mt-6 flex flex-wrap items-center gap-2">
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
          className="mt-24 inline-block border-b border-hairline pb-1 text-small text-muted transition-colors hover:border-accent hover:text-accent"
        >
          {t('caseStudies.viewAll')}
        </Link>
      </div>
    </Section>
  );
}
