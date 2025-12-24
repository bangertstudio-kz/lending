import { Apple, Smartphone, MonitorSmartphone, Palette, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

const services = [
  {
    icon: Apple,
    titleKey: 'services.iosDev.title',
    descriptionKey: 'services.iosDev.description'
  },
  {
    icon: Smartphone,
    titleKey: 'services.androidDev.title',
    descriptionKey: 'services.androidDev.description'
  },
  {
    icon: MonitorSmartphone,
    titleKey: 'services.crossPlatform.title',
    descriptionKey: 'services.crossPlatform.description'
  },
  {
    icon: Palette,
    titleKey: 'services.uiux.title',
    descriptionKey: 'services.uiux.description'
  },
  {
    icon: Shield,
    titleKey: 'services.maintenance.title',
    descriptionKey: 'services.maintenance.description'
  }
];

export function Services() {
  const { t } = useTranslation();
  
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
          {t('services.title')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={service.titleKey}
              className="bg-black border border-white/10 p-8 hover:border-white/30 transition-colors group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <service.icon className="w-12 h-12 text-white mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-white mb-4">
                {t(service.titleKey)}
              </h3>
              <p className="text-white/60">
                {t(service.descriptionKey)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}