import { Outlet } from "react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

/**
 * Layout sem barra lateral para o perfil Operador.
 * Desenhado para tablets no chão de fábrica: alvos de toque grandes,
 * conteúdo centrado, mínima distracção.
 */
export function OperatorLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-slate-50" data-theme="qms">
            {/* Top bar mínima */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white border-b border-base-200 px-5 py-3 shadow-sm">
                <span className="text-lg font-extrabold text-primary">QMS</span>
                <div className="flex items-center gap-4">
                    <span className="hidden sm:block text-sm text-base-content/60">
                        {user?.name} · {user?.department}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="btn btn-ghost btn-sm gap-1.5 text-base-content/70"
                    >
                        <LogOut className="h-4 w-4" />
                        Sair
                    </button>
                </div>
            </header>

            {/* Conteúdo centrado */}
            <main className="pt-16 min-h-screen px-4">
                <Outlet />
            </main>
        </div>
    );
}
