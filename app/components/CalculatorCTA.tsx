'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/router';

export function CalculatorCTA() {
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    const query = description.trim() ? `?description=${encodeURIComponent(description)}` : '';
    router.push(`/calculator${query}`);
  };

  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/70 px-4 py-2 rounded-full mb-6 text-sm">
            <Sparkles className="w-4 h-4 text-white/60" />
            AI-генерация оценки проекта
          </div>
          <h2 className="text-white text-4xl font-bold mb-4">
            Узнайте стоимость вашего проекта
          </h2>
          <p className="text-white/50 text-lg">
            Опишите идею — ИИ рассчитает бюджет, сроки и состав команды за секунды
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <div className="border border-white/10 bg-white/[0.03] hover:border-white/20 transition-colors">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Например: мобильное приложение для доставки еды с оплатой и личным кабинетом..."
              rows={4}
              className="w-full bg-transparent px-6 pt-6 pb-4 text-white placeholder:text-white/30 resize-none focus:outline-none text-base"
            />
            <div className="flex items-center justify-between px-6 pb-4">
              <span className="text-white/20 text-xs">
                {description.length > 0 ? `${description.length} символов` : 'Описание не обязательно'}
              </span>
              <motion.button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-white text-black px-6 py-2.5 text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-40"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Sparkles className="w-4 h-4" />
                Рассчитать с AI
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-white/25 text-xs mt-4"
        >
          Бесплатно · Без регистрации · Результат мгновенно
        </motion.p>
      </div>
    </section>
  );
}
