# 🚀 Безкоштовний деплой DeadlineTracker

## 🎯 Стек: Netlify + Railway + Supabase

**💰 Вартість:** $0/місяць - **ПОВНІСТЮ БЕЗКОШТОВНО!**

---

## 📋 Крок 1: Supabase (PostgreSQL)

1. **Зайди на [supabase.com](https://supabase.com)**
2. **Sign in with GitHub**
3. **New Project**
4. **Налаштування:**
   - Name: `deadline-tracker-db`
   - Database Password: згенеруй надійний пароль
   - Region: найближчий до тебе
5. **Отримай Connection String:**
   - Settings → Database
   - Connection string → URI
   - Скопіюй `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`

---

## 🚂 Крок 2: Railway (Backend)

1. **Зайди на [railway.app](https://railway.app)**
2. **Sign in with GitHub**
3. **New Project → Deploy from GitHub repo**
4. **Виберіть репозиторій:** `localnewsai2025-spec/DeadlineTracker`
5. **Налаштування:**
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
6. **Змінні середовища:**
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-here
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```
7. **Отримай URL:** наприклад `https://deadline-tracker-backend.railway.app`

---

## 🌐 Крок 3: Netlify (Frontend)

1. **Зайди на [netlify.com](https://netlify.com)**
2. **Sign in with GitHub**
3. **New site from Git**
4. **Виберіть репозиторій:** `localnewsai2025-spec/DeadlineTracker`
5. **Налаштування:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
6. **Змінні середовища:**
   ```
   VITE_REACT_APP_API_URL=https://deadline-tracker-backend.railway.app
   ```
7. **Отримай URL:** наприклад `https://deadline-tracker.netlify.app`

---

## 🔧 Крок 4: Налаштування бази даних

1. **В Supabase:**
   - SQL Editor → New Query
   - Скопіюй схему з `backend/prisma/schema.prisma`
   - Виконай SQL для створення таблиць

2. **Або через Prisma:**
   ```bash
   cd backend
   npx prisma db push
   ```

---

## ✅ Готово!

**Твій проект тепер працює:**
- 🌐 **Frontend:** `https://deadline-tracker.netlify.app`
- 🚂 **Backend:** `https://deadline-tracker-backend.railway.app`
- 🗄️ **Database:** Supabase PostgreSQL

**Всі сервіси безкоштовні!** 🎉

---

## 🔄 Оновлення коду

1. **Зроби зміни локально**
2. **Закоміть в GitHub:**
   ```bash
   git add .
   git commit -m "Update"
   git push origin main
   ```
3. **Автоматичний деплой:**
   - Netlify автоматично перезбудує frontend
   - Railway автоматично перезбудує backend

---

## 🆘 Вирішення проблем

### Помилка CORS
- Перевір CORS налаштування в backend
- Додай frontend URL в CORS origins

### Помилка підключення до БД
- Перевір DATABASE_URL в Railway
- Перевір, чи створені таблиці в Supabase

### Помилка збірки
- Перевір логи в Netlify/Railway
- Перевір, чи всі залежності встановлені

---

## 🎯 Переваги цього стеку

- 🆓 **Повністю безкоштовно**
- 🚀 **Автоматичний деплой** з GitHub
- 🗄️ **Supabase** - крутий веб-інтерфейс для БД
- 📱 **Мобільні додатки** для всіх сервісів
- 🔧 **Простий моніторинг** та логи
- ⚡ **Швидкий** та надійний

**Готово! Твій DeadlineTracker тепер працює безкоштовно! 🎉**
