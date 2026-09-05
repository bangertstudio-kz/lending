import packages from '@/app/data/packages.json';
import type { DevPackage } from '@/app/store/packagesStore';
import { NextResponse } from 'next/server';

const PUB_API = 'https://pub.dev/api/packages';
const REVALIDATE_SECONDS = 3600;

/** Merges the curated entry with live numbers from pub.dev; falls back to the curated ones. */
async function withLiveMetrics(entry: DevPackage): Promise<DevPackage> {
  try {
    const [infoRes, metricsRes] = await Promise.all([
      fetch(`${PUB_API}/${entry.name}`, { next: { revalidate: REVALIDATE_SECONDS } }),
      fetch(`${PUB_API}/${entry.name}/metrics`, { next: { revalidate: REVALIDATE_SECONDS } }),
    ]);
    if (!infoRes.ok || !metricsRes.ok) return entry;

    const info = await infoRes.json();
    const score = (await metricsRes.json())?.score ?? {};

    return {
      ...entry,
      version: info?.latest?.version ?? entry.version,
      likes: score.likeCount ?? entry.likes,
      points: score.grantedPoints ?? entry.points,
      maxPoints: score.maxPoints ?? entry.maxPoints,
      downloads30d: score.downloadCount30Days ?? entry.downloads30d,
    };
  } catch {
    return entry;
  }
}

export async function GET() {
  const data = await Promise.all((packages as DevPackage[]).map(withLiveMetrics));

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
