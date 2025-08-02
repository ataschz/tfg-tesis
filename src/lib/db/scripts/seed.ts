import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import fs from "fs";
import path from "path";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const runSeed = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const connection = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(connection);

  console.log("⏳ Running seed script...");

  const start = Date.now();

  // Read the SQL file
  const sqlPath = path.join(__dirname, "seed.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  try {
    // Execute the SQL
    await connection.unsafe(sql);
    
    const end = Date.now();
    console.log("✅ Seed completed in", end - start, "ms");
    
    console.log("\n📊 Data seeded:");
    console.log("- 1 usuario existente (conservado)");
    console.log("- 3 contratistas nuevos");
    console.log("- 3 contratantes nuevos");
    console.log("- 5 contratos con diferentes estados");
    console.log("- Milestones, pagos, reviews y disputas");
    console.log("- Notificaciones y suscripciones");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    throw error;
  } finally {
    await connection.end();
  }

  process.exit(0);
};

runSeed().catch((err) => {
  console.error("❌ Seed script failed");
  console.error(err);
  process.exit(1);
});