# События Яндекс.Метрики

Счётчик: **105997418**. Все идентификаторы целей объявлены в
[`app/analytics.ts`](../app/analytics.ts) — константа `GOALS`. Компоненты не
обращаются к `window.ym` напрямую, а зовут `trackGoal(GOALS.x, params)`.

Чтобы цель попала в отчёты, её нужно завести в интерфейсе Метрики:
**Настройка → Цели → JavaScript-событие**, идентификатор — из колонки «Цель».

## Просмотры страниц

Переходы между страницами клиентские, поэтому в `pages/_app.tsx` на
`routeChangeComplete` шлётся `ym(id, 'hit', url)`. Без этого весь визит
засчитывался бы как один просмотр первой страницы.

## Цели

| Цель | Где | Параметры |
| --- | --- | --- |
| `nav_click` | пункт меню в шапке | `item`, `place` (desktop/mobile), `external` |
| `mobile_menu_open` | открытие бургер-меню | — |
| `logo_click` | логотип | — |
| `lang_change` | смена языка | `from`, `to` |
| `mobile_scroll_next` | кнопка «вниз» на мобильном | `to` (id секции) |
| `hero_cta_consultation` | «Консультация» на первом экране | — |
| `hero_cta_work` | «Работы» на первом экране | — |
| `case_open` | клик по кейсу | `name`, `platform`, `place` (home/cases) |
| `cases_view_all` | «Все работы» с главной | — |
| `dev_solutions_cta` | CTA блока решений → `/packages` | — |
| `calculator_cta_submit` | отправка брифа с главной в калькулятор | `withBrief`, `briefLength` |
| `calculator_analyze_start` | запуск AI-анализа | `source` (button/brief), `briefLength`, `withFile` |
| `calculator_analyze_success` | анализ вернул оценку | `stage`, `features`, `minCost`, `maxCost` |
| `calculator_analyze_error` | анализ упал | `reason` (response/network), `status` |
| `calculator_stage_select` | выбор стадии проекта | `stage` |
| `calculator_feature_toggle` | включение/выключение функции | `feature`, `selected` |
| `calculator_feature_custom_add` | своя функция | `feature` |
| `calculator_file_attach` | прикреплён файл | `size`, `type` |
| `contact_form_submit` | нажата «Отправить» | `place` (home/calculator), `withBrief`, `withFile` |
| `contact_form_success` | заявка ушла в Telegram | `place` |
| `contact_form_error` | заявка не ушла | `place` |
| `contact_link_click` | Telegram / WhatsApp / LinkedIn в блоке контактов | `channel`, `place` |
| `footer_email_click` | почта в подвале | — |
| `footer_social_click` | соцсети в подвале | `channel` |
| `package_pub_click` | пакет на pub.dev | `package` |
| `package_github_click` | репозиторий пакета | `package` |
| `packages_all_click` | «Все пакеты на pub.dev» | — |

## Как добавить новое событие

1. Добавить идентификатор в `GOALS` (`app/analytics.ts`).
2. Позвать `trackGoal(GOALS.новое, { ... })` в обработчике.
3. Завести цель с тем же идентификатором в интерфейсе Метрики.
