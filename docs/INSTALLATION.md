# Інструкція з встановлення DeadlineTracker

## Вимоги

- Node.js 18+ 
- PostgreSQL 12+
- npm або yarn

## Крок 1: Клонування репозиторію

```bash
git clone <repository-url>
cd deadline-tracker
```

## Крок 2: Встановлення залежностей

```bash
# Встановлення залежностей для всього проекту
npm run install:all
```

## Крок 3: Налаштування бази даних

1. Створіть базу даних PostgreSQL:
```sql
CREATE DATABASE deadline_tracker;
```

2. Створіть файл `.env` в папці `backend` на основі `env.example`:
```bash
cp backend/env.example backend/.env
```

3. Відредагуйте `backend/.env` з вашими налаштуваннями:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/deadline_tracker"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3001
NODE_ENV="development"
```

## Крок 4: Налаштування бази даних

```bash
# Генерація Prisma клієнта
npm run db:generate

# Застосування схеми до бази даних
npm run db:push

# Заповнення тестовими даними
npm run db:seed
```

## Крок 5: Запуск проекту

```bash
# Запуск в режимі розробки (backend + frontend)
npm run dev

# Або окремо:
npm run dev:backend  # Backend на порту 3001
npm run dev:frontend # Frontend на порту 5173
```

## Крок 6: Перевірка роботи

1. Відкрийте браузер і перейдіть на `http://localhost:5173`
2. Використайте тестові облікові записи:
   - **Супер-адміністратор**: admin@example.com / password123
   - **Адміністратор**: manager@example.com / password123
   - **Керівник проєкту**: lead@example.com / password123
   - **Студент**: student1@example.com / password123

## Налаштування для продакшну

### Backend

1. Встановіть змінні середовища для продакшну
2. Збудуйте проект:
```bash
npm run build:backend
```

3. Запустіть продакшн сервер:
```bash
npm run start
```

### Frontend

1. Збудуйте проект:
```bash
npm run build:frontend
```

2. Розмістіть файли з папки `dist` на веб-сервер

## Налаштування push-сповіщень (опціонально)

1. Створіть проект в Firebase Console
2. Отримайте ключі сервісного акаунта
3. Додайте їх в `backend/.env`:
```env
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL="your-client-email"
```

## Налаштування email (опціонально)

Додайте налаштування SMTP в `backend/.env`:
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## Вирішення проблем

### Помилка підключення до бази даних
- Перевірте, чи запущений PostgreSQL
- Перевірте правильність `DATABASE_URL` в `.env`
- Переконайтеся, що база даних існує

### Помилки CORS
- Перевірте, чи `FRONTEND_URL` в `.env` відповідає URL фронтенду

### Помилки автентифікації
- Перевірте правильність `JWT_SECRET` в `.env`
- Переконайтеся, що токен не закінчився

## Структура проекту

```
deadline-tracker/
├── backend/          # Backend API (Node.js + Express + TypeScript)
├── frontend/         # Frontend (React + TypeScript + Vite)
├── shared/           # Спільні типи та утиліти
├── docs/            # Документація
└── package.json     # Кореневий package.json
```
