# Система контролю та опіки тварин

Вебсайт для реєстру та підтримки бездомних тварин студентського містечка:
перегляд тварин, пошук і вибір, подання та супровід заявок на догляд
(створення, перегляд, редагування, видалення).

Застосунок клієнтський (React 19 + React Router + Vite) з підтримкою трьох
взаємозамінних джерел даних для заявок на догляд:
- **Firebase Cloud Firestore** (`VITE_DATA_SOURCE=firebase`) — хмарна NoSQL база даних;
- **Mock-сервіс у `localStorage` браузера** (`VITE_DATA_SOURCE=mock`) — автономний режим із симуляцією мережевої затримки ~600 мс;
- **REST API адаптер** (`VITE_DATA_SOURCE=api`) — клієнт зовнішнього HTTP API.

## Середовище

- Node.js: **[v24.20.0]**
- npm: **[11.19.0]**
- Git: **[2.49.0.windows.1]**
- Docker / Compose: **[29.8.0/v5.5.1]**
- Основне середовище: Windows зі стандартними інсталяторами (варіант A)

## Команди

| Дія | Нативно (PowerShell) | Docker |
|---|---|---|
| Встановлення | `npm install` | `docker compose run --rm web npm install` |
| Розробка | `npm run dev` → http://localhost:5173 | `docker compose up` |
| Тести (один запуск) | `npm run test:run` | `docker compose run --rm web npm run test:run` |
| Тести (спостереження) | `npm run test` | — |
| Лінтер | `npm run lint` | `docker compose run --rm web npm run lint` |
| Виробнича збірка | `npm run build` | `docker compose run --rm web npm run build` |
| Перегляд збірки | `npm run preview` → http://localhost:4173 | `docker compose run --rm -p 4173:4173 web npm run preview -- --host 0.0.0.0 --port 4173 --strictPort` |

`npm run preview` лише локально подає вже зібрані файли (не сервер для
виробничого розміщення). Після зміни коду перед preview потрібна нова збірка.
Зупинка контейнера: `docker compose down`.

## Режим даних і налаштування

Шаблон змінних середовища наведено у `.env.example`. Для локального запуску
створіть файл `.env` або `.env.local` (ігнорується Git):

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

1. **Режим Firebase Cloud Firestore (`VITE_DATA_SOURCE=firebase`):**
   - Використовує модульний SDK `firebase/app` та `firebase/firestore` (`src/services/firebase.js`, `src/services/firebaseCareRequestService.js`).
   - Зберігає заявки у колекції `careRequests` хмарної бази даних Cloud Firestore. Якщо колекція порожня, при першому читанні автоматично заповнює її стартовими записами з `/mock-api/care-requests.json` через `writeBatch`.
2. **Автономний режим (`VITE_DATA_SOURCE=mock`):**
   - Використовується за замовчуванням у тестовому середовищі Vitest або за відсутності налаштованих ключів Firebase.
   - Зберігає заявки у `localStorage` за ключем `animal-care.care-requests.v1` із симуляцією затримки ~600 мс. Щоб скинути локальні дані до початкових записів `req-001`, `req-002`, виконайте у консолі браузера `localStorage.removeItem('animal-care.care-requests.v1')` і оновіть сторінку.
3. **Режим REST API (`VITE_DATA_SOURCE=api` + `VITE_API_BASE_URL`):**
   - Виконує HTTP-запити (`GET`, `POST`, `PUT`, `DELETE`) до вказаного базового URL з перевіркою контрактів даних.

## Тестування

Засоби: Vitest, jsdom, React Testing Library, user-event, jest-dom
(`vite.config.js` → секція `test`, `src/test/setup.js`). Усього 9 тестових наборів (70 тестів):

| Рівень | Файл | Що перевіряє |
|---|---|---|
| Логіка | `src/domain/careRequestValidation.test.js` | Нормалізація, граничні межі полів, зв'язок кількості візитів і потреби в ресурсах |
| Логіка | `src/domain/selectCareRequests.test.js` | Пошук, фільтр потреб, числовий порядок сортування, незмінність вхідного масиву |
| Контракт | `src/services/animalContract.test.js` | Перевірка структури записів тварин і генерація `ServiceError(BAD_DATA)` |
| Сервіс | `src/services/animalService.test.js` | Завантаження реєстру тварин, кешування в пам'яті та обробка помилок |
| Адаптер | `src/services/firebaseCareRequestService.test.js` | Читання, створення, видалення документів у Cloud Firestore та обробка `NOT_FOUND` |
| Адаптер | `src/services/mockCareRequestService.test.js` | Ініціалізація `localStorage`, CRUD-операції, скасування через `AbortController` |
| Адаптер | `src/services/apiCareRequestService.test.js` | HTTP-статуси, 204, нормалізація запиту, некоректний JSON |
| Компонент | `src/pages/CareRequestPage.test.jsx` | Помилки біля полів, блокування повторного сабміту, збереження вводу при відмові |
| Інтеграція | `src/App.integration.test.jsx` | Наскрізні користувацькі сценарії: маршрути, фільтри, вибір тварини, створення, редагування, видалення, сторінка 404 |

## Документація

- [`docs/project-plan.md`](docs/project-plan.md) — вимоги, маршрути, модель заявки, перелік готовності й сценарій захисту.
- [`docs/component-architecture.md`](docs/component-architecture.md) — компоненти, стан, маршрути, сервісний рівень, тестування та остаточні рішення.
- [`docs/memoization-experiment.patch`](docs/memoization-experiment.patch) — необов'язковий патч для досліду з `memo`/`useCallback` (застосовується `git apply --ignore-whitespace`, див. architecture, розділ 10).

## Обмеження

- Автоматичного повтору запису при мережевому збої немає (щоб уникнути дублікатів).
- Адаптер перевіряє структуру прочитаних записів через контракти даних.
- Для статичного хостингу потрібне правило повернення `index.html` для клієнтських маршрутів SPA.
