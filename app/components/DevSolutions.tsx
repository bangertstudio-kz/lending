'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Section, SectionHeading, Eyebrow } from './ui/section';
import { usePackagesStore } from '@/app/store/packagesStore';

const BENEFITS = ['budget', 'quality', 'freedom'] as const;

export function DevSolutions() {
  const { t, i18n } = useTranslation();
  const { packages, fetch } = usePackagesStore();

  useEffect(() => { fetch(); }, [fetch]);

  const loaded = packages.length > 0;
  const format = (value: number) =>
    new Intl.NumberFormat(i18n.language === 'en' ? 'en-US' : 'ru-RU').format(value);

  const stats = [
    { label: t('packages.home.statPackages'), value: packages.length },
    {
      label: t('packages.home.statDownloads'),
      value: packages.reduce((sum, pkg) => sum + pkg.downloads30d, 0),
    },
    {
      label: t('packages.home.statLikes'),
      value: packages.reduce((sum, pkg) => sum + pkg.likes, 0),
    },
  ];

  return (
    <Section tone="surface">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow={<Eyebrow>{t('packages.home.badge')}</Eyebrow>}
          title={t('packages.home.title')}
          subtitle={t('packages.home.subtitle')}
          className="mb-16"
        />

        <dl className="mb-20 grid grid-cols-3 divide-x divide-hairline border-y border-hairline">
          {stats.map((stat) => (
            <div key={stat.label} className="px-6 py-10">
              <dt className="font-mono text-h2 tabular-nums text-accent">
                {loaded ? format(stat.value) : '—'}
              </dt>
              <dd className="mt-2 text-xs leading-snug text-faint">{stat.label}</dd>
            </div>
          ))}
        </dl>

        <div className="mb-16 grid gap-14 md:grid-cols-3">
          {BENEFITS.map((key) => (
            <div key={key}>
              <h3 className="mb-3 font-display font-semibold text-h3 text-fg">
                {t(`packages.home.benefits.${key}.title`)}
              </h3>
              <p className="text-small leading-relaxed text-muted">
                {t(`packages.home.benefits.${key}.description`)}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/packages"
          className="inline-block bg-fg px-6 py-3.5 text-small font-medium text-bg transition-colors hover:bg-accent"
        >
          {t('packages.home.cta')}
        </Link>
      </div>
    </Section>
  );
}
