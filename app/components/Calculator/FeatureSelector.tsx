import { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import data from '@/app/data/calculator.json';

interface FeatureSelectorProps {
  selected: string[];
  onChange: (features: string[]) => void;
}

export default function FeatureSelector({ selected, onChange }: FeatureSelectorProps) {
  const { t } = useTranslation();
  const [customFeature, setCustomFeature] = useState('');

  const predefinedKeys = data.features.map(f => f.key);

  const toggleFeature = (key: string) => {
    onChange(selected.includes(key) ? selected.filter(f => f !== key) : [...selected, key]);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  const addCustomFeature = () => {
    const trimmed = customFeature.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
      setCustomFeature('');
    }
  };

  const customSelected = selected.filter(f => !predefinedKeys.includes(f));

  return (
    <div className="bg-black border border-white/10 p-6 hover:border-white/20 transition-colors">
      <h3 className="text-lg font-semibold text-white mb-4">{t('calculator.features.title')}</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {data.features.map((feature) => {
          const isSelected = selected.includes(feature.key);
          return (
            <button
              key={feature.key}
              onClick={() => toggleFeature(feature.key)}
              className={`px-3 py-2 border transition-all flex items-center gap-2 ${isSelected ? 'border-white/30 bg-white/5 text-white' : 'border-white/10 bg-transparent text-white/70 hover:border-white/20'}`}
            >
              {isSelected && <Check className="w-4 h-4" />}
              <span className="font-medium text-sm">{t(feature.tKey)}</span>
              <span className={`text-xs font-semibold ${isSelected ? 'text-white/80' : 'text-white/50'}`}>{formatCurrency(feature.cost)}</span>
            </button>
          );
        })}
      </div>

      {customSelected.length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium text-white/60 mb-2">{t('calculator.features.customTitle')}:</div>
          <div className="flex flex-wrap gap-2">
            {customSelected.map((feature) => (
              <button key={feature} onClick={() => toggleFeature(feature)} className="px-4 py-2 border border-white/30 bg-white/5 text-white flex items-center gap-2">
                <Check className="w-4 h-4" />
                {feature}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={customFeature}
          onChange={(e) => setCustomFeature(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCustomFeature()}
          placeholder={t('calculator.features.addPlaceholder')}
          className="flex-1 px-4 py-2 border border-white/10 bg-white/5 focus:outline-none focus:border-white/30 text-white placeholder:text-white/40 transition-colors"
        />
        <button onClick={addCustomFeature} className="px-4 py-2 bg-white text-black hover:bg-white/90 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t('calculator.features.add')}
        </button>
      </div>
    </div>
  );
}
