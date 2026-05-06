'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import StageSelector from './StageSelector';
import PlatformSelector from './PlatformSelector';
import FeatureSelector from './FeatureSelector';
import TeamComposition from './TeamComposition';
import EstimationResults from './EstimationResults';

interface CostCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  projectDescription: string;
  name?: string;
  contact?: string;
}

export default function CostCalculator({
  isOpen,
  onClose,
  projectDescription,
  name: initialName = '',
  contact: initialContact = '',
}: CostCalculatorProps) {
  const [description, setDescription] = useState(projectDescription);
  const [name, setName] = useState(initialName);
  const [contact, setContact] = useState(initialContact);
  const [platforms, setPlatforms] = useState<Record<string, number>>({
    'Web App': 0,
    'Mobile App': 0,
    'macOS': 0,
    'Windows': 0,
  });
  const [stage, setStage] = useState('mvp');
  const [team, setTeam] = useState<Record<string, number>>({
    'Project Manager': 1,
    'UI/UX Designer': 1,
    'Frontend Developer': 1,
    'Backend Developer': 1,
    'Mobile Developer': 0,
    'QA Engineer': 1,
  });
  const [features, setFeatures] = useState<string[]>([]);

  const showContactFields = !initialName && !initialContact;

  const calculateEstimates = () => {
    const baseRate = 80;
    const teamSize = Object.values(team).reduce((a, b) => a + b, 0);

    const weeksMultiplier = stage === 'mature' ? 2 : 1;
    const platformCount = Object.values(platforms).reduce((a, b) => a + b, 0);
    const platformMultiplier = 1 + platformCount * 0.3;
    const featureMultiplier = 1 + features.length * 0.15;

    const baseWeeks = 8 * weeksMultiplier * platformMultiplier * featureMultiplier;
    const minWeeks = Math.floor(baseWeeks * 0.8);
    const maxWeeks = Math.ceil(baseWeeks * 1.3);

    const hoursPerWeek = 40;
    const minCost = Math.floor(minWeeks * hoursPerWeek * teamSize * baseRate);
    const maxCost = Math.ceil(maxWeeks * hoursPerWeek * teamSize * baseRate);

    return { minCost, maxCost, minWeeks, maxWeeks, teamSize };
  };

  const estimates = calculateEstimates();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-neutral-950 z-50 overflow-y-auto"
        >
          <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Назад</span>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white/80 px-4 py-2 rounded-full mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">AI-Powered Estimation</span>
                </div>
                <h1 className="text-5xl font-bold text-white mb-3">IT Project Cost Calculator</h1>
                <p className="text-xl text-white/60">Get instant estimates for your next software project</p>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="bg-black border border-white/10 p-6 space-y-4"
                  >
                    {showContactFields && (
                      <>
                        <Input
                          type="text"
                          placeholder="Имя"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30"
                        />
                        <Input
                          type="text"
                          placeholder="Как с вами связаться?"
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          required
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30"
                        />
                      </>
                    )}
                    <div className="space-y-1">
                      {showContactFields && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/50">Описание проекта</span>
                          <span className="text-xs text-white/30">опционально</span>
                        </div>
                      )}
                      <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g. MVP mobile app with payments and admin panel"
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 min-h-[120px]"
                      />
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                    <StageSelector selected={stage} onChange={setStage} />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
                    <PlatformSelector selected={platforms} onChange={setPlatforms} />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
                    <FeatureSelector selected={features} onChange={setFeatures} />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
                    <TeamComposition team={team} onChange={setTeam} />
                  </motion.div>
                </div>

                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="sticky top-6"
                  >
                    <EstimationResults estimates={estimates} />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
