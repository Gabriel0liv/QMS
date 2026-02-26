import { useState } from "react";
import { Plus, Trash2, Pencil, Send, X, Clock, CheckCircle, AlertTriangle } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface NCItem {
  id: string;
  codigoArtigo: string;
  quantidade: string;
  destino: string;
  tipoDefeito: string;
  maquina?: string;
  ordemFabrico?: string;
}

interface HistoricoNC {
  id: string;
  data: string;
  artigos: number;
  resumo: string;
}

// ── Static data ────────────────────────────────────────────────────────────
const ARTIGOS_DB: Record<string, { maquina: string; ordemFabrico: string }> = {
  "ALU-2345-B": { maquina: "Injetora 04",  ordemFabrico: "OF-2026-0234" },
  "ZNC-8821-A": { maquina: "Fundição 02",  ordemFabrico: "OF-2026-0189" },
  "COP-1102-C": { maquina: "CNC-07",       ordemFabrico: "OF-2026-0267" },
  "STL-4456-D": { maquina: "Montagem 03",  ordemFabrico: "OF-2026-0245" },
};

const DEFEITOS = [
  "Porosidade", "Dimensional fora de tolerância", "Rebarbas excessivas",
  "Inclusões", "Fissuras/Trincas", "Contaminação",
  "Acabamento superficial", "Montagem incorreta",
];

const DESTINOS = ["Sucata", "Derreter Injeção", "Derreter Interno", "Decapar"];

const HISTORICO_INICIAL: HistoricoNC[] = [
  { id: "nc-003", data: "26/02/2026 10:42", artigos: 3, resumo: "ALU-2345-B, ZNC-8821-A, STL-4456-D" },
  { id: "nc-002", data: "25/02/2026 14:15", artigos: 1, resumo: "COP-1102-C" },
  { id: "nc-001", data: "24/02/2026 08:30", artigos: 2, resumo: "ALU-2345-B, ZNC-8821-A" },
];

const emptyForm = () => ({ codigoArtigo: "", quantidade: "", destino: "", tipoDefeito: "" });

// ── Component ──────────────────────────────────────────────────────────────
export function ChaoFabrica() {
  const [modalOpen, setModalOpen] = useState(false);
  const [pending, setPending]     = useState<NCItem[]>([]);
  const [form, setForm]           = useState(emptyForm());
  const [editId, setEditId]       = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [historico, setHistorico] = useState<HistoricoNC[]>(HISTORICO_INICIAL);
  const [formError, setFormError] = useState("");

  const artigoInfo = ARTIGOS_DB[form.codigoArtigo];
  const set = (k: keyof ReturnType<typeof emptyForm>, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const resetForm = () => { setForm(emptyForm()); setEditId(null); setFormError(""); };

  const validate = () => {
    if (!form.codigoArtigo || !form.quantidade || !form.destino || !form.tipoDefeito)
      return "Preencha todos os campos obrigatórios.";
    if (Number(form.quantidade) < 1) return "Quantidade deve ser ≥ 1.";
    return "";
  };

  const handleAddItem = () => {
    const err = validate();
    if (err) { setFormError(err); return; }
    const base = { ...form, maquina: artigoInfo?.maquina, ordemFabrico: artigoInfo?.ordemFabrico };
    if (editId) {
      setPending((p) => p.map((i) => i.id === editId ? { ...base, id: editId } : i));
      setEditId(null);
    } else {
      setPending((p) => [...p, { ...base, id: crypto.randomUUID() }]);
    }
    resetForm();
  };

  const handleEdit = (item: NCItem) => {
    setForm({ codigoArtigo: item.codigoArtigo, quantidade: item.quantidade, destino: item.destino, tipoDefeito: item.tipoDefeito });
    setEditId(item.id);
    setFormError("");
  };

  const handleEnviar = () => {
    if (!pending.length) return;
    setHistorico((h) => [{
      id:      `nc-${Date.now()}`,
      data:    new Date().toLocaleString("pt-PT", { dateStyle: "short", timeStyle: "short" }),
      artigos: pending.length,
      resumo:  pending.map((i) => i.codigoArtigo).join(", "),
    }, ...h]);
    setPending([]);
    setModalOpen(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleClose = () => { resetForm(); setPending([]); setModalOpen(false); };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow">
            <AlertTriangle className="h-5 w-5 text-primary-content" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-base-content">Chão de Fábrica</h1>
            <p className="text-sm text-base-content/60">Não-Conformidades · Mod.094/E</p>
          </div>
        </div>
        <button className="btn btn-primary gap-2" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Adicionar NC
        </button>
      </div>

      {/* ── Toast ──────────────────────────────────────────────────────── */}
      {submitted && (
        <div className="alert alert-success mb-5 shadow-sm">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>Não-conformidades enviadas com sucesso!</span>
        </div>
      )}

      {/* ── History table ──────────────────────────────────────────────── */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-base-content/40" />
            <h2 className="font-semibold text-base-content">Histórico de Registos</h2>
          </div>

          {historico.length === 0 ? (
            <p className="text-sm text-base-content/50 text-center py-8">Sem registos anteriores.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th className="text-center">Artigos</th>
                    <th className="hidden sm:table-cell">Resumo</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {historico.map((h) => (
                    <tr key={h.id}>
                      <td className="font-mono text-xs whitespace-nowrap">{h.data}</td>
                      <td className="text-center">
                        <span className="badge badge-neutral badge-sm">{h.artigos}</span>
                      </td>
                      <td className="hidden sm:table-cell text-sm text-base-content/60 max-w-xs truncate">
                        {h.resumo}
                      </td>
                      <td>
                        <span className="badge badge-success badge-sm">Enviado</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL ──────────────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-base-100 w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 shrink-0">
              <div>
                <h2 className="font-bold text-base-content">Registar Não-Conformidades</h2>
                <p className="text-xs text-base-content/50">
                  {pending.length === 0
                    ? "Preencha o formulário e adicione artigos à lista"
                    : `${pending.length} artigo${pending.length > 1 ? "s" : ""} na lista`}
                </p>
              </div>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={handleClose}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body: scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* ── Form ─────────────────────────────────────────────── */}
              <div className="grid grid-cols-1 gap-4">

                {/* Código */}
                <div className="form-control gap-1">
                  <label className="label py-0">
                    <span className="label-text font-semibold">Código do Artigo <span className="text-error">*</span></span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: ALU-2345-B"
                    className="input input-bordered w-full"
                    value={form.codigoArtigo}
                    onChange={(e) => set("codigoArtigo", e.target.value.toUpperCase())}
                  />
                  {artigoInfo && (
                    <p className="text-xs text-primary font-medium">
                      ↳ {artigoInfo.maquina} · {artigoInfo.ordemFabrico}
                    </p>
                  )}
                </div>

                {/* Qty + Destino */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="form-control gap-1">
                    <label className="label py-0">
                      <span className="label-text font-semibold">Quantidade <span className="text-error">*</span></span>
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 50"
                      className="input input-bordered w-full"
                      min="1"
                      value={form.quantidade}
                      onChange={(e) => set("quantidade", e.target.value)}
                    />
                  </div>
                  <div className="form-control gap-1">
                    <label className="label py-0">
                      <span className="label-text font-semibold">Destino <span className="text-error">*</span></span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={form.destino}
                      onChange={(e) => set("destino", e.target.value)}
                    >
                      <option value="" disabled>Selecione…</option>
                      {DESTINOS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                {/* Defeito */}
                <div className="form-control gap-1">
                  <label className="label py-0">
                    <span className="label-text font-semibold">Tipo de Defeito <span className="text-error">*</span></span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={form.tipoDefeito}
                    onChange={(e) => set("tipoDefeito", e.target.value)}
                  >
                    <option value="" disabled>Selecione o defeito…</option>
                    {DEFEITOS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>

                {formError && (
                  <p className="text-sm text-error">{formError}</p>
                )}

                {/* Add button */}
                <div className="flex gap-2 justify-end">
                  {editId && (
                    <button className="btn btn-ghost btn-sm" onClick={resetForm}>
                      Cancelar edição
                    </button>
                  )}
                  <button className="btn btn-secondary gap-2 w-full" onClick={handleAddItem}>
                    <Plus className="h-4 w-4" />
                    {editId ? "Actualizar artigo" : "Adicionar à lista"}
                  </button>
                </div>
              </div>

              {/* ── Staged list ──────────────────────────────────────── */}
              {pending.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-base-200">
                  <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50 pt-2">
                    lista de artigos ({pending.length})
                  </p>
                  {pending.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`card border shadow-none bg-base-50 transition-all ${
                        editId === item.id
                          ? "border-secondary ring-2 ring-secondary/20"
                          : "border-base-300 bg-base-100"
                      }`}
                    >
                      <div className="card-body p-3 flex-row items-center gap-3">
                        <div className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-content text-xs font-bold">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-sm font-semibold leading-tight">
                            {item.codigoArtigo}
                          </p>
                          <p className="text-xs text-base-content/60 truncate">
                            {item.quantidade} un · {item.destino} · {item.tipoDefeito}
                          </p>
                          {item.maquina && (
                            <p className="text-xs text-primary/70 truncate">
                              {item.maquina} · {item.ordemFabrico}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            className="btn btn-ghost btn-xs btn-circle"
                            title="Editar"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            className="btn btn-ghost btn-xs btn-circle text-error"
                            title="Remover"
                            onClick={() => setPending((p) => p.filter((i) => i.id !== item.id))}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="border-t border-base-200 px-6 py-4 flex items-center justify-between gap-3 shrink-0">
              <button className="btn btn-ghost" onClick={handleClose}>Cancelar</button>
              <button
                className="btn btn-primary gap-2"
                disabled={pending.length === 0}
                onClick={handleEnviar}
              >
                <Send className="h-4 w-4" />
                Enviar {pending.length > 0 ? `${pending.length} artigo${pending.length > 1 ? "s" : ""}` : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}