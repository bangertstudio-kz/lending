import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import data from '@/app/data/calculator.json';
import { useCalculatorStore } from '@/app/store/calculatorStore';

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
      addCustomFeature(trimmed);
      setCustomInput('');
    }
  };

  return (
    <div className="bg-bg border border-hairline p-6 hover:border-hairline-strong transition-colors">
      <h3 className="mb-4 font-display font-semibold text-h3 text-fg">{t('calculator.features.title')}</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {[...data.features].sort((a, b) => {
          const aSelected = features.includes(a.key) ? 1 : 0;
          const bSelected = features.includes(b.key) ? 1 : 0;
          return bSelected - aSelected;
        }).map((feature) => {
          const isSelected = features.includes(feature.key);
          return (
            <button
              key={feature.key}
              onClick={() => toggleFeature(feature.key)}
              className={`px-3 py-2 border transition-all flex items-center gap-2 ${isSelected ? 'border-hairline-strong bg-raised text-fg' : 'border-hairline bg-transparent text-muted hover:border-hairline-strong'}`}
            >
              {isSelected && <Check className="w-4 h-4" />}
              <span className="font-medium text-small">{t(feature.tKey)}</span>
              <span className={`text-xs font-semibold ${isSelected ? 'text-fg/80' : 'text-muted'}`}>
                {formatCurrency(feature.cost)}
              </span>
            </button>
          );
        })}
      </div>

      {customSelected.length > 0 && (
        <div className="mb-4">
          <div className="text-small font-medium text-muted mb-2">{t('calculator.features.customTitle')}:</div>
          <div className="flex flex-wrap gap-2">
            {customSelected.map((key) => {
              const data = customFeatureData[key];
              return (
                <button
                  key={key}
                  onClick={() => toggleFeature(key)}
                  className="px-3 py-2 border transition-all flex items-center gap-2 border-hairline-strong bg-raised text-fg"
                >
                  <Check className="w-4 h-4" />
                  <span className="font-medium text-small">{key}</span>
                  {data && (
                    <span className="text-xs font-semibold text-fg/80">
                      {formatCurrency(data.cost)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={t('calculator.features.addPlaceholder')}
          className="flex-1 px-4 py-2 border border-hairline bg-raised focus:outline-none focus:border-accent text-fg placeholder:text-faint transition-colors"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-fg text-bg hover:bg-accent transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('calculator.features.add')}
        </button>
      </div>
    </div>
  );
}
