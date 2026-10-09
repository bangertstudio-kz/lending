import { SeoHead } from '@/app/components/SeoHead';
import { useEffect } from 'react';
import Link from 'next/link';
import { Heart, BadgeCheck, Download, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { Lead } from '@/app/components/ui/block';
import { usePackagesStore } from '@/app/store/packagesStore';
import { GOALS, trackGoal } from '@/app/analytics';

const PUB_PUBLISHER_URL = 'https://pub.dev/publishers/bangertstudio.kz/packages';

const tag = 'rounded-[30px] border border-white/20 px-3 py-1 text-[14px] leading-6 tracking-[-0.02em]';
const link =
  'flex items-center gap-1.5 text-[14px] leading-6 font-medium tracking-[-0.02em] uppercase transition-opacity hover:opacity-70';

export default function PackagesPage() {
  const { t } = useTranslation();
  const { packages, loading, error, fetch } = usePackagesStore();

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <>
      <SeoHead page="packages" path="/packages" />

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

          {/* До первого запроса стор пуст и не «loading» — без этого мелькала пустая страница. */}
          {(loading || (!packages.length && !error)) && <p className="text-[14px] leading-6 opacity-40">{t('packages.loading')}</p>}
          {error && (
            <p role="alert" className="text-[14px] leading-6 text-red-400">
              {t(error)}
            </p>
          )}

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

                <dl className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[14px] leading-6 tabular-nums">
                  <div className="flex items-center gap-1.5" title={`${pkg.likes} ${t('packages.likes')}`}>
                    <dt>
                      <Heart size={16} aria-label={t('packages.likes')} className="text-lime" />
                    </dt>
                    <dd>{pkg.likes}</dd>
                  </div>
                  <div className="flex items-center gap-1.5" title={`${pkg.points}/${pkg.maxPoints} ${t('packages.points')}`}>
                    <dt>
                      <BadgeCheck size={16} aria-label={t('packages.points')} className="text-lime" />
                    </dt>
                    <dd>
                      {pkg.points}/{pkg.maxPoints}
                    </dd>
                  </div>
                  <div className="flex items-center gap-1.5" title={`${pkg.downloads30d} ${t('packages.downloads')}`}>
                    <dt>
                      <Download size={16} aria-label={t('packages.downloads')} className="text-lime" />
                    </dt>
                    <dd>{pkg.downloads30d}</dd>
                  </div>
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

          {packages.length > 0 && (
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
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
