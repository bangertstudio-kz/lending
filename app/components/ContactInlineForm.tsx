'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useTranslation } from 'react-i18next';

async function sendToTelegram(name: string, contact: string, description?: string) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, contact, description: description ?? '' }),
  });
  if (!response.ok) throw new Error('API error');
}

interface ContactInlineFormProps {
  description?: string;
}

export function ContactInlineForm({ description }: ContactInlineFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', contact: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await sendToTelegram(formData.name, formData.contact, description);
      setStatus('success');
      setFormData({ name: '', contact: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        type="text"
        placeholder={t('contact.name')}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30"
        required
      />
      <Textarea
        placeholder={t('contact.howContactWithYou')}
        value={formData.contact}
        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
        className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-white/30 min-h-[100px]"
        required
      />
      {status === 'success' && (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Заявка отправлена!</span>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Ошибка отправки. Попробуйте ещё раз.</span>
        </div>
      )}
      <Button
        type="submit"
        size="lg"
        disabled={status === 'loading'}
        className="w-full bg-white text-black hover:bg-white/90 disabled:opacity-60"
      >
        {status === 'loading' ? 'Отправка...' : t('contact.send')}
        <Send className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}
