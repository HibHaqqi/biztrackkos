import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userEmail = 'haqqi09@gmail.com';
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    console.error(`User with email ${userEmail} not found.`);
    return;
  }

  console.log(`Found user: ${user.name} (${user.id})`);

  const updatedCustomers = await prisma.customer.updateMany({
    where: { userId: null },
    data: { userId: user.id },
  });

  console.log(`Updated ${updatedCustomers.count} customers.`);

  const updatedTransactions = await prisma.transaction.updateMany({
    where: { userId: null },
    data: { userId: user.id },
  });

  console.log(`Updated ${updatedTransactions.count} transactions.`);

  const updatedRooms = await prisma.room.updateMany({
    where: { userId: null },
    data: { userId: user.id },
  });

  console.log(`Updated ${updatedRooms.count} rooms.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });