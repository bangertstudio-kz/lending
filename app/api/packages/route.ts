import type { DevPackage } from '@/app/store/packagesStore';
import { NextResponse } from 'next/server';

const PUB_API = 'https://pub.dev/api/packages';
const PUB_SEARCH = 'https://pub.dev/api/search';
const PUBLISHER = 'bangertstudio.kz';
const REVALIDATE_SECONDS = 3600;
const MAX_SEARCH_PAGES = 10;

const pubFetch = (url: string) => fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });

/** Every package name published under the studio's pub.dev publisher. */
async function fetchPublishedNames(): Promise<string[]> {
  const names: string[] = [];
  let url: string | null = `${PUB_SEARCH}?q=${encodeURIComponent(`publisher:${PUBLISHER}`)}`;

  for (let page = 0; url && page < MAX_SEARCH_PAGES; page += 1) {
    const res: Response = await pubFetch(url);
    if (!res.ok) break;

    const body = await res.json();
    for (const item of body?.packages ?? []) {
      if (item?.package) names.push(item.package);
    }
    url = body?.next ?? null;
  }

  return names;
}

async function fetchPackage(name: string): Promise<DevPackage | null> {
  try {
    const [infoRes, metricsRes] = await Promise.all([
      pubFetch(`${PUB_API}/${name}`),
      pubFetch(`${PUB_API}/${name}/metrics`),
    ]);
    if (!infoRes.ok || !metricsRes.ok) return null;

    const latest = (await infoRes.json())?.latest ?? {};
    const pubspec = latest.pubspec ?? {};
    const score = (await metricsRes.json())?.score ?? {};
    const tags: string[] = score.tags ?? [];

    return {
      name,
      // Tagged for the plain Dart SDK means it runs without Flutter.
      sdk: tags.includes('sdk:dart') ? 'dart' : 'flutter',
      repo: pubspec.repository ?? pubspec.homepage ?? null,
      description: pubspec.description ?? '',
      version: latest.version ?? '',
      likes: score.likeCount ?? 0,
      points: score.grantedPoints ?? 0,
      maxPoints: score.maxPoints ?? 0,
      downloads30d: score.downloadCount30Days ?? 0,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const names = await fetchPublishedNames().catch(() => [] as string[]);
  const resolved = await Promise.all(names.map(fetchPackage));
  const data = resolved
    .filter((entry): entry is DevPackage => entry !== null)
    .sort((a, b) => b.downloads30d - a.downloads30d);

  // Nothing resolved means pub.dev is unreachable, not that we publish nothing —
  // fail loudly so the UI shows its error state instead of an empty page.
  if (data.length === 0) {
    return NextResponse.json({ error: 'pub.dev unavailable' }, { status: 502 });
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
