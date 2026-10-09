// Услуги сайта: ключ — для текстов в локалях (services.<key>), slug — адрес страницы /services/<slug>.
// SERVICES — четыре карточки главной и футер, как в макете.
export const SERVICES = [
  { key: 'mobile', slug: 'mobile-development', image: '/assets/services/mobile.png', footer: 'Mobile' },
  { key: 'web', slug: 'web-development', image: '/assets/hero/devices.png', footer: 'Web' },
  { key: 'uiux', slug: 'ux-ui-design', image: '/assets/process/devices.png', footer: 'UX/UI' },
  { key: 'dev', slug: 'development', image: '/assets/hero/bg.png', footer: 'Development' },
] as const;

// Все страницы услуг: в выпадающем меню шапки есть ещё аудит, на главной его карточки нет.
export const ALL_SERVICES = [
  ...SERVICES,
  { key: 'audit', slug: 'system-audit', image: '/assets/hero/bg.png', footer: 'Audit' },
] as const;

export type Service = (typeof ALL_SERVICES)[number];
