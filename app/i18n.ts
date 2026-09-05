import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';

export const DEFAULT_LANGUAGE = 'ru';
export const LANGUAGE_STORAGE_KEY = 'language';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
};

// Язык при инициализации всегда один и тот же на сервере и на клиенте.
// Читать localStorage здесь нельзя: сервер о нём не знает, и первый рендер
// разъезжается с клиентским — React ругается на несовпадение и выбрасывает
// всё поддерево. Сохранённый язык применяется после монтирования,
// см. useStoredLanguage ниже.
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
}

export default i18n;
