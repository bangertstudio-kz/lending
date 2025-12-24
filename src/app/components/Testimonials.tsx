import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

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
          className="text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t('testimonials.title')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="border border-white/10 p-8"
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
          ))}
        </div>
      </div>
    </section>
  );
}