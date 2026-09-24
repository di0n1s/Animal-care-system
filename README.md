# Система контролю та опіки тварин

Вебсайт для реєстру та підтримки бездомних тварин студентського містечка.

Поточний результат (Л 1.1): початкова сторінка з локальними даними про
тварин кампусу.

## Середовище

- Node.js: **[ЗАПОВНИ: вивід `node --version` на своєму ПК]**
- npm: **[ЗАПОВНИ: вивід `npm --version`]**
- Git: **[ЗАПОВНИ: вивід `git --version`]**
- Docker: **[ЗАПОВНИ: вивід `docker version`]**
- Docker Compose: **[ЗАПОВНИ: вивід `docker compose version`]**
- Основний варіант середовища: Windows зі стандартними інсталяторами (варіант A)

## Запуск

Нативно (Windows PowerShell):

```powershell
npm install
npm run dev
```

Відкрити http://localhost:5173

Docker:

```powershell
docker compose build
docker compose run --rm web npm install
docker compose up
```

Адреса в Docker: http://localhost:5173
Зупинення й видалення контейнера: `docker compose down`

## Збірка

```powershell
npm run build
npm run preview
```

Або через контейнер:

```powershell
docker compose run --rm web npm run build
```

## План курсової роботи

Див. [`docs/project-plan.md`](docs/project-plan.md).

## Компонентна архітектура і стан

Див. [`docs/component-architecture.md`](docs/component-architecture.md) —
ієрархія компонентів, контракти props (Л 1.2) та карта стану, область
Context API і контракти подій (Л 2.1).

Чернетка заявки на догляд зараз інтерактивна (пошук, вибір тварини,
редагування полів), але існує лише в пам'яті поточної сторінки — це ще не
збережена заявка. Валідація та збереження заплановані на Л 3.1, підключення
сервісу даних — на Л 3.2, маршрутизація між сторінками — на Л 2.2.
