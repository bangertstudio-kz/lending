'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { GOALS, trackGoal } from '@/app/analytics';
import { SERVICES } from '@/app/data/services';

const PHONE = { label: '+7 (707) 405-4405', whatsapp: 'https://wa.me/77074054405' };
const TELEGRAM = 'https://t.me/alexanderbangert';
const EMAIL = 'alexganbert@gmail.com';


const linkClass = 'py-2 text-[14px] leading-6 font-medium tracking-[-0.02em] opacity-40 transition-opacity hover:opacity-100';

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <h3 className="text-[24px] leading-8 font-semibold tracking-[-0.02em]">{title}</h3>
      <ul className="flex flex-col items-start">{children}</ul>
    </div>
  );
}

export function Footer() {
  const { t } = useTranslation();
  const cities = t('footer.cities', { returnObjects: true }) as string[];

  return (
    <footer className="bg-[#0a0a0a] font-montserrat text-white">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-12 px-6 py-10 lg:px-20 xl:flex-row xl:gap-20">
        <div className="flex shrink-0 flex-col gap-10">
          <div className="flex items-center gap-3">
            <Link href="/#hero" className="flex items-center gap-1" onClick={() => trackGoal(GOALS.logoClick)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/header/logo.svg" alt="" width={36} height={36} className="size-9" />
              <span className="text-[24px] leading-8 font-bold lg:text-[32px]">BangertStudio</span>
            </Link>
            <span aria-hidden className="h-9 w-px bg-white opacity-20" />
            <span className="text-[12px] leading-3 font-medium tracking-[-0.02em] opacity-40">
              DIGITAL
              <br />
              PRODUCT
              <br />
              STUDIO
            </span>
          </div>
          <p className="text-[14px] leading-6 font-medium tracking-[-0.02em] whitespace-pre-line opacity-40">
            {t('footer.legal')}
          </p>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 xl:gap-20">
          <Column title={t('footer.services')}>
            {/* Названия направлений в макете на английском во всех языках. */}
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className={`block ${linkClass}`}>
                  {s.footer}
                </Link>
              </li>
            ))}
          </Column>

          <Column title={t('footer.company')}>
            {[
              { href: '/cases', label: t('footer.cases') },
              { href: '/#process', label: t('footer.process') },
              { href: '/#hero', label: t('footer.about') },
              { href: '/#contact', label: t('footer.contacts') },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={`block ${linkClass}`}>
                  {item.label}
                </Link>
              </li>
            ))}
          </Column>

          <Column title={t('footer.geography')}>
            {cities.map((city) => (
              <li key={city}>
                <Link href="/#geography" className={`block ${linkClass}`}>
                  {city}
                </Link>
              </li>
            ))}
          </Column>

          <Column title={t('footer.contacts')}>
            <li className="flex flex-wrap items-center gap-x-5">
              <a
                href={`tel:${PHONE.label.replace(/[^\d+]/g, '')}`}
                onClick={() => trackGoal(GOALS.footerSocialClick, { channel: 'phone' })}
                className={`${linkClass} whitespace-nowrap`}
              >
                {PHONE.label}
              </a>
              <span className="flex items-center gap-3">
                <a
                  href={PHONE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  onClick={() => trackGoal(GOALS.footerSocialClick, { channel: 'whatsapp' })}
                  className="transition-opacity hover:opacity-70"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/footer/whatsapp.svg" alt="" width={24} height={24} />
                </a>
                <a
                  href={TELEGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  onClick={() => trackGoal(GOALS.footerSocialClick, { channel: 'telegram_direct' })}
                  className="transition-opacity hover:opacity-70"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/footer/telegram.svg" alt="" width={24} height={24} />
                </a>
              </span>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} onClick={() => trackGoal(GOALS.footerEmailClick)} className={`block ${linkClass}`}>
                {EMAIL}
              </a>
            </li>
          </Column>
        </div>
      </div>
      <div className="bg-[#141414]">
        <p className="mx-auto w-full max-w-[1920px] px-6 py-3 text-[14px] leading-6 font-medium tracking-[-0.02em] opacity-40 lg:px-20">
          © {new Date().getFullYear()} BangertStudio
        </p>
      </div>
    </footer>
  );
}
