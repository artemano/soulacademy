import { PrismaClient } from "@prisma/client";

// In oder to avoid crashes during debve
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a singleton client for prisma that is going to be used in services to connect to db.

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
