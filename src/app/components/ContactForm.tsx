import { useState } from 'react';
import { Send, MessageCircle, Phone, Linkedin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

const socialLinks = [
  {
    name: 'Telegram',
    icon: MessageCircle,
    url: 'https://t.me/alexanderbangert',
    label: '@alexanderbangert'
  },
  {
    name: 'WhatsApp',
    icon: Phone,
    url: 'https://wa.me/77074054405',
    label: '+7 (707) 405-4405'
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://www.linkedin.com/company/bangertstudio/',
    label: 'BangertStudio'
  }
];

export function ContactForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
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
          {/* Форма слева */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6 flex flex-col h-full"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <Input
                type="text"
                placeholder={t('contact.name')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30"
                required
              />
            </div>

            <div className="flex-1">
              <Textarea
                placeholder={t('contact.howContactWithYou')}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 h-full min-h-[300px]"
                required
              />
            </div>

            <Button 
              type="submit"
              size="lg"
              className="w-full bg-white text-black hover:bg-white/90"
            >
              {t('contact.send')}
              <Send className="ml-2 h-5 w-5" />
            </Button>
          </motion.form>

          {/* Контакты справа */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div>
              <h3 className="text-white text-xl mb-6">
                {t('contact.getInTouch')}
              </h3>
              <p className="text-white/60 mb-8">
                {t('contact.reachOut')}
              </p>
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
    </section>
  );
}