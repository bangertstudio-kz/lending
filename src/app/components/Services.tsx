import { Apple, Smartphone, MonitorSmartphone, Palette, Shield } from 'lucide-react';
import { motion } from 'motion/react';

const services = [
  {
    icon: Apple,
    title: 'iOS App Development',
    description: 'Native Swift applications for iPhone and iPad with pixel-perfect design'
  },
  {
    icon: Smartphone,
    title: 'Android App Development',
    description: 'Kotlin-based Android apps optimized for performance and user experience'
  },
  {
    icon: MonitorSmartphone,
    title: 'Flutter / Cross-platform',
    description: 'Build once, deploy everywhere with modern cross-platform frameworks'
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'User-centered design that drives engagement and conversions'
  },
  {
    icon: Shield,
    title: 'Maintenance & Support',
    description: 'Ongoing updates, bug fixes, and technical support for your app'
  }
];

export function Services() {
  return (
    <section id="services" className=" py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Services
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={service.title}
              className="bg-black border border-white/10 p-8 hover:border-white/30 transition-colors group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <service.icon className="w-12 h-12 text-white mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-white mb-4">
                {service.title}
              </h3>
              <p className="text-white/60">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}