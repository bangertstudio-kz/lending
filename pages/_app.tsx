import Head from 'next/head';
import type { AppProps } from 'next/app';
import { I18nextProvider } from 'react-i18next';
import i18n from '../app/i18n';
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <Component {...pageProps} />
    </I18nextProvider>
  );
}
