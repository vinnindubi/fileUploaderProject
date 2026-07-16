import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

// 1. Set up the native PostgreSQL connection pool
const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

// 2. Wrap the pool in Prisma's adapter
const adapter = new PrismaPg(pool);

// 3. Initialize the query builder with the adapter
const prisma = new PrismaClient({ adapter });

export default prisma;