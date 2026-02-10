import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const company = await prisma.company.create({
    data: {
      name: 'Empresa Teste',
      slug: 'empresa-teste',
    },
  });

  console.log('✅ Company criada:');
  console.log(company);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
