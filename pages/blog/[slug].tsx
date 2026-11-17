import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { SeoHead } from '@/src/components/SeoHead';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { Faq } from '@/src/components/Faq';
import { BlogCard } from '@/src/components/Blog';
import { SITE_URL } from '@/src/seo';
import { getPosts, REVALIDATE, type Post } from '@/src/data/content';

// blocking: статья, добавленная в базу после сборки, отрисуется при первом заходе, без пересборки.
export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => ({
  paths: (await getPosts()).flatMap((p) => locales.map((locale) => ({ params: { slug: p.slug }, locale }))),
  fallback: 'blocking',
});

export const getStaticProps: GetStaticProps<{ post: Post; more: Post[] }> = async ({ params, locale }) => {
  const posts = await getPosts(locale);
  const i = posts.findIndex((p) => p.slug === params?.slug);
  if (i < 0) return { notFound: true, revalidate: REVALIDATE };
  // Перелинковка: следующие 3 статьи по кругу, чтобы статья не была тупиком для читателя и краулера.
  const more = [1, 2, 3].map((k) => posts[(i + k) % posts.length]);
  return { props: { post: posts[i], more }, revalidate: REVALIDATE };
};

// Макета статьи нет — собрано в стиле страницы кейса: шапка с хлебными крошками, затем обложка и текст.
export default function BlogPostPage({ post, more }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t, i18n } = useTranslation();
  const date = new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(post.date));

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: post.image,
    author: {
      '@type': 'Person',
      name: 'Alexander Bangert',
      jobTitle: 'Founder & Lead Architect',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bangert Studio',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/og-image.png`,
      },
    },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <>
      <SeoHead
        page="home"
        path={`/blog/${post.slug}`}
        title={`${post.title} — Bangert Studio`}
        description={post.excerpt}
        image={post.image}
        type="article"
        article={{
          publishedTime: post.date,
          author: 'Alexander Bangert',
          tags: [post.category],
        }}
        includeFaq={true}
        breadcrumbs={[
          { name: t('caseStudies.page.home'), path: '/' },
          { name: t('blog.page.title'), path: '/blog' },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
        schema={articleSchema}
      />
      <div className="min-h-screen bg-ink font-montserrat text-white">
        <Header />

        <main>
          <article>
            <header className="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-6 pt-[128px] pb-10 lg:px-20">
              <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-3 text-[14px] leading-6 font-medium tracking-[-0.02em]">
                <Link href="/" className="opacity-40 transition-opacity hover:opacity-100">
                  {t('caseStudies.page.home')}
                </Link>
                <span aria-hidden className="opacity-40">
                  /
                </span>
                <Link href="/blog" className="opacity-40 transition-opacity hover:opacity-100">
                  {t('blog.page.title')}
                </Link>
                <span aria-hidden className="opacity-40">
                  /
                </span>
                <span aria-current="page">{post.title}</span>
              </nav>
              <div className="flex flex-col gap-5">
                <p className="flex flex-wrap gap-3 text-[14px] leading-6 tracking-[-0.02em]">
                  <time dateTime={post.date} className="opacity-40">
                    {date}
                  </time>
                  <span className="text-lime">{t(`blog.page.${post.category}`)}</span>
                </p>
                <h1 className="max-w-[1400px] text-[clamp(2.5rem,5vw,6rem)] leading-none font-medium tracking-[-0.06em]">{post.title}</h1>
                <p className="max-w-[880px] text-[18px] leading-8 font-medium tracking-[-0.02em] opacity-60 lg:text-[20px]">{post.excerpt}</p>
              </div>
            </header>

            <div className="mx-auto grid w-full max-w-[1920px] gap-10 px-6 pt-10 pb-20 lg:grid-cols-2 lg:px-20">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[12px] bg-white/5 lg:self-start">
                <Image src={post.image} alt={post.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-col items-start gap-5">
                {post.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="max-w-[880px] text-[18px] leading-8 font-medium tracking-[-0.02em] opacity-60 lg:text-[20px]">
                    {paragraph}
                  </p>
                ))}
                {post.link && (
                  <Link
                    href={post.link}
                    // Статьи о пакетах ведут на pub.dev — внешнее открываем в новой вкладке.
                    {...(post.link.startsWith('http') && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="mt-5 flex items-center gap-2.5 rounded-[40px] bg-lime px-6 py-3 text-[14px] leading-6 font-semibold tracking-[-0.02em] whitespace-nowrap text-ink transition-opacity hover:opacity-85"
                  >
                    {post.linkLabel}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/hero/arrow-dark.svg" alt="" width={24} height={24} />
                  </Link>
                )}
              </div>
            </div>
          </article>

          <section className="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-6 pb-20 lg:px-20">
            <h2 className="text-[clamp(2rem,4vw,4rem)] leading-none font-medium tracking-[-0.06em]">{t('blog.page.more')}</h2>
            <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
              {more.map((p, k) => (
                <BlogCard key={p.slug} post={p} className={k === 2 ? 'md:hidden xl:flex' : ''} />
              ))}
            </div>
          </section>

          <Faq />
        </main>

        <Footer />
      </div>
    </>
  );
}
