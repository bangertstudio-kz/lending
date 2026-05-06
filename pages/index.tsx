'use strict';

import { Header } from '../app/components/Header';
import { Hero } from '../app/components/Hero';
import { WhyChooseUs } from '../app/components/WhyChooseUs';
import { CaseStudies } from '../app/components/CaseStudies';
import { Services } from '../app/components/Services';
import { ContactForm } from '../app/components/ContactForm';
import { Footer } from '../app/components/Footer';
import { MobileScrollButton } from '../app/components/MobileScrollButton';

export default function Home({ data }: { data: any }) {
  return (
    <div className="min-h-screen bg-neutral-950 relative">
      <Header />
      <div className="relative">
        <Hero />
        <WhyChooseUs />
        <CaseStudies />
        <Services />
        <ContactForm />
        <Footer />
      </div>
      <MobileScrollButton />
    </div>
  );
}


export async function getServerSideProps() {
  return { props: { 'data': 1 } }
}