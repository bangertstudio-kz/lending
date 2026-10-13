import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { SeoHead } from '@/src/components/SeoHead';
import Link from 'next/link';
import { Heart, Download, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { Lead } from '@/src/components/ui/block';
import type { DevPackage } from '@/src/store/packagesStore';
import { loadPackages } from '@/src/api/packages/route';
import { GOALS, trackGoal } from '@/src/analytics';

const PUB_PUBLISHER_URL = 'https://pub.dev/publishers/bangertstudio.kz/packages';

const PLATFORM_LABEL: Record<string, string> = {
  android: 'Android',
  ios: 'iOS',
  web: 'Web',
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
};

const tag = 'rounded-[30px] border border-white/20 px-3 py-1 text-[14px] leading-6 tracking-[-0.02em]';
const link =
  'flex items-center gap-1.5 text-[14px] leading-6 font-medium tracking-[-0.02em] uppercase transition-opacity hover:opacity-70';

// Страница собирается на сервере и обновляется раз в час (ISR). Если pub.dev недоступен,
// бросаем: при сборке это честный фейл, при ревалидации Next оставит предыдущую версию.
export const getStaticProps: GetStaticProps<{ packages: DevPackage[] }> = async () => {
  const packages = await loadPackages();
  if (packages.length === 0) throw new Error('pub.dev unavailable');
  return { props: { packages }, revalidate: 3600 };
};

export default function PackagesPage({ packages }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t, i18n } = useTranslation();
  const number = new Intl.NumberFormat(i18n.language);
  const date = new Intl.DateTimeFormat(i18n.language, { month: 'short', year: 'numeric' });

  return (
    <>
      <SeoHead
        page="packages"
        path="/packages"
        breadcrumbs={[
          { name: t('caseStudies.page.home'), path: '/' },
          { name: t('header.packages'), path: '/packages' },
        ]}
      />

      <div className="min-h-screen bg-ink font-montserrat text-white">
        <Header />

        <main className="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-6 pt-[116px] pb-20 lg:px-20">
          <div className="flex flex-col gap-10">
            <nav aria-label="breadcrumb" className="flex items-center gap-3 text-[14px] leading-6 font-medium tracking-[-0.02em]">
              <Link href="/" className="opacity-40 transition-opacity hover:opacity-100">
                {t('caseStudies.page.home')}
              </Link>
              <span aria-hidden className="opacity-40">
                /
              </span>
              <span aria-current="page">{t('header.packages')}</span>
            </nav>
            <div className="flex flex-col gap-5">
              <h1 className="text-[clamp(3rem,6.25vw,7.5rem)] leading-none font-medium tracking-[-0.06em]">
                {t('packages.title')}
              </h1>
              <Lead className="max-w-[1100px] gap-2.5">{t('packages.subtitle')}</Lead>
            </div>
          </div>

          <dl className="grid grid-cols-3 divide-x divide-white/20 border-y border-white/20">
            {[
              { label: t('packages.home.statPackages'), value: packages.length },
              { label: t('packages.home.statDownloads'), value: packages.reduce((sum, pkg) => sum + pkg.downloads30d, 0) },
              { label: t('packages.home.statLikes'), value: packages.reduce((sum, pkg) => sum + pkg.likes, 0) },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-2 px-6 py-8 first:pl-0">
                <dd className="order-1 font-mono text-[clamp(2rem,3.5vw,3.5rem)] leading-none font-semibold tracking-[-0.04em] text-lime tabular-nums">
                  {number.format(stat.value)}
                </dd>
                <dt className="order-2 text-[14px] leading-5 tracking-[-0.02em] opacity-60">{stat.label}</dt>
              </div>
            ))}
          </dl>

          <div className="grid gap-[22px] md:grid-cols-2 xl:grid-cols-3">
            {packages.map((pkg) => (
              <article
                key={pkg.name}
                className="flex flex-col gap-5 rounded-[12px] border border-white/40 p-6 transition-colors hover:border-lime lg:p-8"
              >
                <div className="flex flex-col gap-3">
                  <h2 className="font-mono text-[24px] leading-8 font-semibold tracking-[-0.02em] break-all">{pkg.name}</h2>
                  <ul className="flex flex-wrap gap-2">
                    <li className={`${tag} font-mono`}>
                      <span className="opacity-60">v{pkg.version}</span>
                    </li>
                    <li className={tag}>
                      <span className="opacity-60">
                        {pkg.sdk === 'dart' ? t('packages.sdkDart') : t('packages.sdkFlutter')}
                      </span>
                    </li>
                  </ul>
                </div>

                <p className="flex-1 text-[16px] leading-6 tracking-[-0.02em] opacity-60 lg:text-[18px] lg:leading-7">
                  {t(`packages.items.${pkg.name}`, { defaultValue: pkg.description })}
                </p>

                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/20 pt-5">
                  <div className="flex flex-col gap-1">
                    <dd className="order-1 flex items-center gap-2 font-mono text-[28px] leading-8 font-semibold tracking-[-0.02em] tabular-nums">
                      <Download size={20} aria-hidden className="text-lime" />
                      {number.format(pkg.downloads30d)}
                    </dd>
                    <dt className="order-2 text-[14px] leading-5 tracking-[-0.02em] opacity-60">{t('packages.downloads')}</dt>
                  </div>
                  <div className="flex flex-col gap-1">
                    <dd className="order-1 flex items-center gap-2 font-mono text-[28px] leading-8 font-semibold tracking-[-0.02em] tabular-nums">
                      <Heart size={20} aria-hidden className="text-lime" />
                      {number.format(pkg.likes)}
                    </dd>
                    <dt className="order-2 text-[14px] leading-5 tracking-[-0.02em] opacity-60">{t('packages.likes')}</dt>
                  </div>
                  {pkg.published && (
                    <div className="flex flex-col gap-1">
                      <dd className="order-1 font-mono text-[16px] leading-6 tracking-[-0.02em]">
                        <time dateTime={pkg.published}>{date.format(new Date(pkg.published))}</time>
                      </dd>
                      <dt className="order-2 text-[14px] leading-5 tracking-[-0.02em] opacity-60">{t('packages.updated')}</dt>
                    </div>
                  )}
                  {pkg.platforms.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <dd className="order-1 text-[16px] leading-6 tracking-[-0.02em]">
                        {pkg.platforms.map((platform) => PLATFORM_LABEL[platform] ?? platform).join(', ')}
                      </dd>
                      <dt className="order-2 text-[14px] leading-5 tracking-[-0.02em] opacity-60">{t('packages.platforms')}</dt>
                    </div>
                  )}
                </dl>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/20 pt-5">
                  <a
                    href={`https://pub.dev/packages/${pkg.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackGoal(GOALS.packagePubClick, { package: pkg.name })}
                    className={`${link} text-lime`}
                  >
                    {t('packages.viewOnPub')}
                    <ArrowUpRight size={18} aria-hidden />
                  </a>
                  {pkg.repo && (
                    <a
                      href={pkg.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackGoal(GOALS.packageGithubClick, { package: pkg.name })}
                      className={`${link} opacity-60`}
                    >
                      {t('packages.viewOnGithub')}
                      <ArrowUpRight size={18} aria-hidden />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          <a
            href={PUB_PUBLISHER_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackGoal(GOALS.packagesAllClick)}
            className="flex items-center gap-2.5 self-start rounded-[40px] border border-white px-6 py-3 text-[14px] leading-6 font-semibold tracking-[-0.02em] transition-colors hover:border-lime hover:text-lime"
          >
            {t('packages.allOnPub')}
            <ArrowUpRight size={20} aria-hidden />
          </a>
        </main>

        <Footer />
      </div>
    </>
  );
}
