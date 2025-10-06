# 🚀 Деплой DeadlineTracker на Render

## Крок 1: Підготовка

1. **Переконайся, що код закомічений в GitHub:**
   ```bash
   git add .
   git commit -m "Refactor for Render deployment"
   git push origin main
   ```

## Крок 2: Деплой на Render

1. **Зайди на [render.com](https://render.com)**
2. **Sign in with GitHub**
3. **Створи новий Blueprint:**
   - New → Blueprint
   - Connect your GitHub repository
   - Виберіть твій `DeadlineTracker` репозиторій
   - Render автоматично знайде `render.yaml` і налаштує все

4. **Render автоматично створить:**
   - ✅ Backend сервіс (`deadline-tracker-backend`)
   - ✅ Frontend сервіс (`deadline-tracker-frontend`)
   - ✅ PostgreSQL базу даних (`deadline-tracker-db`)
   - ✅ Всі змінні середовища
   - ✅ Автоматичний деплой з GitHub

## Крок 3: Очікування

- **Backend деплой:** ~5-10 хвилин
- **Frontend деплой:** ~3-5 хвилин
- **Database створення:** ~2-3 хвилини

## Крок 4: Перевірка

Після деплою ти отримаєш URL'и:
- **Frontend:** `https://deadline-tracker-frontend.onrender.com`
- **Backend:** `https://deadline-tracker-backend.onrender.com`
- **API Health:** `https://deadline-tracker-backend.onrender.com/api/health`

## Крок 5: Тестування

1. **Відкрий frontend URL**
2. **Зареєструйся/увійди**
3. **Створи тестове завдання**
4. **Перевір, чи працюють push-сповіщення**

## 🔧 Налаштування після деплою

### Якщо потрібно оновити код:
1. Зроби зміни локально
2. `git add . && git commit -m "Update" && git push`
3. Render автоматично перезбудує і задеплоїть

### Якщо потрібно подивитися логи:
1. Зайди в Render Dashboard
2. Виберіть сервіс
3. Перейди в Logs

### Якщо потрібно змінити змінні середовища:
1. Зайди в Render Dashboard
2. Виберіть сервіс
3. Перейди в Environment
4. Додай/зміни змінні

## 🆘 Вирішення проблем

### Помилка "Build failed"
- Перевір логи в Render Dashboard
- Переконайся, що всі залежності встановлені
- Перевір, чи немає помилок в коді

### Помилка "Database connection failed"
- Перевір, чи створена база даних
- Перевір DATABASE_URL в змінних середовища
- Запусти міграції: `npm run db:push`

### CORS помилки
- Перевір CORS налаштування в backend
- Переконайся, що frontend URL доданий в CORS

## ✅ Готово!

Твій DeadlineTracker тепер працює на Render! 🎉

**Переваги Render:**
- 🆓 Безкоштовний план
- 🚀 Автоматичний деплой
- 🗄️ Вбудована PostgreSQL
- 🔧 Простий інтерфейс
- 📱 Мобільний додаток
