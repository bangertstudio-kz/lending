'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronDown, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ReadingProgress } from './ReadingProgress';
import { LimeButton } from './ui/block';
import { useTranslation } from 'react-i18next';
import { GOALS, trackGoal } from '@/app/analytics';
import { ALL_SERVICES } from '@/app/data/services';

type NavItem = { label: string; href: string; external?: boolean };

// Пункты из макета. «О студии» пока ведёт к блоку «Процесс» — своего блока у неё ещё нет.
const primaryItems: NavItem[] = [
  { label: 'header.services', href: '/#services' },
  { label: 'header.portfolio', href: '/cases' },
  { label: 'header.about', href: '/#process' },
  { label: 'header.contact', href: '/#contact' },
];

// В шапке макета их нет — живут в меню за кнопкой.
const secondaryItems: NavItem[] = [
  { label: 'header.calculator', href: '/calculator' },
  { label: 'header.packages', href: '/packages' },
  { label: 'header.news', href: '/blog' },
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
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /** Якорь на главной, когда мы уже на ней, — плавно прокручиваем вместо перехода. */
  const scrollToHash = (href: string) => {
    if (router.pathname !== '/' || !href.startsWith('/#')) return false;
    const element = document.getElementById(href.slice(2));
    if (!element) return false;
    element.scrollIntoView({ behavior: 'smooth' });
    return true;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem, place: 'desktop' | 'menu') => {
    trackGoal(GOALS.navClick, { item: item.href, place, external: Boolean(item.external) });
    setIsMenuOpen(false);
    if (scrollToHash(item.href)) e.preventDefault();
  };

  const toggleMenu = () => {
    if (!isMenuOpen) trackGoal(GOALS.mobileMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 font-montserrat text-white transition-colors duration-300 ${
          isScrolled || isMenuOpen ? 'bg-ink/85 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex w-full max-w-[1920px] items-center justify-between gap-6 px-6 py-5 lg:px-20">
          <div className="flex items-center gap-3">
            <Link
              href="/#hero"
              onClick={(e) => {
                trackGoal(GOALS.logoClick);
                if (scrollToHash('/#hero')) e.preventDefault();
              }}
              className="flex items-center gap-1"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/header/logo.svg" alt="" width={36} height={36} className="size-9" />
              <span className="text-[24px] leading-8 font-bold lg:text-[32px]">BangertStudio</span>
            </Link>
            <span aria-hidden className="hidden h-9 w-px bg-white opacity-20 sm:block xl:hidden 2xl:block" />
            <span className="hidden text-[12px] leading-3 font-medium tracking-[-0.02em] opacity-40 sm:block xl:hidden 2xl:block">
              DIGITAL
              <br />
              PRODUCT
              <br />
              STUDIO
            </span>
          </div>

          {/* Полная шапка из макета влезает от ~1365px. На 1280–1535 убираем подпись и сжимаем
              отступы, ниже 1280 пункты живут только в меню. */}
          <div className="hidden items-center gap-10 xl:flex 2xl:gap-[60px]">
            {primaryItems.map((item) =>
              item.label === 'header.services' ? (
                // Выпадающее меню на CSS: открывается по наведению и по фокусу с клавиатуры.
                <div key={item.href} className="group relative">
                  <NavLink
                    item={item}
                    onClick={(e) => handleNavClick(e, item, 'desktop')}
                    className="flex items-center gap-1 py-3 text-[14px] leading-6 font-medium tracking-[-0.02em] whitespace-nowrap uppercase opacity-40 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
                  >
                    {t(item.label)}
                    <ChevronDown size={16} aria-hidden className="transition-transform group-focus-within:rotate-180 group-hover:rotate-180" />
                  </NavLink>
                  {/* pt — прозрачный мостик, чтобы курсор не терял меню по пути от пункта к списку. */}
                  <div className="invisible absolute top-full left-1/2 w-[420px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="flex flex-col rounded-[20px] border border-white/12 bg-ink p-2 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                      {ALL_SERVICES.map((service) => (
                        <li key={service.slug}>
                          <Link
                            href={`/services/${service.slug}`}
                            onClick={() => trackGoal(GOALS.navClick, { item: `/services/${service.slug}`, place: 'dropdown', external: false })}
                            className="flex flex-col gap-0.5 rounded-[12px] px-4 py-3 transition-colors hover:bg-white/6 focus-visible:bg-white/6"
                          >
                            <span className="text-[16px] leading-6 font-semibold tracking-[-0.02em]">
                              {t(`services.${service.key}.title`)}
                            </span>
                            <span className="text-[14px] leading-5 tracking-[-0.02em] opacity-60">
                              {t(`services.${service.key}.description`)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.href}
                  item={item}
                  onClick={(e) => handleNavClick(e, item, 'desktop')}
                  className="py-3 text-[14px] leading-6 font-medium tracking-[-0.02em] whitespace-nowrap uppercase opacity-40 transition-opacity hover:opacity-100"
                >
                  {t(item.label)}
                </NavLink>
              ),
            )}
          </div>

          <div className="flex items-center gap-10">
            <div className="hidden sm:block">
              <LimeButton
                onClick={() => {
                  trackGoal(GOALS.heroCtaConsultation, { place: 'header' });
                  setIsMenuOpen(false);
                  if (!scrollToHash('/#contact')) router.push('/#contact');
                }}
              >
                {t('hero.ctaConsultation')}
              </LimeButton>
            </div>
            <button
              type="button"
              onClick={toggleMenu}
              aria-label={t(isMenuOpen ? 'header.menuClose' : 'header.menuOpen')}
              aria-expanded={isMenuOpen}
              className="flex rounded-[40px] border border-white p-[11px] transition-colors hover:border-lime"
            >
              {isMenuOpen ? (
                <X size={24} strokeWidth={1.5} aria-hidden />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/assets/header/menu.svg" alt="" width={24} height={24} />
              )}
            </button>
          </div>
        </nav>
        <ReadingProgress />
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 font-montserrat text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
            <motion.div
              className="absolute top-[96px] right-6 left-6 rounded-[20px] border border-white/12 bg-ink p-6 sm:left-auto sm:w-[340px] lg:right-20"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav className="flex flex-col">
                {/* Пункты, которые уже видны в шапке (xl+), в меню не дублируем. */}
                {[...primaryItems, ...secondaryItems].map((item) => (
                  <div key={item.href} className={`flex flex-col border-b border-white/12 ${primaryItems.includes(item) ? 'xl:hidden' : ''}`}>
                    <NavLink
                      item={item}
                      onClick={(e) => handleNavClick(e, item, 'menu')}
                      className="py-3 text-[16px] leading-6 font-medium tracking-[-0.02em] uppercase opacity-60 transition-opacity hover:opacity-100"
                    >
                      {t(item.label)}
                    </NavLink>
                    {item.label === 'header.services' && (
                      <ul className="flex flex-col pb-2 pl-4">
                        {ALL_SERVICES.map((service) => (
                          <li key={service.slug}>
                            <Link
                              href={`/services/${service.slug}`}
                              onClick={() => {
                                trackGoal(GOALS.navClick, { item: `/services/${service.slug}`, place: 'menu', external: false });
                                setIsMenuOpen(false);
                              }}
                              className="block py-1.5 text-[14px] leading-6 tracking-[-0.02em] opacity-60 transition-opacity hover:opacity-100"
                            >
                              {t(`services.${service.key}.title`)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </nav>
              <div className="mt-4 flex items-center justify-between gap-4">
                <LanguageSwitcher onLanguageChange={() => setIsMenuOpen(false)} />
                <div className="sm:hidden">
                  <LimeButton
                    onClick={() => {
                      trackGoal(GOALS.heroCtaConsultation, { place: 'menu' });
                      setIsMenuOpen(false);
                      if (!scrollToHash('/#contact')) router.push('/#contact');
                    }}
                  >
                    {t('hero.ctaConsultation')}
                  </LimeButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
