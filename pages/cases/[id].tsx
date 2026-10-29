import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { SeoHead } from '@/src/components/SeoHead';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { Faq } from '@/src/components/Faq';
import { GOALS, trackGoal } from '@/src/analytics';
import { SITE_URL } from '@/src/seo';
import cases from '@/src/data/cases.json';
import type { Case } from '@/src/store/casesStore';

export const getStaticPaths: GetStaticPaths = ({ locales = [] }) => ({
  paths: cases.flatMap((c) => locales.map((locale) => ({ params: { id: c.id }, locale }))),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ project: Case }> = ({ params }) => {
  const project = cases.find((c) => c.id === params?.id);
  return project ? { props: { project } } : { notFound: true };
};

// ponytail: в макете ещё полноширинный блок с длинным текстом о проекте — у кейсов пока есть только
// короткое описание. Появятся тексты: добавить поле в cases.json и вывести блок после видео.
export default function CasePage({ project }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation();
  const isAppStore = (url: string) => url.includes('apps.apple.com');
  const isApp = project.links.some(isAppStore);
  // Подпись кнопки — по адресу ссылки: сторы, страница загрузки десктоп-версии, иначе сайт.
  const linkLabel = (url: string) =>
    isAppStore(url)
      ? 'caseStudies.openApp'
      : url.includes('play.google.com')
        ? 'caseStudies.openGooglePlay'
        : /\/download\/?$/.test(url)
          ? 'caseStudies.openDownload'
          : 'caseStudies.openSite';
  const description = t(`caseStudies.items.${project.id}`, { defaultValue: project.description });

  const caseSchema = {
    '@context': 'https://schema.org',
    '@type': isApp ? 'SoftwareApplication' : 'CreativeWork',
    name: project.name,
    description,
    operatingSystem: project.platforms.join(', '),
    applicationCategory: 'BusinessApplication',
    image: `${SITE_URL}${project.image}`,
    author: {
      '@type': 'ProfessionalService',
      name: 'Bangert Studio',
      url: SITE_URL,
    },
    url: project.links[0],
    ...(project.links.length > 1 && { sameAs: project.links.slice(1) }),
  };

  return (
    <>
      <SeoHead
        page="cases"
        path={`/cases/${project.id}`}
        title={`${project.name} — Bangert Studio`}
        description={description}
        image={`${SITE_URL}${project.image}`}
        includeFaq={true}
        breadcrumbs={[
          { name: t('caseStudies.page.home'), path: '/' },
          { name: t('caseStudies.page.title'), path: '/cases' },
          { name: project.name, path: `/cases/${project.id}` },
        ]}
        schema={caseSchema}
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
                  className="absolute inset-0 -z-10 bg-black/85 md:bg-transparent md:bg-[linear-gradient(90deg,#000_0%,#000_44%,rgba(0,0,0,0.7)_62%,transparent_82%)]"
                />
              </>
            )}
            <div className={`mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-6 py-10 lg:px-20 ${project.wideCover ? 'lg:min-h-[412px]' : ''}`}>
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
                <ul className="flex flex-wrap gap-3">
                  <li className="rounded-[30px] border border-white/20 px-3 py-1 text-[14px] leading-6 tracking-[-0.02em]">
                    <span className="opacity-60">
                      {t('caseStudies.platform')}: {project.platforms.join(' / ')}
                    </span>
                  </li>
                  {isApp && (
                    <li className="rounded-[30px] border border-lime/40 px-3 py-1 text-[14px] leading-6 tracking-[-0.02em] text-lime">
                      {t('caseStudies.inAppStore')}
                    </li>
                  )}
                </ul>
              </div>
              {/* Первая ссылка — основная кнопка, остальные — контурные. */}
              <div className="flex flex-wrap gap-3">
                {project.links.map((url, i) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackGoal(GOALS.caseSiteOpen, { name: project.name, platform: project.platforms.join(' / '), url })}
                    className={`flex items-center gap-2.5 rounded-[40px] px-6 py-3 text-[14px] leading-6 font-semibold tracking-[-0.02em] whitespace-nowrap transition-colors ${
                      i === 0 ? 'bg-lime text-ink hover:opacity-85' : 'border border-white text-white hover:border-lime hover:text-lime'
                    }`}
                  >
                    {t(linkLabel(url))}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={i === 0 ? '/assets/hero/arrow-dark.svg' : '/assets/hero/arrow-light-2.svg'} alt="" width={24} height={24} />
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Под широкой обложкой шапка заканчивается фоном — отступаем, иначе видео прилипает к нему. */}
          {project.video && (
            <section className={`mx-auto w-full max-w-[1920px] px-6 pb-10 lg:px-20 ${project.wideCover ? 'pt-10' : ''}`}>
              <video
                src={project.video}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={`${project.name} — видео проекта`}
                className="aspect-video w-full rounded-[12px] bg-white/5 object-cover"
              />
            </section>
          )}

          <Faq />
        </main>

        <Footer />
      </div>
    </>
  );
}
