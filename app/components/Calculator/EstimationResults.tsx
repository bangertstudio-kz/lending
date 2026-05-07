import { DollarSign, Clock } from 'lucide-react';
import { motion, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface EstimationResultsProps {
  estimates: {
    minCost: number;
    maxCost: number;
    minWeeks: number;
    maxWeeks: number;
  };
}

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 100, damping: 25, mass: 0.5 });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  const display = useTransform(spring, (latest) => Math.round(latest).toLocaleString('en-US'));

  return <motion.span className="inline-block tabular-nums">{display}</motion.span>;
}

export default function EstimationResults({ estimates }: EstimationResultsProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-black border border-white/10 p-6 hover:border-white/20 transition-colors">
      <h3 className="text-xl font-bold text-white mb-6">{t('calculator.results.title')}</h3>

      <div className="mb-8">
        <div className="flex items-center gap-2 text-white/60 mb-2">
          <DollarSign className="w-5 h-5" />
          <span className="text-sm font-medium">{t('calculator.results.budget')}</span>
        </div>
        <div className="text-4xl font-bold text-white mb-1">
          $<AnimatedNumber value={estimates.minCost} />
        </div>
        <div className="text-2xl font-semibold text-white/70">
          to $<AnimatedNumber value={estimates.maxCost} />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 text-white/60 mb-2">
          <Clock className="w-5 h-5" />
          <span className="text-sm font-medium">{t('calculator.results.timeline')}</span>
        </div>
        <div className="text-2xl font-bold text-white">
          <AnimatedNumber value={estimates.minWeeks} /> - <AnimatedNumber value={estimates.maxWeeks} /> {t('calculator.results.weeks')}
        </div>
      </div>

      <div className="mt-6 p-4 bg-white/5 border border-white/10">
        <p className="text-sm text-white/60">💡 {t('calculator.results.disclaimer')}</p>
      </div>
    </div>
  );
}
