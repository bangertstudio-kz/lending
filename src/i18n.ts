import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
};

// Определяем язык из URL
const getLanguageFromPath = (): string | null => {
  const path = window.location.pathname;
  if (path.includes('/ru')) return 'ru';
  if (path.includes('/en')) return 'en';
  return null;
};

// Определяем язык из браузера
const getBrowserLanguage = (): string => {
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'ru' ? 'ru' : 'en';
};

const changeLanguage = (newLang: string) => {
  const basePath = import.meta.env.BASE_URL || '/';

  window.history.replaceState({}, '', basePath + newLang);
}

const initialLanguage = getLanguageFromPath() || getBrowserLanguage();

changeLanguage(initialLanguage);

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
