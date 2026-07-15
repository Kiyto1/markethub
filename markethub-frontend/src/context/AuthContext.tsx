import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import type { LoginResponse, Role, User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function roleHome(role: Role) {
  if (role === "CUSTOMER") return "/products";
  if (role === "SELLER") return "/seller";
  return "/admin";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const navigate = useNavigate();

  async function login(usernameOrEmail: string, password: string) {
    const res = await api.post<LoginResponse>("/api/auth/login", {
      usernameOrEmail,
      password,
    });
    const data = res.data;
    const loggedInUser: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
      active: data.active,
    };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setToken(data.token);
    setUser(loggedInUser);
    navigate(roleHome(data.role));
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/login");
  }

  function hasRole(role: Role) {
    return user?.role === role;
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}