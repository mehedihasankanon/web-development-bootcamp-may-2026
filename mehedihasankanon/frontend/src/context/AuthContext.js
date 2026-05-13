/**
 * AuthContext
 *
 * used for setting up authentication state globally.
 *
 */

"use client";

// create context and use context -> used for global state management
// usestate and useeffect -> used for managing state and side effects
import { createContext, useContext, useState, useEffect } from "react";

// router
import { useRouter } from "next/navigation";

// api call for auth
import api from "@/lib/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // global loading state -> prevents rendering auth page before checking token
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      api
        .get("/users/profile")
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem("token", res.data.token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    router.push("/auth/login");
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem("token", res.data.token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// use context hook
// this lets components access auth state and functions
export function useAuth() {
  return useContext(AuthContext);
}
