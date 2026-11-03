'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { POSTS } from '@/src/data/blog';
import { Kicker, More } from './ui/block';
import { cn } from './ui/utils';

/** Карточка-ссылка на статью: обложка сверху, под ней дата, рубрика, заголовок и анонс. */
export function BlogCard({ post, className = '' }: { post: (typeof POSTS)[number]; className?: string }) {
  const { t, i18n } = useTranslation();
  const date = new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(post.date));
  return (
    <Link
      href={`/blog/${post.slug}`}
      // cn (tailwind-merge): className вроде «hidden md:flex» должен перебивать базовый flex.
      className={cn('group flex flex-col gap-5', className)}
    >
      <span className="relative aspect-[16/10] overflow-hidden rounded-[12px] bg-white/5">
        <Image
          src={post.image}
          alt=""
          fill
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </span>
      <span className="flex flex-col gap-2.5">
        <span className="flex flex-wrap gap-x-3 gap-y-1 text-[13px] leading-5 tracking-[-0.02em]">
          <time dateTime={post.date} className="opacity-40">
            {date}
          </time>
          <span className="text-lime">{t(`blog.page.${post.category}`)}</span>
        </span>
        <span className="text-[24px] leading-8 font-semibold tracking-[-0.02em] text-balance transition-colors duration-300 group-hover:text-lime">
          {t(`blog.items.${post.key}.title`)}
        </span>
        <span className="text-[14px] leading-6 tracking-[-0.02em] opacity-60">{t(`blog.items.${post.key}.excerpt`)}</span>
        <More label={t('blog.more')} />
      </span>
    </Link>
  );
}

// Только один ряд: карточки за пределами числа колонок (1 / md:2 / xl:3) прячем.
const ROW = ['flex', 'hidden md:flex', 'hidden xl:flex'];

export function Blog() {
  const { t } = useTranslation();

  return (
    <section id="blog" className="relative bg-ink font-montserrat text-white">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-10 px-6 py-20 lg:px-20">
        <div className="flex flex-col gap-3">
          <Kicker>{t('blog.eyebrow')}</Kicker>
          <h2 className="text-[clamp(2.25rem,3.125vw,3.75rem)] leading-[1.1333] font-semibold tracking-[-0.06em] uppercase">
            <Link href="/blog" className="transition-colors hover:text-lime">
              {t('blog.title')}
            </Link>
          </h2>
        </div>

        <div className="grid gap-[22px] md:grid-cols-2 xl:grid-cols-3">
          {POSTS.map((post, i) => (
            <BlogCard key={post.slug} post={post} className={ROW[i] ?? 'hidden'} />
          ))}
        </div>
      </div>
    </section>
  );
}
