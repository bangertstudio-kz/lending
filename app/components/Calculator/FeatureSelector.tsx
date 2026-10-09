import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import data from '@/app/data/calculator.json';
import { useCalculatorStore } from '@/app/store/calculatorStore';
import { GOALS, trackGoal } from '@/app/analytics';
import { field, limeButton, panel, panelTitle } from './styles';

const chip =
  'flex cursor-pointer items-center gap-2 rounded-[40px] border px-4 py-2 text-[14px] leading-6 tracking-[-0.02em] transition-colors';
const chipOn = 'border-lime text-lime';
const chipOff = 'border-white/20 hover:border-white/60';

export default function FeatureSelector() {
  const { t } = useTranslation();
  const { features, customFeatureData, toggleFeature, addCustomFeature } = useCalculatorStore();
  const [customInput, setCustomInput] = useState('');

  const predefinedKeys = data.features.map((f) => f.key);
  const customSelected = features.filter((f) => !predefinedKeys.includes(f));

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  const handleAdd = () => {
    const trimmed = customInput.trim();
    if (trimmed) {
      trackGoal(GOALS.calculatorFeatureCustomAdd, { feature: trimmed });
      addCustomFeature(trimmed);
      setCustomInput('');
    }
  };

  const handleToggle = (key: string, wasSelected: boolean) => {
    trackGoal(GOALS.calculatorFeatureToggle, { feature: key, selected: !wasSelected });
    toggleFeature(key);
  };

  return (
    <div className={panel}>
      <h2 className={panelTitle}>{t('calculator.features.title')}</h2>

      <div className="flex flex-wrap gap-2">
        {/* Выбранные — первыми. */}
        {[...data.features]
          .sort((a, b) => Number(features.includes(b.key)) - Number(features.includes(a.key)))
          .map((feature) => {
            const isSelected = features.includes(feature.key);
            return (
              <button
                key={feature.key}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleToggle(feature.key, isSelected)}
                className={`${chip} ${isSelected ? chipOn : chipOff}`}
              >
                {isSelected && <Check className="size-4" />}
                <span className="font-medium">{t(feature.tKey)}</span>
                <span className="opacity-60">{formatCurrency(feature.cost)}</span>
              </button>
            );
          })}
      </div>

      {customSelected.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-[14px] leading-6 tracking-[-0.02em] opacity-60">{t('calculator.features.customTitle')}:</div>
          <div className="flex flex-wrap gap-2">
            {customSelected.map((key) => {
              const custom = customFeatureData[key];
              return (
                <button key={key} type="button" aria-pressed onClick={() => handleToggle(key, true)} className={`${chip} ${chipOn}`}>
                  <Check className="size-4" />
                  <span className="font-medium">{key}</span>
                  {custom && <span className="opacity-60">{formatCurrency(custom.cost)}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={t('calculator.features.addPlaceholder')}
          className={field}
        />
        <button type="button" onClick={handleAdd} className={limeButton}>
          <Plus className="size-4" />
          {t('calculator.features.add')}
        </button>
      </div>
    </div>
  );
}
