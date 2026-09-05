import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LOCALE, LOCALES, OG_IMAGE, OG_LOCALES, isLocale, urlFor } from '@/app/seo';

export function SeoHead({ page, path }: { page: string; path: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = isLocale(router.locale) ? router.locale : DEFAULT_LOCALE;

  const title = t(`meta.${page}.title`);
  const description = t(`meta.${page}.description`);
  const canonical = urlFor(locale, path);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Языковые версии одной и той же страницы. Без этого английская
          версия конкурирует с русской вместо того, чтобы дополнять её. */}
      {LOCALES.map((alt) => (
        <link key={alt} rel="alternate" hrefLang={alt} href={urlFor(alt, path)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={urlFor(DEFAULT_LOCALE, path)} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:locale" content={OG_LOCALES[locale]} />
      <meta property="og:site_name" content="Bangert Studio" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Head>
  );
}
