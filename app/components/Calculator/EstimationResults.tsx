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
    <div className="bg-bg border border-hairline p-6 hover:border-hairline-strong transition-colors">
      <h3 className="mb-6 font-display font-semibold text-h3 text-fg">{t('calculator.results.title')}</h3>

      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted mb-2">
          <DollarSign className="w-5 h-5" />
          <span className="text-small font-medium">{t('calculator.results.budget')}</span>
        </div>
        <div className="mb-1 font-mono text-h1 tabular-nums text-accent">
          $<AnimatedNumber value={estimates.minCost} />
        </div>
        <div className="font-mono text-h2 tabular-nums text-muted">
          to $<AnimatedNumber value={estimates.maxCost} />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted mb-2">
          <Clock className="w-5 h-5" />
          <span className="text-small font-medium">{t('calculator.results.timeline')}</span>
        </div>
        <div className="font-mono text-h2 tabular-nums text-fg">
          <AnimatedNumber value={estimates.minWeeks} /> - <AnimatedNumber value={estimates.maxWeeks} /> {t('calculator.results.weeks')}
        </div>
      </div>

      <div className="mt-6 p-4 bg-raised border border-hairline">
        <p className="text-small text-muted">{t('calculator.results.disclaimer')}</p>
      </div>
    </div>
  );
}
