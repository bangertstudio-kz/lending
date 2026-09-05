import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  i18n: {
    locales: ['ru', 'en', 'kk', 'pt', 'es'],
    defaultLocale: 'ru',
    // Автоопределение выключено намеренно: иначе Next редиректит корень по
    // заголовку Accept-Language, и посетитель попадает не туда, куда вёл
    // переход, а краулер видит нестабильный ответ на "/".
    localeDetection: false,
  },
};

export default nextConfig;
