# 🚀 БЕЗКОШТОВНИЙ деплой DeadlineTracker

## 🎯 Стек: Vercel + Render + Supabase

**💰 Вартість:** $0/місяць - **ПОВНІСТЮ БЕЗКОШТОВНО!**

---

## 📋 Крок 1: Supabase (PostgreSQL)

1. **Зайди в Supabase Dashboard**
2. **SQL Editor → New Query**
3. **Скопіюй SQL з файлу `supabase-schema.sql`**
4. **Натисни "Run"**

---

## 🌐 Крок 2: Render (Backend)

1. **Зайди на [render.com](https://render.com)**
2. **Sign in with GitHub**
3. **New → Blueprint**
4. **Підключи репозиторій:** `localnewsai2025-spec/DeadlineTracker`
5. **Render автоматично:**
   - Створить backend сервіс
   - Налаштує всі змінні середовища (включаючи Supabase DATABASE_URL)
6. **Отримай URL:** `https://deadline-tracker-backend.onrender.com`

---

## 🎨 Крок 3: Vercel (Frontend)

1. **Зайди в Vercel Dashboard**
2. **Settings → Environment Variables**
3. **Додай змінну:**
   ```
   VITE_REACT_APP_API_URL=https://deadline-tracker-backend.onrender.com
   ```
4. **Redeploy** проект

---

## ✅ Готово!

**Твій проект тепер працює:**
- 🎨 **Frontend:** `https://deadline-tracker-sand.vercel.app`
- 🖥️ **Backend:** `https://deadline-tracker-backend.onrender.com`
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
3. **Автоматичний деплой:**
   - Render автоматично перезбудує backend
   - Vercel автоматично перезбудує frontend

---

## 🆘 Вирішення проблем

### Помилка CORS
- Перевір CORS налаштування в backend
- Додай frontend URL в CORS origins

### Помилка підключення до БД
- Перевір DATABASE_URL в Render
- Перевір, чи створені таблиці в Supabase

### Помилка збірки
- Перевір логи в Render/Vercel
- Перевір, чи всі залежності встановлені

---

## 🎯 Переваги цього стеку

- 🆓 **ПОВНІСТЮ БЕЗКОШТОВНО**
- 🚀 **Render** - крутий для backend
- 🎨 **Vercel** - крутий для frontend
- 🗄️ **Supabase** - крутий веб-інтерфейс для БД
- 📱 **Автоматичний деплой** з GitHub
- ⚡ **Швидкий** та надійний

**Готово! Твій DeadlineTracker тепер працює БЕЗКОШТОВНО! 🎉**
