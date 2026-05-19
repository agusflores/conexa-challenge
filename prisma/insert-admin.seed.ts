import { PrismaClient, Role } from '@prisma/client';

import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.user.findUnique({
    where: {
      username: 'admin',
    },
  });

  if (adminExists) {
    return;
  }

  const hashedPassword = await bcrypt.hash('admin12345', 10);

  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
