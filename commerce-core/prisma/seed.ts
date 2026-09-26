import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: 'electronics' }, update: {}, create: { name: 'Electronics', slug: 'electronics' }
  });
  await prisma.user.upsert({
    where: { email: 'admin@commercecore.dev' },
    update: { role: Role.ADMIN },
    create: { email: 'admin@commercecore.dev', passwordHash: await bcrypt.hash('Admin123!', 12), role: Role.ADMIN, cart: { create: {} } }
  });
  await prisma.product.upsert({
    where: { slug: 'wireless-headphones' }, update: {},
    create: { name: 'Wireless Headphones', slug: 'wireless-headphones', description: 'Comfortable over-ear headphones with clear sound.', price: 7999, inventory: 25, categoryId: category.id }
  });
  console.log('Demo data created. Admin: admin@commercecore.dev / Admin123!');
}
main().finally(() => prisma.$disconnect());
