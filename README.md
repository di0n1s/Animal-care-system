# Animal Care System

Вебдодаток для обліку бездомних тварин студмістечка та роботи з волонтерськими заявками на догляд (перегляд каталогу, пошук і фільтрація, створення, редагування та видалення заявок).

Стек: React 19, React Router, Vite, Firebase Cloud Firestore, Vitest + React Testing Library.

## Вимоги до середовища

Перевірено на Windows із такими версіями:
- Node.js v24.20.0
- npm 11.19.0
- Git 2.49.0
- Docker 29.8.0 / Docker Compose v5.5.1

## Запуск проєкту

Встановити залежності та запустити dev-сервер:

```bash
npm install
npm run dev
```

Додаток відкриється на `http://localhost:5173`.

Інші корисні команди:
- `npm run test:run` - одноразовий прогін усіх тестів
- `npm run test` - тести у watch-режимі
- `npm run lint` - перевірка коду через ESLint
- `npm run build` - збірка проєкту в папку `dist/`
- `npm run preview` - локальний перегляд зібраного `dist/` на `http://localhost:4173`

### Запуск через Docker

```bash
docker compose up
```

Для тестів, лінтера або збірки в контейнері:
- `docker compose run --rm web npm run test:run`
- `docker compose run --rm web npm run lint`
- `docker compose run --rm web npm run build`

Зупинити контейнер: `docker compose down`.

## Налаштування даних (`.env`)

Приклад змінних середовища лежить у `.env.example`. Для локальної роботи скопіюйте його в `.env` (файл додано в `.gitignore`, щоб не комітити ключі):

```env
VITE_DATA_SOURCE=firebase
VITE_API_BASE_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Підтримуються 3 режими роботи із заявками:
- `firebase` - зберігає заявки у колекції `careRequests` у Cloud Firestore (`src/services/firebase.js`, `src/services/firebaseCareRequestService.js`). Якщо колекція порожня, при першому відкритті автоматично підвантажуються початкові записи з `public/mock-api/care-requests.json`.
- `mock` - локальний режим через `localStorage` (ключ `animal-care.care-requests.v1`, із затримкою ~600 мс). Вмикається автоматично у тестах або якщо не задано конфіг Firebase. Скинути дані можна через `localStorage.removeItem('animal-care.care-requests.v1')` у консолі браузера.
- `api` - робота із зовнішнім REST API за адресою з `VITE_API_BASE_URL`.

## Тести

Тести написані на Vitest і React Testing Library (налаштування в `vite.config.js` та `src/test/setup.js`). Усього 9 тестових файлів (70 тестів):
- валідація та фільтрація заявок (`src/domain/*.test.js`);
- контракти та сервіси (`animalContract`, `animalService`, `firebaseCareRequestService`, `mockCareRequestService`, `apiCareRequestService`);
- форма та сторінка заявок (`src/pages/CareRequestPage.test.jsx`);
- інтеграційні сценарії по маршрутах і CRUD (`src/App.integration.test.jsx`).

## Документація

- [План проєкту та вимоги](docs/project-plan.md)
- [Архітектура компонентів і стану](docs/component-architecture.md)
