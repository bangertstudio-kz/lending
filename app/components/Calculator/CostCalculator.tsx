'use client';

import { useEffect, useRef, useState } from 'react';
import { Wand2, Loader2, Paperclip, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCalculatorStore } from '@/app/store/calculatorStore';
import StageSelector from './StageSelector';
import FeatureSelector from './FeatureSelector';
import EstimationResults from './EstimationResults';
import { ContactInlineForm } from '../ContactInlineForm';
import { ContactLinks } from '../ContactLinks';
import { GOALS, trackGoal } from '@/app/analytics';
import { field, limeButton, panel, panelTitle } from './styles';

export default function CostCalculator({ projectDescription = '' }: { projectDescription?: string }) {
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

  return (
    <div className="grid items-start gap-5 lg:grid-cols-3 lg:gap-10">
      <div className={`flex flex-col gap-5 transition-opacity duration-300 lg:col-span-2 ${isAnalyzing ? 'pointer-events-none opacity-50' : ''}`}>
        <div className={panel}>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className={panelTitle}>{t('calculator.description')}</h2>
            <span className="text-[14px] leading-6 tracking-[-0.02em] opacity-40">{t('calculator.optional')}</span>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('calculator.descriptionPlaceholder')}
            className={`${field} max-h-[240px] min-h-[140px] resize-none`}
          />
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={handleAnalyze} disabled={isAnalyzing || !description.trim()} className={limeButton}>
              {isAnalyzing ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
              {isAnalyzing ? t('calculator.analyzing') : t('calculator.analyze')}
            </button>
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFile} />
            {attachedFile ? (
              <span className="flex items-center gap-2 rounded-[40px] border border-white/40 py-2 pr-3 pl-4 text-[14px] leading-6">
                <Paperclip className="size-4 shrink-0" />
                <span className="max-w-[180px] truncate">{attachedFile.name}</span>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  aria-label="Remove file"
                  className="cursor-pointer opacity-60 transition-opacity hover:opacity-100"
                >
                  <X className="size-4" />
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Attach file"
                className="flex cursor-pointer rounded-[40px] border border-white/40 p-3 transition-colors hover:border-lime hover:text-lime"
              >
                <Paperclip className="size-5" />
              </button>
            )}
            {analyzeError && <span className="text-[14px] leading-6 text-red-400">{t('calculator.analyzeError')}</span>}
          </div>
        </div>
        <StageSelector />
        <FeatureSelector />
      </div>

      <div className="flex flex-col gap-5 lg:sticky lg:top-28">
        <EstimationResults estimates={estimates} />
        <div className={panel}>
          <h2 className={panelTitle}>{t('calculator.leaveRequest')}</h2>
          <ContactInlineForm description={contactDescription || undefined} file={attachedFile} place="calculator" />
        </div>
        <div className="flex flex-col gap-3">
          <h2 className={panelTitle}>{t('calculator.contactUs')}</h2>
          <ContactLinks place="calculator" />
        </div>
      </div>
    </div>
  );
}
