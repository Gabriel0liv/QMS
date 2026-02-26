import { useState } from "react";
import { AlertTriangle, RotateCcw, Send, Cpu, ClipboardList } from "lucide-react";

export function ChaoFabrica() {
  const [codigoArtigo, setCodigoArtigo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [destino, setDestino] = useState("");
  const [tipoDefeito, setTipoDefeito] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const artigos: Record<string, { maquina: string; ordemFabrico: string }> = {
    "ALU-2345-B": { maquina: "Injetora 04", ordemFabrico: "OF-2026-0234" },
    "ZNC-8821-A": { maquina: "Fundição 02", ordemFabrico: "OF-2026-0189" },
    "COP-1102-C": { maquina: "CNC-07", ordemFabrico: "OF-2026-0267" },
    "STL-4456-D": { maquina: "Montagem 03", ordemFabrico: "OF-2026-0245" },
  };

  const defeitosDisponiveis = [
    "Porosidade",
    "Dimensional fora de tolerância",
    "Rebarbas excessivas",
    "Inclusões",
    "Fissuras/Trincas",
    "Contaminação",
    "Acabamento superficial",
    "Montagem incorreta",
  ];

  const destinosDisponiveis = ["Sucata", "Derreter Injeção", "Derreter Interno", "Decapar"];

  const artigoInfo = artigos[codigoArtigo];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCodigoArtigo("");
      setQuantidade("");
      setDestino("");
      setTipoDefeito("");
    }, 2500);
  };

  const handleClear = () => {
    setCodigoArtigo("");
    setQuantidade("");
    setDestino("");
    setTipoDefeito("");
  };

  /* shared input class */
  const inputCls =
    "w-full rounded-xl border border-gray-400 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition";

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10">
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow">
          <AlertTriangle className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Chão de Fábrica</h1>
          <p className="text-sm text-gray-500">Registo de Não-Conformidades · Mod.094/E</p>
        </div>
      </div>

      {/* Success toast */}
      {submitted && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 shadow-sm">
          <svg className="h-5 w-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-medium text-green-800">Não-conformidade registada com sucesso!</span>
        </div>
      )}

      {/* ── Form ──────────────────────────────────── */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Código do Artigo */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">Código do Artigo</label>
              <span className="text-xs text-red-500">* Obrigatório</span>
            </div>
            <input
              type="text"
              placeholder="Ex: ALU-2345-B"
              className={inputCls}
              value={codigoArtigo}
              onChange={(e) => setCodigoArtigo(e.target.value.toUpperCase())}
              required
            />
            <p className="text-xs text-gray-400">
              Introduza o código para auto-preencher os dados da máquina
            </p>
          </div>

          {/* Auto-fill */}
          {artigoInfo && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Dados auto-preenchidos</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-blue-500 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Máquina</p>
                    <p className="text-sm font-semibold text-gray-900">{artigoInfo.maquina}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-blue-500 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Ordem de Fabrico</p>
                    <p className="text-sm font-semibold text-gray-900">{artigoInfo.ordemFabrico}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Quantidade + Destino: 2-col on md+ */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Quantidade</label>
                <span className="text-xs text-red-500">* Obrigatório</span>
              </div>
              <input
                type="number"
                placeholder="Ex: 150"
                className={inputCls}
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                min="1"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Destino</label>
                <span className="text-xs text-red-500">* Obrigatório</span>
              </div>
              <select
                className={inputCls}
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                required
              >
                <option value="" disabled>Selecione…</option>
                {destinosDisponiveis.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tipo de Defeito */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">Tipo de Defeito</label>
              <span className="text-xs text-red-500">* Obrigatório</span>
            </div>
            <select
              className={inputCls}
              value={tipoDefeito}
              onChange={(e) => setTipoDefeito(e.target.value)}
              required
            >
              <option value="" disabled>Selecione o tipo de defeito…</option>
              {defeitosDisponiveis.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400">Catálogo padronizado de defeitos</p>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 pt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-slate-50 transition-colors"
              onClick={handleClear}
            >
              <RotateCcw className="h-4 w-4" />
              Limpar
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
            >
              <Send className="h-4 w-4" />
              Registar Não-Conformidade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}