'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeft, Wand2, Loader2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useTranslation } from 'react-i18next';
import { useCalculatorStore } from '@/app/store/calculatorStore';
import StageSelector from './StageSelector';
import FeatureSelector from './FeatureSelector';
import EstimationResults from './EstimationResults';
import { ContactInlineForm } from '../ContactInlineForm';
import { ContactLinks } from '../ContactLinks';

interface CostCalculatorProps {
  isOpen: boolean;
  onClose?: () => void;
  projectDescription?: string;
  inline?: boolean;
}

export default function CostCalculator({
  isOpen,
  onClose,
  projectDescription = '',
  inline = false,
}: CostCalculatorProps) {
  const { description, setDescription, features, estimates, isAnalyzing, analyzeError, analyzeDescription } = useCalculatorStore();
  const { t } = useTranslation();

  useEffect(() => {
    if (projectDescription) {
      setDescription(projectDescription);
      analyzeDescription();
    }
  }, [projectDescription]); // eslint-disable-line react-hooks/exhaustive-deps

  const contactDescription = [
    description && `📋 Описание: ${description}`,
    features.length > 0 && `⚙️ Функции: ${features.join(', ')}`,
    estimates.minCost > 0 && `💰 Оценка: $${estimates.minCost.toLocaleString()} – $${estimates.maxCost.toLocaleString()}`,
    estimates.minWeeks > 0 && `🕐 Сроки: ${estimates.minWeeks}–${estimates.maxWeeks} нед.`,
  ].filter(Boolean).join('\n\n');

  const content = (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {!inline && onClose && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">{t('calculator.back')}</span>
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/80 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">{t('calculator.badge')}</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">{t('calculator.title')}</h1>
          <p className="text-xl text-white/60">{t('calculator.subtitle')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className={`lg:col-span-2 space-y-6 transition-opacity duration-300 ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-black border border-white/10 p-6 space-y-1"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white/50">{t('calculator.description')}</span>
                <span className="text-xs text-white/30">{t('calculator.optional')}</span>
              </div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('calculator.descriptionPlaceholder')}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 min-h-[120px]"
              />
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={analyzeDescription}
                  disabled={isAnalyzing || !description.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  {isAnalyzing ? t('calculator.analyzing') : t('calculator.analyze')}
                </button>
                {analyzeError && (
                  <span className="text-sm text-red-400">{t('calculator.analyzeError')}</span>
                )}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
              <StageSelector />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
              <FeatureSelector />
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="sticky top-24"
            >
              <EstimationResults estimates={estimates} />
              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-white text-sm font-medium mb-4">{t('calculator.contactUs')}</p>
                  <ContactLinks />
                </div>
                <div>
                  <p className="text-white text-sm font-medium mb-4">{t('calculator.leaveRequest')}</p>
                  <ContactInlineForm description={contactDescription || undefined} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );

  if (inline) return isOpen ? content : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-neutral-950 z-50 overflow-y-auto"
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
