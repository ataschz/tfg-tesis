import { betterAuth } from "better-auth";
import { db } from "@/lib/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { v4 as uuidv4 } from "uuid";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  advanced: {
    database: {
      generateId: () => uuidv4(),
    },
  },
  emailVerification: {
    onEmailVerification: async (data) => {
      // Email verification completed
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [admin()],
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://192.168.100.168:3001",
  ],
});
