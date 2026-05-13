// === database connection

import dotenv from "dotenv";
import path from "path";

const __dirname = path.resolve();

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });

// ===