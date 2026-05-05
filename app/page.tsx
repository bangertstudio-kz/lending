import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WhyChooseUs } from './components/WhyChooseUs';
import { CaseStudies } from './components/CaseStudies';
import { Services } from './components/Services';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { MobileScrollButton } from './components/MobileScrollButton';

export default function Home() {
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
