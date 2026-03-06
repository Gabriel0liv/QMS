import { useState, useRef, useEffect, useMemo } from "react";
import { Plus, Trash2, Pencil, Send, X, Clock, CheckCircle, AlertTriangle, Search, List, LayoutGrid, Filter, ArrowLeft, ChevronRight, ChevronLeft, MonitorSmartphone, Factory, Undo2, ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router";
import { api, ApiArtigo, ApiDefeito, ApiNCRow } from "../services/api";
import { useAuth } from "../context/AuthContext";

// ── constant data ─────────────────────────────────────────────────────────
const DESTINOS = [
  { label: "Derreter",    codigo: "CR001" },
  { label: "Decapar",     codigo: "CQT01" },
  { label: "Sucatar",     codigo: "CS001" },
];


// ── Types ──────────────────────────────────────────────────────────────────
interface NCRow {
  id?: string;
  codigoArtigo: string;
  descricao: string;
  quantidade: string;
  destino: string;
  codigoDestino: string;
  defeito: string;
  defeitoId: string;
  observacoes: string;
  maquinaCodigo: string;
}


interface HistoricoItem {
  id?: string;
  data: string;
  codigoArtigo: string;
  descricao: string;
  quantidade: string;
  destino: string;
  codigoDestino: string;
  defeito: string;
  observacoes: string;
  estadoMovimentacao: string;
  maquinaCodigo: string;
}


interface DraftState {
  codigoArtigo: string;
  descricao: string;
  quantidade: string;
  destino: string;
  codigoDestino: string;
  defeito: string;
  defeitoId: string;
  observacoes: string;
  maquinaCodigo: string;
}


// ── Types e Mock Removido ────────────────────────────────────────────────


const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// ── Components ─────────────────────────────────────────────────────────────

function ArtigoInput({ value, onChange }: { value: string; onChange: (code: string, desc: string) => void }) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<ApiArtigo[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]   = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        const res = await api.searchArtigos(query);
        setResults(res);
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  return (
    <div ref={ref} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/30" />
        <input 
          autoFocus
          className="input input-bordered w-full pl-9 h-10 text-sm font-mono uppercase" 
          placeholder="CÓDIGO OU DESIGNÇÃO..." 
          value={query}
          onFocus={() => { if (results.length) setOpen(true); }}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onChange={(e) => {
            const v = e.target.value.toUpperCase();
            setQuery(v);
            setOpen(v.length >= 2);
            onChange(v, ""); // Limpa a descrição até selecionar um match
          }}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="loading loading-spinner loading-xs opacity-30"></span>
          </div>
        )}
      </div>
      {open && results.length > 0 && (
        <ul className="absolute z-[1001] top-full left-0 mt-0.5 w-full bg-base-100 border border-base-200 rounded-lg shadow-xl overflow-y-auto max-h-48 p-0">
          {results.map(m => (
            <li key={m.artigoCodigo}>
              <button 
                type="button"
                className="w-full text-left px-3 py-1.5 hover:bg-primary hover:text-primary-content transition-colors flex flex-col border-b border-base-100 last:border-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(m.artigoCodigo, m.descricao);
                  setQuery(m.artigoCodigo);
                  setOpen(false);
                }}
              >
                <span className="font-mono font-black text-[10px]">{m.artigoCodigo}</span>
                <span className="text-[9px] opacity-70 truncate font-bold">{m.descricao}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MaquinaInput({ value, onChange, options = [] }: { value: string; onChange: (code: string) => void; options?: { maquinaCodigo: string; descricao: string }[] }) {
  const [query, setQuery] = useState(value);
  const [open, setOpen]   = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  const filtered = useMemo(() => {
    if (!query) return options;
    return options
      .filter(m => m.maquinaCodigo.toUpperCase().includes(query.toUpperCase()) || m.descricao.toUpperCase().includes(query.toUpperCase()));
  }, [query, options]);

  return (
    <div ref={ref} className="relative w-full group">
      <div className="relative">
        <MonitorSmartphone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/30 group-focus-within:text-primary transition-colors" />
        <input 
          className="input input-bordered w-full pl-9 pr-8 h-10 text-sm font-mono uppercase bg-base-100/50 focus:bg-base-100 transition-all border-base-200 focus:border-primary shadow-sm" 
          placeholder="PESQUISAR MÁQUINA..." 
          value={query}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onChange={(e) => {
            const v = e.target.value.toUpperCase();
            setQuery(v);
            setOpen(true);
            onChange(v);
          }}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer opacity-30 hover:opacity-100 transition-opacity" onClick={() => setOpen(!open)}>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </div>
      {open && filtered.length > 0 && (
        <ul className="absolute z-[1001] top-full left-0 mt-0.5 w-full bg-base-100 border border-base-200 rounded-lg shadow-xl overflow-y-auto max-h-48 p-0">
          {filtered.map(m => (
            <li key={m.maquinaCodigo}>
              <button 
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-primary hover:text-primary-content transition-colors flex flex-col border-b border-base-100 last:border-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(m.maquinaCodigo);
                  setQuery(m.maquinaCodigo);
                  setOpen(false);
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono font-black text-xs">{m.maquinaCodigo}</span>
                </div>
                <span className="text-[9px] opacity-70 truncate font-bold uppercase tracking-tight">{m.descricao}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DefeitoInput({ value, onChange, options = [] }: { value: string; onChange: (desc: string, id: string) => void; options?: ApiDefeito[] }) {
  const [query, setQuery] = useState(value);
  const [open, setOpen]   = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  const filtered = useMemo(() => {
    if (!query) return options;
    return options
      .filter(d => d.descricao.toUpperCase().includes(query.toUpperCase()) || d.id.toString().includes(query));
  }, [query, options]);

  return (
    <div ref={ref} className="relative w-full group">
      <div className="relative">
        <AlertTriangle className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/30 group-focus-within:text-primary transition-colors" />
        <input 
          className="input input-bordered w-full pl-9 pr-8 h-10 text-sm font-bold uppercase bg-base-100/50 focus:bg-base-100 transition-all border-base-200 focus:border-primary shadow-sm" 
          placeholder="PESQUISAR DEFEITO..." 
          value={query}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onChange={(e) => {
            const v = e.target.value.toUpperCase();
            setQuery(v);
            setOpen(true);
            onChange(v, "");
          }}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer opacity-30 hover:opacity-100 transition-opacity" onClick={() => setOpen(!open)}>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </div>
      </div>
      {open && filtered.length > 0 && (
        <ul className="absolute z-[1001] top-full left-0 mt-0.5 w-full bg-base-100 border border-base-200 rounded-lg shadow-xl overflow-y-auto max-h-48 p-0">
          {filtered.map(d => (
            <li key={d.id}>
              <button 
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-primary hover:text-primary-content transition-colors flex flex-col border-b border-base-100 last:border-0"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(d.descricao, d.id.toString());
                  setQuery(d.descricao);
                  setOpen(false);
                }}
              >
                <span className="text-xs font-black uppercase tracking-tight">{d.descricao}</span>
                <span className="text-[8px] opacity-60 font-mono italic">#{d.id}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RegistrationView({ onSave, onBack, maquinas, defeitos, onRefreshHistory }: { onSave: (items: NCRow[]) => void; onBack: () => void; maquinas: { maquinaCodigo: string; descricao: string }[]; defeitos: ApiDefeito[]; onRefreshHistory: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [draft, setDraft] = useState<DraftState>({ codigoArtigo: "", descricao: "", quantidade: "", destino: "", codigoDestino: "", defeito: "", defeitoId: "", observacoes: "", maquinaCodigo: "" });

  const { user } = useAuth();

  const handleManualSave = async () => {
    if (!draft.codigoArtigo || !draft.quantidade || !draft.destino || !draft.defeito) {
      setError("Preencha os campos obrigatórios (*)");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const rowWithUser = {
        ...draft,
        utilizadorCodigo: user?.utilizadorCodigo || "DESCONHECIDO"
      };
      
      await api.saveNC([rowWithUser]);
      await onRefreshHistory();
      
      // Limpar formulário após sucesso
      setDraft({ codigoArtigo: "", descricao: "", quantidade: "", destino: "", codigoDestino: "", defeito: "", defeitoId: "", observacoes: "", maquinaCodigo: "" });
      onBack(); // Volta para a lista de histórico
    } catch (err: any) {
      setError("Erro ao gravar no servidor: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (draft.codigoArtigo || draft.quantidade) {
      setShowCancelModal(true);
    } else {
       onBack();
    }
  };

  const handleConfirmCancel = () => {
    setDraft({ codigoArtigo: "", descricao: "", quantidade: "", destino: "", codigoDestino: "", defeito: "", defeitoId: "", observacoes: "", maquinaCodigo: "" });
    setShowCancelModal(false);
    onBack();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 bg-base-300/40 animate-in fade-in duration-150">
      <div className="bg-base-100 rounded-3xl shadow-2xl border border-base-200 w-full max-w-2xl overflow-visible animate-in fade-in duration-200">
        
        {/* ── HEADER ── */}
        <div className="px-6 py-4 border-b border-base-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><Plus className="h-5 w-5"/></div>
            <h2 className="text-lg font-black uppercase tracking-tight">Nova Não-Conformidade</h2>
          </div>
          <button className="btn btn-ghost btn-circle btn-sm" onClick={handleCancel}><X className="h-5 w-5"/></button>
        </div>

        {/* ── FORM GRID ── */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Row 1 */}
            <div className="space-y-1">
              <label className="label py-0 text-[10px] font-black uppercase opacity-60">Artigo *</label>
              <ArtigoInput value={draft.codigoArtigo} onChange={(c, d) => setDraft(v => ({...v, codigoArtigo: c, descricao: d}))} />
            </div>
            <div className="space-y-1">
              <label className="label py-0 text-[10px] font-black uppercase opacity-60">Designação (Auto)</label>
              <input 
                type="text" 
                className="input input-bordered w-full h-10 text-xs font-bold uppercase opacity-50 bg-base-200 cursor-not-allowed" 
                value={draft.descricao} 
                disabled 
                placeholder="AGUARDAR SELEÇÃO..." 
              />
            </div>

            {/* Row 2 */}
            <div className="space-y-1">
              <label className="label py-0 text-[10px] font-black uppercase opacity-60">Quantidade *</label>
              <input type="number" min="0" className="input input-bordered h-10 w-full font-black text-sm" value={draft.quantidade} onChange={e => setDraft(v => ({...v, quantidade: e.target.value}))} placeholder="0" />
            </div>
            <div className="space-y-1">
              <label className="label py-0 text-[10px] font-black uppercase opacity-60">Máquina (Código)</label>
              <MaquinaInput value={draft.maquinaCodigo} options={maquinas} onChange={c => setDraft(v => ({...v, maquinaCodigo: c}))} />
            </div>

            {/* Row 3 */}
            <div className="space-y-1">
              <label className="label py-0 text-[10px] font-black uppercase opacity-60">Destino *</label>
              <select 
                className="select select-bordered w-full h-10 font-black text-sm uppercase bg-base-100 min-h-0"
                value={draft.destino}
                onChange={e => setDraft(v => ({...v, destino: e.target.value, codigoDestino: DESTINOS.find(d => d.label === e.target.value)?.codigo || ""}))}
              >
                <option value="" disabled>Selecionar Destino...</option>
                {DESTINOS.map(d => (
                  <option key={d.codigo} value={d.label}>{d.label.toUpperCase()} ({d.codigo})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="label py-0 text-[10px] font-black uppercase opacity-60">Defeito *</label>
              <DefeitoInput value={draft.defeito} options={defeitos} onChange={(d, id) => setDraft(v => ({...v, defeito: d, defeitoId: id}))} />
            </div>
          </div>

          {/* Row 4 - Observations */}
          <div className="space-y-1">
            <label className="label py-0 text-[10px] font-black uppercase opacity-60">Observações (Opcional)</label>
            <textarea 
              className="textarea textarea-bordered w-full h-20 min-h-[80px] text-xs font-bold p-3 resize-none" 
              value={draft.observacoes} 
              onChange={e => setDraft(v => ({...v, observacoes: e.target.value}))} 
              placeholder="Instruções ou notas adicionais..."
            />
          </div>

          {error && (
            <div className="p-3 bg-error/10 text-error text-[10px] font-black rounded-xl uppercase flex items-center gap-2 border border-error/20">
              <AlertTriangle className="h-4 w-4"/>
              {error}
            </div>
          )}
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="p-4 border-t border-base-200 bg-base-200/30 flex gap-3">
          <button className="btn btn-ghost h-11 min-h-0 flex-1 rounded-xl font-black uppercase text-xs opacity-60" onClick={handleCancel}>
            Cancelar
          </button>
          <button 
            className={`btn btn-primary h-11 min-h-0 flex-[2] rounded-xl shadow-lg shadow-primary/20 gap-2 ${loading ? "loading" : ""}`}
            disabled={loading}
            onClick={handleManualSave}
          >
            {!loading && <CheckCircle className="h-4 w-4"/>}
            <span className="text-xs font-black uppercase tracking-widest leading-none">
              {loading ? "A GRAVAR..." : "REGISTAR NC"}
            </span>
          </button>
        </div>
      </div>

      {/* ── CANCEL MODAL ── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-6 bg-base-300/60 animate-in fade-in">
          <div className="bg-base-100 rounded-3xl shadow-2xl border border-base-200 w-full max-w-md overflow-hidden animate-in fade-in duration-150">
            <div className="p-10 text-center space-y-6">
              <div className="h-20 w-20 bg-warning/10 text-warning rounded-3xl flex items-center justify-center mx-auto shadow-inner"><AlertTriangle className="h-10 w-10"/></div>
              <div className="space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tight">Cancelar Registo?</h3>
                <p className="text-sm font-bold opacity-50 px-6">Os dados inseridos serão perdidos.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 p-6 gap-3 bg-base-200/50">
              <button className="btn btn-ghost h-16 rounded-2xl font-black uppercase tracking-widest text-[10px]" onClick={() => setShowCancelModal(false)}>Manter</button>
              <button className="btn btn-error h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-error/20" onClick={handleConfirmCancel}>Sim, Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function RegistoNC() {
  const { hasRole } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewParam = searchParams.get("view");
  
  // Logic to determine initial view based on param or last saved view
  const getInitialView = () => {
    if (viewParam === "mobilidade") return "IFRAME_MOBILIDADE";
    if (viewParam === "chao_fabrica") return "IFRAME_CHAO_FAB_VIEW";
    if (viewParam === "add") return "ADD";
    if (!viewParam) {
      const last = localStorage.getItem("nc_last_active_view");
      if (last === "ADD") return "ADD";
    }
    return "LIST";
  };

  const [currentView, setCurrentView] = useState<"LIST" | "ADD" | "IFRAME_MOBILIDADE" | "IFRAME_CHAO_FAB_VIEW" | null>(null);

  // Initialize view and handle persistence
  useEffect(() => {
    const v = getInitialView();
    setCurrentView(v);
  }, [viewParam]);

  const setView = (v: "LIST" | "ADD" | "IFRAME_MOBILIDADE" | "IFRAME_CHAO_FAB_VIEW") => {
    setCurrentView(v);
    if (v === "LIST") {
      setSearchParams({});
      localStorage.setItem("nc_last_active_view", "LIST");
    } else if (v === "ADD") {
      setSearchParams({ view: "add" });
      localStorage.setItem("nc_last_active_view", "ADD");
    } else if (v === "IFRAME_MOBILIDADE") {
      setSearchParams({ view: "mobilidade" });
    } else if (v === "IFRAME_CHAO_FAB_VIEW") {
      setSearchParams({ view: "chao_fabrica" });
    }
  };

  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [defeitosGerais, setDefeitosGerais] = useState<ApiDefeito[]>([]);
  const [maquinas, setMaquinas] = useState<{ maquinaCodigo: string; descricao: string }[]>([]);
  
  const refreshHistory = async () => {
    const data = await api.getHistorico();
    setHistorico(data as any);
  };

  useEffect(() => {
    refreshHistory();
    api.getDefeitos().then(setDefeitosGerais);
    api.getMaquinas().then(setMaquinas);
  }, []);
  const [submitted, setSubmitted] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({ data: "", dataOperator: "=", artigo: "", designacao: "", qtd: "", qtdOperator: "=", destino: "", obs: "", estado: "" });
  const [draftFilters, setDraftFilters] = useState({ data: "", dataOperator: "=", artigo: "", designacao: "", qtd: "", qtdOperator: "=", destino: "", obs: "", estado: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingRecord, setEditingRecord] = useState<HistoricoItem | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [viewParam]);

  const filteredHistory = useMemo(() => {
    return historico.filter(h => {
      let matchData = true;
      if (appliedFilters.data) {
         // Otimização: Evitar split repetido se possível, mas mantendo a lógica se h.data for string "dd/MM/yyyy HH:mm"
         const [datePart] = h.data.split(" ");
         const [d, m, y] = datePart.split("/");
         if (y && m && d) {
           const itemDateStr = `${y}-${m}-${d}`;
           if (appliedFilters.dataOperator === ">") matchData = itemDateStr > appliedFilters.data;
           else if (appliedFilters.dataOperator === "<") matchData = itemDateStr < appliedFilters.data;
           else matchData = itemDateStr === appliedFilters.data;
         }
      }
      const matchArtigo = h.codigoArtigo.toLowerCase().includes(appliedFilters.artigo.toLowerCase());
      const matchDesignacao = h.descricao.toLowerCase().includes(appliedFilters.designacao.toLowerCase());
      const matchDestino = h.destino.toLowerCase().includes(appliedFilters.destino.toLowerCase());
      const matchObs = h.observacoes.toLowerCase().includes(appliedFilters.obs.toLowerCase());
      const matchEstado = appliedFilters.estado === "" || h.estadoMovimentacao === appliedFilters.estado;

      let matchQtd = true;
      if (appliedFilters.qtd.trim() !== "") {
        const filterQtd = parseInt(appliedFilters.qtd.trim(), 10);
        const itemQtd = parseInt(h.quantidade, 10);
        if (!isNaN(itemQtd) && !isNaN(filterQtd)) {
          switch (appliedFilters.qtdOperator) {
            case ">": matchQtd = itemQtd > filterQtd; break;
            case "<": matchQtd = itemQtd < filterQtd; break;
            case ">=": matchQtd = itemQtd >= filterQtd; break;
            case "<=": matchQtd = itemQtd <= filterQtd; break;
            default: matchQtd = itemQtd === filterQtd; break;
          }
        } else if (!isNaN(filterQtd)) matchQtd = false;
        else matchQtd = h.quantidade.includes(appliedFilters.qtd.trim());
      }
      return matchData && matchArtigo && matchDesignacao && matchDestino && matchObs && matchEstado && matchQtd;
    });
  }, [historico, appliedFilters]);

  const handleSave = () => {
    setSubmitted(true);
    setView("LIST");
    setTimeout(() => setSubmitted(false), 3000);
  };

  const toggleEstado = (id: string) => {
    setHistorico((prev: HistoricoItem[]) => prev.map(h => {
      if (h.id === id) {
        if (h.estadoMovimentacao === "concluído") return h;
        return { ...h, estadoMovimentacao: h.estadoMovimentacao === "pendente" ? "movimentado" : "pendente" };
      }
      return h;
    }));
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm("Tem a certeza que deseja eliminar este registo?")) {
      setHistorico((prev: HistoricoItem[]) => prev.filter(h => h.id !== id));
    }
  };

  const handleSaveEdit = () => {
    if (editingRecord) {
      setHistorico((prev: HistoricoItem[]) => prev.map(h => h.id === editingRecord.id ? editingRecord : h));
      setEditingRecord(null);
    }
  };

  const currentItem = filteredHistory[currentIndex];

  const IframeHeader = () => (
    currentItem ? (
      <div className="bg-base-100 border-b border-base-200 shadow-sm p-2 flex items-center justify-between z-10 shrink-0 h-20">
        <div className="flex items-center gap-1 md:gap-4 flex-1 min-w-0">
          <button className="btn btn-ghost btn-circle btn-sm" onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} disabled={currentIndex === 0}><ChevronLeft className="h-5 w-5" /></button>
          <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 items-center px-2">
            <div className="hidden md:block">
              <div className="text-[9px] uppercase font-black opacity-40">Data / Hora</div>
              <div className="text-xs font-mono font-bold truncate">{currentItem.data}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase font-black opacity-40">Artigo</div>
              <div className="text-xs font-black text-primary truncate">{currentItem.codigoArtigo}</div>
            </div>
            <div className="hidden md:block">
              <div className="text-[9px] uppercase font-black opacity-40">Designação</div>
              <div className="text-xs font-bold opacity-80 truncate">{currentItem.descricao}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase font-black opacity-40">Qtd</div>
              <div className="text-xs font-black truncate">{currentItem.quantidade} UN</div>
            </div>
            <div>
              <div className="text-[9px] uppercase font-black opacity-40">Defeito</div>
              <div className="text-xs font-bold truncate text-error/70">{currentItem.defeito}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase font-black opacity-40">Destino</div>
              <div className="text-xs font-bold truncate">{currentItem.destino}</div>
            </div>
          </div>

          <div className="pr-2 border-l border-base-200 pl-4 h-full flex flex-col items-center justify-center w-28 md:w-36">
            <span className="text-[9px] uppercase font-black opacity-40 mb-1">Estado</span>
            <button className={`badge ${currentItem.estadoMovimentacao === "pendente" ? "badge-warning" : "badge-success"} font-black text-[10px] h-6 w-full uppercase border-0 cursor-pointer`} onClick={() => toggleEstado(currentItem.id || "")}>
              {currentItem.estadoMovimentacao}
            </button>
          </div>
          <button className="btn btn-ghost btn-circle btn-sm" onClick={() => setCurrentIndex(prev => Math.min(filteredHistory.length - 1, prev + 1))} disabled={currentIndex === filteredHistory.length - 1}><ChevronRight className="h-5 w-5" /></button>
        </div>
      </div>
    ) : (
      <div className="bg-base-100 border-b border-base-200 p-4 shrink-0 flex items-center justify-center text-sm font-bold opacity-50 h-20">
        Nenhum registo disponível ou filtros demasiado restritivos.
      </div>
    )
  );

  return (
    <div className="h-[calc(100vh-64px)] w-full flex flex-col bg-base-100 overflow-hidden lg:h-screen">
      
      {/* ── LIST VIEW ── */}
      <div className={`flex-1 overflow-y-auto p-4 lg:p-10 ${currentView === "LIST" ? "block" : "hidden"}`}>
        <div className="max-w-[1500px] mx-auto space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3">
                 <Factory className="h-7 w-7 text-primary-content" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Registo Produto Não Conforme</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">Controlo de Qualidade</span>
                  <div className="h-1 w-1 rounded-full bg-base-content/20"></div>
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1.5"><Clock className="h-3 w-3"/> HISTÓRICO GLOBAL</span>
                </div>
              </div>
            </div>
          </div>

          {submitted && <div className="alert alert-success py-4 font-black text-xs uppercase animate-in slide-in-from-top-4"><CheckCircle className="h-5 w-5"/> Registos enviados com sucesso!</div>}

          <div className="bg-base-100 rounded-[2.5rem] border border-base-200 shadow-xl overflow-hidden">
            <div className="px-8 py-6 border-b border-base-200 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-widest opacity-40 flex items-center gap-3"><List className="h-4 w-4"/> Visão Geral</h2>
              <div className="flex items-center gap-3">
                <button 
                  className={`btn h-10 min-h-0 px-4 rounded-xl ${showFilters ? 'btn-primary shadow-lg shadow-primary/20' : 'btn-ghost'}`} 
                  onClick={() => {
                    setDraftFilters(appliedFilters);
                    setShowFilters(true);
                  }}
                >
                  <Filter className="h-4 w-4" />
                  <span className="text-xs font-black uppercase tracking-widest leading-none mt-0.5">Filtros</span>
                </button>
                <button 
                  className="btn btn-primary h-10 min-h-0 rounded-xl gap-2 px-6 shadow-xl shadow-primary/20" 
                  onClick={() => setView("ADD")}
                >
                  <Plus className="h-4 w-4"/>
                  <span className="font-black uppercase tracking-widest text-xs leading-none mt-0.5">Registar NC</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto min-h-[400px] relative">
              <table className="table table-zebra w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-base-200/30">
                    <th className="p-4"><span className="text-[9px] font-black uppercase opacity-40">Data</span></th>
                    <th className="p-4"><span className="text-[9px] font-black uppercase opacity-40">Artigo</span></th>
                    <th className="p-4"><span className="text-[9px] font-black uppercase opacity-40">Máquina</span></th>
                    <th className="p-4"><span className="text-[9px] font-black uppercase opacity-40">Designação</span></th>
                    <th className="p-4 text-center"><span className="text-[9px] font-black uppercase opacity-40">Qtd</span></th>
                    <th className="p-4"><span className="text-[9px] font-black uppercase opacity-40">Defeito</span></th>
                    <th className="p-4"><span className="text-[9px] font-black uppercase opacity-40">Destino</span></th>

                    <th className="p-4 text-center w-36"><span className="text-[9px] font-black uppercase opacity-40 block w-full">Estado</span></th>
                    <th className="p-4 w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((h, idx) => (
                      <tr key={h.id || `hist-${idx}`} className="hover:bg-primary/5 transition-colors group">
                        <td className="p-4 font-mono text-[11px] opacity-40">{h.data}</td>
                        <td className="p-4 font-mono text-sm font-black text-primary">{h.codigoArtigo}</td>
                        <td className="p-4">
                           <span className="badge badge-ghost font-black text-[10px] uppercase opacity-60 h-5">{h.maquinaCodigo || "ND"}</span>
                        </td>
                        <td className="p-4 text-xs font-bold opacity-80 uppercase truncate max-w-xs">{h.descricao}</td>
                        <td className="p-4 text-center text-sm font-black">{h.quantidade}</td>
                        <td className="p-4 text-[10px] font-bold opacity-60 uppercase">{h.defeito}</td>
                        <td className="p-4 text-xs font-black uppercase">{h.destino}</td>

                        <td className="p-4 text-right w-36">
                          <button 
                            className={`badge ${h.estadoMovimentacao === 'pendente' ? 'badge-warning' : h.estadoMovimentacao === 'movimentado' ? 'badge-info' : 'badge-success'} badge-outline font-black text-[9px] h-5 w-24 uppercase cursor-pointer text-center flex justify-center`} 
                            onClick={() => toggleEstado(h.id || "")}
                          >
                            {h.estadoMovimentacao}
                          </button>
                        </td>
                        <td className="p-4 pr-6 text-right w-24">
                          {!hasRole("operator") && (
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="btn btn-ghost btn-xs btn-circle hover:text-primary" onClick={() => setEditingRecord({...h})}><Pencil className="h-3.5 w-3.5"/></button>
                              <button className="btn btn-ghost btn-xs btn-circle hover:text-error" onClick={() => handleDeleteRecord(h.id || "")}><Trash2 className="h-3.5 w-3.5"/></button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="p-0">
                        <div className="flex flex-col items-center justify-center py-20 text-base-content/20 gap-4">
                          <div className="h-16 w-16 bg-base-200 rounded-3xl flex items-center justify-center">
                            <Search className="h-8 w-8 opacity-20" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-black uppercase tracking-widest">Nenhum registo encontrado</p>
                            <p className="text-[10px] uppercase font-bold opacity-50 mt-1">Experimente ajustar os filtros ou registar uma nova NC</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── ADD VIEW ── */}
      <div className={`flex-1 overflow-y-auto p-4 md:p-8 ${currentView === "ADD" ? "block" : "hidden"}`}>
        <RegistrationView onSave={handleSave} onBack={() => setView("LIST")} maquinas={maquinas} defeitos={defeitosGerais} onRefreshHistory={refreshHistory} />
      </div>

      {/* ── IFRAME MOBILIDADE ── */}
      <div className={`flex-1 flex flex-col ${currentView === "IFRAME_MOBILIDADE" ? "flex" : "hidden"}`}>
         <IframeHeader />
         <div className="flex-1 bg-white relative">
            <iframe src="http://192.168.0.18:90" className="absolute inset-0 w-full h-full border-0" title="Mobilidade" />
         </div>
      </div>

      {/* ── IFRAME CHAO FABRICA ── */}
      <div className={`flex-1 flex flex-col ${currentView === "IFRAME_CHAO_FAB_VIEW" ? "flex" : "hidden"}`}>
         <IframeHeader />
         <div className="flex-1 bg-white relative">
            <iframe src="http://192.168.0.18:81" className="absolute inset-0 w-full h-full border-0" title="Chao de Fabrica" />
         </div>
      </div>

      {/* ── EDIT OVERLAY ── */}
      {editingRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-base-300/40 animate-in fade-in">
          <div className="bg-base-100 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl border border-base-200">
             <h3 className="font-black uppercase text-sm">Editar Registo de NC</h3>
              <div className="space-y-4 pt-2">
                <div>
                  <label className="label py-0 mb-1 text-[10px] font-black uppercase opacity-60">Artigo</label>
                  <ArtigoInput value={editingRecord.codigoArtigo} onChange={(c, d) => setEditingRecord((v: HistoricoItem | null) => v ? ({...v, codigoArtigo: c, descricao: d}) : null)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label py-0 mb-1 text-[10px] font-black uppercase opacity-60">Qtd</label>
                    <input type="number" min="0" className="input input-bordered w-full font-black h-10" value={editingRecord.quantidade} onChange={e => setEditingRecord((v: HistoricoItem | null) => v ? ({...v, quantidade: e.target.value}) : null)} />
                  </div>
                  <div>
                    <label className="label py-0 mb-1 text-[10px] font-black uppercase opacity-60">Máquina</label>
                    <MaquinaInput value={editingRecord.maquinaCodigo} options={maquinas} onChange={c => setEditingRecord((v: HistoricoItem | null) => v ? ({...v, maquinaCodigo: c}) : null)} />
                  </div>
                </div>
                <div>
                  <label className="label py-0 mb-1 text-[10px] font-black uppercase opacity-60">Defeito</label>
                  <DefeitoInput value={editingRecord.defeito} options={defeitosGerais} onChange={(d, id) => setEditingRecord((v: HistoricoItem | null) => v ? ({...v, defeito: d, defeitoId: id}) : null)} />
                </div>
                <div>
                  <label className="label py-0 mb-1 text-[10px] font-black uppercase opacity-60">Destino</label>
                  <select className="select select-bordered w-full font-black text-sm uppercase h-10 min-h-0" value={editingRecord.destino} onChange={e => setEditingRecord((v: HistoricoItem | null) => v ? ({...v, destino: e.target.value, codigoDestino: DESTINOS.find(x => x.label === e.target.value)?.codigo || ""}) : null)} >
                    {DESTINOS.map(d => <option key={d.codigo} value={d.label}>{d.label.toUpperCase()}</option>)}
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button className="btn btn-ghost flex-1 font-black uppercase rounded-xl h-10 min-h-0" onClick={() => setEditingRecord(null)}>CANCELAR</button>
                  <button className="btn btn-primary flex-1 font-black uppercase rounded-xl h-10 min-h-0 shadow-lg shadow-primary/20" onClick={handleSaveEdit}>GRAVAR</button>
                </div>
              </div>
          </div>
        </div>
      )}
      {/* ── FILTER MODAL ── */}
      {showFilters && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-base-300/40 animate-in fade-in">
          <div className="bg-base-100 rounded-3xl w-full max-w-lg shadow-2xl border border-base-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-base-200 flex items-center justify-between">
              <h3 className="font-black uppercase flex items-center gap-2 tracking-tight"><Filter className="h-5 w-5"/> Filtros de Pesquisa</h3>
              <button className="btn btn-ghost btn-circle btn-sm hover:bg-base-200" onClick={() => setShowFilters(false)}><X className="h-4 w-4"/></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
               <div>
                  <label className="label py-0 mb-1.5 text-[10px] font-black uppercase opacity-60 tracking-widest">Data Registo <span className="text-primary">*</span></label>
                  <div className="flex gap-2">
                    <select className="select select-bordered text-sm font-black w-32 bg-base-100 h-10 min-h-0" value={draftFilters.dataOperator} onChange={e => setDraftFilters({...draftFilters, dataOperator: e.target.value})}>
                      <option value="=">NO DIA (=)</option>
                      <option value=">">APÓS (&gt;)</option>
                      <option value="<">ANTES (&lt;)</option>
                    </select>
                    <input type="date" className="input input-bordered flex-1 text-sm font-bold uppercase h-10" value={draftFilters.data} onChange={e => setDraftFilters({...draftFilters, data: e.target.value})} />
                  </div>
               </div>
               
               <div>
                  <label className="label py-0 mb-1.5 text-[10px] font-black uppercase opacity-60 tracking-widest">Artigo</label>
                  <ArtigoInput value={draftFilters.artigo} onChange={(c, d) => setDraftFilters({...draftFilters, artigo: c, designacao: d || draftFilters.designacao})} />
               </div>

               <div>
                  <label className="label py-0 mb-1.5 text-[10px] font-black uppercase opacity-60 tracking-widest">Designação Livre</label>
                  <input type="text" className="input input-bordered w-full uppercase text-sm h-10" value={draftFilters.designacao} onChange={e => setDraftFilters({...draftFilters, designacao: e.target.value})} placeholder="Parte do texto..." />
               </div>

               <div>
                  <label className="label py-0 mb-1.5 text-[10px] font-black uppercase opacity-60 tracking-widest">Quantidade</label>
                  <div className="flex gap-2">
                    <select className="select select-bordered text-sm font-black w-32 bg-base-100 h-10 min-h-0" value={draftFilters.qtdOperator} onChange={e => setDraftFilters({...draftFilters, qtdOperator: e.target.value})}>
                      <option value="=">IGUAL (=)</option>
                      <option value=">">MAIOR (&gt;)</option>
                      <option value="<">MENOR (&lt;)</option>
                    </select>
                    <input type="number" min="0" className="input input-bordered flex-1 text-sm font-bold h-10" value={draftFilters.qtd} onChange={e => setDraftFilters({...draftFilters, qtd: e.target.value})} placeholder="Qtd..." />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label py-0 mb-1.5 text-[10px] font-black uppercase opacity-60 tracking-widest">Destino</label>
                     <select className="select select-bordered w-full uppercase text-sm font-bold bg-base-100 h-10 min-h-0" value={draftFilters.destino} onChange={e => setDraftFilters({...draftFilters, destino: e.target.value})}>
                      <option value="">TODOS OS DESTINOS</option>
                      {DESTINOS.map(d => <option key={d.codigo} value={d.label}>{d.label.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label py-0 mb-1.5 text-[10px] font-black uppercase opacity-60 tracking-widest">Estado</label>
                    <select className="select select-bordered w-full uppercase text-sm font-bold bg-base-100 h-10 min-h-0" value={draftFilters.estado} onChange={e => setDraftFilters({...draftFilters, estado: e.target.value})}>
                      <option value="">TODOS OS ESTADOS</option>
                      <option value="pendente">PENDENTE</option>
                      <option value="movimentado">MOVIMENTADO</option>
                      <option value="concluído">CONCLUÍDO</option>
                    </select>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-base-200 flex gap-4">
              <button className="btn btn-ghost flex-1 font-black uppercase tracking-[0.2em] text-[10px]" onClick={() => setDraftFilters({ data: "", dataOperator: "=", artigo: "", designacao: "", qtd: "", qtdOperator: "=", destino: "", obs: "", estado: "" })}>
                Limpar
              </button>
              <button 
                className="btn btn-primary flex-1 font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20" 
                onClick={() => {
                  setAppliedFilters(draftFilters);
                  setShowFilters(false);
                }}
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}