import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { SeoHead } from '@/app/components/SeoHead';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
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
      <div className="min-h-screen bg-bg">
        <Header />

        <main className="mx-auto max-w-6xl px-6 pb-28 pt-36">
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 text-small text-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('caseStudies.back')}
          </Link>

          <div className="mt-10 grid items-start gap-12 md:grid-cols-12 md:gap-20">
            <div className="overflow-hidden bg-surface md:col-span-6">
              <ImageWithFallback
                src={project.image}
                alt={project.name}
                className="aspect-square w-full object-cover"
              />
            </div>

            <div className="md:sticky md:top-32 md:col-span-6">
              <h1 className="font-display font-semibold text-h1 text-fg">{project.name}</h1>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="border border-hairline px-2 py-0.5 text-xs text-faint">
                  {project.platform}
                </span>
                {isApp && (
                  <span className="border border-accent/40 bg-accent-soft px-2 py-0.5 text-xs text-accent">
                    {t('caseStudies.inAppStore')}
                  </span>
                )}
              </div>

              <p className="mt-8 max-w-[60ch] text-body-lg leading-relaxed text-muted">{description}</p>

              <a
                href={project.site}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackGoal(GOALS.caseSiteOpen, { name: project.name, platform: project.platform })
                }
                className="mt-12 inline-flex items-center gap-2 bg-fg px-6 py-3 text-small font-medium text-bg transition-colors hover:bg-accent"
              >
                {t(isApp ? 'caseStudies.openApp' : 'caseStudies.openSite')}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
