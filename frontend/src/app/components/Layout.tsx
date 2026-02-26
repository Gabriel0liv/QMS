import { useState } from "react";
import { Outlet, NavLink } from "react-router";
import {
  Factory, Package, FileText, LogOut, Menu, X,
  Wrench, Tag, ClipboardCheck, PenLine,
  Users, Server,
} from "lucide-react";
import { useAuth, UserRole } from "../context/AuthContext";
import { useNavigate } from "react-router";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { to: "/chao-fabrica", label: "Chão de Fábrica", icon: Factory, roles: ["operator"] },
  { to: "/recepcoes", label: "Receções", icon: Package, roles: ["quality"] },
  { to: "/retrabalho", label: "Retrabalho", icon: Wrench, roles: ["quality"] },
  { to: "/catalogo-defeitos", label: "Catálogo de Defeitos", icon: Tag, roles: ["quality"] },
  { to: "/validacao-nc", label: "Validação NC", icon: ClipboardCheck, roles: ["quality"] },
  { to: "/documentos-tecnicos", label: "Documentos Técnicos", icon: FileText, roles: ["quality", "production", "rd"] },
  { to: "/assinaturas", label: "Assinaturas", icon: PenLine, roles: ["quality", "production", "rd"] },
  { to: "/gestao-utilizadores", label: "Utilizadores", icon: Users, roles: ["admin"] },
  { to: "/estado-sistema", label: "Estado do Sistema", icon: Server, roles: ["admin"] },
];

export function Layout() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isOperator = user?.role === "operator";
  const visibleItems = NAV_ITEMS.filter((item) => hasRole(...item.roles));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const SidebarContent = () => (
    <>
      <div className="px-5 py-5 border-b border-gray-100">
        <p className="text-xl font-extrabold text-blue-600 tracking-tight">QMS</p>
        <p className="text-xs text-gray-400 mt-0.5">Quality Management System</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {visibleItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-slate-100 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold shrink-0">
            {user?.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">{user?.name}</p>
            <p className="truncate text-xs text-gray-500">{user?.department}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </>
  );

  /* ── Operator: no sidebar, fullscreen ─────────────────────────────── */
  if (isOperator) {
    return (
      <div className="min-h-screen bg-slate-50" data-theme="corporate">
        {/* Minimal top bar for operator */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white border-b border-gray-100 px-5 py-3 shadow-sm">
          <p className="text-base font-extrabold text-blue-600">QMS</p>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-gray-400">
              {user?.name} · {user?.department}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Sair
            </button>
          </div>
        </header>
        <main className="pt-14 min-h-screen">
          <Outlet />
        </main>
      </div>
    );
  }

  /* ── Other roles: sidebar layout ──────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-50" data-theme="corporate">
      {/* Desktop sidebar */}
      <aside className="fixed top-0 left-0 hidden lg:flex lg:flex-col h-screen w-60 bg-white border-r border-gray-100 shadow-sm z-50">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white border-b border-gray-100 px-4 py-3 shadow-sm">
        <p className="text-lg font-extrabold text-blue-600">QMS</p>
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-gray-500 hover:bg-slate-100 transition-colors"
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
        className={`fixed top-0 left-0 z-50 flex h-screen w-64 flex-col bg-white shadow-xl transition-transform duration-300 lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-3 right-3 rounded-lg p-1.5 text-gray-400 hover:bg-slate-100 transition-colors"
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