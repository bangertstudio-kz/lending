// Статьи блога. Тексты — в локалях (blog.items.<key>), здесь только то, что не переводится.
// Новые статьи — сверху. Первые две пересказывают посты из t.me/bangertstudio.
export const BLOG_CATEGORIES = ['dev', 'business'] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const POSTS: {
  slug: string;
  key: string;
  category: BlogCategory;
  image: string;
  date: string;
  /** Куда ведёт кнопка в конце статьи (текст — blog.items.<key>.linkLabel). */
  link?: string;
}[] = [
  { slug: 'open-source', key: 'openSource', category: 'dev', image: '/assets/blog/open-source.jpg', date: '2026-09-05', link: '/packages' },
  { slug: 'ai-project-estimate', key: 'aiEstimate', category: 'business', image: '/assets/process/devices.png', date: '2026-09-05', link: '/calculator' },
];
