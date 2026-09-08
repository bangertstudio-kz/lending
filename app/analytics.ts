/**
 * Единая точка отправки событий в Яндекс.Метрику.
 *
 * Компоненты не зовут window.ym напрямую: счётчик грузится асинхронно
 * (strategy="afterInteractive"), на сервере его нет вовсе, а имена целей
 * должны совпадать с теми, что заведены в интерфейсе Метрики. Поэтому все
 * идентификаторы живут здесь одним списком — переименование цели не
 * превращается в поиск строки по всему проекту.
 */

export const METRIKA_ID = 105997418;

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
  }
}

export const GOALS = {
  // Навигация
  navClick: 'nav_click',
  mobileMenuOpen: 'mobile_menu_open',
  logoClick: 'logo_click',
  langChange: 'lang_change',
  mobileScrollNext: 'mobile_scroll_next',

  // Главная
  heroCtaConsultation: 'hero_cta_consultation',
  heroCtaWork: 'hero_cta_work',
  caseOpen: 'case_open',
  casesViewAll: 'cases_view_all',
  devSolutionsCta: 'dev_solutions_cta',

  // Калькулятор
  calculatorCtaSubmit: 'calculator_cta_submit',
  calculatorAnalyzeStart: 'calculator_analyze_start',
  calculatorAnalyzeSuccess: 'calculator_analyze_success',
  calculatorAnalyzeError: 'calculator_analyze_error',
  calculatorStageSelect: 'calculator_stage_select',
  calculatorFeatureToggle: 'calculator_feature_toggle',
  calculatorFeatureCustomAdd: 'calculator_feature_custom_add',
  calculatorFileAttach: 'calculator_file_attach',

  // Заявка и контакты
  contactFormSubmit: 'contact_form_submit',
  contactFormSuccess: 'contact_form_success',
  contactFormError: 'contact_form_error',
  contactLinkClick: 'contact_link_click',
  footerEmailClick: 'footer_email_click',
  footerSocialClick: 'footer_social_click',

  // Пакеты
  packagePubClick: 'package_pub_click',
  packageGithubClick: 'package_github_click',
  packagesAllClick: 'packages_all_click',
} as const;

export type Goal = (typeof GOALS)[keyof typeof GOALS];

/** Параметры визита: Метрика принимает любой сериализуемый объект. */
export type GoalParams = Record<string, string | number | boolean>;

function send(method: string, ...args: unknown[]) {
  if (typeof window === 'undefined') return;
  // ym определён стабом ещё до загрузки tag.js и копит вызовы в очередь,
  // так что ранние клики не теряются. Опциональный вызов — на случай
  // блокировщиков, которые вырезают счётчик целиком.
  window.ym?.(METRIKA_ID, method, ...args);
}

/** Достижение цели. Пустые параметры не шлём — в отчётах они лишний шум. */
export function trackGoal(goal: Goal, params?: GoalParams) {
  if (params && Object.keys(params).length > 0) {
    send('reachGoal', goal, params);
    return;
  }
  send('reachGoal', goal);
}

/**
 * Просмотр страницы при клиентском переходе. Счётчик сам считает только
 * первую загрузку, а тут SPA: без ручного hit весь маршрут после первого
 * клика сваливался бы в один просмотр.
 */
export function trackPageView(url: string) {
  send('hit', url);
}
