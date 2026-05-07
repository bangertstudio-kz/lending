import { Rocket, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import data from '@/app/data/calculator.json';
import { useCalculatorStore } from '@/app/store/calculatorStore';

const stageIcons: Record<string, React.ElementType> = { mvp: Rocket, mature: Building2 };

export default function StageSelector() {
  const { t } = useTranslation();
  const { stage, setStage } = useCalculatorStore();

  return (
    <div className="bg-black border border-white/10 p-6 hover:border-white/20 transition-colors">
      <h3 className="text-lg font-semibold text-white mb-4">{t('calculator.stage.title')}</h3>
      <div className="grid grid-cols-2 gap-4">
        {data.stages.map((s) => {
          const Icon = stageIcons[s.id] ?? Rocket;
          const isSelected = stage === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setStage(s.id)}
              className={`p-4 border transition-all text-left ${isSelected ? 'border-white/30 bg-white/5' : 'border-white/10 bg-transparent hover:border-white/20'}`}
            >
              <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-white' : 'text-white/40'}`} />
              <div className={`font-semibold mb-1 ${isSelected ? 'text-white' : 'text-white/70'}`}>{t(s.tKey)}</div>
              <div className="text-xs text-white/50">{t(s.descKey)}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
