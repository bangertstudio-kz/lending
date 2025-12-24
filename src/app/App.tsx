import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { WhyChooseUs } from './components/WhyChooseUs';
import { CaseStudies } from './components/CaseStudies';
import { Process } from './components/Process';
import { Technologies } from './components/Technologies';
import { Testimonials } from './components/Testimonials';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { AnimatedBackground } from './components/AnimatedBackground';
import { MobileScrollButton } from './components/MobileScrollButton';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 relative">
      <AnimatedBackground />
      <Header />
      <div className="relative">
        <Hero />
        <WhyChooseUs />

        <CaseStudies />
        <Services />


        {/* <Process /> */}
        {/* <Technologies /> */}
        <ContactForm />
        <Testimonials />

        <Footer />
      </div>
      <MobileScrollButton />
    </div>
  );
}