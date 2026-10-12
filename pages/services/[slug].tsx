import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { SeoHead } from '@/src/components/SeoHead';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { Process } from '@/src/components/Process';
import { Faq } from '@/src/components/Faq';
import { LimeButton, goToContact } from '@/src/components/ui/block';
import { GOALS, trackGoal } from '@/src/analytics';
import { ALL_SERVICES, type Service } from '@/src/data/services';
import { SITE_URL } from '@/src/seo';

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

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${text('title1')} ${text('title2')}`,
    serviceType: service.key,
    description: text('lead'),
    provider: {
      '@type': 'ProfessionalService',
      name: 'Bangert Studio',
      url: SITE_URL,
    },
    areaServed: [
      { '@type': 'Country', name: 'Kazakhstan' },
      { '@type': 'City', name: 'Almaty' },
      { '@type': 'City', name: 'Astana' },
      { '@type': 'City', name: 'Shymkent' },
      { '@type': 'City', name: 'Karaganda' },
      { '@type': 'City', name: 'Aktobe' },
      { '@type': 'City', name: 'Atyrau' },
      { '@type': 'City', name: 'Aktau' },
      { '@type': 'City', name: 'Pavlodar' },
      { '@type': 'AdministrativeArea', name: 'Worldwide' },
    ],
  };

  return (
    <>
      <SeoHead
        page="home"
        path={`/services/${service.slug}`}
        title={`${text('title1')} ${text('title2')} — Bangert Studio`}
        description={text('lead')}
        includeFaq={true}
        breadcrumbs={[
          { name: t('caseStudies.page.home'), path: '/' },
          { name: t(`services.${service.key}.title`), path: `/services/${service.slug}` },
        ]}
        schema={serviceSchema}
      />
      <div className="min-h-screen bg-ink font-montserrat text-white">
        <Header />

        <main>
          {/* В макете фон уходит под шапку (664px вместе с ней) и гаснет книзу. */}
          <section className="relative isolate overflow-hidden bg-ink">
            {/* Фоновое свечение и градиенты */}
            <div aria-hidden className="pointer-events-none absolute -right-20 top-1/4 -z-20 h-[500px] w-[500px] rounded-full bg-lime/10 blur-[130px]" />
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(2,2,2,0)_50%,var(--color-ink))]" />

            <div className="relative mx-auto flex w-full max-w-[1920px] flex-col justify-center px-6 pt-[128px] pb-12 lg:min-h-[664px] lg:px-20">
              {/* Десктопная иллюстрация (справа, от самого верха под хэдер, без черной полосы сверху) */}
              <div
                aria-hidden
                className="pointer-events-none absolute right-0 top-0 bottom-0 z-0 hidden lg:flex items-start justify-end w-[50%] xl:w-[54%] 2xl:w-[58%] max-w-[1170px] 2xl:max-w-[1220px]"
              >
                <div className="relative h-full w-full max-h-[664px]">
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 1920px) 1170px, 54vw"
                    className="object-contain object-right-top"
                  />
                </div>
              </div>

              {/* Текстовая колонка слева */}
              <div className="relative z-10 flex max-w-[680px] xl:max-w-[820px] 2xl:max-w-[960px] flex-col gap-8 xl:gap-10">
                <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-3 text-[14px] leading-6 font-medium tracking-[-0.02em]">
                  <Link href="/" className="opacity-40 transition-opacity hover:opacity-100">
                    {t('caseStudies.page.home')}
                  </Link>
                  <span aria-hidden className="opacity-40">
                    /
                  </span>
                  <span aria-current="page">{t(`services.${service.key}.title`)}</span>
                </nav>

                <h1 className="text-[clamp(1.85rem,4.8vw,5.25rem)] 2xl:text-[6.5rem] leading-[0.94] font-medium tracking-[-0.06em]">
                  <span className="block uppercase">{text('title1')}</span>
                  <span className="block text-lime whitespace-nowrap">{text('title2')}</span>
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

              {/* Мобильная иллюстрация под кнопками */}
              <div
                aria-hidden
                className="relative mx-auto mt-8 w-full max-w-[480px] aspect-[1170/664] lg:hidden"
              >
                <Image
                  src={service.image}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-contain object-center"
                />
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
