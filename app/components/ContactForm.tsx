'use client';

import { useTranslation } from 'react-i18next';
import { Section } from './ui/section';
import { ContactInlineForm } from './ContactInlineForm';
import { ContactLinks } from './ContactLinks';

export function ContactForm() {
  const { t } = useTranslation();

  return (
    <Section id="contact" tone="bg">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-start gap-20 md:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 font-display font-semibold text-h2 text-fg">{t('contact.title')}</h2>
              <p className="mb-8 text-body text-muted">{t('contact.subtitle')}</p>
            </div>
            <ContactInlineForm />
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="mb-4 font-display font-semibold text-h2 text-fg">{t('contact.getInTouch')}</h2>
              <p className="mb-8 text-body text-muted">{t('contact.reachOut')}</p>
            </div>
            <ContactLinks />
          </div>
        </div>
      </div>
    </Section>
  );
}
