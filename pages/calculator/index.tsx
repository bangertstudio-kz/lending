import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { SeoHead } from '@/src/components/SeoHead';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { Faq } from '@/src/components/Faq';
import { Kicker, Lead } from '@/src/components/ui/block';
import CostCalculator from '@/src/components/Calculator/CostCalculator';

export default function CalculatorPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const description = typeof router.query.description === 'string' ? router.query.description : '';

  return (
    <>
      <SeoHead
        page="calculator"
        path="/calculator"
        includeFaq={true}
        breadcrumbs={[
          { name: t('caseStudies.page.home'), path: '/' },
          { name: t('header.calculator'), path: '/calculator' },
        ]}
      />
      <div className="min-h-screen bg-ink font-montserrat text-white">
        <Header />

        <main>
          <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-6 pt-[128px] pb-20 lg:px-20">
            <div className="flex flex-col gap-10">
              <nav aria-label="breadcrumb" className="flex items-center gap-3 text-[14px] leading-6 font-medium tracking-[-0.02em]">
                <Link href="/" className="opacity-40 transition-opacity hover:opacity-100">
                  {t('caseStudies.page.home')}
                </Link>
                <span aria-hidden className="opacity-40">
                  /
                </span>
                <span aria-current="page">{t('header.calculator')}</span>
              </nav>
              <div className="flex flex-col gap-5">
                <Kicker>{t('calculator.badge')}</Kicker>
                <h1 className="max-w-[1400px] text-[clamp(2.75rem,5vw,6rem)] leading-none font-medium tracking-[-0.06em]">
                  {t('calculator.title')}
                </h1>
                <Lead className="gap-2.5">{t('calculator.subtitle')}</Lead>
              </div>
            </div>

            <CostCalculator projectDescription={description} />
          </div>

          <Faq />
        </main>

        <Footer />
      </div>
    </>
  );
}
