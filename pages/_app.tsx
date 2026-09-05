import Head from 'next/head';
import Script from 'next/script';
import type { AppProps } from 'next/app';
import { I18nextProvider } from 'react-i18next';
import i18n from '../app/i18n';
import { display, geistMono, geistSans } from '../app/fonts';
import '../app/globals.css';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://bangertstudio.kz/#organization',
      name: 'Bangert Studio',
      url: 'https://bangertstudio.kz',
      logo: 'https://bangertstudio.kz/og-image.png',
      description: 'Разработка мобильных и веб-приложений под ключ для стартапов и бизнеса.',
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://bangertstudio.kz/#website',
      url: 'https://bangertstudio.kz',
      name: 'Bangert Studio',
      publisher: { '@id': 'https://bangertstudio.kz/#organization' },
    },
  ],
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <Head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="theme-color" content="#0A0908" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=105997418', 'ym');

          ym(105997418, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:'dataLayer', accurateTrackBounce:true, trackLinks:true});
        `}
      </Script>
      {/* Переменные шрифтов обязаны жить на :root. В @theme объявлено
          --font-display: var(--font-display-family), и var() внутри кастомного
          свойства подставляется на том элементе, где свойство объявлено —
          то есть на :root. С переменными на внутреннем div вся декларация
          становилась невалидной и заголовки молча падали в Geist. */}
      <style jsx global>{`
        :root {
          --font-geist-sans: ${geistSans.style.fontFamily};
          --font-geist-mono: ${geistMono.style.fontFamily};
          --font-display-family: ${display.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </I18nextProvider>
  );
}
