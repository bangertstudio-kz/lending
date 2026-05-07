import { Monitor, Smartphone, Laptop } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import data from '@/app/data/calculator.json';
import { useCalculatorStore } from '@/app/store/calculatorStore';

const iconMap: Record<string, React.ElementType> = { Monitor, Smartphone, Laptop };

export default function PlatformSelector() {
  const { t } = useTranslation();
  const { platforms, updatePlatform } = useCalculatorStore();

  return (
    <div className="bg-black border border-white/10 p-6 hover:border-white/20 transition-colors">
      <h3 className="text-lg font-semibold text-white mb-4">{t('calculator.platforms.title')}</h3>
      <div className="space-y-3">
        {data.platforms.map((platform) => {
          const Icon = iconMap[platform.icon] ?? Monitor;
          const count = platforms[platform.key] || 0;
          const isSelected = count > 0;
          return (
            <div
              key={platform.key}
              className={`flex items-center justify-between p-3 border transition-all ${isSelected ? 'border-white/30 bg-white/5' : 'border-white/10 bg-transparent'}`}
            >
              <div className="flex items-center gap-3 flex-1">
                <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-white/40'}`} />
                <div>
                  <div className={`font-medium ${isSelected ? 'text-white' : 'text-white/70'}`}>{t(platform.tKey)}</div>
                  <div className="text-xs text-white/50">{t(platform.descKey)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updatePlatform(platform.key, -1)}
                  disabled={count === 0}
                  className="w-8 h-8 bg-white/5 border border-white/20 flex items-center justify-center hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="text-white text-lg leading-none">−</span>
                </button>
                <span className="w-8 text-center font-semibold text-white">{count}</span>
                <button
                  onClick={() => updatePlatform(platform.key, 1)}
                  disabled={count >= 5}
                  className="w-8 h-8 bg-white/5 border border-white/20 flex items-center justify-center hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="text-white text-lg leading-none">+</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
