import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { SeoHead } from '@/app/components/SeoHead';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { Faq } from '@/app/components/Faq';
import { BlogCard } from '@/app/components/Blog';
import { BLOG_CATEGORIES, POSTS, type BlogCategory } from '@/app/data/blog';

type Filter = 'all' | BlogCategory;

// ponytail: в макете после сетки ещё блок-калькулятор — его пока нет на сайте в новом стиле.
export default function BlogPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>('all');
  const visible = POSTS.filter((post) => filter === 'all' || post.category === filter);

  return (
    <>
      <SeoHead page="home" path="/blog" title={`${t('blog.page.title')} — Bangert Studio`} description={t('blog.items.openSource.excerpt')} />
      <div className="min-h-screen bg-ink font-montserrat text-white">
        <Header />

        <main>
          <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-6 pt-[128px] pb-20 lg:px-20">
            <div className="flex flex-col gap-10">
              <nav aria-label="breadcrumb" className="flex items-center gap-3 text-[14px] leading-6 font-medium tracking-[-0.02em]">
                <Link href="/" className="opacity-40 transition-opacity hover:opacity-100">
                  {t('caseStudies.page.home')}
                </Link>
                <span aria-hidden className="opacity-40">
                  /
                </span>
                <span aria-current="page">{t('blog.page.title')}</span>
              </nav>
              <h1 className="text-[clamp(3rem,6.25vw,7.5rem)] leading-none font-medium tracking-[-0.06em]">{t('blog.page.title')}</h1>
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-5">
              {(['all', ...BLOG_CATEGORIES] as Filter[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={filter === key}
                  onClick={() => setFilter(key)}
                  className={`cursor-pointer rounded-[40px] border border-white px-6 py-2 text-[14px] leading-6 font-semibold tracking-[-0.02em] transition-colors ${
                    filter === key ? 'bg-white text-ink' : 'hover:border-lime hover:text-lime'
                  }`}
                >
                  {t(`blog.page.${key}`)}
                </button>
              ))}
            </div>

            <div className="grid gap-[22px] md:grid-cols-2 xl:grid-cols-3">
              {visible.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>

          <Faq />
        </main>

        <Footer />
      </div>
    </>
  );
}
