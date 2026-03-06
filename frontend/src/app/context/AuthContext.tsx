import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { api, ApiUser } from "../services/api";

export type UserRole = "operator" | "quality" | "production" | "rd" | "admin";

interface User extends ApiUser {
  role: UserRole; // Mapeado do cargo do backend
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("qms_user");
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      // Se for um utilizador antigo (que tinha 'name' em vez de 'nome'), ignoramos
      if (parsed && !parsed.nome) {
        localStorage.removeItem("qms_user");
        return null;
      }
      // Se a sessão for antiga e não tiver 'role', mapeamos agora
      if (parsed && !parsed.role && parsed.cargo) {
        parsed.role = mapCargoToRole(parsed.cargo);
      }
      return parsed;
    } catch {
      return null;
    }
  });

  // Helper para converter a string do cargo no enum do frontend
  function mapCargoToRole(cargo: string | null | undefined): UserRole {
    const c = (cargo || "").toLowerCase();
    if (c.includes("admin")) return "admin";
    if (c.includes("qualidade")) return "quality";
    if (c.includes("producao")) return "production";
    if (c.includes("i&d") || c.includes("rd")) return "rd";
    return "operator";
  }

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const apiUser = await api.login(username, password);
      const mappedUser: User = {
        ...apiUser,
        role: mapCargoToRole(apiUser.cargo)
      };
      setUser(mappedUser);
      localStorage.setItem("qms_user", JSON.stringify(mappedUser));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("qms_user");
  };

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
