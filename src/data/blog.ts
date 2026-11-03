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
  { slug: 'ai-in-mobile-apps', key: 'aiMobile', category: 'business', image: '/assets/services/uiux.png', date: '2026-11-03', link: '/calculator' },
  { slug: 'flutter-on-iphone-duo', key: 'flutterDuo', category: 'dev', image: '/assets/services/dev.png', date: '2026-10-28', link: '/services/mobile-development' },
  { slug: 'iphone-duo', key: 'iphoneDuo', category: 'dev', image: '/assets/services/mobile.png', date: '2026-10-23', link: '/services/mobile-development' },
  { slug: 'graphview-plus', key: 'pkgGraphviewPlus', category: 'dev', image: '/assets/blog/packages/graphview_plus.jpg', date: '2026-10-21', link: 'https://pub.dev/packages/graphview_plus' },
  { slug: 'dependency-graph', key: 'pkgDependencyGraph', category: 'dev', image: '/assets/blog/packages/dependency_graph.jpg', date: '2026-10-19', link: 'https://pub.dev/packages/dependency_graph' },
  { slug: 'depend', key: 'pkgDepend', category: 'dev', image: '/assets/blog/packages/depend.jpg', date: '2026-10-17', link: 'https://pub.dev/packages/depend' },
  { slug: 'herdsman', key: 'pkgHerdsman', category: 'dev', image: '/assets/blog/packages/herdsman.jpg', date: '2026-10-15', link: 'https://pub.dev/packages/herdsman' },
  { slug: 'swagger-fixtures', key: 'pkgSwaggerFixtures', category: 'dev', image: '/assets/blog/packages/swagger_fixtures.jpg', date: '2026-10-13', link: 'https://pub.dev/packages/swagger_fixtures' },
  { slug: 'responsive-breakpoints', key: 'pkgResponsiveBreakpoints', category: 'dev', image: '/assets/blog/packages/responsive_breakpoints.jpg', date: '2026-10-11', link: 'https://pub.dev/packages/responsive_breakpoints' },
  { slug: 'fform', key: 'pkgFform', category: 'dev', image: '/assets/blog/packages/fform.jpg', date: '2026-10-09', link: 'https://pub.dev/packages/fform' },
  { slug: 'background-geo-tracker', key: 'pkgBackgroundGeoTracker', category: 'dev', image: '/assets/blog/packages/background_geo_tracker.jpg', date: '2026-10-07', link: 'https://pub.dev/packages/background_geo_tracker' },
  { slug: 'metro-map', key: 'pkgMetroMap', category: 'dev', image: '/assets/blog/packages/metro_map.jpg', date: '2026-10-05', link: 'https://pub.dev/packages/metro_map' },
  { slug: 'apollon', key: 'pkgApollon', category: 'dev', image: '/assets/blog/packages/apollon.jpg', date: '2026-10-03', link: 'https://pub.dev/packages/apollon' },
  { slug: 'markup-analyzer', key: 'pkgMarkupAnalyzer', category: 'dev', image: '/assets/blog/packages/markup_analyzer.jpg', date: '2026-10-01', link: 'https://pub.dev/packages/markup_analyzer' },
  { slug: 'safe-route', key: 'pkgSafeRoute', category: 'dev', image: '/assets/blog/packages/safe_route.jpg', date: '2026-09-29', link: 'https://pub.dev/packages/safe_route' },
  { slug: 'fform-validator', key: 'pkgFformValidator', category: 'dev', image: '/assets/blog/packages/fform_validator.jpg', date: '2026-09-27', link: 'https://pub.dev/packages/fform_validator' },
  { slug: 'enum-picker', key: 'pkgEnumPicker', category: 'dev', image: '/assets/blog/packages/enum_picker.jpg', date: '2026-09-25', link: 'https://pub.dev/packages/enum_picker' },
  { slug: 'map-route', key: 'pkgMapRoute', category: 'dev', image: '/assets/blog/packages/map_route.jpg', date: '2026-09-23', link: 'https://pub.dev/packages/map_route' },
  { slug: 'pike', key: 'pkgPike', category: 'dev', image: '/assets/blog/packages/pike.jpg', date: '2026-09-21', link: 'https://pub.dev/packages/pike' },
  { slug: 'open-source', key: 'openSource', category: 'dev', image: '/assets/blog/open-source.jpg', date: '2026-09-05', link: '/packages' },
  { slug: 'ai-project-estimate', key: 'aiEstimate', category: 'business', image: '/assets/process/devices.png', date: '2026-09-05', link: '/calculator' },
];
