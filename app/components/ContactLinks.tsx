'use client';

import { ArrowUpRight, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GOALS, trackGoal } from '@/app/analytics';

type IconProps = { className?: string };

// Те же значки, что в футере (public/assets/footer), но инлайном — чтобы красить через currentColor.
function TelegramIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" clipRule="evenodd" d="M24 12C24 18.627 18.627 24 12 24C5.373 24 0 18.627 0 12C0 5.373 5.373 0 12 0C18.627 0 24 5.373 24 12ZM12.43 8.859C11.2633 9.34433 8.93067 10.349 5.432 11.873C4.864 12.099 4.56633 12.32 4.539 12.536C4.493 12.902 4.951 13.046 5.573 13.241L5.836 13.325C6.449 13.524 7.273 13.757 7.701 13.766C8.08967 13.774 8.52367 13.614 9.003 13.286C12.271 11.0793 13.958 9.964 14.064 9.94C14.139 9.923 14.243 9.901 14.313 9.964C14.383 10.026 14.376 10.144 14.369 10.176C14.323 10.369 12.529 12.038 11.599 12.902C11.309 13.171 11.104 13.362 11.062 13.406C10.9667 13.5027 10.8727 13.5957 10.78 13.685C10.21 14.233 9.784 14.645 10.804 15.317C11.294 15.64 11.686 15.907 12.077 16.173C12.504 16.464 12.93 16.754 13.482 17.116C13.622 17.2093 13.757 17.3027 13.887 17.396C14.384 17.751 14.831 18.069 15.383 18.019C15.703 17.989 16.035 17.688 16.203 16.789C16.6 14.663 17.382 10.059 17.563 8.161C17.575 8.00343 17.5683 7.84499 17.543 7.689C17.529 7.56275 17.4675 7.44655 17.371 7.364C17.228 7.247 17.006 7.222 16.906 7.224C16.455 7.232 15.763 7.473 12.43 8.859Z" />
    </svg>
  );
}

function WhatsappIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.9992 0C13.8397 0.000532664 15.6554 0.42443 17.3059 1.2389C18.9565 2.05338 20.3975 3.2366 21.5176 4.69705C22.6377 6.1575 23.4069 7.85603 23.7656 9.66127C24.1243 11.4665 24.0629 13.3301 23.5863 15.1078C23.1096 16.8855 22.2304 18.5298 21.0167 19.9134C19.8029 21.297 18.2872 22.3829 16.5867 23.0871C14.8862 23.7912 13.0465 24.0948 11.2099 23.9742C9.37331 23.8537 7.58906 23.3123 5.99516 22.392L1.31516 23.948C1.13913 24.0064 0.950321 24.0147 0.769846 23.9719C0.589371 23.9292 0.424337 23.8371 0.293192 23.706C0.162047 23.5748 0.0699568 23.4098 0.0272153 23.2293C-0.0155262 23.0488 -0.00723525 22.86 0.0511616 22.684L1.61116 18.006C0.55663 16.1819 0.000950516 14.1124 1.21835e-06 12.0054C-0.000948079 9.89845 0.552866 7.82838 1.60575 6.00336C2.65864 4.17834 4.17348 2.66271 5.99796 1.60888C7.82243 0.555039 9.89221 0.000147209 11.9992 0ZM7.86316 6.006C7.7105 6.01072 7.56075 6.04901 7.42456 6.11814C7.28837 6.18727 7.16908 6.28555 7.07516 6.406C6.80516 6.722 6.04316 7.492 6.04316 9.056C6.04316 10.622 7.10116 12.136 7.24916 12.348C7.39516 12.556 9.33116 15.768 12.2932 17.148C12.8438 17.404 13.4038 17.6273 13.9732 17.818C14.6812 18.058 15.3272 18.026 15.8372 17.946C16.4052 17.856 17.5832 17.178 17.8292 16.432C18.0732 15.692 18.0732 15.054 17.9992 14.922C17.9252 14.79 17.7292 14.708 17.4312 14.546C16.7674 14.1862 16.0952 13.8421 15.4152 13.514C15.1452 13.406 14.9472 13.354 14.7512 13.674C14.5532 13.992 13.9912 14.71 13.8172 14.922C13.6472 15.128 13.4732 15.158 13.1772 15C12.8812 14.842 11.9312 14.504 10.8032 13.42C10.1515 12.7696 9.59894 12.027 9.16316 11.216C8.98716 10.896 9.14316 10.726 9.28916 10.566C9.42316 10.426 9.58516 10.196 9.73316 10.008C9.87916 9.828 9.93116 9.694 10.0292 9.48C10.1272 9.268 10.0772 9.08 10.0032 8.924C9.92916 8.764 9.33916 7.196 9.09116 6.558C8.85116 5.938 8.60916 6.026 8.42716 6.014C8.25716 6.006 8.06116 6.006 7.86316 6.006Z" />
    </svg>
  );
}

function LinkedinIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socialLinks = [
  { name: 'Google Meet', icon: Video, url: 'https://calendar.app.google/LZjMidqtq5BtFg7x6', labelKey: 'contact.bookCall' },
  { name: 'Telegram', icon: TelegramIcon, url: 'https://t.me/alexanderbangert', label: '@alexanderbangert' },
  { name: 'WhatsApp', icon: WhatsappIcon, url: 'https://wa.me/77074054405', label: '+7 (707) 405-4405' },
  { name: 'LinkedIn', icon: LinkedinIcon, url: 'https://www.linkedin.com/company/bangertstudio/', label: 'BangertStudio' },
] as const;

export function ContactLinks({ place = 'home' }: { place?: 'home' | 'calculator' }) {
  const { t } = useTranslation();

  return (
    <ul className="flex flex-col gap-3">
      {socialLinks.map((social) => (
        <li key={social.name}>
          <a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackGoal(GOALS.contactLinkClick, { channel: social.name, place })}
            className="group flex items-center gap-4 rounded-[16px] border border-white/12 bg-white/[0.03] p-4 transition-all duration-300 hover:border-lime/50 hover:bg-[radial-gradient(120%_140%_at_0_100%,rgba(210,249,73,0.12),rgba(210,249,73,0)_60%)] lg:p-5"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white transition-colors duration-300 group-hover:bg-lime group-hover:text-ink">
              <social.icon className="size-6" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[12px] leading-5 font-medium tracking-[0.02em] uppercase opacity-40">{social.name}</span>
              <span className="truncate text-[18px] leading-7 font-semibold tracking-[-0.02em] lg:text-[20px]">
                {'labelKey' in social ? t(social.labelKey) : social.label}
              </span>
            </span>
            <ArrowUpRight
              aria-hidden
              className="size-6 shrink-0 opacity-40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-lime group-hover:opacity-100"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
