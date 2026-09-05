'use client';

import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

const sections = ['hero', 'case-studies', 'services', 'contact'];

export function MobileScrollButton() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((sectionId, index) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(index);
          }
        }
      });

      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      setIsVisible(!isAtBottom);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNext = () => {
    const nextIndex = currentSection + 1;
    if (nextIndex < sections.length) {
      document.getElementById(sections[nextIndex])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && currentSection < sections.length - 1 && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToNext}
          className="fixed bottom-8 right-6 z-50 rounded-full bg-fg p-4 text-bg transition-colors hover:bg-accent active:scale-95"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
