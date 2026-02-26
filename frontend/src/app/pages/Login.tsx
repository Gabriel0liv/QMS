import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Lock, User, Factory, ClipboardCheck,
  Settings2, FlaskConical, ShieldCheck,
} from "lucide-react";

const DEMO_USERS = [
  { icon: Factory,        label: "Operador",   username: "operador"  },
  { icon: ClipboardCheck, label: "Qualidade",  username: "qualidade" },
  { icon: Settings2,      label: "Produção",   username: "producao"  },
  { icon: FlaskConical,   label: "I&D",        username: "rd"        },
  { icon: ShieldCheck,    label: "Admin (TI)", username: "admin"     },
];

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) { setError("Preencha todos os campos."); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 350));
    const ok = login(username, password);
    setLoading(false);
    if (!ok) { setError("Credenciais inválidas. Tente novamente."); setPassword(""); }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center ">
      {/*
        max-w-4xl  = 56rem = 896px  — bom equilíbrio para login desktop
        md:h-[580px] fixa a altura para que a imagem preencha toda a seção
      */}
      <div
        className="w-full max-w-4xl bg-base-100 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row"
        style={{ minHeight: "600px" }}
      >
        {/* ── Left: full-bleed image, sem nenhum padding ─────────────── */}
        <div className="hidden md:block w-3/5 relative">
          <img
            src="/img-fechadura.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* ── Right: form panel ───────────────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12">

          {/* Mobile-only logo */}
          <div className="md:hidden text-center mb-8">
            <p className="text-4xl font-extrabold" style={{ color: "var(--brand-primary)" }}>QMS</p>
            <p className="text-xs text-base-content/50">Quality Management System</p>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-base-content">Bem-vindo</h2>
          <p className="text-sm text-base-content/50 mt-1 mb-8">
            Introduza as suas credenciais para aceder ao sistema
          </p>

          {/* ── Form: inputs and button with identical height (h-11) ── */}
          <form onSubmit={handleSubmit} noValidate>

            <div className="flex flex-col gap-5">
              {/* Utilizador */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-base-content mb-1.5"
                >
                  Utilizador
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40 pointer-events-none" />
                  <input
                    id="username"
                    type="text"
                    placeholder="Nome de utilizador"
                    autoComplete="username"
                    className="input input-bordered w-full h-11 pl-9 text-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Palavra-passe */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-base-content mb-1.5"
                >
                  Palavra-passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40 pointer-events-none" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="input input-bordered w-full h-11 pl-9 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-error mt-3">{error}</p>
            )}

            {/* Submit — mesma altura h-11 e largura total dos inputs */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full h-11 text-sm mt-6"
            >
              {loading && <span className="loading loading-spinner loading-sm" />}
              {loading ? "A autenticar…" : "Entrar"}
            </button>
          </form>

          {/* Demo quick-access icon buttons */}
          <div className="mt-8 pt-6 border-t border-base-200">
            <p className="text-xs font-semibold uppercase tracking-widest text-base-content/35 mb-3">
              Acesso rápido (demo)
            </p>
            <div className="flex items-center gap-2">
              {DEMO_USERS.map(({ icon: Icon, label, username: u }) => (
                <div key={u} className="tooltip tooltip-top" data-tip={label}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-circle border border-base-300 hover:border-primary hover:text-primary hover:bg-primary/10"
                    onClick={() => { setUsername(u); setPassword("123"); setError(""); }}
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-base-content/25 mt-8">
            © 2026 QMS · Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
