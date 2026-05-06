'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const navItems = [
  { label: 'header.whyChooseUs', href: '/#why-choose-us' },
  { label: 'header.caseStudies', href: '/cases' },
  { label: 'header.services', href: '/#services' },
  { label: 'header.contact', href: '/#contact' },
];

export function Header() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - 80, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  {t(item.label)}
                </motion.a>
              ))}
              <motion.a
                href="/calculator"
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-medium border border-white/20 px-3 py-1.5 hover:border-white/40"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: navItems.length * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Calculator className="w-4 h-4" />
                Calculator
              </motion.a>
              <LanguageSwitcher onLanguageChange={() => setIsMobileMenuOpen(false)} />
            </div>

            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="absolute top-20 left-6 right-6 bg-black/95 border border-white/10 rounded-lg p-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="flex flex-col gap-4">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-white/80 hover:text-white transition-colors text-lg font-medium py-2 border-b border-white/10 last:border-0"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    {t(item.label)}
                  </motion.a>
                ))}
                <a
                  href="/calculator"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-lg font-medium py-2"
                >
                  <Calculator className="w-5 h-5" />
                  Calculator
                </a>
                <div className="pt-4 border-t border-white/10">
                  <LanguageSwitcher onLanguageChange={() => setIsMobileMenuOpen(false)} />
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
