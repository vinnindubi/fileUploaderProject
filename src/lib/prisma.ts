import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { createRequire } from "module";
import type { PrismaClient as PrismaClientType } from "@prisma/client";

// Ensure environment variables are loaded early
import "dotenv/config";

const { Pool } = pg;

// 1. The foolproof ESM workaround we built earlier
const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");

// 2. Set up the native PostgreSQL connection pool
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

// 3. Wrap the native pool in Prisma's adapter
const adapter = new PrismaPg(pool);

// 4. THE FIX: Pass the adapter into the PrismaClient constructor!
const prisma = new PrismaClient({ adapter }) as PrismaClientType;

export default prisma;