'use client';

import { MessageCircle, Phone } from 'lucide-react';
import { GOALS, trackGoal } from '@/app/analytics';

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socialLinks = [
  { name: 'Telegram', icon: MessageCircle, url: 'https://t.me/alexanderbangert', label: '@alexanderbangert' },
  { name: 'WhatsApp', icon: Phone, url: 'https://wa.me/77074054405', label: '+7 (707) 405-4405' },
  { name: 'LinkedIn', icon: LinkedinIcon, url: 'https://www.linkedin.com/company/bangertstudio/', label: 'BangertStudio' },
];

export function ContactLinks({ place = 'home' }: { place?: 'home' | 'calculator' }) {
  return (
    <div className="space-y-3">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackGoal(GOALS.contactLinkClick, { channel: social.name, place })}
          className="group flex items-center gap-4 border border-hairline bg-surface p-4 transition-colors hover:border-accent"
        >
          <div className="rounded-full bg-raised p-3 transition-colors group-hover:bg-accent-soft">
            <social.icon className="h-5 w-5 text-muted transition-colors group-hover:text-accent" />
          </div>
          <div>
            <p className="text-xs text-faint">{social.name}</p>
            <p className="text-small text-fg">{social.label}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
