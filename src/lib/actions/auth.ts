"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserProfileByAuthId } from "@/lib/db/queries/platform";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const userProfile = await getUserProfileByAuthId(session.user.id);

  if (!userProfile) {
    return {
      ...session.user,
      profile: null,
      role: null,
    };
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