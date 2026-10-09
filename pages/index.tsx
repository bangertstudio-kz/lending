'use strict';

import { SeoHead } from '@/app/components/SeoHead';
import { Header } from '../app/components/Header';
import { Hero } from '../app/components/Hero';
import { CaseStudies } from '../app/components/CaseStudies';
import { Process } from '../app/components/Process';
import { Services } from '../app/components/Services';
import { Geography } from '../app/components/Geography';
import { Blog } from '../app/components/Blog';
import { Faq } from '../app/components/Faq';
import { CalculatorCTA } from '../app/components/CalculatorCTA';
import { DevSolutions } from '../app/components/DevSolutions';
import { ContactForm } from '../app/components/ContactForm';
import { Footer } from '../app/components/Footer';
import { MobileScrollButton } from '../app/components/MobileScrollButton';

export default function Home() {
  return (
    <>
      <SeoHead page="home" path="/" />
      <div className="relative min-h-screen bg-bg">
        <Header />
        <main className="relative">
          <Hero />
          <CaseStudies />
          <Process />
          <Services />
          <Geography />
          <Blog />
          <Faq />
          {/* <CalculatorCTA />
          <DevSolutions /> */}
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