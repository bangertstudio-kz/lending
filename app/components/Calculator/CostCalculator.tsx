'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeft, Wand2, Loader2, Paperclip, X } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { useTranslation } from 'react-i18next';
import { useCalculatorStore } from '@/app/store/calculatorStore';
import StageSelector from './StageSelector';
import FeatureSelector from './FeatureSelector';
import EstimationResults from './EstimationResults';
import { ContactInlineForm } from '../ContactInlineForm';
import { ContactLinks } from '../ContactLinks';
import { GOALS, trackGoal } from '@/app/analytics';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) trackGoal(GOALS.calculatorFileAttach, { size: file.size, type: file.type || 'unknown' });
    setAttachedFile(file);
    e.target.value = '';
  };

  const handleAnalyze = () => {
    trackGoal(GOALS.calculatorAnalyzeStart, {
      source: 'button',
      briefLength: description.trim().length,
      withFile: Boolean(attachedFile),
    });
    analyzeDescription(attachedFile ? [attachedFile] : []);
  };

  useEffect(() => {
    if (projectDescription) {
      setDescription(projectDescription);
      // Бриф приехал с главной — анализ стартует сам, без клика по кнопке.
      trackGoal(GOALS.calculatorAnalyzeStart, {
        source: 'brief',
        briefLength: projectDescription.trim().length,
        withFile: false,
      });
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
              className="flex items-center gap-2 text-muted hover:text-fg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-small font-medium">{t('calculator.back')}</span>
            </button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-raised border border-hairline text-fg/80 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-small font-medium">{t('calculator.badge')}</span>
          </div>
          <h1 className="mb-3 font-display font-semibold text-h1 text-fg">{t('calculator.title')}</h1>
          <p className="text-h3 text-muted">{t('calculator.subtitle')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className={`lg:col-span-2 space-y-6 transition-opacity duration-300 ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-bg border border-hairline p-6 space-y-1"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-small text-muted">{t('calculator.description')}</span>
                <span className="text-xs text-faint">{t('calculator.optional')}</span>
              </div>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('calculator.descriptionPlaceholder')}
                className="bg-raised border-hairline text-fg placeholder:text-faint focus:border-accent min-h-[120px] max-h-[240px] overflow-y-auto resize-none"
              />
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !description.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-fg text-bg text-small font-medium hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  {isAnalyzing ? t('calculator.analyzing') : t('calculator.analyze')}
                </button>
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFile} />
                {attachedFile ? (
                  <div className="flex items-center gap-2 px-3 py-2 border border-hairline-strong bg-raised text-small text-fg">
                    <Paperclip className="w-4 h-4 shrink-0" />
                    <span className="max-w-[160px] truncate">{attachedFile.name}</span>
                    <button type="button" onClick={() => setAttachedFile(null)} className="text-muted hover:text-fg transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 border border-hairline text-muted text-small hover:border-accent hover:text-fg transition-colors"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                )}
                {analyzeError && (
                  <span className="text-small text-red-400">{t('calculator.analyzeError')}</span>
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
                  <p className="text-fg text-small font-medium mb-4">{t('calculator.contactUs')}</p>
                  <ContactLinks place="calculator" />
                </div>
                <div>
                  <p className="text-fg text-small font-medium mb-4">{t('calculator.leaveRequest')}</p>
                  <ContactInlineForm
                    description={contactDescription || undefined}
                    file={attachedFile}
                    place="calculator"
                  />
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
          className="fixed inset-0 bg-bg z-50 overflow-y-auto"
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
