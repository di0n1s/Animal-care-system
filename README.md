# Система контролю та опіки тварин

Вебсайт для реєстру та підтримки бездомних тварин студентського містечка.

Поточний результат (Л 1.1): початкова сторінка з локальними даними про
тварин кампусу.

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

## Компонентна архітектура

Див. [`docs/component-architecture.md`](docs/component-architecture.md) —
ієрархія компонентів і контракти props після рефакторингу в Л 1.2.

Форми подання заявок на догляд та маршрутизація між сторінками ще
заплановані на наступні лабораторні роботи.
