import { DollarSign, Clock, Users } from 'lucide-react';
import { motion, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';

interface EstimationResultsProps {
  estimates: {
    minCost: number;
    maxCost: number;
    minWeeks: number;
    maxWeeks: number;
    teamSize: number;
  };
}

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 100, damping: 25, mass: 0.5 });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  const display = useTransform(spring, (latest) => {
    return Math.round(latest).toLocaleString('en-US');
  });

  return (
    <motion.span className="inline-block tabular-nums">
      {display}
    </motion.span>
  );
}

export default function EstimationResults({ estimates }: EstimationResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-black border border-white/10 p-6 hover:border-white/20 transition-colors">
      <h3 className="text-xl font-bold text-white mb-6">Estimated Cost</h3>

      {/* Price Range */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-white/60 mb-2">
          <DollarSign className="w-5 h-5" />
          <span className="text-sm font-medium">Budget Range</span>
        </div>
        <div className="text-4xl font-bold text-white mb-1">
          $<AnimatedNumber value={estimates.minCost} />
        </div>
        <div className="text-2xl font-semibold text-white/70">
          to $<AnimatedNumber value={estimates.maxCost} />
        </div>
      </div>

      {/* Timeline */}
      <div className="mb-8 pb-8 border-b border-white/10">
        <div className="flex items-center gap-2 text-white/60 mb-2">
          <Clock className="w-5 h-5" />
          <span className="text-sm font-medium">Timeline</span>
        </div>
        <div className="text-2xl font-bold text-white">
          <AnimatedNumber value={estimates.minWeeks} /> - <AnimatedNumber value={estimates.maxWeeks} /> weeks
        </div>
      </div>

      {/* Team Summary */}
      <div>
        <div className="flex items-center gap-2 text-white/60 mb-2">
          <Users className="w-5 h-5" />
          <span className="text-sm font-medium">Team Size</span>
        </div>
        <div className="text-2xl font-bold text-white mb-4">
          <AnimatedNumber value={estimates.teamSize} /> {estimates.teamSize === 1 ? 'person' : 'people'}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-white/5 border border-white/10">
        <p className="text-sm text-white/60">
          💡 These estimates are based on industry averages. Final costs may vary based on specific requirements and team rates.
        </p>
      </div>
    </div>
  );
}
