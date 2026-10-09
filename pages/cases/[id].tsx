import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { SeoHead } from '@/app/components/SeoHead';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { Faq } from '@/app/components/Faq';
import { GOALS, trackGoal } from '@/app/analytics';
import { SITE_URL } from '@/app/seo';
import cases from '@/app/data/cases.json';
import type { Case } from '@/app/store/casesStore';

export const getStaticPaths: GetStaticPaths = ({ locales = [] }) => ({
  paths: cases.flatMap((c) => locales.map((locale) => ({ params: { id: c.id }, locale }))),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ project: Case }> = ({ params }) => {
  const project = cases.find((c) => c.id === params?.id);
  return project ? { props: { project } } : { notFound: true };
};

// ponytail: в макете ещё полноширинный блок с длинным текстом о проекте — у кейсов пока есть только
// короткое описание. Появятся тексты: добавить поле в cases.json и вывести блок после «О проекте».
export default function CasePage({ project }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation();
  const isApp = project.site.includes('apps.apple.com');
  const description = t(`caseStudies.items.${project.id}`, { defaultValue: project.description });

  return (
    <>
      <SeoHead
        page="cases"
        path={`/cases/${project.id}`}
        title={`${project.name} — Bangert Studio`}
        description={description}
        image={`${SITE_URL}${project.image}`}
      />
      <div className="min-h-screen bg-ink font-montserrat text-white">
        <Header />

        {/* pt — высота фиксированной шапки (88px в макете). */}
        <main className="pt-[88px]">
          <section className="relative isolate overflow-hidden">
            {/* Фон — только у кейсов с широкой обложкой: квадратный постер на всю ширину превращался
                в размытую вырезку из середины. */}
            {project.wideCover && (
              <>
                <Image src={project.wideCover} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-black/75 md:bg-transparent md:bg-[linear-gradient(90deg,#000_16.346%,transparent)]"
                />
              </>
            )}
            <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-6 py-10 lg:min-h-[412px] lg:px-20">
              <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-3 text-[14px] leading-6 font-medium tracking-[-0.02em]">
                <Link href="/" className="opacity-40 transition-opacity hover:opacity-100">
                  {t('caseStudies.page.home')}
                </Link>
                <span aria-hidden className="opacity-40">
                  /
                </span>
                <Link href="/cases" className="opacity-40 transition-opacity hover:opacity-100">
                  {t('caseStudies.page.title')}
                </Link>
                <span aria-hidden className="opacity-40">
                  /
                </span>
                <span aria-current="page">{project.name}</span>
              </nav>
              <div className="flex flex-col gap-5">
                <h1 className="text-[clamp(3rem,6.25vw,7.5rem)] leading-none font-medium tracking-[-0.06em]">{project.name}</h1>
                <p className="max-w-[880px] text-[18px] leading-8 font-medium tracking-[-0.02em] opacity-60 lg:text-[20px]">
                  {description}
                </p>
              </div>
            </div>
          </section>

          {/* Картинки кейсов — квадратные постеры с текстом: показываем целиком в квадратной рамке. */}
          <section className="mx-auto grid w-full max-w-[1920px] gap-10 px-6 py-10 lg:grid-cols-[minmax(0,640px)_1fr] lg:px-20">
            <div className="relative aspect-square w-full overflow-hidden rounded-[12px] bg-white/5">
              <Image src={project.image} alt={project.name} fill sizes="(min-width: 1024px) 640px, 100vw" className="object-contain" />
            </div>

            <div className="flex flex-col items-start gap-10">
              <h2 className="text-[clamp(2.25rem,3.125vw,3.75rem)] leading-[1.1333] font-semibold tracking-[-0.06em] uppercase">
                {t('caseStudies.page.about')}
              </h2>
              <div className="flex flex-col gap-5">
                <p className="max-w-[880px] text-[18px] leading-8 font-medium tracking-[-0.02em] opacity-60 lg:text-[20px]">
                  {description}
                </p>
                <ul className="flex flex-wrap gap-3">
                  <li className="rounded-[30px] border border-white/20 px-3 py-1 text-[14px] leading-6 tracking-[-0.02em]">
                    <span className="opacity-60">
                      {t('caseStudies.platform')}: {project.platform}
                    </span>
                  </li>
                  {isApp && (
                    <li className="rounded-[30px] border border-lime/40 px-3 py-1 text-[14px] leading-6 tracking-[-0.02em] text-lime">
                      {t('caseStudies.inAppStore')}
                    </li>
                  )}
                </ul>
              </div>
              <a
                href={project.site}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackGoal(GOALS.caseSiteOpen, { name: project.name, platform: project.platform })}
                className="flex items-center gap-2.5 rounded-[40px] bg-lime px-6 py-3 text-[14px] leading-6 font-semibold tracking-[-0.02em] whitespace-nowrap text-ink transition-opacity hover:opacity-85"
              >
                {t(isApp ? 'caseStudies.openApp' : 'caseStudies.openSite')}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/hero/arrow-dark.svg" alt="" width={24} height={24} />
              </a>
            </div>
          </section>

          <Faq />
        </main>

        <Footer />
      </div>
    </>
  );
}
