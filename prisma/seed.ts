import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash('TuPasswordSeguro123', 10);

  await prisma.user.upsert({
    where: { email: 'daniieldz10@gmail.com' },
    update: {},
    create: {
      email: 'daniieldz10@gmail.com',
      password: password,
      role: 'ADMIN',
    },
  });
  console.log('🌱 Admin sembrado correctamente');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
