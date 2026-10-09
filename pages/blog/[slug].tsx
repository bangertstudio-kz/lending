import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { SeoHead } from '@/app/components/SeoHead';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { Faq } from '@/app/components/Faq';
import { SITE_URL } from '@/app/seo';
import { POSTS } from '@/app/data/blog';

type Post = (typeof POSTS)[number];

export const getStaticPaths: GetStaticPaths = ({ locales = [] }) => ({
  paths: POSTS.flatMap((p) => locales.map((locale) => ({ params: { slug: p.slug }, locale }))),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ post: Post }> = ({ params }) => {
  const post = POSTS.find((p) => p.slug === params?.slug);
  return post ? { props: { post } } : { notFound: true };
};

// Макета статьи нет — собрано в стиле страницы кейса: шапка с хлебными крошками, затем обложка и текст.
export default function BlogPostPage({ post }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t, i18n } = useTranslation();
  const text = (field: string) => t(`blog.items.${post.key}.${field}`);
  const body = t(`blog.items.${post.key}.body`, { returnObjects: true }) as string[];
  const date = new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(post.date));

  return (
    <>
      <SeoHead
        page="home"
        path={`/blog/${post.slug}`}
        title={`${text('title')} — Bangert Studio`}
        description={text('excerpt')}
        image={`${SITE_URL}${post.image}`}
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
                <span aria-current="page">{text('title')}</span>
              </nav>
              <div className="flex flex-col gap-5">
                <p className="flex flex-wrap gap-3 text-[14px] leading-6 tracking-[-0.02em]">
                  <time dateTime={post.date} className="opacity-40">
                    {date}
                  </time>
                  <span className="text-lime">{t(`blog.page.${post.category}`)}</span>
                </p>
                <h1 className="max-w-[1400px] text-[clamp(2.5rem,5vw,6rem)] leading-none font-medium tracking-[-0.06em]">{text('title')}</h1>
                <p className="max-w-[880px] text-[18px] leading-8 font-medium tracking-[-0.02em] opacity-60 lg:text-[20px]">{text('excerpt')}</p>
              </div>
            </header>

            <div className="mx-auto grid w-full max-w-[1920px] gap-10 px-6 py-10 lg:grid-cols-2 lg:px-20">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[12px] bg-white/5 lg:self-start">
                <Image src={post.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-col items-start gap-5">
                {body.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="max-w-[880px] text-[18px] leading-8 font-medium tracking-[-0.02em] opacity-60 lg:text-[20px]">
                    {paragraph}
                  </p>
                ))}
                {post.link && (
                  <Link
                    href={post.link}
                    className="mt-5 flex items-center gap-2.5 rounded-[40px] bg-lime px-6 py-3 text-[14px] leading-6 font-semibold tracking-[-0.02em] whitespace-nowrap text-ink transition-opacity hover:opacity-85"
                  >
                    {text('linkLabel')}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/hero/arrow-dark.svg" alt="" width={24} height={24} />
                  </Link>
                )}
              </div>
            </div>
          </article>

          <Faq />
        </main>

        <Footer />
      </div>
    </>
  );
}
