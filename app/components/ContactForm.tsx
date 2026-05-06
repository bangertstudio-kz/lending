'use client';

import { useState } from 'react';
import { Send, MessageCircle, Phone, AlertCircle } from 'lucide-react';

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import CostCalculator from './Calculator/CostCalculator';

async function sendToTelegram(name: string, contact: string, projectDescription: string) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, contact, description: projectDescription }),
  });
  if (!response.ok) throw new Error('API error');
}

const socialLinks = [
  { name: 'Telegram', icon: MessageCircle, url: 'https://t.me/alexanderbangert', label: '@alexanderbangert' },
  { name: 'WhatsApp', icon: Phone, url: 'https://wa.me/77074054405', label: '+7 (707) 405-4405' },
  { name: 'LinkedIn', icon: LinkedinIcon, url: 'https://www.linkedin.com/company/bangertstudio/', label: 'BangertStudio' },
];

export function ContactForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', contact: '', projectDescription: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await sendToTelegram(formData.name, formData.contact, formData.projectDescription);
      setStatus('success');
      setIsCalculatorOpen(true);
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="bg-black py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-white text-center mb-4 text-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {t('contact.title')}
        </motion.h2>

        <motion.p
          className="text-white/60 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {t('contact.subtitle')}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Input
              type="text"
              placeholder={t('contact.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30"
              required
            />

            <Input
              type="text"
              placeholder={t('contact.howContactWithYou')}
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30"
              required
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">{t('contact.description')}</span>
                <span className="text-xs text-white/30">опционально</span>
              </div>
              <Textarea
                placeholder="e.g. MVP mobile app with payments and admin panel"
                value={formData.projectDescription}
                onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 min-h-[120px]"
              />
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Ошибка отправки. Попробуйте ещё раз.</span>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={status === 'loading'}
              className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-60"
            >
              {status === 'loading' ? 'Отправка...' : t('contact.send')}
              <Send className="ml-2 h-5 w-5" />
            </Button>
          </motion.form>

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

            <div className="space-y-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 border border-white/10 hover:border-white/30 transition-colors group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-white/5 p-3 rounded-full group-hover:bg-white/10 transition-colors">
                    <social.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/50 text-sm">{social.name}</p>
                    <p className="text-white">{social.label}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <CostCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        projectDescription={formData.projectDescription}
        name={formData.name}
        contact={formData.contact}
      />
    </section>
  );
}
