import Head from 'next/head';
import { useEffect } from 'react';
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
          content="Открытые библиотеки Bangert Studio для Flutter и Dart: состояние, формы, навигация, адаптивная вёрстка и инструменты разработки."
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

      <div className="min-h-screen bg-bg">
        <Header />

        <main className="mx-auto max-w-5xl px-6 pb-28 pt-36">
          <h1 className="font-display font-semibold text-h1 text-fg">{t('packages.title')}</h1>

          <p className="mb-16 mt-4 max-w-[62ch] text-body leading-relaxed text-muted">
            {t('packages.subtitle')}
          </p>

          {loading && (
            <p className="text-center text-small text-faint">{t('packages.loading')}</p>
          )}
          {error && <p role="alert" className="text-center text-small text-red-400">{t(error)}</p>}

          <div className="grid gap-4 md:grid-cols-2">
            {packages.map((pkg, index) => (
              <article
                key={pkg.name}
                className="flex flex-col border border-hairline bg-surface p-6 transition-colors hover:border-hairline-strong"
              >
                <div className="flex items-center flex-wrap gap-x-3 gap-y-2 mb-3">
                  <h2 className="font-mono text-h3 text-fg">{pkg.name}</h2>
                  <span className="border border-hairline px-2 py-0.5 font-mono text-xs text-faint">
                    v{pkg.version}
                  </span>
                  <span className="border border-hairline px-2 py-0.5 text-xs text-faint">
                    {pkg.sdk === 'dart' ? t('packages.sdkDart') : t('packages.sdkFlutter')}
                  </span>
                </div>

                <p className="mb-6 flex-1 text-small leading-relaxed text-muted">
                  {t(`packages.items.${pkg.name}`, { defaultValue: pkg.description })}
                </p>

                <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs tabular-nums text-faint">
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
                    className="flex items-center gap-1 border-b border-hairline pb-px text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    {t('packages.viewOnPub')}
                    <ArrowUpRight size={13} aria-hidden />
                  </a>
                  {pkg.repo && (
                    <a
                      href={pkg.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 border-b border-hairline pb-px text-xs text-faint transition-colors hover:border-accent hover:text-accent"
                    >
                      {t('packages.viewOnGithub')}
                      <ArrowUpRight size={13} aria-hidden />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a
              href={PUB_PUBLISHER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 border-b border-hairline pb-px text-small text-muted transition-colors hover:border-accent hover:text-accent"
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
