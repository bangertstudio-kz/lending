'use client';

import { useEffect } from 'react';
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

  // Числа считаются из данных: захардкоженные цифры разъезжаются с правдой,
  // как только в cases.json или на pub.dev что-то меняется.
  const appStoreCount = cases.filter((item) => item.site.includes('apps.apple.com')).length;

  const items = [
    { value: cases.length, label: t('proof.projects') },
    { value: appStoreCount, label: t('proof.appstore') },
    { value: packages.length, label: t('proof.packages') },
    { value: '10+', label: t('proof.years') },
  ];

  return (
    <div className="border-y border-hairline bg-surface">
      <dl className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-y divide-hairline md:grid-cols-4 md:divide-y-0">
        {items.map((item) => (
          <div key={item.label} className="px-6 py-12">
            <dt className="font-mono text-h2 tabular-nums text-accent">
              {typeof item.value === 'number' && item.value === 0 ? '—' : item.value}
            </dt>
            <dd className="mt-2 text-small leading-snug text-faint">{item.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
