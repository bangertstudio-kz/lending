'use client';

import { useTranslation } from 'react-i18next';
import { Kicker, Lead } from './ui/block';
import { ContactInlineForm } from './ContactInlineForm';
import { ContactLinks } from './ContactLinks';

export function ContactForm() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="relative bg-ink font-montserrat text-white">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-6 py-20 lg:px-20">
        <div className="flex flex-col gap-3">
          <Kicker>{t('contact.eyebrow')}</Kicker>
          <h2 className="text-[clamp(2.25rem,3.125vw,3.75rem)] leading-[1.1333] font-semibold tracking-[-0.06em] uppercase">
            {t('contact.title')}
          </h2>
          <Lead className="gap-2.5">{t('contact.subtitle')}</Lead>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <ContactInlineForm />

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <h3 className="text-[24px] leading-8 font-semibold tracking-[-0.02em]">{t('contact.getInTouch')}</h3>
              <p className="text-[18px] leading-7 tracking-[-0.02em] opacity-60 lg:text-[20px]">{t('contact.reachOut')}</p>
            </div>
            <ContactLinks />
          </div>
        </div>
      </div>
    </section>
  );
}
