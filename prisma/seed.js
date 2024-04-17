import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const data = [
    {
      name: "Mente",
    },
    {
      name: "Cuerpo",
    },
    {
      name: "Emociones",
    },
    {
      name: "Prosperidad",
    },
    {
      name: "Relaciones",
    },
    {
      name: "Espíritu",
    },
    {
      name: "Sanación",
    },
    {
      name: "Autoconocimiento",
    },
    {
      name: "Liderazgo",
    },
    {
      name: "Emprendimiento",
    },
    {
      name: "Transformación",
    },
  ];
  data.map(async (categoryRecord) => {
    const cat = await prisma.category.create({
      data: categoryRecord,
    });
    console.log(cat);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
