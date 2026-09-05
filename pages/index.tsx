'use strict';

import Head from 'next/head';
import { Header } from '../app/components/Header';
import { Hero } from '../app/components/Hero';
import { WhyChooseUs } from '../app/components/WhyChooseUs';
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
        <meta name="description" content="Запускаем мобильные и веб-приложения под ключ. От идеи до релиза — помогаем стартапам и бизнесу." />
        <link rel="canonical" href="https://bangertstudio.kz" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bangertstudio.kz" />
        <meta property="og:title" content="Bangert Studio — Разработка мобильных и веб-приложений" />
        <meta property="og:description" content="Запускаем мобильные и веб-приложения под ключ. От идеи до релиза — помогаем стартапам и бизнесу." />
        <meta property="og:image" content="https://bangertstudio.kz/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bangert Studio — Разработка мобильных и веб-приложений" />
        <meta name="twitter:description" content="Запускаем мобильные и веб-приложения под ключ. От идеи до релиза." />
        <meta name="twitter:image" content="https://bangertstudio.kz/og-image.png" />
      </Head>
      <div className="min-h-screen bg-neutral-950 relative">
        <Header />
        <div className="relative">
          <Hero />
          <CaseStudies />
          <CalculatorCTA />
          <Services />
          <DevSolutions />
          <ContactForm />
          <Footer />
        </div>
        <MobileScrollButton />
      </div>
    </>
  );
}


export async function getServerSideProps() {
  return { props: { 'data': 1 } }
}