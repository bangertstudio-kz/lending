'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CountUp } from './CountUp';
import cases from '@/app/data/cases.json';
import { usePackagesStore } from '@/app/store/packagesStore';

// Кейсы лежат статичным файлом — считаем из него, чтобы числа попадали
// в серверный HTML. Пакеты приходят с живого pub.dev, их до ответа API
// показать нечем.
const PROJECT_COUNT = cases.length;

export function ProofBar() {
  const { t } = useTranslation();
  const { packages, fetch } = usePackagesStore();

  useEffect(() => { fetch(); }, [fetch]);

  const items = [
    { value: PROJECT_COUNT, label: t('proof.projects') },
    { value: packages.length || null, label: t('proof.packages') },
    { value: null, label: t('proof.years'), literal: '10+' },
  ];

  return (
    <div className="border-y border-hairline bg-surface">
      <dl className="mx-auto grid max-w-5xl divide-y divide-hairline md:grid-cols-3 md:divide-x md:divide-y-0">
        {items.map((item) => (
          <div key={item.label} className="px-6 py-12">
            <dt className="font-mono text-h2 tabular-nums text-accent">
              {item.literal ?? (item.value === null ? '—' : <CountUp value={item.value} format={String} />)}
            </dt>
            <dd className="mt-2 text-small leading-snug text-faint">{item.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
