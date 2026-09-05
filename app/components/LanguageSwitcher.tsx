'use client';

import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { LANGUAGE_STORAGE_KEY } from '@/app/i18n';

interface LanguageSwitcherProps {
  onLanguageChange?: () => void;
}

export function LanguageSwitcher({ onLanguageChange }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ru' : 'en';
    i18n.changeLanguage(newLang);
    // Раньше выбор языка не переживал перезагрузку: сюда ничего не писалось,
    // хотя инициализация из этого ключа читала.
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch {
      // хранилище может быть недоступно — переключение всё равно сработало
    }
    if (onLanguageChange) onLanguageChange();
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 text-small text-muted transition-colors hover:text-fg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Switch language"
    >
      <Globe size={18} />
      <span className="text-sm font-medium uppercase">{i18n.language}</span>
    </motion.button>
  );
}
