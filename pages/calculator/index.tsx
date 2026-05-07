import Head from 'next/head';
import { useRouter } from 'next/router';
import { Header } from '@/app/components/Header';
import CostCalculator from '@/app/components/Calculator/CostCalculator';

export default function CalculatorPage() {
  const router = useRouter();
  const description = typeof router.query.description === 'string' ? router.query.description : '';

  return (
    <>
      <Head>
        <title>Калькулятор стоимости — Bangert Studio</title>
        <meta name="description" content="Рассчитайте стоимость и сроки разработки вашего мобильного или веб-приложения. Быстрая оценка с помощью ИИ." />
        <link rel="canonical" href="https://bangertstudio.kz/calculator" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bangertstudio.kz/calculator" />
        <meta property="og:title" content="Калькулятор стоимости — Bangert Studio" />
        <meta property="og:description" content="Рассчитайте стоимость и сроки разработки вашего приложения." />
        <meta property="og:image" content="https://bangertstudio.kz/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Калькулятор стоимости — Bangert Studio" />
        <meta name="twitter:description" content="Рассчитайте стоимость и сроки разработки вашего приложения." />
        <meta name="twitter:image" content="https://bangertstudio.kz/og-image.png" />
      </Head>
      <div className="min-h-screen bg-neutral-950">
        <Header />
        <div className="pt-20">
          <CostCalculator isOpen inline projectDescription={description} />
        </div>
      </div>
    </>
  );
}
