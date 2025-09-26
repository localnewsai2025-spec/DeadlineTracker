# Розробка DeadlineTracker

## Архітектура проекту

### Backend (Node.js + Express + TypeScript)
- **Фреймворк**: Express.js
- **Мова**: TypeScript
- **База даних**: PostgreSQL + Prisma ORM
- **Автентифікація**: JWT
- **Валідація**: express-validator
- **Безпека**: helmet, cors, rate-limiting

### Frontend (React + TypeScript + Vite)
- **Фреймворк**: React 18
- **Мова**: TypeScript
- **Збірка**: Vite
- **Маршрутизація**: React Router
- **Стан**: React Query + Context API
- **Стилі**: Tailwind CSS
- **Форми**: React Hook Form
- **Сповіщення**: React Hot Toast

## Структура проекту

```
deadline-tracker/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── controllers/     # Контролери
│   │   ├── middleware/      # Middleware
│   │   ├── routes/          # Маршрути
│   │   ├── services/        # Бізнес-логіка
│   │   ├── types/           # Типи TypeScript
│   │   ├── utils/           # Утиліти
│   │   └── config/          # Конфігурація
│   ├── prisma/              # Схема бази даних
│   └── package.json
├── frontend/                # Frontend додаток
│   ├── src/
│   │   ├── components/      # React компоненти
│   │   ├── pages/           # Сторінки
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API сервіси
│   │   ├── types/           # Типи TypeScript
│   │   ├── utils/           # Утиліти
│   │   └── contexts/        # React контексти
│   └── package.json
├── shared/                  # Спільні типи
├── docs/                    # Документація
└── package.json             # Кореневий package.json
```

## Розробка

### Встановлення залежностей

```bash
# Встановлення всіх залежностей
npm run install:all

# Або окремо
cd backend && npm install
cd frontend && npm install
```

### Запуск в режимі розробки

```bash
# Запуск backend та frontend одночасно
npm run dev

# Або окремо
npm run dev:backend   # http://localhost:3001
npm run dev:frontend  # http://localhost:5173
```

### База даних

```bash
# Генерація Prisma клієнта
npm run db:generate

# Застосування змін до бази даних
npm run db:push

# Відкриття Prisma Studio
npm run db:studio

# Заповнення тестовими даними
npm run db:seed
```

## Код-стиль

### TypeScript
- Використовуйте строгу типізацію
- Уникайте `any` типу
- Використовуйте інтерфейси для об'єктів
- Використовуйте enum для констант

### React
- Використовуйте функціональні компоненти
- Використовуйте hooks замість класів
- Використовуйте TypeScript для пропсів
- Використовуйте React.memo для оптимізації

### CSS
- Використовуйте Tailwind CSS класи
- Уникайте кастомних CSS файлів
- Використовуйте responsive дизайн
- Дотримуйтесь дизайн-системи

## Тестування

### Backend тести
```bash
cd backend
npm test
```

### Frontend тести
```bash
cd frontend
npm test
```

### E2E тести
```bash
npm run test:e2e
```

## Лінтінг

### Backend
```bash
cd backend
npm run lint
npm run lint:fix
```

### Frontend
```bash
cd frontend
npm run lint
npm run lint:fix
```

## Збірка

### Backend
```bash
cd backend
npm run build
```

### Frontend
```bash
cd frontend
npm run build
```

### Всього проекту
```bash
npm run build
```

## Деплой

### Backend
1. Встановіть змінні середовища
2. Зберіть проект: `npm run build:backend`
3. Запустіть: `npm run start`

### Frontend
1. Зберіть проект: `npm run build:frontend`
2. Розмістіть файли з `dist/` на веб-сервер

## API Розробка

### Створення нового маршруту

1. Створіть контролер в `backend/src/controllers/`
2. Створіть сервіс в `backend/src/services/`
3. Додайте маршрут в `backend/src/routes/`
4. Додайте валідацію в `backend/src/utils/validation.ts`
5. Додайте типи в `backend/src/types/index.ts`

### Приклад контролера

```typescript
export class ExampleController {
  static getItems = asyncHandler(async (req: AuthRequest, res: Response) => {
    const items = await ExampleService.getItems();
    ResponseUtils.success(res, items, 'Items retrieved');
  });
}
```

### Приклад сервісу

```typescript
export class ExampleService {
  static async getItems() {
    return prisma.item.findMany();
  }
}
```

## Frontend Розробка

### Створення нового компонента

1. Створіть файл в `frontend/src/components/`
2. Використовуйте TypeScript інтерфейси
3. Використовуйте Tailwind CSS для стилів
4. Додайте пропси та обробники подій

### Приклад компонента

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  onClick 
}) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### Створення нової сторінки

1. Створіть файл в `frontend/src/pages/`
2. Додайте маршрут в `frontend/src/App.tsx`
3. Використовуйте Layout компонент
4. Додайте захист маршруту

### Приклад сторінки

```typescript
export const ExamplePage: React.FC = () => {
  const { data, isLoading } = useQuery('example', exampleService.getData);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Example Page</h1>
      {/* Content */}
    </div>
  );
};
```

## База даних

### Додавання нової таблиці

1. Додайте модель в `backend/prisma/schema.prisma`
2. Застосуйте зміни: `npm run db:push`
3. Оновіть типи: `npm run db:generate`

### Приклад моделі

```prisma
model Example {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("examples")
}
```

## Безпека

### Автентифікація
- Використовуйте JWT токени
- Зберігайте токени в localStorage
- Додавайте токен в заголовки запитів

### Авторизація
- Перевіряйте ролі користувачів
- Використовуйте middleware для захисту маршрутів
- Валідуйте дані на сервері

### Валідація
- Використовуйте express-validator
- Валідуйте дані на клієнті та сервері
- Санітизуйте вхідні дані

## Оптимізація

### Backend
- Використовуйте індекси в базі даних
- Кешуйте часто використовувані дані
- Оптимізуйте SQL запити
- Використовуйте пагінацію

### Frontend
- Використовуйте React.memo для компонентів
- Використовуйте useMemo та useCallback
- Оптимізуйте зображення
- Використовуйте lazy loading

## Моніторинг

### Логування
- Використовуйте console.log для розробки
- Використовуйте структуровані логи для продакшну
- Логуйте помилки та важливі події

### Метрики
- Відстежуйте час відповіді API
- Відстежуйте помилки
- Відстежуйте використання функцій

## Вирішення проблем

### Поширені проблеми

1. **Помилка підключення до бази даних**
   - Перевірте DATABASE_URL
   - Перевірте, чи запущений PostgreSQL

2. **CORS помилки**
   - Перевірте FRONTEND_URL в .env
   - Перевірте налаштування CORS

3. **Помилки автентифікації**
   - Перевірте JWT_SECRET
   - Перевірте валідність токена

4. **Помилки збірки**
   - Очистіть node_modules
   - Перевстановіть залежності
   - Перевірте версії Node.js

### Дебаг

1. **Backend**
   - Використовуйте console.log
   - Перевірте логи сервера
   - Використовуйте Postman для тестування API

2. **Frontend**
   - Використовуйте React DevTools
   - Перевірте консоль браузера
   - Використовуйте Network tab

## Контрибуція

1. Створіть feature branch
2. Внесіть зміни
3. Додайте тести
4. Запустіть лінтинг
5. Створіть pull request

## Ліцензія

MIT License - дивіться LICENSE файл для деталей.
