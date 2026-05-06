import { Rocket, Zap, Building2 } from 'lucide-react';

interface StageSelectorProps {
  selected: string;
  onChange: (stage: string) => void;
}

const stages = [
  { id: 'mvp', label: 'MVP', icon: Rocket, description: 'Core features only' },
  { id: 'mature', label: 'Mature Product', icon: Building2, description: 'Full-featured app' },
];

export default function StageSelector({ selected, onChange }: StageSelectorProps) {
  return (
    <div className="bg-black border border-white/10 p-6 hover:border-white/20 transition-colors">
      <h3 className="text-lg font-semibold text-white mb-4">Project Stage</h3>
      <div className="grid grid-cols-2 gap-4">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const isSelected = selected === stage.id;

          return (
            <button
              key={stage.id}
              onClick={() => onChange(stage.id)}
              className={`
                p-4 border transition-all text-left
                ${isSelected
                  ? 'border-white/30 bg-white/5'
                  : 'border-white/10 bg-transparent hover:border-white/20'
                }
              `}
            >
              <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-white' : 'text-white/40'}`} />
              <div className={`font-semibold mb-1 ${isSelected ? 'text-white' : 'text-white/70'}`}>
                {stage.label}
              </div>
              <div className="text-xs text-white/50">
                {stage.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
