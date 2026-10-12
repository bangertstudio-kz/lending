'use client';

import { Users, Shield, Zap, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export function WhyChooseUs() {
  const { t } = useTranslation();

  const reasons = [
    {
      icon: Users,
      title: t('whyChooseUs.experienced.title'),
      description: t('whyChooseUs.experienced.description'),
    },
    {
      icon: MessageCircle,
      title: t('whyChooseUs.communication.title'),
      description: t('whyChooseUs.communication.description'),
    },
    {
      icon: Zap,
      title: t('whyChooseUs.agile.title'),
      description: t('whyChooseUs.agile.description'),
    },
    {
      icon: Shield,
      title: t('whyChooseUs.support.title'),
      description: t('whyChooseUs.support.description'),
    },
  ];

  return (
    <section id="why-choose-us" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-white text-center mb-16 text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t('whyChooseUs.title')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              className="flex gap-6"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="flex-shrink-0">
                <reason.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-white mb-2">{reason.title}</h3>
                <p className="text-white/60">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
