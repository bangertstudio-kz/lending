'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

async function sendToTelegram(name: string, contact: string, description?: string, file?: File | null) {
  const body = new FormData();
  body.append('name', name);
  body.append('contact', contact);
  if (description) body.append('description', description);
  if (file) body.append('files', file, file.name);

  const response = await fetch('/api/contact', { method: 'POST', body });
  if (!response.ok) throw new Error('API error');
}

const FIELD_CLASS =
  'w-full border border-hairline bg-surface px-4 py-3.5 text-body text-fg ' +
  'placeholder:text-faint transition-colors focus:border-accent focus:outline-none';

interface ContactInlineFormProps {
  description?: string;
  file?: File | null;
}

export function ContactInlineForm({ description, file }: ContactInlineFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', contact: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await sendToTelegram(formData.name, formData.contact, description, file);
      setStatus('success');
      setFormData({ name: '', contact: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder={t('contact.name')}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className={FIELD_CLASS}
        required
      />
      <textarea
        placeholder={t('contact.howContactWithYou')}
        value={formData.contact}
        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
        className={`${FIELD_CLASS} min-h-[110px] resize-none`}
        required
      />
      {status === 'success' && (
        <p role="status" className="text-small text-accent">
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
        className="w-full bg-fg px-6 py-4 text-small font-medium text-bg transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
      >
        {status === 'loading' ? t('contact.sending') : t('contact.send')}
      </button>
    </form>
  );
}
