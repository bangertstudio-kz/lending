export const SITE_URL = 'https://bangertstudio.kz';
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const LOCALES = ['ru', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ru';

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

/**
 * Единственное место, где собирается адрес страницы.
 *
 * Форма адреса должна совпадать в canonical, hreflang и sitemap: `/en` и
 * `/en/` для поисковика — разные URL, и рассинхрон дробит сигнал между ними.
 * Договорённость: корень со слешем, остальные пути без.
 */
export function urlFor(locale: string, path: string): string {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return path === '/' ? `${SITE_URL}${prefix}/` : `${SITE_URL}${prefix}${path}`;
}
