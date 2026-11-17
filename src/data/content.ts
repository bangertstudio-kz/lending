// Кейсы и статьи блога живут в Supabase (таблицы cases и posts). Читаем только на сервере —
// из getStaticProps/getServerSideProps — и сразу отдаём тексты на языке страницы.
// Чтение открыто RLS-политикой, поэтому хватает публичного (publishable) ключа.

export const BLOG_CATEGORIES = ['dev', 'business'] as const;
export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

/** Через сколько секунд страница с контентом пересобирается после правки в базе. */
export const REVALIDATE = 300;

export interface Case {
  id: string;
  name: string;
  description: string;
  platforms: string[];
  image: string;
  /** Куда ведут кнопки кейса; первая — основная. Ссылка на App Store подписывается «Открыть в App Store». */
  links: string[];
  /** Широкая обложка (≈16:9) для фона шапки страницы кейса; у квадратных постеров её нет. */
  wideCover?: string;
  /** Видео-превью кейса (16:9, без звука, по кругу). */
  video?: string;
}

export interface Post {
  slug: string;
  category: BlogCategory;
  image: string;
  date: string;
  /** Куда ведёт кнопка в конце статьи. */
  link?: string;
  title: string;
  excerpt: string;
  body: string[];
  linkLabel: string;
}

const FALLBACK_LOCALE = 'ru';
const pick = <T,>(byLocale: Record<string, T>, locale = FALLBACK_LOCALE): T => byLocale[locale] ?? byLocale[FALLBACK_LOCALE];

async function select<T>(query: string): Promise<T[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY are not set');
  const res = await fetch(`${url}/rest/v1/${query}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`Supabase ${query}: ${res.status} ${await res.text()}`);
  return res.json();
}

interface CaseRow {
  id: string;
  name: string;
  description: Record<string, string>;
  platforms: string[];
  image: string;
  links: string[];
  wide_cover: string | null;
  video: string | null;
}

export async function getCases(locale?: string): Promise<Case[]> {
  const rows = await select<CaseRow>('cases?select=id,name,description,platforms,image,links,wide_cover,video&order=sort');
  // undefined в props Next не сериализует — пустые поля просто не кладём.
  return rows.map(({ wide_cover, video, description, ...row }) => ({
    ...row,
    description: pick(description, locale),
    ...(wide_cover && { wideCover: wide_cover }),
    ...(video && { video }),
  }));
}

interface PostRow {
  slug: string;
  category: BlogCategory;
  image: string;
  date: string;
  link: string | null;
  content: Record<string, Pick<Post, 'title' | 'excerpt' | 'body' | 'linkLabel'>>;
}

/** Новые статьи — сверху. */
export async function getPosts(locale?: string): Promise<Post[]> {
  const rows = await select<PostRow>('posts?select=slug,category,image,date,link,content&order=date.desc,slug.desc');
  return rows.map(({ content, link, ...row }) => ({ ...row, ...(link && { link }), ...pick(content, locale) }));
}
