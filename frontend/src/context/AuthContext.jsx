"use client";
import { api } from "@/lib/api";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("dsa_token");

    if (token) {
      api
        .me() //restore session
        .then(setUser)
        .catch(() => localStorage.removeItem("dsa_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { token, user } = await api.login({ email, password });
    localStorage.setItem("token", token);
    setUser(user);
  };

  const register = async (name, email, password) => {
    const { token, user } = await api.register({ name, email, password });
    localStorage.setItem("dsa_token", token);
    setUser(user);
  };

  const logOut = () => {
    localStorage.removeItem("dsa_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
