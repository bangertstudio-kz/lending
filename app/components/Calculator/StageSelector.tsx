import { Rocket, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import data from '@/app/data/calculator.json';
import { useCalculatorStore } from '@/app/store/calculatorStore';
import { GOALS, trackGoal } from '@/app/analytics';
import { panel, panelTitle } from './styles';

const stageIcons: Record<string, React.ElementType> = { mvp: Rocket, mature: Building2 };

export default function StageSelector() {
  const { t } = useTranslation();
  const { stage, setStage } = useCalculatorStore();

  return (
    <div className={panel}>
      <h2 className={panelTitle}>{t('calculator.stage.title')}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {data.stages.map((s) => {
          const Icon = stageIcons[s.id] ?? Rocket;
          const isSelected = stage === s.id;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                trackGoal(GOALS.calculatorStageSelect, { stage: s.id });
                setStage(s.id);
              }}
              className={`flex cursor-pointer flex-col items-start gap-3 rounded-[12px] border p-5 text-left transition-colors ${
                isSelected
                  ? 'border-lime bg-[radial-gradient(100%_100%_at_0_100%,rgba(210,249,73,0.09),rgba(210,249,73,0))]'
                  : 'border-white/20 hover:border-white/60'
              }`}
            >
              <Icon className={`size-8 ${isSelected ? 'text-lime' : 'opacity-40'}`} strokeWidth={1.5} />
              <span className="flex flex-col gap-1">
                <span className="text-[18px] leading-6 font-semibold tracking-[-0.02em]">{t(s.tKey)}</span>
                <span className="text-[14px] leading-5 tracking-[-0.02em] opacity-60">{t(s.descKey)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
