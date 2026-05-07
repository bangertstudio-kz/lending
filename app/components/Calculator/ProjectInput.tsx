interface ProjectInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProjectInput({ value, onChange }: ProjectInputProps) {
  return (
    <div className="bg-black border border-white/10 p-6 hover:border-white/20 transition-colors">
      <label className="block text-lg font-semibold text-white mb-3">
        Describe your project
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. MVP mobile app with payments and admin panel"
        className="w-full px-4 py-3 border border-white/10 bg-white/5 focus:outline-none focus:border-white/30 resize-none text-white placeholder:text-white/40 transition-colors"
        rows={4}
      />
    </div>
  );
}
