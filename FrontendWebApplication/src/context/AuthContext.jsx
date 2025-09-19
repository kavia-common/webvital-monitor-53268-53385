import React, { createContext, useContext, useEffect, useState } from "react";
import { me, logout as doLogout } from "../api/auth";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context */
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides auth state and actions to the app */
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const u = await me();
        setUser(u);
      } catch {
        setUser(null);
      } finally {
        setInitializing(false);
      }
    }
    const token = localStorage.getItem("access_token");
    if (token) {
      init();
    } else {
      setInitializing(false);
    }
  }, []);

  const value = {
    user,
    setUser,
    initializing,
    logout: () => {
      doLogout();
      setUser(null);
      window.location.href = "/login";
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function RequireAuth({ children }) {
  /** Protects child routes, redirecting to login if not authenticated */
  const { user, initializing } = useAuth();
  if (initializing) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  if (!user) {
    window.location.href = "/login";
    return null;
  }
  return children;
}
