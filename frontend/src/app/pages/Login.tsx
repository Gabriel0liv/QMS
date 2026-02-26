import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Lock, User } from "lucide-react";

const DEMO_USERS = [
  { label: "Operador", cred: "operador / 123" },
  { label: "Qualidade", cred: "qualidade / 123" },
  { label: "Produção", cred: "producao / 123" },
  { label: "I&D", cred: "rd / 123" },
  { label: "Admin (TI)", cred: "admin / 123" },
];

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const ok = login(username, password);
    setLoading(false);
    if (!ok) {
      setError("Credenciais inválidas. Tente novamente.");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[540px]">

        {/* Left branding panel */}
        <div className="hidden md:flex md:w-2/5 bg-blue-600 flex-col justify-between p-10 text-white">
          <div>
            <div className="text-4xl font-extrabold tracking-tight mb-1">QMS</div>
            <div className="text-blue-200 text-sm font-medium">Quality Management System</div>
          </div>

          <div className="space-y-5">
            {[
              { icon: "🏭", title: "Chão de Fábrica", desc: "Registo de Não-Conformidades" },
              { icon: "🔍", title: "Inspeção", desc: "Controlo de receções e matérias-primas" },
              { icon: "📄", title: "Documentação", desc: "Especificações e desenhos técnicos" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-blue-200 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-blue-300 text-xs">
            © 2026 QMS · Todos os direitos reservados
          </p>
        </div>

        {/* Right form panel */}
        <div className="flex flex-col justify-center flex-1 p-8 sm:p-12">
          {/* Mobile-only title */}
          <div className="md:hidden text-center mb-8">
            <p className="text-3xl font-extrabold text-blue-600">QMS</p>
            <p className="text-sm text-gray-400">Quality Management System</p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Bem-vindo</h2>
          <p className="text-sm text-gray-500 mb-8">Introduza as suas credenciais para aceder</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Utilizador</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Nome de utilizador"
                  autoComplete="username"
                  className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Palavra-passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 py-3 text-gray-900 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 text-sm transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : null}
              {loading ? "A autenticar…" : "Entrar"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
              Credenciais de demonstração
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.label}
                  type="button"
                  onClick={() => {
                    const [usr] = u.cred.split(" / ");
                    setUsername(usr);
                    setPassword("123");
                    setError("");
                  }}
                  className="text-left rounded-lg border border-gray-200 px-3 py-2 hover:bg-blue-50 hover:border-blue-300 transition group"
                >
                  <p className="text-xs font-semibold text-gray-700 group-hover:text-blue-700">{u.label}</p>
                  <p className="text-xs text-gray-400 font-mono">{u.cred}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
