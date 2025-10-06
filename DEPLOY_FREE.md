# 🚀 БЕЗКОШТОВНИЙ деплой DeadlineTracker

## 🎯 Стек: Vercel + Supabase

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

## 🌐 Крок 2: Vercel (Frontend + Backend)

1. **Зайди на [vercel.com](https://vercel.com)**
2. **Sign in with GitHub**
3. **New Project → Import Git Repository**
4. **Виберіть репозиторій:** `localnewsai2025-spec/DeadlineTracker`
5. **Налаштування:**
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Змінні середовища:**
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-here
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```
7. **Деплой!** Vercel автоматично збудує все

---

## 🔧 Крок 3: Налаштування бази даних

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
- 🌐 **Frontend + Backend:** `https://deadline-tracker.vercel.app`
- 🗄️ **Database:** Supabase PostgreSQL

**ВСЕ БЕЗКОШТОВНО!** 🎉

---

## 🔄 Оновлення коду

1. **Зроби зміни локально**
2. **Закоміть в GitHub:**
   ```bash
   git add .
   git commit -m "Update"
   git push origin main
   ```
3. **Vercel автоматично перезбудує все**

---

## 🆘 Вирішення проблем

### Помилка CORS
- Перевір CORS налаштування в backend
- Додай frontend URL в CORS origins

### Помилка підключення до БД
- Перевір DATABASE_URL в Vercel
- Перевір, чи створені таблиці в Supabase

### Помилка збірки
- Перевір логи в Vercel
- Перевір, чи всі залежності встановлені

---

## 🎯 Переваги цього стеку

- 🆓 **ПОВНІСТЮ БЕЗКОШТОВНО**
- 🚀 **Один сервіс** - Vercel для всього
- 🗄️ **Supabase** - крутий веб-інтерфейс для БД
- 📱 **Автоматичний деплой** з GitHub
- ⚡ **Швидкий** та надійний
- 🔧 **Простий моніторинг** та логи

**Готово! Твій DeadlineTracker тепер працює БЕЗКОШТОВНО! 🎉**
