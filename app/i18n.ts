import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
};

if (!i18n.isInitialized) {
  const savedLanguage =
    typeof window !== 'undefined'
      ? localStorage.getItem('language') || 'ru'
      : 'ru';

  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
}

export default i18n;
