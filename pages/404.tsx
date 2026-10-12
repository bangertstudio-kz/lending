import { useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, useSpring } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowUpRight, Home, FolderGit2, Layers, MessageSquare } from 'lucide-react';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { LimeButton, goToContact } from '@/src/components/ui/block';
import { Magnetic } from '@/src/components/ui/Magnetic';
import { SpotlightCard } from '@/src/components/ui/SpotlightCard';

export default function Custom404() {
  const { t } = useTranslation();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // 3D параллакс-наклон центральной композиции 404 за курсором
  const rotateX = useSpring(0, { stiffness: 160, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 160, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    rotateX.set(-y * 14);
    rotateY.set(x * 14);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <Head>
        <title>{`${t('notFound.title')} — Bangert Studio`}</title>
        <meta name="robots" content="noindex, follow" />
      </Head>

      <div className="flex min-h-screen flex-col justify-between bg-ink font-montserrat text-white selection:bg-lime selection:text-ink">
        <Header />

        <main className="relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden px-6 pt-[124px] pb-24 lg:px-20">
          {/* Фоновое изображение 404.png строго внутри блока 404 */}
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <Image
              src="/assets/404.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-bottom"
            />
            {/* Градиент сверху для слияния с шапкой и снизу перед футером */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#0A0908_0%,transparent_16%,transparent_78%,#0A0908_100%)]" />
          </div>

          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1000 }}
            className="relative z-10 mx-auto flex w-full max-w-[1140px] flex-col items-center text-center"
          >
            {/* Статус-бейдж в стиле терминала */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 backdrop-blur-md"
            >
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-lime shadow-[0_0_8px_#d2f949]" />
              </span>
              <span className="font-mono text-[11px] sm:text-[12px] font-semibold tracking-wider uppercase text-white/80">
                {t('notFound.badge')}
              </span>
            </motion.div>

            {/* Текст «404» */}
            <motion.div
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              className="relative mb-4 select-none will-change-transform"
            >
              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="block text-[clamp(6rem,20vw,14rem)] font-extrabold leading-none tracking-[-0.06em] text-white drop-shadow-[0_16px_36px_rgba(0,0,0,0.95)]"
              >
                4<span className="text-lime">0</span>4
              </motion.span>
            </motion.div>

            {/* Заголовок и поясняющий текст */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-3 text-[clamp(1.75rem,3.75vw,2.75rem)] font-bold tracking-[-0.04em] uppercase"
            >
              {t('notFound.title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 max-w-[560px] text-[15px] leading-relaxed text-white/65 sm:text-[17px]"
            >
              {t('notFound.subtitle')}
            </motion.p>

            {/* Основные кнопки действий */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
            >
              <Magnetic strength={0.25}>
                <Link href="/">
                  <LimeButton onClick={() => {}}>
                    <Home className="size-4" />
                    <span>{t('notFound.homeCta')}</span>
                  </LimeButton>
                </Link>
              </Magnetic>

              <Magnetic strength={0.25}>
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="flex cursor-pointer items-center gap-2 rounded-[40px] border border-white/20 bg-white/[0.03] px-6 py-3 text-[14px] leading-6 font-semibold tracking-[-0.02em] uppercase text-white backdrop-blur-sm transition-all hover:border-lime hover:text-lime"
                >
                  <ArrowLeft className="size-4" />
                  <span>{t('notFound.backCta')}</span>
                </button>
              </Magnetic>

              <Magnetic strength={0.25}>
                <Link
                  href="/cases"
                  className="flex items-center gap-2 rounded-[40px] border border-white/20 bg-white/[0.03] px-6 py-3 text-[14px] leading-6 font-semibold tracking-[-0.02em] uppercase text-white backdrop-blur-sm transition-all hover:border-lime hover:text-lime"
                >
                  <FolderGit2 className="size-4" />
                  <span>{t('notFound.casesCta')}</span>
                </Link>
              </Magnetic>
            </motion.div>

            {/* Карточки быстрой навигации по ключевым направлениям */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-14 grid w-full gap-4 text-left sm:grid-cols-3"
            >
              {/* Карточка 1: Портфолио */}
              <Link href="/cases" className="group">
                <SpotlightCard
                  spotlightColor="rgba(210, 249, 73, 0.16)"
                  className="h-full rounded-[16px] border border-white/15 bg-black/55 backdrop-blur-md p-6 transition-all duration-300 hover:border-lime/40 hover:bg-black/65"
                >
                  <div className="flex h-full flex-col justify-between gap-5">
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-[10px] border border-white/15 bg-white/[0.04] text-lime transition-colors group-hover:border-lime/40 group-hover:bg-lime/10">
                        <FolderGit2 className="size-5" />
                      </div>
                      <ArrowUpRight className="size-5 text-white/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lime" />
                    </div>
                    <div>
                      <h2 className="mb-1 text-[18px] font-semibold tracking-[-0.02em] text-white transition-colors group-hover:text-lime">
                        {t('notFound.cardCasesTitle')}
                      </h2>
                      <p className="text-[13px] leading-5 text-white/55">
                        {t('notFound.cardCasesDesc')}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </Link>

              {/* Карточка 2: Услуги */}
              <Link href="/#services" className="group">
                <SpotlightCard
                  spotlightColor="rgba(210, 249, 73, 0.16)"
                  className="h-full rounded-[16px] border border-white/15 bg-black/55 backdrop-blur-md p-6 transition-all duration-300 hover:border-lime/40 hover:bg-black/65"
                >
                  <div className="flex h-full flex-col justify-between gap-5">
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-[10px] border border-white/15 bg-white/[0.04] text-lime transition-colors group-hover:border-lime/40 group-hover:bg-lime/10">
                        <Layers className="size-5" />
                      </div>
                      <ArrowUpRight className="size-5 text-white/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lime" />
                    </div>
                    <div>
                      <h2 className="mb-1 text-[18px] font-semibold tracking-[-0.02em] text-white transition-colors group-hover:text-lime">
                        {t('notFound.cardServicesTitle')}
                      </h2>
                      <p className="text-[13px] leading-5 text-white/55">
                        {t('notFound.cardServicesDesc')}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </Link>

              {/* Карточка 3: Связаться / Обсудить проект */}
              <button
                type="button"
                onClick={goToContact}
                className="group cursor-pointer text-left"
              >
                <SpotlightCard
                  spotlightColor="rgba(210, 249, 73, 0.16)"
                  className="h-full rounded-[16px] border border-white/15 bg-black/55 backdrop-blur-md p-6 transition-all duration-300 hover:border-lime/40 hover:bg-black/65"
                >
                  <div className="flex h-full flex-col justify-between gap-5">
                    <div className="flex items-center justify-between">
                      <div className="flex size-11 items-center justify-center rounded-[10px] border border-white/15 bg-white/[0.04] text-lime transition-colors group-hover:border-lime/40 group-hover:bg-lime/10">
                        <MessageSquare className="size-5" />
                      </div>
                      <ArrowUpRight className="size-5 text-white/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lime" />
                    </div>
                    <div>
                      <h2 className="mb-1 text-[18px] font-semibold tracking-[-0.02em] text-white transition-colors group-hover:text-lime">
                        {t('notFound.cardContactTitle')}
                      </h2>
                      <p className="text-[13px] leading-5 text-white/55">
                        {t('notFound.cardContactDesc')}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </button>
            </motion.div>
          </div>
        </main>

        {/* Непрозрачный монолитный футер */}
        <div className="relative z-20 w-full bg-[#0a0a0a]">
          <Footer />
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return { props: {} };
}
