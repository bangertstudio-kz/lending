'use strict';

import { SeoHead } from '@/src/components/SeoHead';
import { Header } from '../src/components/Header';
import { Hero } from '../src/components/Hero';
import { CaseStudies } from '../src/components/CaseStudies';
import { Process } from '../src/components/Process';
import { Services } from '../src/components/Services';
import { Geography } from '../src/components/Geography';
import { Blog } from '../src/components/Blog';
import { Faq } from '../src/components/Faq';
import { ContactForm } from '../src/components/ContactForm';
import { Footer } from '../src/components/Footer';
import { MobileScrollButton } from '../src/components/MobileScrollButton';
import { SectionReveal } from '../src/components/ui/SectionReveal';

export default function Home() {
  return (
    <>
      <SeoHead page="home" path="/" includeFaq={true} />
      <div className="relative min-h-screen bg-bg">
        <Header />
        <main className="relative">
          <Hero />
          <CaseStudies />
          <SectionReveal>
            <Process />
          </SectionReveal>
          <SectionReveal>
            <Services />
          </SectionReveal>
          <SectionReveal>
            <Geography />
          </SectionReveal>
          <SectionReveal>
            <Blog />
          </SectionReveal>
          <SectionReveal>
            <Faq />
          </SectionReveal>
          {/* <CalculatorCTA />
          <DevSolutions /> */}
          <SectionReveal>
            <ContactForm />
          </SectionReveal>
        </main>
        <Footer />
        <MobileScrollButton />
      </div>
    </>
  );
}


export async function getStaticProps() {
  return { props: {} };
}