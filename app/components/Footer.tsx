'use client';

import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
import { Logo } from './Logo';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-surface border-t border-hairline py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <Logo />
            <p className="text-muted text-small mt-3">
              {t('footer.description')}
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <a
              href="mailto:alexganbert@gmail.com"
              className="text-muted hover:text-accent transition-colors"
            >
              alexganbert@gmail.com
            </a>

            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/bangertstudio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-faint hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/bangertstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-faint hover:text-accent transition-colors"
                aria-label={t('footer.news')}
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://t.me/alexanderbangert"
                target="_blank"
                rel="noopener noreferrer"
                className="text-faint hover:text-accent transition-colors"
                aria-label={t('footer.writeToUs')}
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-hairline text-center">
          <p className="text-faint text-small">
            © {new Date().getFullYear()} Bangert Studio. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
}
