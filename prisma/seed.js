import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed: Creating Admin User...');

  // Credentials
  const email = 'admin@test.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create or Update Admin User
  const user = await prisma.user.upsert({
    where: { email: email },
    update: {
      password: hashedPassword,
    },
    create: {
      email: email,
      name: 'System Administrator',
      password: hashedPassword,
      user_id: 'admin-001',
      isActive: true,
    },
  });

  console.log(`Success! Admin user is ready: ${user.email}`);
  console.log('You can now log in and create your first organization/enterprise.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
