# Bangert Studio — Официальный сайт

Современный веб-сайт цифровой студии разработки мобильных приложений и веб-сервисов **Bangert Studio**.

---

## 🚀 Стек технологий

- **Фреймворк:** [Next.js](https://nextjs.org/) (React 19)
- **Язык:** [TypeScript](https://www.typescriptlang.org/)
- **Стилизация:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Анимации:** [Motion](https://motion.dev/) (Framer Motion)
- **Интернационализация:** [react-i18next](https://react.i18next.com/) (5 языков: `ru`, `en`, `kk`, `es`, `pt`)
- **Иконки:** [Lucide React](https://lucide.dev/)
- **Интеграции:** Telegram Bot API (уведомления о заявках), OpenAI API (AI-калькулятор оценки стоимости)

---

## 🛠️ Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env` в корне проекта (или используйте готовый пример из `.env.example`):

```env
TELEGRAM_BOT_TOKEN=ваш_токен_бота
TELEGRAM_CHAT_ID=ваш_chat_id
OPENAI_API_KEY=ваш_ключ_openai
```

### 3. Запуск сервера разработки

```bash
npm run dev
```

Сайт будет доступен по адресу: [http://localhost:3000](http://localhost:3000)

---

## 📦 Сборка и запуск в продакшене

Для сборки оптимизированного продакшен-бандла:

```bash
npm run build
```

Для запуска продакшен-сервера:

```bash
npm start
```

---

## 🔍 Скрипты и валидация

- `npm run lint` — проверка качества кода через ESLint
- `npm run check:locales` — валидация синхронности ключей переводов (403 ключа на 5 языках)
- `npm run check:links` — проверка сохранения локалей во внутренних ссылках

---

## 📁 Структура проекта

```text
├── src/
│   ├── components/      # UI-компоненты (Header, Hero, Services, CaseStudies, Faq, ContactForm и др.)
│   ├── data/            # Данные кейсов (cases.json) и услуг (services.ts)
│   ├── locales/         # Словари переводов (ru, en, kk, es, pt)
│   ├── store/           # Zustand хранилища состояния
│   ├── globals.css      # Глобальные стили и токены Tailwind v4
│   └── seo.ts           # Базовая конфигурация SEO и OpenGraph
├── pages/
│   ├── index.tsx        # Главная страница лендинга
│   ├── 404.tsx          # Интерактивная страница 404
│   ├── cases/           # Портфолио (/cases) и страницы отдельных кейсов (/cases/[id])
│   ├── services/        # Страницы услуг (/services/[slug])
│   ├── calculator/      # Интерактивный калькулятор стоимости проектов
│   └── _app.tsx         # Корневой лейаут, провайдеры и SEO-метатеги
├── public/
│   └── assets/          # Изображения, векторные иконки, обложки кейсов и 3D-мокапы
└── scripts/             # Скрипты автоматической проверки локалей
```

---

## 📄 Лицензия

Все права защищены © ТОО «BANGERT STUDIO», 2026.
