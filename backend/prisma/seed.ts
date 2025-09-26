import { PrismaClient, UserRole, TaskStatus, TaskPriority, ProjectStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Початок заповнення бази даних...');

  // Створюємо користувачів
  const hashedPassword = await bcrypt.hash('password123', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      firstName: 'Супер',
      lastName: 'Адмін',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      firstName: 'Менеджер',
      lastName: 'Проєкту',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  const projectLead = await prisma.user.upsert({
    where: { email: 'lead@example.com' },
    update: {},
    create: {
      email: 'lead@example.com',
      firstName: 'Керівник',
      lastName: 'Команди',
      password: hashedPassword,
      role: UserRole.PROJECT_LEAD,
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      email: 'student1@example.com',
      firstName: 'Студент',
      lastName: 'Перший',
      password: hashedPassword,
      role: UserRole.STUDENT,
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@example.com' },
    update: {},
    create: {
      email: 'student2@example.com',
      firstName: 'Студент',
      lastName: 'Другий',
      password: hashedPassword,
      role: UserRole.STUDENT,
    },
  });

  console.log('👥 Користувачі створені');

  // Створюємо проєкти
  const project1 = await prisma.project.create({
    data: {
      name: 'Веб-додаток DeadlineTracker',
      description: 'Розробка веб-додатку для відстеження дедлайнів',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: ProjectStatus.ACTIVE,
      creatorId: projectLead.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Навчальний курс з програмування',
      description: 'Курс з вивчення мови програмування JavaScript',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-06-30'),
      status: ProjectStatus.ACTIVE,
      creatorId: admin.id,
    },
  });

  console.log('📁 Проєкти створені');

  // Додаємо учасників до проєктів
  await prisma.projectMember.createMany({
    data: [
      {
        projectId: project1.id,
        userId: student1.id,
        role: 'member',
      },
      {
        projectId: project1.id,
        userId: student2.id,
        role: 'member',
      },
      {
        projectId: project2.id,
        userId: student1.id,
        role: 'member',
      },
    ],
  });

  console.log('👥 Учасники додані до проєктів');

  // Створюємо завдання
  const task1 = await prisma.task.create({
    data: {
      title: 'Створити дизайн інтерфейсу',
      description: 'Розробити макети основних екранів додатку',
      deadline: new Date('2024-03-15'),
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      creatorId: projectLead.id,
      assigneeId: student1.id,
      projectId: project1.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Налаштувати базу даних',
      description: 'Створити схему бази даних та налаштувати Prisma',
      deadline: new Date('2024-03-20'),
      status: TaskStatus.NOT_STARTED,
      priority: TaskPriority.HIGH,
      creatorId: projectLead.id,
      assigneeId: student2.id,
      projectId: project1.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Реалізувати автентифікацію',
      description: 'Створити систему входу та реєстрації користувачів',
      deadline: new Date('2024-03-25'),
      status: TaskStatus.NOT_STARTED,
      priority: TaskPriority.MEDIUM,
      creatorId: projectLead.id,
      assigneeId: student1.id,
      projectId: project1.id,
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: 'Вивчити основи JavaScript',
      description: 'Пройти перші 5 уроків курсу',
      deadline: new Date('2024-03-10'),
      status: TaskStatus.COMPLETED,
      priority: TaskPriority.LOW,
      creatorId: admin.id,
      assigneeId: student1.id,
      projectId: project2.id,
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: 'Практичне завдання з функцій',
      description: 'Виконати 10 вправ з функцій JavaScript',
      deadline: new Date('2024-03-18'),
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.MEDIUM,
      creatorId: admin.id,
      assigneeId: student2.id,
      projectId: project2.id,
    },
  });

  console.log('📋 Завдання створені');

  // Створюємо нагадування
  await prisma.reminder.createMany({
    data: [
      {
        taskId: task1.id,
        userId: student1.id,
        remindAt: new Date('2024-03-14T09:00:00Z'),
        type: 'PUSH',
      },
      {
        taskId: task2.id,
        userId: student2.id,
        remindAt: new Date('2024-03-19T09:00:00Z'),
        type: 'PUSH',
      },
      {
        taskId: task3.id,
        userId: student1.id,
        remindAt: new Date('2024-03-24T09:00:00Z'),
        type: 'PUSH',
      },
    ],
  });

  console.log('🔔 Нагадування створені');

  // Створюємо коментарі
  await prisma.comment.createMany({
    data: [
      {
        taskId: task1.id,
        userId: student1.id,
        content: 'Почав роботу над дизайном. Планую завершити до кінця тижня.',
      },
      {
        taskId: task1.id,
        userId: projectLead.id,
        content: 'Добре! Не забудьте про адаптивність для мобільних пристроїв.',
      },
      {
        taskId: task4.id,
        userId: student1.id,
        content: 'Завдання виконано. Всі уроки пройдені успішно.',
      },
    ],
  });

  console.log('💬 Коментарі створені');

  // Створюємо сповіщення
  await prisma.notification.createMany({
    data: [
      {
        userId: student1.id,
        title: 'Нове завдання',
        message: 'Вам призначено нове завдання: "Створити дизайн інтерфейсу"',
        type: 'info',
      },
      {
        userId: student2.id,
        title: 'Нове завдання',
        message: 'Вам призначено нове завдання: "Налаштувати базу даних"',
        type: 'info',
      },
      {
        userId: student1.id,
        title: 'Завдання виконано',
        message: 'Завдання "Вивчити основи JavaScript" позначено як виконане',
        type: 'success',
      },
    ],
  });

  console.log('📢 Сповіщення створені');

  console.log('✅ База даних успішно заповнена!');
  console.log('\n📝 Тестові облікові записи:');
  console.log('👑 Супер-адміністратор: admin@example.com / password123');
  console.log('👨‍💼 Адміністратор: manager@example.com / password123');
  console.log('👨‍🏫 Керівник проєкту: lead@example.com / password123');
  console.log('👨‍🎓 Студент 1: student1@example.com / password123');
  console.log('👨‍🎓 Студент 2: student2@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Помилка при заповненні бази даних:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
