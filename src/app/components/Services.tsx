import { Apple, Smartphone, Palette, Shield, Globe, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

const services = [
  {
    icon: Smartphone,
    titleKey: 'services.androidDev.title',
    descriptionKey: 'services.androidDev.description'
  },
  {
    icon: Apple,
    titleKey: 'services.iosDev.title',
    descriptionKey: 'services.iosDev.description'
  },
  {
    icon: Globe,
    titleKey: 'services.webDev.title',
    descriptionKey: 'services.webDev.description'
  },
  {
    icon: Palette,
    titleKey: 'services.uiux.title',
    descriptionKey: 'services.uiux.description'
  },
  {
    icon: BarChart3,
    titleKey: 'services.analytics.title',
    descriptionKey: 'services.analytics.description'
  },
  {
    icon: Shield,
    titleKey: 'services.maintenance.title',
    descriptionKey: 'services.maintenance.description'
  },
  
  

];

export function Services() {
  const { t } = useTranslation();
  
  return (
    <section id="services" className=" py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-white text-center mb-16 text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t('services.title')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={service.titleKey}
              className="bg-black border border-white/10 p-6 hover:border-white/30 transition-colors group flex md:flex-col items-start gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <service.icon className="w-8 h-8 text-white flex-shrink-0 group-hover:scale-110 transition-transform" />
              <div className="flex-1 md:flex-none">
                <h3 className="text-white mb-4">
                  {t(service.titleKey)}
                </h3>
                <p className="text-white/60">
                  {t(service.descriptionKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}