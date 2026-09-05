'use strict';

import Head from 'next/head';
import { Header } from '../app/components/Header';
import { Hero } from '../app/components/Hero';
import { ProofBar } from '../app/components/ProofBar';
import { CaseStudies } from '../app/components/CaseStudies';
import { Services } from '../app/components/Services';
import { CalculatorCTA } from '../app/components/CalculatorCTA';
import { DevSolutions } from '../app/components/DevSolutions';
import { ContactForm } from '../app/components/ContactForm';
import { Footer } from '../app/components/Footer';
import { MobileScrollButton } from '../app/components/MobileScrollButton';

export default function Home() {
  return (
    <>
      <Head>
        <title>Bangert Studio — Разработка мобильных и веб-приложений</title>
        <meta name="description" content="Мобильная и веб-разработка полного цикла. Срок и бюджет вы знаете до старта работ, а не после." />
        <link rel="canonical" href="https://bangertstudio.kz" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bangertstudio.kz" />
        <meta property="og:title" content="Bangert Studio — Разработка мобильных и веб-приложений" />
        <meta property="og:description" content="Мобильная и веб-разработка полного цикла. Срок и бюджет вы знаете до старта работ, а не после." />
        <meta property="og:image" content="https://bangertstudio.kz/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bangert Studio — Разработка мобильных и веб-приложений" />
        <meta name="twitter:description" content="Мобильная и веб-разработка полного цикла. Срок и бюджет вы знаете до старта работ." />
        <meta name="twitter:image" content="https://bangertstudio.kz/og-image.png" />
      </Head>
      <div className="relative min-h-screen bg-bg">
        <Header />
        <main className="relative">
          <Hero />
          <ProofBar />
          <CaseStudies />
          <Services />
          <CalculatorCTA />
          <DevSolutions />
          <ContactForm />
        </main>
        <Footer />
        <MobileScrollButton />
      </div>
    </>
  );
}


export async function getServerSideProps() {
  return { props: { 'data': 1 } }
}