'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { GOALS, trackGoal } from '@/src/analytics';

async function sendToTelegram(
  name: string,
  contact: string,
  description?: string,
  file?: File | null,
) {
  const body = new FormData();
  body.append('name', name);
  body.append('contact', contact);
  if (description) body.append('description', description);
  if (file) body.append('files', file, file.name);

  const response = await fetch('/api/contact', { method: 'POST', body });
  if (!response.ok) throw new Error('API error');
}

const STYLES = {
  form: 'flex h-full flex-col gap-3.5',
  field:
    'w-full rounded-[12px] border border-white/40 bg-transparent px-5 py-4 text-[16px] leading-6 tracking-[-0.02em] text-white ' +
    'placeholder:text-white/40 transition-colors focus:border-lime focus:outline-none',
  textarea: 'min-h-[110px] flex-1 resize-none',
  success: 'text-[14px] leading-6 text-lime font-medium',
  error: 'text-[14px] leading-6 text-red-400 font-medium',
  button:
    'shrink-0 cursor-pointer rounded-[40px] bg-lime px-8 py-3.5 text-[14px] leading-6 font-semibold tracking-[-0.02em] text-ink transition-all hover:bg-lime/90 hover:shadow-[0_4px_24px_rgba(210,249,73,0.3)] disabled:pointer-events-none disabled:opacity-50',
};

interface ContactInlineFormProps {
  description?: string;
  file?: File | null;
  /** Откуда отправлена заявка: форма живёт и на главной, и в калькуляторе. */
  place?: 'home' | 'calculator';
}

export function ContactInlineForm({ description: attachedDescription, file, place = 'home' }: ContactInlineFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    taskDescription: '',
    agreed: true,
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreed) return;

    setStatus('loading');
    trackGoal(GOALS.contactFormSubmit, {
      place,
      withBrief: Boolean(formData.taskDescription || attachedDescription),
      withFile: Boolean(file),
    });

    const combinedDescription = [attachedDescription, formData.taskDescription].filter(Boolean).join('\n\n');

    try {
      await sendToTelegram(formData.name || t('contact.name'), formData.phone, combinedDescription, file);
      setStatus('success');
      setFormData({ name: '', phone: '', taskDescription: '', agreed: true });
      trackGoal(GOALS.contactFormSuccess, { place });
    } catch {
      setStatus('error');
      trackGoal(GOALS.contactFormError, { place });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={STYLES.form}>
      {/* 1-я строка: [Имя] [Номер телефона*] */}
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          placeholder={t('contact.name')}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={STYLES.field}
          autoComplete="name"
        />
        <input
          type="tel"
          placeholder={t('contact.phone')}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className={STYLES.field}
          required
          autoComplete="tel"
        />
      </div>

      {/* 2-я строка под этим: [Описание задачи] */}
      <textarea
        placeholder={t('contact.taskDescription')}
        value={formData.taskDescription}
        onChange={(e) => setFormData({ ...formData, taskDescription: e.target.value })}
        className={`${STYLES.field} ${STYLES.textarea}`}
        rows={4}
      />

      {status === 'success' && (
        <p role="status" className={STYLES.success}>
          {t('contact.sent')}
        </p>
      )}
      {status === 'error' && (
        <p role="alert" className={STYLES.error}>
          {t('contact.sendError')}
        </p>
      )}

      {/* 3-я строка под этим: [  ] Я согласен с ......      Отправить */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-1">
        <label className="group flex cursor-pointer items-center gap-3 select-none">
          <span
            className={`relative flex size-5 shrink-0 items-center justify-center rounded-[6px] border transition-all ${
              formData.agreed
                ? 'border-lime bg-lime'
                : 'border-white/40 bg-white/[0.04] group-hover:border-white/70'
            }`}
          >
            <input
              type="checkbox"
              checked={formData.agreed}
              onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
              className="sr-only"
              required
            />
            {formData.agreed && <Check className="size-3.5 text-ink stroke-[3]" />}
          </span>
          <span className="text-[13px] leading-5 text-white/60 transition-colors group-hover:text-white/80">
            {t('contact.consent')}
          </span>
        </label>

        <button
          type="submit"
          disabled={status === 'loading' || !formData.agreed}
          className={STYLES.button}
        >
          {status === 'loading' ? t('contact.sending') : t('contact.send')}
        </button>
      </div>
    </form>
  );
}
