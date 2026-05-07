'use client';

import { MessageCircle, Phone } from 'lucide-react';

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

export function ContactLinks() {
  return (
    <div className="space-y-3">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 border border-white/10 hover:border-white/30 transition-colors group"
        >
          <div className="bg-white/5 p-3 rounded-full group-hover:bg-white/10 transition-colors">
            <social.icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white/50 text-xs">{social.name}</p>
            <p className="text-white text-sm">{social.label}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
