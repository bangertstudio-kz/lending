'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Boxes, Coins, ShieldCheck, GitFork, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePackagesStore } from '@/app/store/packagesStore';

const BENEFITS = [
  { key: 'budget', Icon: Coins },
  { key: 'quality', Icon: ShieldCheck },
  { key: 'freedom', Icon: GitFork },
] as const;

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

  const benefitCounts = {
    perfect: packages.filter((pkg) => pkg.points === pkg.maxPoints).length,
    total: packages.length,
  };

  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/70 px-4 py-2 rounded-full mb-6 text-sm">
            <Boxes className="w-4 h-4 text-white/60" />
            {t('packages.home.badge')}
          </div>
          <h2 className="text-white text-4xl font-bold mb-4">
            {t('packages.home.title')}
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            {t('packages.home.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-3 border-y border-white/10 divide-x divide-white/10 mb-12"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="py-6 px-4 text-center">
              <div className="text-white text-3xl font-bold mb-1 tabular-nums">
                {loaded ? format(stat.value) : '—'}
              </div>
              <div className="text-white/40 text-xs leading-snug">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3 mb-12">
          {BENEFITS.map(({ key, Icon }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Icon className="w-5 h-5 text-white/60 mb-4" aria-hidden />
              <h3 className="text-white text-base font-semibold mb-2">
                {t(`packages.home.benefits.${key}.title`)}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {t(`packages.home.benefits.${key}.description`)}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            {t('packages.home.cta')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
