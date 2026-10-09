import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { SeoHead } from '@/app/components/SeoHead';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { Process } from '@/app/components/Process';
import { Faq } from '@/app/components/Faq';
import { LimeButton, goToContact } from '@/app/components/ui/block';
import { GOALS, trackGoal } from '@/app/analytics';
import { ALL_SERVICES, type Service } from '@/app/data/services';

export const getStaticPaths: GetStaticPaths = ({ locales = [] }) => ({
  paths: ALL_SERVICES.flatMap((s) => locales.map((locale) => ({ params: { slug: s.slug }, locale }))),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ service: Service }> = ({ params }) => {
  const service = ALL_SERVICES.find((s) => s.slug === params?.slug);
  return service ? { props: { service } } : { notFound: true };
};

// ponytail: в макете после «Процесса» ещё блок-калькулятор «Узнайте стоимость за 30 секунд» — его
// пока нет на сайте в новом стиле; появится — вставить между <Process /> и <Faq />.
export default function ServicePage({ service }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation();
  const text = (field: string) => t(`services.page.${service.key}.${field}`);

  return (
    <>
      <SeoHead
        page="home"
        path={`/services/${service.slug}`}
        title={`${text('title1')} ${text('title2')} — Bangert Studio`}
        description={text('lead')}
      />
      <div className="min-h-screen bg-ink font-montserrat text-white">
        <Header />

        <main>
          {/* В макете фон уходит под шапку (664px вместе с ней) и гаснет книзу. */}
          <section className="relative isolate overflow-hidden">
            {/* Картинка целиком (без обрезки и лишнего увеличения) на всю высоту блока, прижата вправо и
                плавно гаснет влево — у мобильной слева и так чёрный фон, поэтому она смотрится во всю ширину.
                На телефонах текст поверх картинки — приглушаем её. */}
            <div aria-hidden className="absolute inset-0 -z-10 opacity-30 [mask-image:linear-gradient(90deg,transparent_15%,#000_55%)] lg:opacity-100">
              <Image src={service.image} alt="" fill priority sizes="100vw" className="object-contain object-right-bottom" />
            </div>
            <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(2,2,2,0)_45.673%,var(--color-ink))]" />
            <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-6 pt-[128px] pb-10 lg:min-h-[664px] lg:px-20">
              <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-3 text-[14px] leading-6 font-medium tracking-[-0.02em]">
                <Link href="/" className="opacity-40 transition-opacity hover:opacity-100">
                  {t('caseStudies.page.home')}
                </Link>
                <span aria-hidden className="opacity-40">
                  /
                </span>
                <span aria-current="page">{t(`services.${service.key}.title`)}</span>
              </nav>

              <h1 className="text-[clamp(2.75rem,6.25vw,7.5rem)] leading-none font-medium tracking-[-0.06em]">
                <span className="block uppercase">{text('title1')}</span>
                <span className="block text-lime">{text('title2')}</span>
              </h1>
              <p className="max-w-[560px] text-[18px] leading-8 font-medium tracking-[-0.02em] lg:text-[20px]">{text('lead')}</p>

              <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
                <LimeButton
                  onClick={() => {
                    trackGoal(GOALS.heroCtaConsultation, { place: `service_${service.key}` });
                    goToContact();
                  }}
                >
                  {t('hero.ctaConsultation')}
                </LimeButton>
                <Link
                  href="/cases"
                  onClick={() => trackGoal(GOALS.heroCtaWork, { place: `service_${service.key}` })}
                  className="group flex items-center gap-5 text-[14px] leading-6 font-semibold tracking-[-0.02em]"
                >
                  <span className="flex rounded-[40px] border border-white p-[11px] transition-colors group-hover:border-lime">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/hero/play.svg" alt="" width={24} height={24} />
                  </span>
                  {t('services.page.portfolio')}
                </Link>
              </div>
            </div>
          </section>

          <Process />
          <Faq />
        </main>

        <Footer />
      </div>
    </>
  );
}
