import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "operator" | "quality" | "production" | "rd" | "admin";

interface User {
  name: string;
  role: UserRole;
  department: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<string, { password: string; user: User }> = {
  operador: {
    password: "123",
    user: { name: "Manuel Costa", role: "operator", department: "Produção" },
  },
  qualidade: {
    password: "123",
    user: { name: "João Silva", role: "quality", department: "Qualidade" },
  },
  producao: {
    password: "123",
    user: { name: "Carlos Neves", role: "production", department: "Produção" },
  },
  rd: {
    password: "123",
    user: { name: "Sofia Lopes", role: "rd", department: "I&D" },
  },
  admin: {
    password: "123",
    user: { name: "Ana Ferreira", role: "admin", department: "TI" },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    const record = mockUsers[username.toLowerCase()];
    if (record && record.password === password) {
      setUser(record.user);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
