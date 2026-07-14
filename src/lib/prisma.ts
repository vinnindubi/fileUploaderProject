// 1. Import the blueprint (TypeScript will erase this before Node.js runs!)
import type { PrismaClient as PrismaClientType } from "@prisma/client";

// 2. The standard ESM runtime trick for Node.js
import pkg from "@prisma/client";

// 3. Merge them together! Tell TypeScript exactly what pkg.PrismaClient is.
const PrismaClient = pkg.PrismaClient as typeof PrismaClientType;

// Initialize the single, globally shared instance
const prisma = new PrismaClient();

export default prisma;