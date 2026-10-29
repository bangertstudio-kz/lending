import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import cases from '@/src/data/cases.json';
import { SeoHead } from '@/src/components/SeoHead';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { Faq } from '@/src/components/Faq';
import { CaseGridCard, HOME_COVERS, useCardVariant } from '@/src/components/CaseGridCard';

// Сначала кейсы с обложками из макета главной, затем остальные с видео, дальше — в порядке cases.json.
const ORDERED = [...cases].sort((a, b) => {
  const rank = (c: (typeof cases)[number]) =>
    HOME_COVERS.includes(c.id) ? HOME_COVERS.indexOf(c.id) : HOME_COVERS.length + ('video' in c && c.video ? 0 : 1);
  return rank(a) - rank(b);
});

const FILTERS = {
  all: () => true,
  mobile: (platforms: string[]) => platforms.some((p) => p === 'iOS' || p === 'Android'),
  web: (platforms: string[]) => platforms.includes('Web'),
};
type Filter = keyof typeof FILTERS;

export default function CasesPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>('all');
  const variant = useCardVariant();
  const visible = ORDERED.filter((project) => FILTERS[filter](project.platforms));

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

            {/* До гидрации вариант неизвестен — сетка проявляется, когда он выбран, без прыжка вёрстки. */}
            <div className={`grid gap-[22px] transition-opacity duration-300 md:grid-cols-2 ${variant ? '' : 'opacity-0'}`}>
              {visible.map((project, i) => (
                <CaseGridCard
                  key={project.id}
                  project={project}
                  variant={variant ?? 'caption'}
                  // Как в макете: первым в «Все проекты» идёт широкий Manover Metal со слоганом и описанием.
                  {...(filter === 'all' && i === 0 && {
                    featured: { tagline: t('caseStudies.home.manoverTagline'), text: t('caseStudies.home.manoverText') },
                    aspect: 'aspect-[16/9]',
                    sizes: '100vw',
                    preload: true,
                    className: 'md:col-span-2',
                  })}
                />
              ))}
            </div>
          </div>

          <Faq />
        </main>

        <Footer />
      </div>
    </>
  );
}
