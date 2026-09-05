import { useEffect } from 'react';
import i18n, { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY } from './i18n';

/**
 * Применяет сохранённый язык уже после гидратации. Смена языка здесь —
 * обычное обновление состояния, а не расхождение первого рендера,
 * поэтому предупреждения о несовпадении не возникает.
 */
export function useStoredLanguage() {
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch {
      // приватный режим или заблокированное хранилище — молча остаёмся на языке по умолчанию
    }

    const next = saved ?? DEFAULT_LANGUAGE;
    if (next !== i18n.language && next in (i18n.options.resources ?? {})) {
      i18n.changeLanguage(next);
    }
  }, []);
}
