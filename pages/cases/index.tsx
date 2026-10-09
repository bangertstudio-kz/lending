import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import cases from '@/app/data/cases.json';
import { SeoHead } from '@/app/components/SeoHead';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { Faq } from '@/app/components/Faq';
import { CaseCard, HOME_COVERS, cardTitle } from '@/app/components/CaseStudies';
import { More } from '@/app/components/ui/block';

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

const GRADIENT = 'bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.8)_83.654%)]';
// У широкой карточки в макете затемнение до чистого чёрного — на обложке Manover свой текст.
const FEATURED_GRADIENT = 'bg-[linear-gradient(180deg,transparent,#000_83.654%)]';

export default function CasesPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>('all');
  const visible = ORDERED.filter((project) => FILTERS[filter](project.platform));

  return (
    <>
      <SeoHead page="cases" path="/cases" />
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
                    sizes={featured ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw'}
                    className={`h-[400px] md:h-[480px] xl:h-[540px] ${
                      featured ? 'gap-2.5 shadow-[4px_4px_0_0_var(--color-lime)] md:col-span-2' : ''
                    }`}
                  >
                    {featured ? (
                      <>
                        <span className="flex flex-col gap-2.5">
                          <span className="text-[18px] leading-6 font-semibold tracking-[-0.02em]">
                            {t('caseStudies.home.manoverTagline')}
                          </span>
                          <span className={cardTitle}>{project.name}</span>
                          <span className="max-w-[760px] text-[14px] leading-5 font-medium tracking-[-0.02em] opacity-40">
                            {t('caseStudies.home.manoverText')}
                          </span>
                        </span>
                        <More label={t('caseStudies.home.more')} />
                      </>
                    ) : (
                      <span className="flex flex-wrap items-end justify-between gap-x-6">
                        <span className={cardTitle}>{project.name}</span>
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
