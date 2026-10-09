'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GOALS, trackGoal } from '@/app/analytics';

async function sendToTelegram(name: string, contact: string, description?: string, file?: File | null) {
  const body = new FormData();
  body.append('name', name);
  body.append('contact', contact);
  if (description) body.append('description', description);
  if (file) body.append('files', file, file.name);

  const response = await fetch('/api/contact', { method: 'POST', body });
  if (!response.ok) throw new Error('API error');
}

const STYLES = {
  // Форма тянется на высоту соседней колонки (на главной), лишнее место забирает поле «Как связаться».
  form: 'flex h-full flex-col gap-3',
  field:
    'w-full rounded-[12px] border border-white/40 bg-transparent px-5 py-4 text-[16px] leading-6 tracking-[-0.02em] text-white ' +
    'placeholder:text-white/40 transition-colors focus:border-lime focus:outline-none',
  textarea: 'min-h-[110px] flex-1 resize-none',
  success: 'text-[14px] leading-6 text-lime',
  button:
    'w-full cursor-pointer rounded-[40px] bg-lime px-6 py-3 text-[14px] leading-6 font-semibold tracking-[-0.02em] text-ink transition-opacity hover:opacity-85 disabled:pointer-events-none disabled:opacity-50',
};

interface ContactInlineFormProps {
  description?: string;
  file?: File | null;
  /** Откуда отправлена заявка: форма живёт и на главной, и в калькуляторе. */
  place?: 'home' | 'calculator';
}

export function ContactInlineForm({ description, file, place = 'home' }: ContactInlineFormProps) {
  const styles = STYLES;
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', contact: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    trackGoal(GOALS.contactFormSubmit, { place, withBrief: Boolean(description), withFile: Boolean(file) });
    try {
      await sendToTelegram(formData.name, formData.contact, description, file);
      setStatus('success');
      setFormData({ name: '', contact: '' });
      trackGoal(GOALS.contactFormSuccess, { place });
    } catch {
      setStatus('error');
      trackGoal(GOALS.contactFormError, { place });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder={t('contact.name')}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className={styles.field}
        required
      />
      <textarea
        placeholder={t('contact.howContactWithYou')}
        value={formData.contact}
        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
        className={`${styles.field} ${styles.textarea}`}
        required
      />
      {status === 'success' && (
        <p role="status" className={styles.success}>
          {t('contact.sent')}
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className="text-small text-red-400">
          {t('contact.sendError')}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className={styles.button}
      >
        {status === 'loading' ? t('contact.sending') : t('contact.send')}
      </button>
    </form>
  );
}
