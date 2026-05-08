import Head from 'next/head';
import { useEffect } from 'react';
import { motion } from 'motion/react';
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
      <Head>
        <title>Кейсы — Bangert Studio</title>
        <meta name="description" content="Наши работы: мобильные и веб-приложения для стартапов и бизнеса. Смотрите реальные проекты Bangert Studio." />
        <link rel="canonical" href="https://bangertstudio.kz/cases" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bangertstudio.kz/cases" />
        <meta property="og:title" content="Кейсы — Bangert Studio" />
        <meta property="og:description" content="Наши работы: мобильные и веб-приложения для стартапов и бизнеса." />
        <meta property="og:image" content="https://bangertstudio.kz/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Кейсы — Bangert Studio" />
        <meta name="twitter:description" content="Наши работы: мобильные и веб-приложения для стартапов и бизнеса." />
        <meta name="twitter:image" content="https://bangertstudio.kz/og-image.png" />
      </Head>
      <div className="min-h-screen bg-black">
        <Header />

        <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
          <motion.h1
            className="text-white text-4xl text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('caseStudies.title')}
          </motion.h1>

          {loading && <p className="text-white/40 text-center text-sm">Loading...</p>}
          {error && <p className="text-red-400 text-center text-sm">{error}</p>}

          {!loading && !error && (
            <div className="flex flex-col">
              {cases.map((project, index) => (
                <motion.a
                  key={project.name}
                  href={project.site}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-6 py-6 border-b border-white/10 group hover:border-white/30 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-zinc-900">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-white text-lg">{project.name}</h2>
                      <span className="text-xs text-white/40 border border-white/20 px-2 py-0.5 flex-shrink-0">
                        {project.platform}
                      </span>
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed mb-3">{project.description}</p>
                    <span className="text-white/40 text-xs border-b border-white/20 pb-px group-hover:text-white/70 group-hover:border-white/40 transition-colors">
                      {t('caseStudies.viewSite')} →
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
