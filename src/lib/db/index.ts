import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL must defined");
}

export const client = postgres(connectionString, {
  prepare: false,
  max: 10, // Límite máximo de conexiones
  idle_timeout: 20, // Tiempo de espera en segundos
  connect_timeout: 10, // Tiempo límite de conexión
  types: {
    timestamp: {
      to: 1114,
      from: [1114, 1184],
      serialize: (value: string) => value,
      parse: (value: string) => value,
    },
  },
});
export const db = drizzle(client, { schema });

// Re-export schema tables for easier imports
export {
  userProfiles,
  contractorProfiles,
  clientProfiles,
  contracts,
  payments,
  disputes,
  disputeEvidence,
  reviews,
  notifications,
  statusHistory,
} from "./schema/platform";
