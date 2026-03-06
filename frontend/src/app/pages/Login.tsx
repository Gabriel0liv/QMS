import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Lock, User, Factory, ClipboardCheck,
  Settings2, FlaskConical, ShieldCheck,
} from "lucide-react";


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
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || "Credenciais inválidas. Tente novamente.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center ">
      <div
        className="w-full max-w-lg bg-base-100 rounded-2xl shadow-xl overflow-hidden"
        style={{ minHeight: "500px" }}
      >
        {/* ── Form panel ───────────────────────────────────────── */}
        <div className="h-full flex flex-col justify-center px-10 py-12">

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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full h-11 text-sm mt-6"
            >
              {loading && <span className="loading loading-spinner loading-sm" />}
              {loading ? "A autenticar…" : "Entrar"}
            </button>
          </form>


          <p className="text-xs text-base-content/25 mt-8">
            © 2026 QMS · Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
