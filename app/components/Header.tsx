'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ReadingProgress } from './ReadingProgress';
import { useTranslation } from 'react-i18next';

type NavItem = { label: string; href: string; external?: boolean };

const navItems: NavItem[] = [
  { label: 'header.caseStudies', href: '/cases' },
  { label: 'header.packages', href: '/packages' },
  { label: 'header.calculator', href: '/calculator' },
  { label: 'header.news', href: 'https://t.me/bangertstudio', external: true },
];

/**
 * Внутренние переходы идут через next/link: он подставляет активную локаль в
 * адрес. Обычный <a href="/cases"> уводил на дефолтный (русский) префикс, и
 * язык сбрасывался при каждом переходе по меню.
 */
function NavLink({
  item,
  onClick,
  className,
  children,
}: {
  item: NavItem;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className: string;
  children: React.ReactNode;
}) {
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={item.href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}

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
    setIsMobileMenuOpen(false);
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - 80, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-bg/85 backdrop-blur-xl border-b border-hairline' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo />

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-small text-muted transition-colors hover:text-fg"
                >
                  {t(item.label)}
                </NavLink>
              ))}
              <LanguageSwitcher onLanguageChange={() => setIsMobileMenuOpen(false)} />
            </div>

            <button
              className="md:hidden text-fg p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
        <ReadingProgress />
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-bg/90 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="absolute top-20 left-6 right-6 bg-raised border border-hairline p-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="border-b border-hairline py-2 text-body-lg text-muted transition-colors last:border-0 hover:text-fg"
                  >
                    {t(item.label)}
                  </NavLink>
                ))}
                <div className="pt-4 border-t border-hairline">
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
