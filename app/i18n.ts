import { createInstance, type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';
import kk from './locales/kk.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';

import { DEFAULT_LOCALE, isLocale, type Locale } from './seo';

export { DEFAULT_LOCALE, isLocale, LOCALES, type Locale } from './seo';

const resources = {
  ru: { translation: ru },
  en: { translation: en },
  kk: { translation: kk },
  pt: { translation: pt },
  es: { translation: es },
};

function build(locale: Locale): I18nInstance {
  const instance = createInstance();
  instance.use(initReactI18next).init({
    resources,
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
  return instance;
}

let clientInstance: I18nInstance | null = null;

/**
 * Язык определяется адресом страницы, а не хранилищем браузера.
 *
 * На сервере каждый запрос получает собственный экземпляр: общий синглтон
 * протекал бы между параллельными запросами с разными языками — один
 * запрос переключил бы язык, а соседний отрендерился бы на чужом.
 */
export function getI18n(locale: Locale): I18nInstance {
  if (typeof window === 'undefined') return build(locale);

  if (!clientInstance) {
    clientInstance = build(locale);
  } else if (clientInstance.language !== locale) {
    clientInstance.changeLanguage(locale);
  }
  return clientInstance;
}

/**
 * Текущий язык для кода вне React (сторы, обработчики).
 * На сервере экземпляр создаётся под запрос, поэтому там возвращаем язык
 * по умолчанию — вызывающий код работает в браузере.
 */
export function getCurrentLanguage(): Locale {
  if (typeof window === 'undefined' || !clientInstance) return DEFAULT_LOCALE;
  return isLocale(clientInstance.language) ? clientInstance.language : DEFAULT_LOCALE;
}
