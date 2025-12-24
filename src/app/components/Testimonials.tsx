import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

const testimonials = [
  {
    quote: 'The team delivered our iOS app ahead of schedule with exceptional quality. Their communication was transparent throughout the entire process.',
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'FitnessPro'
  },
  {
    quote: 'Working with this team transformed our business. The Flutter app works flawlessly on both platforms and our users love it.',
    name: 'Michael Chen',
    role: 'Founder',
    company: 'ShopLocal'
  },
  {
    quote: 'Best outsourcing decision we ever made. The code quality is excellent and they provided great architectural guidance for scaling.',
    name: 'Emily Rodriguez',
    role: 'CTO',
    company: 'TaskMaster'
  }
];

export function Testimonials() {
  const { t } = useTranslation();

  return (
    <section id="testimonials" className="bg-black py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-white text-center mb-16 text-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t('testimonials.title')}
        </motion.h2>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem 
                key={testimonial.name}
                className="pl-4 md:basis-1/3"
              >
                <motion.div
                  className="border border-white/10 p-8 h-full"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -5, borderColor: 'rgba(255, 255, 255, 0.3)' }}
                >
                  <p className="text-white/70 mb-8 italic">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="border-t border-white/10 pt-6">
                    <p className="text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-white/50 text-sm">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Кнопки навигации */}
          <div className="flex justify-center md:justify-start gap-4 mt-8">
            <CarouselPrevious 
              className="static translate-y-0 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-30"
            />
            <CarouselNext 
              className="static translate-y-0 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-30"
            />
          </div>
        </Carousel>
      </div>
    </section>
  );
}