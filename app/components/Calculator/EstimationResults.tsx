import { motion, useSpring, useTransform } from 'motion/react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { panel, panelTitle } from './styles';

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

const label = 'text-[14px] leading-6 font-medium tracking-[-0.02em] uppercase opacity-40';

export default function EstimationResults({ estimates }: EstimationResultsProps) {
  const { t } = useTranslation();

  return (
    <div className={panel}>
      <p className="flex gap-3">
        <span aria-hidden className="w-1 shrink-0 bg-lime" />
        <span className={panelTitle}>{t('calculator.results.title')}</span>
      </p>

      <div className="flex flex-col gap-1">
        <span className={label}>{t('calculator.results.budget')}</span>
        <span className="text-[clamp(2rem,3vw,3rem)] leading-tight font-semibold tracking-[-0.04em] text-lime">
          $<AnimatedNumber value={estimates.minCost} /> – $<AnimatedNumber value={estimates.maxCost} />
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className={label}>{t('calculator.results.timeline')}</span>
        <span className="text-[24px] leading-8 font-semibold tracking-[-0.02em]">
          <AnimatedNumber value={estimates.minWeeks} />–<AnimatedNumber value={estimates.maxWeeks} /> {t('calculator.results.weeks')}
        </span>
      </div>

      <div className="h-px rounded-[4px] bg-white opacity-20" />
      <p className="text-[14px] leading-6 tracking-[-0.02em] opacity-60">{t('calculator.results.disclaimer')}</p>
    </div>
  );
}
