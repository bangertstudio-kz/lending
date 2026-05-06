import { Monitor, Smartphone, Laptop, Plus, Minus } from 'lucide-react';

interface PlatformSelectorProps {
  selected: Record<string, number>;
  onChange: (platforms: Record<string, number>) => void;
}

const platforms = [
  { name: 'Web App', icon: Monitor, description: 'React web application' },
  { name: 'Mobile App', icon: Smartphone, description: 'iOS & Android' },
  { name: 'macOS', icon: Laptop, description: 'Native macOS app' },
  { name: 'Windows', icon: Laptop, description: 'Native Windows app' },
];

export default function PlatformSelector({ selected, onChange }: PlatformSelectorProps) {
  const updatePlatform = (name: string, delta: number) => {
    const newCount = Math.max(0, Math.min(5, (selected[name] || 0) + delta));
    onChange({ ...selected, [name]: newCount });
  };

  return (
    <div className="bg-black border border-white/10 p-6 hover:border-white/20 transition-colors">
      <h3 className="text-lg font-semibold text-white mb-4">Platforms</h3>
      <div className="space-y-3">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const count = selected[platform.name] || 0;
          const isSelected = count > 0;

          return (
            <div
              key={platform.name}
              className={`
                flex items-center justify-between p-3 border transition-all
                ${isSelected ? 'border-white/30 bg-white/5' : 'border-white/10 bg-transparent'}
              `}
            >
              <div className="flex items-center gap-3 flex-1">
                <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-white/40'}`} />
                <div>
                  <div className={`font-medium ${isSelected ? 'text-white' : 'text-white/70'}`}>
                    {platform.name}
                  </div>
                  <div className="text-xs text-white/50">{platform.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updatePlatform(platform.name, -1)}
                  disabled={count === 0}
                  className="w-8 h-8 bg-white/5 border border-white/20 flex items-center justify-center hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4 text-white" />
                </button>
                <span className="w-8 text-center font-semibold text-white">
                  {count}
                </span>
                <button
                  onClick={() => updatePlatform(platform.name, 1)}
                  disabled={count >= 5}
                  className="w-8 h-8 bg-white/5 border border-white/20 flex items-center justify-center hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
