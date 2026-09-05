import { SeoHead } from '@/app/components/SeoHead';
import { useEffect } from 'react';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useTranslation } from 'react-i18next';
import { useCasesStore } from '@/app/store/casesStore';

export default function CasesPage() {
  const { t } = useTranslation();
  const { cases, loading, error, fetch } = useCasesStore();

  useEffect(() => { fetch(); }, [fetch]);

  return (
    <>
      <SeoHead page="cases" path="/cases" />
      <div className="min-h-screen bg-bg">
        <Header />

        <main className="mx-auto max-w-6xl px-6 pb-28 pt-36">
          <h1 className="font-display font-semibold text-h1 text-fg">{t('caseStudies.title')}</h1>
          <p className="mb-16 mt-4 max-w-[52ch] text-body-lg text-muted">
            {t('caseStudies.subtitle')}
          </p>

          {loading && <p className="text-center text-small text-faint">{t('packages.loading')}</p>}
          {error && <p role="alert" className="text-center text-small text-red-400">{error}</p>}

          {!loading && !error && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cases.map((project) => (
                <a
                  key={project.name}
                  href={project.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col border border-hairline bg-surface transition-colors hover:border-hairline-strong"
                >
                  <div className="aspect-square overflow-hidden bg-raised">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <h2 className="font-display font-semibold text-h3 text-fg">{project.name}</h2>
                    <p className="flex-1 text-small leading-relaxed text-muted">{t(`caseStudies.items.${project.id}`, { defaultValue: project.description })}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="border border-hairline px-2 py-0.5 text-xs text-faint">
                        {project.platform}
                      </span>
                      {project.site.includes('apps.apple.com') && (
                        <span className="border border-accent/40 bg-accent-soft px-2 py-0.5 text-xs text-accent">
                          {t('caseStudies.inAppStore')}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
