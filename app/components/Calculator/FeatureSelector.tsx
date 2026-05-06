import { useState } from 'react';
import { Check, Plus } from 'lucide-react';

interface FeatureSelectorProps {
  selected: string[];
  onChange: (features: string[]) => void;
}

const predefinedFeatures = [
  { name: 'Landing Page', cost: 5000 },
  { name: 'Authentication', cost: 8000 },
  { name: 'Payments', cost: 12000 },
  { name: 'Admin Panel', cost: 15000 },
  { name: 'API Integration', cost: 6000 },
  { name: 'Notifications', cost: 5000 },
  { name: 'Analytics', cost: 10000 },
  { name: 'Chat/Messaging', cost: 18000 },
  { name: 'File Upload', cost: 4000 },
  { name: 'Search', cost: 7000 },
  { name: 'Social Login', cost: 3000 },
];

export default function FeatureSelector({ selected, onChange }: FeatureSelectorProps) {
  const [customFeature, setCustomFeature] = useState('');

  const toggleFeature = (featureName: string) => {
    if (selected.includes(featureName)) {
      onChange(selected.filter(f => f !== featureName));
    } else {
      onChange([...selected, featureName]);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const addCustomFeature = () => {
    if (customFeature.trim() && !selected.includes(customFeature.trim())) {
      onChange([...selected, customFeature.trim()]);
      setCustomFeature('');
    }
  };

  return (
    <div className="bg-black border border-white/10 p-6 hover:border-white/20 transition-colors">
      <h3 className="text-lg font-semibold text-white mb-4">Features</h3>

      <div className="flex flex-wrap gap-2 mb-4">
        {predefinedFeatures.map((feature) => {
          const isSelected = selected.includes(feature.name);

          return (
            <button
              key={feature.name}
              onClick={() => toggleFeature(feature.name)}
              className={`
                px-3 py-2 border transition-all flex items-center gap-2
                ${isSelected
                  ? 'border-white/30 bg-white/5 text-white'
                  : 'border-white/10 bg-transparent text-white/70 hover:border-white/20'
                }
              `}
            >
              {isSelected && <Check className="w-4 h-4" />}
              <span className="font-medium text-sm">{feature.name}</span>
              <span className={`text-xs font-semibold ${isSelected ? 'text-white/80' : 'text-white/50'}`}>
                {formatCurrency(feature.cost)}
              </span>
            </button>
          );
        })}
      </div>

      {selected.filter(f => !predefinedFeatures.map(pf => pf.name).includes(f)).length > 0 && (
        <div className="mb-4">
          <div className="text-sm font-medium text-white/60 mb-2">Custom Features:</div>
          <div className="flex flex-wrap gap-2">
            {selected.filter(f => !predefinedFeatures.map(pf => pf.name).includes(f)).map((feature) => (
              <button
                key={feature}
                onClick={() => toggleFeature(feature)}
                className="px-4 py-2 border border-white/30 bg-white/5 text-white flex items-center gap-2"
              >
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
          placeholder="Add custom feature..."
          className="flex-1 px-4 py-2 border border-white/10 bg-white/5 focus:outline-none focus:border-white/30 text-white placeholder:text-white/40 transition-colors"
        />
        <button
          onClick={addCustomFeature}
          className="px-4 py-2 bg-white text-black hover:bg-white/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
    </div>
  );
}
