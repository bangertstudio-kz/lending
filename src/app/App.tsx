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

export default function App() {
  return (
    <div className="min-h-screen bg-black relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Hero />
        <Services />
        <WhyChooseUs />
        <CaseStudies />
        <Process />
        <Technologies />
        <Testimonials />
        <ContactForm />
        <Footer />
      </div>
    </div>
  );
}