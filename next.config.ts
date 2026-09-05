import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  i18n: {
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
    // Автоопределение выключено намеренно: иначе Next редиректит корень по
    // заголовку Accept-Language, и посетитель с английской системой попадает
    // не туда, куда вёл переход, а краулер видит нестабильный ответ на "/".
    localeDetection: false,
  },
};

export default nextConfig;
