import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router";
import {
    Factory, Package, FileText, LogOut, Menu, X,
    Wrench, Tag, ClipboardCheck, PenLine, Users, Server, MonitorSmartphone
} from "lucide-react";
import { useAuth, UserRole } from "../context/AuthContext";

interface NavItem {
    to: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    roles: UserRole[];
    isSubItem?: boolean;
}

const NAV_ITEMS: NavItem[] = [
    { to: "/registo-nc", label: "Registo NC", icon: Factory, roles: ["operator"] },
    { to: "/registo-nc?view=mobilidade", label: "Mobilidade", icon: MonitorSmartphone, roles: ["operator"], isSubItem: true },
    { to: "/registo-nc?view=chao_fabrica", label: "Chão de Fábrica", icon: Factory, roles: ["operator"], isSubItem: true },
    { to: "/recepcoes", label: "Receções", icon: Package, roles: ["quality"] },
    { to: "/retrabalho", label: "Retrabalho", icon: Wrench, roles: ["quality"] },
    { to: "/catalogo-defeitos", label: "Catálogo de Defeitos", icon: Tag, roles: ["quality"] },
    { to: "/validacao-nc", label: "Validação NC", icon: ClipboardCheck, roles: ["quality"] },
    { to: "/documentos-tecnicos", label: "Documentos Técnicos", icon: FileText, roles: ["quality", "production", "rd"] },
    { to: "/assinaturas", label: "Assinaturas", icon: PenLine, roles: ["quality", "production", "rd"] },
    { to: "/gestao-utilizadores", label: "Utilizadores", icon: Users, roles: ["admin"] },
    { to: "/estado-sistema", label: "Estado do Sistema", icon: Server, roles: ["admin"] },
];

/**
 * Layout principal para perfis de escritório com sidebar de navegação.
 */
export function MainLayout() {
    const { user, logout, hasRole } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const visibleItems = NAV_ITEMS.filter((item) => hasRole(...item.roles));

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const SidebarContent = () => (
        <>
            <div className="px-5 py-5 border-b border-base-200">
                <p className="text-xl font-extrabold text-primary tracking-tight">QMS</p>
                <p className="text-xs text-base-content/50 mt-0.5">Quality Management System</p>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-0.5">
                    {visibleItems.map(({ to, label, icon: Icon, isSubItem }) => {
                        const isActive = to.includes("?") 
                            ? location.pathname + location.search === to
                            : location.pathname === to && !location.search;
                            
                        return (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    onClick={() => setSidebarOpen(false)}
                                    className={() =>
                                        `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                                            isSubItem ? "ml-4 opacity-80" : ""
                                        } ${isActive
                                            ? "bg-primary text-primary-content shadow-sm"
                                            : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
                                        }`
                                    }
                                >
                                    <Icon className={isSubItem ? "h-3.5 w-3.5 shrink-0" : "h-4 w-4 shrink-0"} />
                                    {label}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="border-t border-base-200 bg-base-200/40 p-4 space-y-3">
                <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-9">
                            <span className="text-sm font-bold">
                                {user?.name.substring(0, 2).toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-base-content">{user?.name}</p>
                        <p className="truncate text-xs text-base-content/50">{user?.department}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="btn btn-ghost btn-sm w-full border border-base-300"
                >
                    <LogOut className="h-4 w-4" />
                    Sair
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-base-200" data-theme="qms">
            {/* Desktop sidebar */}
            <aside className="fixed top-0 left-0 hidden lg:flex lg:flex-col h-screen w-60 bg-base-100 border-r border-base-200 shadow-sm z-50">
                <SidebarContent />
            </aside>

            {/* Mobile top bar */}
            <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-base-100 border-b border-base-200 px-4 py-3 shadow-sm">
                <p className="text-lg font-extrabold text-primary">QMS</p>
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="btn btn-ghost btn-sm"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </header>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Mobile sidebar panel */}
            <aside
                className={`fixed top-0 left-0 z-50 flex h-screen w-64 flex-col bg-base-100 shadow-xl transition-transform duration-300 lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-3 right-3 btn btn-ghost btn-sm btn-circle"
                >
                    <X className="h-5 w-5" />
                </button>
                <SidebarContent />
            </aside>

            {/* Main content */}
            <main className="lg:ml-60 pt-14 lg:pt-0 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
}
