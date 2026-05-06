import { Users, Plus, Minus } from 'lucide-react';

interface TeamCompositionProps {
  team: Record<string, number>;
  onChange: (team: Record<string, number>) => void;
}

const roles = [
  { name: 'Project Manager', rate: 100 },
  { name: 'UI/UX Designer', rate: 80 },
  { name: 'Frontend Developer', rate: 85 },
  { name: 'Backend Developer', rate: 90 },
  { name: 'Mobile Developer', rate: 95 },
  { name: 'QA Engineer', rate: 70 },
];

export default function TeamComposition({ team, onChange }: TeamCompositionProps) {
  const updateRole = (role: string, delta: number) => {
    const newCount = Math.max(0, (team[role] || 0) + delta);
    onChange({ ...team, [role]: newCount });
  };

  return (
    <div className="bg-black border border-white/10 p-6 hover:border-white/20 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-white" />
        <h3 className="text-lg font-semibold text-white">Team Composition</h3>
      </div>

      <div className="space-y-3">
        {roles.map((role) => (
          <div
            key={role.name}
            className="flex items-center justify-between p-3 bg-white/5 border border-white/10"
          >
            <div className="flex-1">
              <div className="font-medium text-white">{role.name}</div>
              <div className="text-sm text-white/50">${role.rate}/hour</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateRole(role.name, -1)}
                disabled={team[role.name] === 0}
                className="w-8 h-8 bg-white/5 border border-white/20 flex items-center justify-center hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-4 h-4 text-white" />
              </button>
              <span className="w-8 text-center font-semibold text-white">
                {team[role.name] || 0}
              </span>
              <button
                onClick={() => updateRole(role.name, 1)}
                className="w-8 h-8 bg-white/5 border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
