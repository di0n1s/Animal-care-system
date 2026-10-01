# Компонентна архітектура — «Система контролю та опіки тварин»

## 1. Що змінилося після Л 1.1

| Було в Л 1.1 | Стало в Л 1.2 | Причина |
|---|---|---|
| Заголовок, навігація й footer в `App.jsx` | `AppLayout`, `SiteHeader`, `MainNav` | Спільне компонування окремо від сторінок |
| Перевірка масиву й `map` прямо в `HomePage` | `Section`, `CatalogSummary`, `AnimalList` | Сторінка лише складає готові блоки |
| Статус (`needsCare`) обчислювався всередині картки | `CareStatusBadge` | Одне правило статусу для картки й макета заявки |
| Тільки реєстр тварин | `CareRequestPage` + `CareRequestFormPreview` | Другий сценарій — підготовка заявки на догляд, без збереження даних |
| Плоска папка `components/` | Групи `layout/`, `navigation/`, `animals/`, `requests/`, `ui/` | Зрозуміла відповідальність файлів |

Початковий сценарій Л 1.1 (перегляд реєстру тварин) повністю збережено —
змінилась лише внутрішня організація коду, а не поведінка для користувача.

## 2. Ієрархія компонентів

```
App
  AppLayout
    SiteHeader
      MainNav
    main
      AnimalSelectionProvider (Context API, лише робоча область)
        CatalogContainer → HomePage
          Section (про застосунок)
          Section (реєстр тварин)
            CatalogSummary
            AnimalFilters
            AnimalList
              AnimalCard (для кожного запису, локальний detailsOpen)
                CareStatusBadge
              EmptyState (якщо порожньо або немає збігів)
        CareRequestContainer → CareRequestPage (власник draft, useEffect)
          Section (підготовка заявки)
            CareStatusBadge
            CareRequestForm
              FormField (для кожного поля)
              AppButton (кнопки)
            CareRequestSummary
    footer
```

`HomePage` і `CareRequestPage` передаються в `AppLayout` через `children` —
оболонка не імпортує ці сторінки напряму.

## 3. Контракти ключових компонентів

| Компонент | Вхідні властивості | Домовленість |
|---|---|---|
| `AppLayout` | `title`, `links`, `children` | Створює спільну оболонку з одним `main` |
| `Section` | `id`, `title`, `children` | `id` унікальний у поточному документі |
| `AnimalList` | `items`, `selectedId`, `onSelect`, `emptyTitle` | Не зберігає власної копії вибору |
| `AnimalCard` | `item`, `selected`, `onSelect` | `detailsOpen` — локальний стан, `selected` — ззовні |
| `AnimalFilters` | `query`, `onlyNeedsCare`, `onQueryChange`, `onOnlyNeedsCareChange`, `onReset` | Керовані значення, компонент нічого не зберігає сам |
| `CareStatusBadge` | `needsCare` | Логічне значення, компонент нічого не змінює |
| `CareRequestPage` | `item`, `onClearSelection` | `item` може бути відсутнім (порожній результат) |
| `FormField` | `id`, `label`, `hint`, `children` | Вкладене поле отримує той самий `id` |
| `CareRequestForm` | `idPrefix`, `animalName`, `draft`, `onScheduleChange`, `onNeedsSuppliesChange`, `onReset` | Повністю кероване; не тримає власного стану полів |
| `CareRequestSummary` | `animalName`, `draft` | Лише показує той самий об'єкт `draft` |
| `AppButton` | `children`, `type`, `variant`, `disabled`, `onClick`, aria-* | `variant`: `primary` або `secondary` |
| `AnimalSelectionProvider` | `items`, `children` | Єдиний власник `selectedId` у робочій області |

## 4. Приклади повторного використання

- **`CareStatusBadge`** використовується і в `AnimalCard` (кожна картка реєстру),
  і окремо в `CareRequestPage` над формою заявки — зміна правила підпису
  статусу тепер відбувається в одному місці й одразу видно в обох.
- **`Section`** використано тричі з різним вмістом (опис застосунку, реєстр
  тварин, заявка на догляд) — оболонка секції однакова, вміст різний.
- **`FormField`** застосовано для двох різних полів форми (`input` для назви
  тварини, `textarea` для графіка догляду) без дублювання розмітки підпису
  й підказки.

## 5. Оформлення

Використано власні стилі з Л 1.1, доповнені правилами для навігації,
кнопок і полів форми (`src/index.css`). React Bootstrap не підключався —
власних стилів достатньо для поточного обсягу інтерфейсу.

## 6. Стан і взаємодія (Л 2.1)

### Карта стану

| Значення | Природа | Власник |
|---|---|---|
| `animals` | Початкові предметні дані | Модуль `data/animals.js`, підключений на рівні `App` |
| `detailsOpen` | Локальний стан інтерфейсу | Конкретна `AnimalCard` |
| `query`, `onlyNeedsCare` | Стан інтерфейсу каталогу | `HomePage`, через хук `useAnimalFilters` |
| `selectedId` | Спільний стан вибору | `AnimalSelectionProvider` (Context API) |
| `draft` | Незбережені поля заявки | Поточний екземпляр `CareRequestPage` |
| `visibleItems`, `selectedItem` | Похідні значення | Обчислюються з даних і стану, окремого `useState` немає |

### Область Context API

`AnimalSelectionContext` + `AnimalSelectionProvider` обгортають лише робочу
область (`CatalogContainer` і `CareRequestContainer`) усередині `children`
`AppLayout`. `SiteHeader`, `MainNav` і footer поза цією областю — вибір тварини
їм не потрібен. `useAnimalSelection` кидає помилку, якщо викликаний поза
провайдером — це помилка інтеграції, а не порожній вибір.

### Контракти подій

| Подія | Відправник | Власник | Дія |
|---|---|---|---|
| `onSelect(id)` | `AnimalCard` | `AnimalSelectionProvider` | Встановлює `selectedId`, якщо `id` існує |
| `onQueryChange(text)` | `AnimalFilters` | `useAnimalFilters` (у `HomePage`) | Оновлює текст пошуку |
| `onOnlyNeedsCareChange(flag)` | `AnimalFilters` | `useAnimalFilters` | Оновлює прапорець фільтра |
| `onScheduleChange(text)` | `CareRequestForm` | `CareRequestPage` | Оновлює `draft.schedule` |
| `onNeedsSuppliesChange(flag)` | `CareRequestForm` | `CareRequestPage` | Оновлює `draft.needsSupplies` |
| `onReset()` | `CareRequestForm` | `CareRequestPage` | Повертає `draft` до порожнього об'єкта |
| `onClearSelection()` | `CareRequestPage` | `AnimalSelectionProvider` | Скидає `selectedId` до `null` |

### Обґрунтування вибору засобів керування станом

| Потреба | Засіб | Чому |
|---|---|---|
| Розгортання опису картки | Локальний `useState` | Потрібне лише одному екземпляру `AnimalCard` |
| Пошук і фільтр у каталозі | Стан сторінки через власний хук `useAnimalFilters` | Значення потрібні лише фільтрам і списку одного сценарію |
| Поля й підсумок чернетки | Піднято до `CareRequestPage` | Форма і підсумок — сусідні компоненти, яким потрібен один об'єкт |
| Вибір тварини між каталогом і заявкою | Context API (`AnimalSelectionProvider`) | Дві віддалені гілки робочої області мають бачити один вибір |
| Видимі записи, лічильники | Звичайні обчислення | Похідні значення з поточних даних і фільтрів |
| Заголовок вкладки | `useEffect` | Синхронізація із зовнішньою властивістю браузера (`document.title`) |

Ефект у `CareRequestPage` синхронізує `document.title` з назвою обраної
тварини. Залежність — обчислений рядок `title`; функція очищення повертає
попередній заголовок перед повторною синхронізацією або демонтуванням.
Redux/MobX/Zustand не використовувались — для цього обсягу стану вистачає
`useState`, підняття стану й обмеженого Context API.


## 7. Маршрутизація (Л 2.2)

### Дерево маршрутного вмісту

```
AppLayout (Outlet, AnimalSelectionProvider)
  Головна (/)
  Реєстр тварин (/animals)
  Деталі тварини (/animals/:animalId)
  RequestsLayout (/requests, свій Outlet)
    Список заявок (index)
    Нова заявка (/requests/new)
    Редагування заявки (/requests/:requestId/edit)
  Сторінка 404 (*)
```

`AppLayout` не має власного `path` — він задає лише спільне компонування
(шапку, меню, `AnimalSelectionProvider`) для всіх дочірніх маршрутів через
`Outlet`. `RequestsLayout` додає другий рівень `Outlet` лише там, де потрібне
власне меню розділу (список/нова заявка).

### Де тепер живе стан після Л 2.1

| Значення | Було в Л 2.1 | Стало в Л 2.2 |
|---|---|---|
| Відкрита сторінка | Всі секції змонтовані одночасно | Шлях URL (`Routes`/`Route`) |
| Пошук і фільтр `needsCare` | `useState` у хуку `useAnimalFilters` | Query parameters (`useSearchParams`), той самий контракт хука |
| Тварина для нової заявки | Тільки Context API | `?animalId=` у query — читається напряму, не копіюється в контекст |
| Останній явний вибір (підсвітка картки) | Context API | Залишається Context API (`AnimalSelectionProvider`) |
| Чернетка форми, розгортання опису | Локальний `useState` | Без змін — локальний `useState`, скидається при демонтуванні |
| Заголовок вкладки | `useEffect` у `CareRequestPage` | Перенесено в спільний `PageHeading`, викликається кожною сторінкою |

Пряме відкриття `/animals?q=соня` чи `/requests/req-001/edit` відновлює
потрібний стан з адреси без участі Context API — це навмисно різні механізми:
контекст пам'ятає **останню дію користувача**, URL визначає **поточну
сторінку**.

### Контракти нових компонентів

| Компонент | Вхідні властивості | Домовленість |
|---|---|---|
| `PageHeading` | `title` | Єдиний власник `document.title` для відкритої сторінки |
| `AnimalListPage` | `items`, `selectedId`, `onSelect` | Колишній вміст каталогу з `HomePage`, тепер окрема адреса |
| `AnimalDetailsPage` | `items` | Читає `animalId` через `useParams`, показує `NotFoundPage` за відсутності |
| `RequestsLayout` | — (`Outlet`) | Власне меню розділу заявок, без нового провайдера |
| `CareRequestPage` | `title`, `item`, `initialDraft`, `onCancel`, `cancelLabel` | Спільний редактор; `item` завжди коректний — перевірку виконує маршрутна сторінка |
| `CareRequestCreatePage` | `items` | Читає `animalId` з query; без параметра показує `EmptyState` |
| `CareRequestEditPage` | `requests`, `items` | Читає `requestId` через `useParams`; подвійна перевірка (заявка → тварина) |
| `NotFoundPage` | `title`, `message` (необов'язкові) | Один компонент для невідомого маршруту й відсутнього запису |

`CareRequestContainer` з Л 2.1 видалено — його роль тепер виконують
`CareRequestCreatePage` і `CareRequestEditPage` з явними адресами.
