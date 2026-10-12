import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import cases from '@/src/data/cases.json';
import { SeoHead } from '@/src/components/SeoHead';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { Faq } from '@/src/components/Faq';
import { CaseCard, HOME_COVERS } from '@/src/components/CaseStudies';
import { More } from '@/src/components/ui/block';

// Кейсы с обложками из макета главной идут первыми, остальные в порядке cases.json.
const ORDERED = [...cases].sort((a, b) => {
  const rank = (id: string) => (HOME_COVERS.includes(id) ? HOME_COVERS.indexOf(id) : HOME_COVERS.length);
  return rank(a.id) - rank(b.id);
});

const FILTERS = {
  all: () => true,
  mobile: (platform: string) => /iOS|Android/.test(platform),
  web: (platform: string) => platform.includes('Web'),
};
type Filter = keyof typeof FILTERS;

const GRADIENT = 'bg-[linear-gradient(180deg,transparent_20%,rgba(0,0,0,0.65)_55%,#000_92%)]';
// У широкой карточки градиент скрывает текст на обложке слева и плавно открывает 3D-мокап справа.
const FEATURED_GRADIENT =
  'bg-[linear-gradient(180deg,rgba(10,9,8,0.96)_0%,rgba(10,9,8,0.92)_60%,rgba(10,9,8,0.96)_100%)] md:bg-[linear-gradient(90deg,#0A0908_0%,#0A0908_48%,rgba(10,9,8,0.7)_65%,transparent_85%)]';

export default function CasesPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>('all');
  const visible = ORDERED.filter((project) => FILTERS[filter](project.platform));

  return (
    <>
      <SeoHead
        page="cases"
        path="/cases"
        includeFaq={true}
        breadcrumbs={[
          { name: t('caseStudies.page.home'), path: '/' },
          { name: t('caseStudies.page.title'), path: '/cases' },
        ]}
      />
      <div className="min-h-screen bg-ink font-montserrat text-white">
        <Header />

        <main>
          <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-6 pt-[116px] pb-20 lg:px-20">
            <div className="flex flex-col gap-10">
              <nav aria-label="breadcrumb" className="flex items-center gap-3 text-[14px] leading-6 font-medium tracking-[-0.02em]">
                <Link href="/" className="opacity-40 transition-opacity hover:opacity-100">
                  {t('caseStudies.page.home')}
                </Link>
                <span aria-hidden className="opacity-40">
                  /
                </span>
                <span aria-current="page">{t('caseStudies.page.title')}</span>
              </nav>
              <h1 className="text-[clamp(3.5rem,6.25vw,7.5rem)] leading-none font-medium tracking-[-0.06em]">
                {t('caseStudies.page.title')}
              </h1>
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-5">
              {(Object.keys(FILTERS) as Filter[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={filter === key}
                  onClick={() => setFilter(key)}
                  className={`cursor-pointer rounded-[40px] border border-white px-6 py-2 text-[14px] leading-6 font-semibold tracking-[-0.02em] transition-colors ${
                    filter === key ? 'bg-white text-ink' : 'hover:border-lime hover:text-lime'
                  }`}
                >
                  {t(`caseStudies.page.${key}`)}
                </button>
              ))}
            </div>

            <div className="grid gap-[22px] md:grid-cols-2 xl:grid-cols-3">
              {visible.map((project, i) => {
                // Как в макете: первым в «Все проекты» идёт широкий Manover Metal с описанием и лаймовой тенью.
                const featured = filter === 'all' && i === 0;
                return (
                  <CaseCard
                    key={project.id}
                    id={project.id}
                    place="cases"
                    gradient={featured ? FEATURED_GRADIENT : GRADIENT}
                    sizes={featured ? '(min-width: 1280px) 67vw, 100vw' : '(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw'}
                    innerClassName={featured ? 'p-6 lg:p-10' : 'p-5 sm:p-6 lg:p-6 2xl:p-8'}
                    className={`aspect-[16/9] w-full ${
                      featured
                        ? 'min-h-[380px] sm:min-h-0 gap-2.5 rounded-[12px] ring-1 ring-lime/50 shadow-[0_4px_24px_rgba(210,249,73,0.18)] md:col-span-2 xl:col-span-2 xl:row-span-2'
                        : 'min-h-[220px] sm:min-h-0'
                    }`}
                  >
                    {featured ? (
                      <>
                        <span className="flex max-w-[620px] flex-col gap-2.5">
                          <span className="text-[16px] sm:text-[18px] leading-6 font-semibold tracking-[-0.02em]">
                            {t('caseStudies.home.manoverTagline')}
                          </span>
                          <span className="text-[28px] sm:text-[36px] lg:text-[44px] 2xl:text-[48px] leading-none font-bold tracking-[-0.06em] uppercase">
                            {project.name}
                          </span>
                          <span className="max-w-[760px] text-[13px] sm:text-[14px] leading-5 font-medium tracking-[-0.02em] opacity-40 line-clamp-3 lg:line-clamp-none">
                            {t('caseStudies.home.manoverText')}
                          </span>
                        </span>
                        <More label={t('caseStudies.home.more')} />
                      </>
                    ) : (
                      <span className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
                        <span className="text-[20px] sm:text-[24px] lg:text-[22px] 2xl:text-[28px] leading-tight font-bold tracking-[-0.05em] uppercase">
                          {project.name}
                        </span>
                        <More label={t('caseStudies.home.more')} />
                      </span>
                    )}
                  </CaseCard>
                );
              })}
            </div>
          </div>

          <Faq />
        </main>

        <Footer />
      </div>
    </>
  );
}
