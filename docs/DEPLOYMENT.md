# Деплой DeadlineTracker

## Варіант 1: Railway + Vercel (Рекомендований)

### Backend на Railway

1. **Створіть акаунт на Railway**:
   - Перейдіть на [railway.app](https://railway.app)
   - Увійдіть через GitHub

2. **Створіть новий проект**:
   - Натисніть "New Project"
   - Виберіть "Deploy from GitHub repo"
   - Виберіть ваш репозиторій

3. **Додайте PostgreSQL**:
   - В проекті натисніть "New Service"
   - Виберіть "Database" → "PostgreSQL"
   - Railway автоматично створить змінну `DATABASE_URL`

4. **Налаштуйте змінні середовища**:
   - Відкрийте налаштування сервісу
   - Додайте змінні:
     ```
     JWT_SECRET=your-super-secret-jwt-key-here
     NODE_ENV=production
     PORT=3001
     ```

5. **Деплой**:
   - Railway автоматично збудує та запустить backend
   - Отримайте URL вашого API (наприклад: `https://deadline-tracker-backend.railway.app`)

### Frontend на Vercel

1. **Створіть акаунт на Vercel**:
   - Перейдіть на [vercel.com](https://vercel.com)
   - Увійдіть через GitHub

2. **Імпортуйте проект**:
   - Натисніть "New Project"
   - Виберіть ваш репозиторій
   - Встановіть Root Directory: `frontend`

3. **Налаштуйте збірку**:
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Додайте змінні середовища**:
   - В налаштуваннях проекту додайте:
     ```
     REACT_APP_API_URL=https://your-backend-url.railway.app/api
     ```

5. **Деплой**:
   - Vercel автоматично збудує та задеплоить frontend
   - Отримайте URL вашого сайту

## Варіант 2: Render + Netlify

### Backend на Render

1. **Створіть акаунт на Render**:
   - Перейдіть на [render.com](https://render.com)
   - Увійдіть через GitHub

2. **Створіть Web Service**:
   - Натисніть "New" → "Web Service"
   - Підключіть ваш репозиторій
   - Встановіть:
     - Build Command: `cd backend && npm install && npm run build`
     - Start Command: `cd backend && npm start`

3. **Додайте PostgreSQL**:
   - Натисніть "New" → "PostgreSQL"
   - Render автоматично створить змінну `DATABASE_URL`

4. **Налаштуйте змінні середовища**:
   ```
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=production
   DATABASE_URL=postgresql://...
   ```

### Frontend на Netlify

1. **Створіть акаунт на Netlify**:
   - Перейдіть на [netlify.com](https://netlify.com)
   - Увійдіть через GitHub

2. **Додайте новий сайт**:
   - Натисніть "New site from Git"
   - Виберіть ваш репозиторій
   - Встановіть:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `frontend/dist`

3. **Додайте змінні середовища**:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

## Варіант 3: Fly.io (Full-stack)

1. **Встановіть Fly CLI**:
   ```bash
   # Windows
   powershell -c "iwr https://fly.io/install.ps1 -useb | iex"
   
   # macOS/Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. **Увійдіть в акаунт**:
   ```bash
   fly auth login
   ```

3. **Створіть fly.toml**:
   ```toml
   app = "deadline-tracker"
   primary_region = "fra"
   
   [build]
   
   [env]
     NODE_ENV = "production"
     PORT = "3001"
   
   [[services]]
     http_checks = []
     internal_port = 3001
     processes = ["app"]
     protocol = "tcp"
     script_checks = []
   
     [services.concurrency]
       hard_limit = 25
       soft_limit = 20
       type = "connections"
   
     [[services.ports]]
       force_https = true
       handlers = ["http"]
       port = 80
   
     [[services.ports]]
       handlers = ["tls", "http"]
       port = 443
   
     [[services.tcp_checks]]
       grace_period = "1s"
       interval = "15s"
       restart_limit = 0
       timeout = "2s"
   ```

4. **Деплой**:
   ```bash
   fly deploy
   ```

## Налаштування GitHub Actions (Автоматичний деплой)

### Для Railway + Vercel

Створіть `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: railway-app/railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

## Налаштування домену

### Railway
1. В налаштуваннях сервісу
2. Відкрийте "Domains"
3. Додайте ваш домен
4. Налаштуйте DNS записи

### Vercel
1. В налаштуваннях проекту
2. Відкрийте "Domains"
3. Додайте ваш домен
4. Налаштуйте DNS записи

## Моніторинг та логи

### Railway
- Логи доступні в панелі управління
- Метрики в реальному часі
- Автоматичне масштабування

### Vercel
- Analytics в панелі управління
- Логи функцій
- Performance monitoring

## Вирішення проблем

### Помилки збірки
1. Перевірте логи збірки
2. Переконайтеся, що всі залежності в package.json
3. Перевірте версії Node.js

### Помилки підключення до БД
1. Перевірте DATABASE_URL
2. Переконайтеся, що БД запущена
3. Перевірте налаштування мережі

### CORS помилки
1. Перевірте REACT_APP_API_URL
2. Додайте домен в CORS налаштування
3. Перевірте HTTPS

## Безпека

### Змінні середовища
- Ніколи не комітьте .env файли
- Використовуйте секрети в GitHub
- Регулярно оновлюйте JWT_SECRET

### HTTPS
- Всі платформи надають безкоштовний SSL
- Переконайтеся, що HTTPS увімкнено
- Використовуйте HSTS заголовки

## Оптимізація

### Backend
- Використовуйте кешування
- Оптимізуйте SQL запити
- Налаштуйте rate limiting

### Frontend
- Оптимізуйте зображення
- Використовуйте CDN
- Налаштуйте кешування

## Підтримка

- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Render: [render.com/docs](https://render.com/docs)
- Fly.io: [fly.io/docs](https://fly.io/docs)
