# API Документація DeadlineTracker

## Базовий URL
```
http://localhost:3001/api
```

## Автентифікація

Всі захищені маршрути вимагають JWT токен в заголовку:
```
Authorization: Bearer <token>
```

## Коди відповідей

- `200` - Успіх
- `201` - Створено
- `400` - Невірний запит
- `401` - Неавторизований
- `403` - Доступ заборонено
- `404` - Не знайдено
- `500` - Помилка сервера

## Формат відповіді

```json
{
  "success": true,
  "data": { ... },
  "message": "Повідомлення",
  "error": "Помилка"
}
```

## Маршрути

### Автентифікація

#### POST /auth/register
Реєстрація нового користувача

**Тіло запиту:**
```json
{
  "email": "user@example.com",
  "firstName": "Іван",
  "lastName": "Іванов",
  "password": "password123"
}
```

**Відповідь:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt-token"
  }
}
```

#### POST /auth/login
Вхід в систему

**Тіло запиту:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /auth/profile
Отримання профілю користувача (захищений)

#### PUT /auth/profile
Оновлення профілю користувача (захищений)

#### PUT /auth/change-password
Зміна пароля (захищений)

### Завдання

#### GET /tasks
Отримання списку завдань (захищений)

**Параметри запиту:**
- `page` - номер сторінки (за замовчуванням 1)
- `limit` - кількість елементів на сторінці (за замовчуванням 10)
- `status` - фільтр за статусом
- `priority` - фільтр за пріоритетом
- `assigneeId` - фільтр за виконавцем
- `projectId` - фільтр за проєктом

#### GET /tasks/:id
Отримання завдання за ID (захищений)

#### POST /tasks
Створення нового завдання (захищений)

**Тіло запиту:**
```json
{
  "title": "Назва завдання",
  "description": "Опис завдання",
  "deadline": "2024-12-31T23:59:59Z",
  "priority": "HIGH",
  "assigneeId": "user-id",
  "projectId": "project-id"
}
```

#### PUT /tasks/:id
Оновлення завдання (захищений)

#### DELETE /tasks/:id
Видалення завдання (захищений)

#### PATCH /tasks/:id/status
Зміна статусу завдання (захищений)

**Тіло запиту:**
```json
{
  "status": "COMPLETED"
}
```

#### GET /tasks/overdue
Отримання прострочених завдань (захищений)

#### GET /tasks/upcoming
Отримання майбутніх завдань (захищений)

**Параметри запиту:**
- `days` - кількість днів вперед (за замовчуванням 7)

### Проєкти

#### GET /projects
Отримання списку проєктів (захищений)

#### GET /projects/:id
Отримання проєкту за ID (захищений)

#### POST /projects
Створення нового проєкту (захищений)

**Тіло запиту:**
```json
{
  "name": "Назва проєкту",
  "description": "Опис проєкту",
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z"
}
```

#### PUT /projects/:id
Оновлення проєкту (захищений)

#### DELETE /projects/:id
Видалення проєкту (захищений)

#### GET /projects/:id/stats
Отримання статистики проєкту (захищений)

#### POST /projects/:id/members
Додавання учасника до проєкту (захищений)

**Тіло запиту:**
```json
{
  "userId": "user-id",
  "role": "member"
}
```

#### DELETE /projects/:id/members/:userId
Видалення учасника з проєкту (захищений)

#### PUT /projects/:id/members/:userId/role
Зміна ролі учасника проєкту (захищений)

### Нагадування

#### POST /reminders
Створення нагадування (захищений)

**Тіло запиту:**
```json
{
  "taskId": "task-id",
  "remindAt": "2024-12-31T09:00:00Z",
  "type": "PUSH"
}
```

#### GET /reminders/task/:taskId
Отримання нагадувань для завдання (захищений)

#### PUT /reminders/:id
Оновлення нагадування (захищений)

#### DELETE /reminders/:id
Видалення нагадування (захищений)

#### GET /reminders/upcoming
Отримання майбутніх нагадувань (захищений)

### Користувачі (тільки для адміністраторів)

#### GET /users
Отримання списку користувачів (захищений, адмін)

#### GET /users/:id
Отримання користувача за ID (захищений)

#### PUT /users/:id
Оновлення користувача (захищений)

#### DELETE /users/:id
Видалення користувача (захищений)

#### PUT /users/:id/role
Зміна ролі користувача (захищений, адмін)

#### GET /users/:id/stats
Отримання статистики користувача (захищений)

## Типи даних

### UserRole
```typescript
enum UserRole {
  STUDENT = 'STUDENT',
  PROJECT_LEAD = 'PROJECT_LEAD',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}
```

### TaskStatus
```typescript
enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE'
}
```

### TaskPriority
```typescript
enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}
```

### ReminderType
```typescript
enum ReminderType {
  PUSH = 'PUSH',
  EMAIL = 'EMAIL'
}
```

### ProjectStatus
```typescript
enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  COMPLETED = 'COMPLETED'
}
```

## Приклади використання

### JavaScript/TypeScript

```javascript
// Автентифікація
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await response.json();
const token = data.token;

// Створення завдання
const taskResponse = await fetch('/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Нове завдання',
    description: 'Опис завдання',
    deadline: '2024-12-31T23:59:59Z',
    priority: 'HIGH'
  })
});
```

### cURL

```bash
# Автентифікація
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Створення завдання
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Нове завдання","deadline":"2024-12-31T23:59:59Z"}'
```
