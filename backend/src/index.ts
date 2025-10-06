import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { ReminderService } from './services/reminderService';
import * as cron from 'node-cron';

const app = express();

// Trust proxy for Render
app.set('trust proxy', 1);

// Middleware для безпеки
app.use(helmet());

// CORS
app.use(cors({
  origin: [
    config.frontend.url,
    'https://deadline-tracker-sand.vercel.app',
    'https://deadline-tracker.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 хвилин
  max: 100, // максимум 100 запитів на IP за 15 хвилин
  message: 'Занадто багато запитів з цього IP, спробуйте пізніше',
});
app.use('/api/', limiter);

// Парсинг JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Статичні файли
app.use('/uploads', express.static(config.upload.dir));

// API маршрути
app.use('/api', routes);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

// Обробка помилок
app.use(notFoundHandler);
app.use(errorHandler);

// Запуск сервера
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на порту ${PORT}`);
  console.log(`📱 Frontend URL: ${config.frontend.url}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
});

// Планувальник для обробки нагадувань - ВИМКНЕНО
// cron.schedule('* * * * *', async () => {
//   try {
//     await ReminderService.processReminders();
//   } catch (error) {
//     console.error('Помилка при обробці нагадувань:', error);
//   }
// });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM отримано, завершуємо сервер...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT отримано, завершуємо сервер...');
  process.exit(0);
});

export default app;
