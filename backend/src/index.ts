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
    'https://deadline-tracker-sand.vercel.app',
    'https://deadline-tracker.vercel.app',
    'http://localhost:5173',
    config.frontend.url
  ],
  credentials: true,
}));

// Rate limiting - зменшено для Render
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 хвилин
  max: 50, // зменшено до 50 запитів
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

// Health check для Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
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
