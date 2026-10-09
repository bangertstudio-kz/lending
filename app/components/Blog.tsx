'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { POSTS } from '@/app/data/blog';
import { Kicker, More } from './ui/block';
import { cn } from './ui/utils';

/** Карточка-ссылка на статью: обложка на весь фон, затемнение снизу, текст прижат к низу. */
export function BlogCard({ post, className = '' }: { post: (typeof POSTS)[number]; className?: string }) {
  const { t } = useTranslation();
  return (
    <Link
      href={`/blog/${post.slug}`}
      // cn (tailwind-merge): className вроде «hidden md:flex» должен перебивать базовый flex.
      className={cn('group relative isolate flex h-[400px] flex-col justify-end gap-2.5 overflow-hidden rounded-[12px] p-6 lg:p-10', className)}
    >
      <Image
        src={post.image}
        alt=""
        fill
        sizes="(min-width: 1280px) 30vw, (min-width: 768px) 50vw, 100vw"
        className="-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/0 to-black/80 to-[83.654%]" />
      <span className="flex flex-col gap-2">
        <span className="text-[24px] leading-8 font-semibold tracking-[-0.02em]">{t(`blog.items.${post.key}.title`)}</span>
        <span className="text-[14px] leading-6 tracking-[-0.02em]">{t(`blog.items.${post.key}.excerpt`)}</span>
      </span>
      <More label={t('blog.more')} />
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
