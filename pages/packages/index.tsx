import Head from 'next/head';
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, BadgeCheck, Download, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { usePackagesStore } from '@/app/store/packagesStore';

const PUB_PUBLISHER_URL = 'https://pub.dev/publishers/bangertstudio.kz/packages';

export default function PackagesPage() {
  const { t } = useTranslation();
  const { packages, loading, error, fetch } = usePackagesStore();

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <>
      <Head>
        <title>Решения для разработчиков — Bangert Studio</title>
        <meta
          name="description"
          content="Open-source библиотеки Bangert Studio для Flutter и Dart: управление состоянием, формы, навигация, адаптивная вёрстка и инструменты разработки."
        />
        <link rel="canonical" href="https://bangertstudio.kz/packages" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bangertstudio.kz/packages" />
        <meta property="og:title" content="Решения для разработчиков — Bangert Studio" />
        <meta
          property="og:description"
          content="Open-source библиотеки Bangert Studio для Flutter и Dart, опубликованные на pub.dev."
        />
        <meta property="og:image" content="https://bangertstudio.kz/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Решения для разработчиков — Bangert Studio" />
        <meta
          name="twitter:description"
          content="Open-source библиотеки Bangert Studio для Flutter и Dart, опубликованные на pub.dev."
        />
        <meta name="twitter:image" content="https://bangertstudio.kz/og-image.png" />
      </Head>

      <div className="min-h-screen bg-black">
        <Header />

        <main className="max-w-5xl mx-auto px-6 pt-32 pb-24">
          <motion.h1
            className="text-white text-4xl text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('packages.title')}
          </motion.h1>

          <motion.p
            className="text-white/50 text-sm leading-relaxed text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('packages.subtitle')}
          </motion.p>

          {loading && (
            <p className="text-white/40 text-center text-sm">{t('packages.loading')}</p>
          )}
          {error && <p className="text-red-400 text-center text-sm">{t(error)}</p>}

          <div className="grid gap-4 md:grid-cols-2">
            {packages.map((pkg, index) => (
              <motion.article
                key={pkg.name}
                className="flex flex-col border border-white/10 p-5 hover:border-white/30 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
              >
                <div className="flex items-center flex-wrap gap-x-3 gap-y-2 mb-3">
                  <h3 className="text-white text-lg font-mono">{pkg.name}</h3>
                  <span className="text-xs text-white/40 border border-white/20 px-2 py-0.5">
                    v{pkg.version}
                  </span>
                  <span className="text-xs text-white/40 border border-white/20 px-2 py-0.5">
                    {pkg.sdk === 'dart' ? t('packages.sdkDart') : t('packages.sdkFlutter')}
                  </span>
                </div>

                <p className="text-white/50 text-sm leading-relaxed mb-5 flex-1">
                  {t(`packages.items.${pkg.name}`, { defaultValue: pkg.description })}
                </p>

                <div className="flex items-center flex-wrap gap-x-5 gap-y-2 text-white/40 text-xs mb-5">
                  <span className="flex items-center gap-1.5" title={`${pkg.likes} ${t('packages.likes')}`}>
                    <Heart size={13} aria-hidden />
                    {pkg.likes}
                  </span>
                  <span
                    className="flex items-center gap-1.5"
                    title={`${pkg.points}/${pkg.maxPoints} ${t('packages.points')}`}
                  >
                    <BadgeCheck size={13} aria-hidden />
                    {pkg.points}/{pkg.maxPoints}
                  </span>
                  <span
                    className="flex items-center gap-1.5"
                    title={`${pkg.downloads30d} ${t('packages.downloads')}`}
                  >
                    <Download size={13} aria-hidden />
                    {pkg.downloads30d}
                  </span>
                </div>

                <div className="flex items-center gap-5">
                  <a
                    href={`https://pub.dev/packages/${pkg.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-white/60 hover:text-white text-xs border-b border-white/20 hover:border-white/40 pb-px transition-colors"
                  >
                    {t('packages.viewOnPub')}
                    <ArrowUpRight size={13} aria-hidden />
                  </a>
                  {pkg.repo && (
                    <a
                      href={pkg.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-white/40 hover:text-white text-xs border-b border-white/10 hover:border-white/40 pb-px transition-colors"
                    >
                      {t('packages.viewOnGithub')}
                      <ArrowUpRight size={13} aria-hidden />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a
              href={PUB_PUBLISHER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-white/40 hover:text-white/80 text-sm border-b border-white/20 hover:border-white/40 pb-px transition-colors"
            >
              {t('packages.allOnPub')}
              <ArrowUpRight size={14} aria-hidden />
            </a>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
