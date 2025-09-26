# 🚀 Швидкий деплой DeadlineTracker

## Варіант 1: Railway + Vercel (Найпростіший)

### 1. Backend на Railway

1. **Створіть акаунт**: [railway.app](https://railway.app) → Sign in with GitHub
2. **Новий проект**: New Project → Deploy from GitHub repo
3. **Виберіть репозиторій**: ваш deadline-tracker
4. **Додайте PostgreSQL**: New Service → Database → PostgreSQL
5. **Змінні середовища**:
   ```
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=production
   ```
6. **Деплой**: Railway автоматично збудує backend
7. **Отримайте URL**: наприклад `https://deadline-tracker-backend.railway.app`

### 2. Frontend на Vercel

1. **Створіть акаунт**: [vercel.com](https://vercel.com) → Sign in with GitHub
2. **Новий проект**: New Project → Import Git Repository
3. **Налаштування**:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Змінні середовища**:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```
5. **Деплой**: Vercel автоматично збудує frontend
6. **Отримайте URL**: наприклад `https://deadline-tracker.vercel.app`

## Варіант 2: Render (Все в одному)

1. **Створіть акаунт**: [render.com](https://render.com) → Sign in with GitHub
2. **Новий проект**: New → Blueprint
3. **Підключіть репозиторій**: ваш deadline-tracker
4. **Render автоматично**:
   - Створить PostgreSQL базу
   - Збудує backend
   - Збудує frontend
   - Налаштує змінні середовища
5. **Деплой**: автоматично через GitHub

## Варіант 3: Fly.io (Full-stack)

1. **Встановіть Fly CLI**:
   ```bash
   # Windows
   powershell -c "iwr https://fly.io/install.ps1 -useb | iex"
   ```
2. **Увійдіть**: `fly auth login`
3. **Деплой**: `fly deploy`
4. **Додайте PostgreSQL**: `fly postgres create`

## 🎯 Рекомендація

**Для початку використовуйте Railway + Vercel**:
- ✅ Найпростіший налаштування
- ✅ Автоматичний деплой з GitHub
- ✅ Безкоштовні SSL сертифікати
- ✅ Хороша документація
- ✅ Надійність

## 📋 Чек-лист деплою

- [ ] Створити GitHub репозиторій
- [ ] Завантажити код в GitHub
- [ ] Налаштувати Railway для backend
- [ ] Налаштувати Vercel для frontend
- [ ] Додати змінні середовища
- [ ] Протестувати роботу сайту
- [ ] Налаштувати кастомний домен (опціонально)

## 🔧 Після деплою

1. **Протестуйте функціонал**:
   - Реєстрація/вхід
   - Створення завдань
   - Push-сповіщення

2. **Налаштуйте моніторинг**:
   - Логи в панелі управління
   - Метрики використання
   - Сповіщення про помилки

3. **Оптимізуйте**:
   - Кешування
   - CDN
   - Компресія

## 🆘 Вирішення проблем

### Помилка "Connection refused"
- Перевірте, чи запущений backend
- Перевірте REACT_APP_API_URL
- Перевірте CORS налаштування

### Помилка підключення до БД
- Перевірте DATABASE_URL
- Перевірте, чи створена база даних
- Запустіть міграції: `npm run db:push`

### CORS помилки
- Додайте домен frontend в CORS налаштування backend
- Перевірте HTTPS
- Перевірте заголовки

## 📞 Підтримка

- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Render: [render.com/docs](https://render.com/docs)
- Fly.io: [fly.io/docs](https://fly.io/docs)

---

**Готово! Ваш DeadlineTracker тепер працює в хмарі! 🎉**
