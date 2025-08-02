"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getUserProfileByAuthId } from "@/lib/db/queries/platform";

interface UserProfile {
  id: string;
  authId: string;
  firstName: string;
  lastName: string;
  userType: string;
  clientProfile?: {
    company?: string;
  } | null;
}

interface User {
  id: string;
  email: string;
  profile?: UserProfile | null;
  role?: "client" | "contractor" | "mediator" | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const session = await authClient.getSession();

      if (!session.data) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Get user profile from server action
      const response = await fetch("/api/auth/profile");
      if (!response.ok) {
        setUser({
          id: session.data.user.id,
          email: session.data.user.email,
          profile: null,
          role: null,
        });
        setLoading(false);
        return;
      }

      const profileData = await response.json();

      let role: "client" | "contractor" | "mediator" = "client";
      if (profileData.userType === "contractor") {
        role = "contractor";
      } else if (profileData.userType === "mediator") {
        role = "mediator";
      } else if (profileData.userType === "client") {
        role = "client";
      }

      setUser({
        id: session.data.user.id,
        email: session.data.user.email,
        profile: profileData,
        role,
      });
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    loadUser();

    // Listen for auth state changes
    const unsubscribe = authClient.onSessionChange((session) => {
      if (session) {
        loadUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
