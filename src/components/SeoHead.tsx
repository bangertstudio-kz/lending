import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { DEFAULT_LOCALE, LOCALES, OG_IMAGE, OG_LOCALES, isLocale, urlFor } from '@/src/seo';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface SeoHeadProps {
  page: string;
  path: string;
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
  breadcrumbs?: BreadcrumbItem[];
  includeFaq?: boolean;
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

export function SeoHead({
  page,
  path,
  title: titleOverride,
  description: descriptionOverride,
  image = OG_IMAGE,
  type = 'website',
  article,
  breadcrumbs,
  includeFaq = false,
  schema,
}: SeoHeadProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const locale = isLocale(router.locale) ? router.locale : DEFAULT_LOCALE;

  const title = titleOverride ?? t(`meta.${page}.title`);
  const description = descriptionOverride ?? t(`meta.${page}.description`);
  const canonical = urlFor(locale, path);

  // Schema: BreadcrumbList
  const breadcrumbSchema =
    breadcrumbs && breadcrumbs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((crumb, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: crumb.name,
            item: crumb.path.startsWith('http') ? crumb.path : urlFor(locale, crumb.path),
          })),
        }
      : null;

  // Schema: FAQPage
  let faqSchema: Record<string, unknown> | null = null;
  if (includeFaq) {
    try {
      const items = t('faq.items', { returnObjects: true }) as { q: string; a: string }[];
      if (Array.isArray(items) && items.length > 0) {
        faqSchema = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.a,
            },
          })),
        };
      }
    } catch {
      // ignore if faq not available
    }
  }

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Роботы и индексация */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Локальные гео-мета-теги Казахстана (GEO Local SEO) */}
      <meta name="geo.region" content="KZ" />
      <meta name="geo.placename" content="Almaty, Kazakhstan" />
      <meta name="geo.position" content="43.238949;76.889709" />
      <meta name="ICBM" content="43.238949, 76.889709" />

      {/* Машиночитаемый контекст для LLM-агентов */}
      <link rel="author" href="/llms.txt" />

      {/* Языковые версии (hreflang) */}
      {LOCALES.map((alt) => (
        <link key={alt} rel="alternate" hrefLang={alt} href={urlFor(alt, path)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={urlFor(DEFAULT_LOCALE, path)} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Bangert Studio" />
      <meta property="og:locale" content={OG_LOCALES[locale]} />
      <meta property="og:site_name" content="Bangert Studio" />

      {type === 'article' && article && (
        <>
          {article.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
          {article.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.tags?.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Schemas */}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </Head>
  );
}
