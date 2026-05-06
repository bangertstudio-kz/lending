'use client';

import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ContactInlineForm } from './ContactInlineForm';
import { ContactLinks } from './ContactLinks';

export function ContactForm() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="bg-black py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <h3 className="text-white text-xl mb-6">{t('contact.title')}</h3>
              <p className="text-white/60 mb-8">{t('contact.subtitle')}</p>
            </div>
            <ContactInlineForm />
          </motion.div>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div>
              <h3 className="text-white text-xl mb-6">{t('contact.getInTouch')}</h3>
              <p className="text-white/60 mb-8">{t('contact.reachOut')}</p>
            </div>
            <ContactLinks />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
