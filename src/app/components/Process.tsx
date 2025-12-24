import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export function Process() {
  const { t } = useTranslation();

  const steps = [
    {
      number: '01',
      title: t('process.step1.title'),
      description: t('process.step1.description')
    },
    {
      number: '02',
      title: t('process.step2.title'),
      description: t('process.step2.description')
    },
    {
      number: '03',
      title: t('process.step3.title'),
      description: t('process.step3.description')
    },
    {
      number: '04',
      title: t('process.step4.title'),
      description: t('process.step4.description')
    },
    {
      number: '05',
      title: t('process.step5.title'),
      description: t('process.step5.description')
    }
  ];
  return (
    <section id="process" className="bg-black py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t('process.title')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={step.number} 
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div 
                className="mb-6"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                <span className="text-6xl font-bold text-white/10">
                  {step.number}
                </span>
              </motion.div>
              
              <h3 className="text-white mb-3">
                {step.title}
              </h3>
              
              <p className="text-white/60 text-sm">
                {step.description}
              </p>

              {index < steps.length - 1 && (
                <motion.div 
                  className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                  style={{ transformOrigin: 'left' }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}