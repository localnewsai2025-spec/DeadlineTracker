import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Створення реального користувача...');

  // Створюємо одного реального користувача
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@deadlinetracker.com' },
    update: {},
    create: {
      email: 'admin@deadlinetracker.com',
      firstName: 'Admin',
      lastName: 'User',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
    },
  });

  console.log('✅ Реальний користувач створений:', {
    email: admin.email,
    password: 'admin123',
    role: admin.role,
  });

  console.log('🎉 Готово! Тепер можна увійти з:');
  console.log('📧 Email: admin@deadlinetracker.com');
  console.log('🔑 Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Помилка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });