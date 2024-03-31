const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        {
          name: "Transformación",
        },
        {
          name: "Autoconocimiento",
        },
        {
          name: "Espiritualidad",
        },
        {
          name: "Esoterismo",
        },
        {
          name: "Coaching",
        },
        {
          name: "Filosofía",
        },
        {
          name: "Sanación",
        },
      ],
    });
    console.log("Listo!!! ");
  } catch (error) {
    console.log("Error cargando categorías en la base de datos", error);
  } finally {
    await database.$disconnect();
  }
}
main();
