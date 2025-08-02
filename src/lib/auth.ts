import { betterAuth } from "better-auth";
import { db } from "@/lib/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { v4 as uuidv4 } from "uuid";
import { admin } from "better-auth/plugins";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserProfileByAuthId } from "@/lib/db/queries/platform";

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

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const userProfile = await getUserProfileByAuthId(session.user.id);

  if (!userProfile) {
    redirect("/profile/setup");
  }

  // Determine user role based on profile data
  let role: "client" | "contractor" | "mediator" = "client";
  
  if (userProfile.userType === "contractor") {
    role = "contractor";
  } else if (userProfile.userType === "mediator") {
    role = "mediator";
  } else if (userProfile.userType === "client") {
    role = "client";
  }

  return {
    ...session.user,
    profile: userProfile,
    role,
  };
}
