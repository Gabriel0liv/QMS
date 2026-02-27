import { useState, useRef, useEffect, useMemo } from "react";
import { Plus, Trash2, Pencil, Send, X, Clock, CheckCircle, AlertTriangle, Search, List, LayoutGrid, Filter, ArrowLeft, ChevronRight, ChevronLeft, MonitorSmartphone, Factory } from "lucide-react";

// ── constant data (unchanged) ─────────────────────────────────────────────
const ARTIGOS: Record<string, { descricao: string; tipo?: string; setor?: string }> = {
  "01-77-216":      { descricao: "CX.7715/16X30 - 92MM CORTADO",           tipo: "Aço",                  setor: "BALANCÉS"  },
  "08-LG-001":      { descricao: "PUNHO LOGIC (INJ.) BRUTO",                tipo: "Alumínio Injetado",    setor: "LOGÍSTICA" },
  "03-15-049-11":   { descricao: "TAMPA 1510 VIBRADO (CONES)",              tipo: "Zamak",                setor: "VIBRADORA" },
  "08-AK-003-11":   { descricao: "PUNHO AAJ100 VIBRADO",                   tipo: "Alumínio Injetado",    setor: "VIBRADORA" },
  "08-28-040-11":   { descricao: "PUNHO 2801 VIBRADO (CONES)",              tipo: "Alumínio Injetado",    setor: "VIBRADORA" },
  "02-V2P-001-11":  { descricao: "ABA DIR. VULC.2P VIBRADA",               tipo: "Perfil de alumínio",   setor: "VIBRADORA" },
  "02-V2P-002-11":  { descricao: "ABA CURVA VULCANA 2P VIBRADA",           tipo: "Perfil de alumínio",   setor: "VIBRADORA" },
  "01-37-001-09":   { descricao: "ESPELHO 3730 MARCADO",                    tipo: "Alumínio",             setor: "VIBRADORA" },
  "03-15-041-11":   { descricao: "CORPO (INT.) 1510 VIBRADO",               tipo: "Zamak",                setor: "VIBRADORA" },
  "03-15-093-11":   { descricao: "CORPO 1500/E VIBRADO (CONES)",            tipo: "Zamak",                setor: "VIBRADORA" },
  "08-28-075-11":   { descricao: "CORPO 2800 VIBRADO (CONES)",              tipo: "Alumínio Injetado",    setor: "VIBRADORA" },
  "08-28-041-11":   { descricao: "PUNHO 2800 VIBRADO (CONES)",              tipo: "Alumínio Injetado",    setor: "VIBRADORA" },
  "03-15-412-11":   { descricao: "CORPO (INT.) 1520 VIBRADO",               tipo: "Zamak",                setor: "VIBRADORA" },
  "03-15-413-11":   { descricao: "TAMPA 1520 VIBRADO (CONES)",              tipo: "Zamak",                setor: "VIBRADORA" },
  "02-10-001-11":   { descricao: "ABA CURVA DOB. 1000 VIBR.(2)",          tipo: "Perfil de alumínio",   setor: "VIBRADORA" },
  "03-32-004-11":   { descricao: "CORPO FECHO 3020/3 VIBRADO (CONES)",     tipo: "Zamak",                setor: "VIBRADORA" },
  "03-15-016-11":   { descricao: "TAMPA 1500 VIBRADO (CONES)",              tipo: "Zamak",                setor: "VIBRADORA" },
  "03-37-684-11":   { descricao: "ESPELHO 3700 EXTERIOR",                   tipo: "Zamak",                setor: "VIBRADORA" },
  "03-18-001-11":   { descricao: "CORPO 1800 VIBRADO (CONES)",              tipo: "Zamak",                setor: "VIBRADORA" },
  "02-V2P-001-60":  { descricao: "ABA DIREITA VULCANA 2P COR",             tipo: "Perfil de alumínio",   setor: "PINTURA"   },
  "02-V2P-002-60":  { descricao: "ABA CURVA VULCANA 2P COR",               tipo: "Perfil de alumínio",   setor: "PINTURA"   },
  "02-V3P-001-121": { descricao: "ABA DIR V3P 9016 TEX",                   tipo: "Perfil de alumínio",   setor: "PINTURA"   },
  "02-V3P-002-121": { descricao: "ABA CURVA V3P 9016 TEX",                 tipo: "Perfil de alumínio",   setor: "PINTURA"   },
  "03-32-006-22":   { descricao: "CORPO FECHO 3020/2 BRANCO",              tipo: "Zamak",                setor: "PINTURA"   },
  "03-35-002-44":   { descricao: "ESPELHO 3500 CINZA 9006",                 tipo: "Zamak",                setor: "PINTURA"   },
  "03-15-016-44":   { descricao: "TAMPA 1500 CINZA 9006",                   tipo: "Zamak",                setor: "PINTURA"   },
  "08-15-001-44":   { descricao: "PUNHO 1500 CINZA 9006",                   tipo: "Alumínio Injetado",    setor: "PINTURA"   },
  "03-18-003-31":   { descricao: "LINGUA 1800 VERDE 6005",                  tipo: "Zamak",                setor: "PINTURA"   },
  "03-18-003-45":   { descricao: "LINGUA P 1800 CINZA INOX",               tipo: "Zamak",                setor: "PINTURA"   },
  "08-15-024-45":   { descricao: "PUNHO 1501 CINZA INOX",                   tipo: "Alumínio Injetado",    setor: "PINTURA"   },
  "08-AK-003-113":  { descricao: "PUNHO AAJ100 SILVER (ALUK)",              tipo: "Alumínio Injetado",    setor: "PINTURA"   },
  "08-VE-002-75":   { descricao: "CORPO VELA BRANCO 9010-SAV",             tipo: "Alumínio Injetado",    setor: "PINTURA"   },
  "03-15-049-80":   { descricao: "TAMPA 1510 RAL 7016 F.",                  tipo: "Zamak",                setor: "PINTURA"   },
  "03-15-041-80":   { descricao: "CORPO (INT.) 1510 RAL 7016 F.",          tipo: "Zamak",                setor: "PINTURA"   },
  "08-28-040-80":   { descricao: "PUNHO 2801 RAL 7016 F.",                  tipo: "Alumínio Injetado",    setor: "PINTURA"   },
  "01-77-234-24":   { descricao: "ESPELHO 7707 PEQ. PONTAS",               tipo: "Aço",                  setor: "PINTURA"   },
  "03-18-001-45":   { descricao: "CORPO 1800 CINZA INOX",                   tipo: "Zamak",                setor: "PINTURA"   },
  "01-77-221-117":  { descricao: "ESPELHO 7791X30 RAL 9016",               tipo: "Aço",                  setor: "PINTURA"   },
  "08-VE-001-75":   { descricao: "PUNHO VELA BRANCO 9010-SAV",             tipo: "Alumínio Injetado",    setor: "PINTURA"   },
  "01-77-006-117":  { descricao: "TESTA 7791-23 RAL 9016",                 tipo: "Aço",                  setor: "PINTURA"   },
  "08-VE-001-76":   { descricao: "PUNHO VELA PRETO 9005-SAV",              tipo: "Alumínio Injetado",    setor: "PINTURA"   },
  "08-VE-002-76":   { descricao: "CORPO VELA PRETO 9005-SAV",              tipo: "Alumínio Injetado",    setor: "PINTURA"   },
  "03-32-006-23":   { descricao: "CORPO FECHO 3020/2 PRETO 9005",          tipo: "Zamak",                setor: "PINTURA"   },
  "03-32-004-23":   { descricao: "CORPO FECHO 3020/3 PRETO 9005",          tipo: "Zamak",                setor: "PINTURA"   },
  "02-10-001-23":   { descricao: "ABA CURVA DOB. 1000 PRETO",              tipo: "Perfil de alumínio",   setor: "PINTURA"   },
  "03-18-001-31":   { descricao: "CORPO 1800 VERDE 6005",                   tipo: "Zamak",                setor: "PINTURA"   },
};

const DESTINOS = [
  { label: "Derreter",    codigo: "CR001" },
  { label: "Decapar",     codigo: "CQT01" },
  { label: "Sucatar",     codigo: "CS001" },
];

// ── Types ──────────────────────────────────────────────────────────────────
interface NCRow {
  id: string;
  codigoArtigo: string;
  descricao: string;
  quantidade: string;
  destino: string;
  codigoDestino: string;
  observacoes: string;
}

interface HistoricoItem {
  id: string;
  data: string;
  codigoArtigo: string;
  descricao: string;
  quantidade: string;
  destino: string;
  codigoDestino: string;
  observacoes: string;
  estadoMovimentacao: "pendente" | "movimentado";
}

const HISTORICO_INICIAL: HistoricoItem[] = [
  { id: "h1", data: "26/02/2026 10:42", codigoArtigo: "08-AK-003-11",  descricao: "PUNHO AAJ100 VIBRADO",            quantidade: "12", destino: "Derreter", codigoDestino: "CR001", observacoes: "Porosidade", estadoMovimentacao: "pendente" },
  { id: "h2", data: "26/02/2026 10:42", codigoArtigo: "03-15-412-11",  descricao: "CORPO (INT.) 1520 VIBRADO",        quantidade: "5",  destino: "Derreter", codigoDestino: "CR001", observacoes: "", estadoMovimentacao: "pendente" },
  { id: "h3", data: "26/02/2026 10:42", codigoArtigo: "03-15-413-11",  descricao: "TAMPA 1520 VIBRADO (CONES)",      quantidade: "5",  destino: "Derreter", codigoDestino: "CR001", observacoes: "", estadoMovimentacao: "pendente" },
  { id: "h4", data: "25/02/2026 14:15", codigoArtigo: "08-15-001-44",  descricao: "PUNHO 1500 CINZA 9006",           quantidade: "8",  destino: "Decapar",  codigoDestino: "CQT01", observacoes: "Dimensional", estadoMovimentacao: "pendente" },
  { id: "h5", data: "24/02/2026 08:30", codigoArtigo: "02-10-001-23",  descricao: "ABA CURVA DOB. 1000 PRETO",      quantidade: "45", destino: "Sucatar",  codigoDestino: "CS001", observacoes: "", estadoMovimentacao: "pendente" },
  { id: "h6", data: "24/02/2026 08:30", codigoArtigo: "08-VE-001-76",  descricao: "PUNHO VELA PRETO 9005-SAV",      quantidade: "3",  destino: "Decapar",  codigoDestino: "CQT01", observacoes: "Rebarbas", estadoMovimentacao: "pendente" },
];

// ── Components ─────────────────────────────────────────────────────────────

function ArtigoInput({ value, onChange }: { value: string; onChange: (code: string, desc: string) => void }) {
  const [query, setQuery] = useState(value);
  const [open, setOpen]   = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  const matches = useMemo(() => {
    if (query.length < 1) return [];
    const q = query.toUpperCase();
    const all = Object.keys(ARTIGOS);
    const p1 = all.filter(k => k.toUpperCase().startsWith(q));
    const p2 = all.filter(k => !p1.includes(k) && ARTIGOS[k].descricao.toUpperCase().startsWith(q));
    const p3 = all.filter(k => !p1.includes(k) && !p2.includes(k) && (k.toUpperCase().includes(q) || ARTIGOS[k].descricao.toUpperCase().includes(q)));
    return [...p1, ...p2, ...p3].slice(0, 8);
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
          onFocus={() => { if (matches.length) setOpen(true); }}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          onChange={(e) => {
            const v = e.target.value.toUpperCase();
            setQuery(v);
            setOpen(v.length >= 1);
            if (ARTIGOS[v]) onChange(v, ARTIGOS[v].descricao); else onChange(v, "");
          }}
        />
      </div>
      {open && matches.length > 0 && (
        <ul className="absolute z-[200] top-full left-0 mt-1 w-full bg-base-100 border border-base-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {matches.map(m => (
            <li key={m}>
              <button 
                type="button"
                className="w-full text-left px-4 py-2.5 hover:bg-primary hover:text-primary-content transition-colors flex flex-col border-b border-base-100 last:border-0"
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevents input onBlur from firing before selection
                  onChange(m, ARTIGOS[m].descricao);
                  setQuery(m);
                  setOpen(false);
                }}
              >
                <span className="font-mono font-black text-xs">{m}</span>
                <span className="text-[10px] opacity-70 truncate font-bold">{ARTIGOS[m].descricao}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Registration View (Sub-component for isolation) ─────────────────────────
function RegistrationView({ onCancel, onSave }: { onCancel: () => void, onSave: (items: NCRow[]) => void }) {
  const [activeTab, setActiveTab] = useState<"form" | "list">("form");
  const [rows, setRows] = useState<NCRow[]>([]);
  const [draft, setDraft] = useState({ codigoArtigo: "", descricao: "", quantidade: "", destino: "", codigoDestino: "", observacoes: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!draft.codigoArtigo || !draft.quantidade || !draft.destino) {
      setError("Preencha os campos obrigatórios (*)");
      return;
    }
    if (editId) {
      setRows(r => r.map(x => x.id === editId ? { ...draft, id: editId } : x));
    } else {
      setRows(r => [...r, { ...draft, id: crypto.randomUUID() }]);
    }
    setDraft({ codigoArtigo: "", descricao: "", quantidade: "", destino: "", codigoDestino: "", observacoes: "" });
    setEditId(null);
    setError("");
    if (window.innerWidth < 768) setActiveTab("list");
  };

  return (
    <div className="flex flex-col h-full bg-base-100 rounded-3xl overflow-hidden shadow-xl border border-base-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* View Header */}
      <div className="px-6 py-5 border-b border-base-200 flex items-center justify-between bg-base-100">
        <div className="flex items-center gap-4">
          <button className="btn btn-ghost btn-sm btn-circle" onClick={onCancel}><ArrowLeft className="h-5 w-5"/></button>
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight">Novo Registo NC</h2>
            <div className="flex items-center gap-2 text-[10px] font-black opacity-40 uppercase tracking-widest">
              <span>Chão de Fábrica</span>
              <ChevronRight className="h-2 w-2"/>
              <span>Registo Manual</span>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-base-200/50 px-3 py-1.5 rounded-full">
           <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
           <span className="text-[10px] font-black uppercase opacity-60">Sessão Activa</span>
        </div>
      </div>

      {/* Tabs (Mobile Only) */}
      <div className="md:hidden flex p-1 bg-base-200 mx-4 mt-4 rounded-xl">
        <button className={`flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all ${activeTab === "form" ? "bg-base-100 shadow-sm text-primary" : "opacity-40"}`} onClick={() => setActiveTab("form")}>Formulário</button>
        <button className={`flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all ${activeTab === "list" ? "bg-base-100 shadow-sm text-primary" : "opacity-40"}`} onClick={() => setActiveTab("list")}>Lista ({rows.length})</button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Form Section */}
          <div className={`${activeTab === "list" ? "hidden md:block" : "block"} space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-black uppercase tracking-widest opacity-30 flex items-center gap-2 px-1">
                <LayoutGrid className="h-3 w-3"/>
                Introdução de Dados
              </h3>
              {editId && <button className="text-[10px] font-black uppercase text-primary hover:underline" onClick={() => { setEditId(null); setDraft({ codigoArtigo: "", descricao: "", quantidade: "", destino: "", codigoDestino: "", observacoes: "" }); }}>Cancelar Edição</button>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-base-200/20 rounded-2xl border border-base-200/50">
              <div className="md:col-span-1">
                <label className="label py-0 mb-1 text-[10px] font-black uppercase opacity-60">Artigo *</label>
                <ArtigoInput value={draft.codigoArtigo} onChange={(c, d) => setDraft(v => ({ ...v, codigoArtigo: c, descricao: d }))} />
              </div>
              <div className="md:col-span-1">
                <label className="label py-0 mb-1 text-[10px] font-black uppercase opacity-60">Designação</label>
                <div className="h-10 px-4 bg-base-200/50 rounded-xl border border-base-300 flex items-center overflow-hidden">
                  <span className="text-xs font-bold truncate uppercase">{draft.descricao || <span className="opacity-20 font-normal italic">Auto-preenchido...</span>}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label py-0 mb-1 text-[10px] font-black uppercase opacity-60">Qtd *</label>
                  <input type="number" className="input input-bordered h-10 w-full font-black text-sm" value={draft.quantidade} onChange={e => setDraft(v => ({ ...v, quantidade: e.target.value }))} placeholder="0" />
                </div>
                <div>
                  <label className="label py-0 mb-1 text-[10px] font-black uppercase opacity-60">Destino *</label>
                  <select className="select select-bordered h-10 min-h-0 w-full font-black text-[11px] uppercase p-0 px-2" value={draft.destino} onChange={e => {
                    const d = DESTINOS.find(x => x.label === e.target.value);
                    setDraft(v => ({ ...v, destino: e.target.value, codigoDestino: d?.codigo || "" }));
                  }}>
                    <option value="" disabled>ESCOLHER...</option>
                    {DESTINOS.map(d => <option key={d.codigo} value={d.label}>{d.label.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="label py-0 mb-1 text-[10px] font-black uppercase opacity-60">Obs.</label>
                  <input className="input input-bordered h-10 w-full text-xs" value={draft.observacoes} onChange={e => setDraft(v => ({ ...v, observacoes: e.target.value }))} placeholder="..." />
                </div>
                <button className="btn btn-secondary h-10 min-h-0 px-6 rounded-xl shadow-lg shadow-secondary/20" onClick={handleAdd}>
                  <Plus className="h-4 w-4"/>
                  <span className="font-black text-xs">{editId ? "GRAVAR" : "ADD"}</span>
                </button>
              </div>
            </div>
            {error && <div className="p-3 bg-error/10 text-error text-[10px] font-black rounded-lg uppercase flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5"/>{error}</div>}
          </div>

          {/* List Section */}
          <div className={`${activeTab === "form" ? "hidden md:block" : "block"} space-y-4 pb-12`}>
            <h3 className="text-[11px] font-black uppercase tracking-widest opacity-30 flex items-center gap-2 px-1">
              <List className="h-3.5 w-3.5"/>
              Itens para Enviar ({rows.length})
            </h3>
            
            {rows.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center bg-base-200/5 rounded-3xl border-2 border-dashed border-base-200 text-base-content/20 gap-3">
                <Plus className="h-10 w-10 opacity-20"/>
                <span className="text-[11px] font-black uppercase tracking-widest">A lista está vazia</span>
              </div>
            ) : (
              <div className="overflow-hidden border border-base-200 rounded-3xl bg-base-100 shadow-sm">
                <table className="table table-zebra w-full">
                  <thead className="bg-base-200/50">
                    <tr>
                      <th className="text-[9px] font-black uppercase py-4">Artigo</th>
                      <th className="text-[9px] font-black uppercase">Designação</th>
                      <th className="text-[9px] font-black uppercase text-center">Qtd</th>
                      <th className="text-[9px] font-black uppercase">Destino</th>
                      <th className="text-right py-4 pr-6"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(r => (
                      <tr key={r.id} className="hover:bg-base-200/10 group">
                        <td className="font-mono font-black text-primary text-xs w-32">{r.codigoArtigo}</td>
                        <td className="font-bold text-xs opacity-70 truncate max-w-xs">{r.descricao}</td>
                        <td className="text-center font-black text-sm w-20">{r.quantidade}</td>
                        <td>
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black uppercase">{r.destino}</span>
                            <span className="text-[9px] font-mono opacity-40 font-bold">{r.codigoDestino}</span>
                          </div>
                        </td>
                        <td className="text-right pr-4">
                          <div className="flex justify-end gap-1">
                            <button className="btn btn-ghost btn-xs btn-circle hover:text-primary" onClick={() => { setDraft({...r}); setEditId(r.id); setActiveTab("form"); }}><Pencil className="h-3 w-3"/></button>
                            <button className="btn btn-ghost btn-xs btn-circle hover:text-error" onClick={() => setRows(prev => prev.filter(x => x.id !== r.id))}><Trash2 className="h-3 w-3"/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Footer */}
      <div className="px-8 py-5 border-t border-base-200 bg-base-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="hidden md:flex items-center gap-3">
           <div className={`h-2.5 w-2.5 rounded-full ${rows.length > 0 ? "bg-success" : "bg-base-200"}`}></div>
           <span className="text-[11px] font-black opacity-40 uppercase tracking-widest">{rows.length} registos preparados para envio</span>
        </div>
        <div className="flex w-full md:w-auto gap-4">
          <button className="btn btn-ghost h-12 min-h-0 px-8 rounded-xl font-black uppercase text-xs flex-1 md:flex-initial" onClick={onCancel}>Cancelar</button>
          <button 
            className="btn btn-primary h-12 min-h-0 px-10 rounded-xl gap-3 shadow-xl shadow-primary/20 flex-1 md:flex-initial"
            disabled={rows.length === 0}
            onClick={() => onSave(rows)}
          >
            <Send className="h-4 w-4"/>
            <span className="font-black text-xs uppercase tracking-widest">Enviar Registos ({rows.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Controller ────────────────────────────────────────────────────────
export function RegistoNC() {
  const [view, setView] = useState<"LIST" | "ADD" | "IFRAME_MOBILIDADE" | "IFRAME_CHAO_FABRICA">("LIST");
  const [historico, setHistorico] = useState<HistoricoItem[]>(HISTORICO_INICIAL);
  const [submitted, setSubmitted] = useState(false);
  const [filters, setFilters] = useState({ data: "", artigo: "", designacao: "", qtd: "", destino: "", obs: "", estado: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredHistory = useMemo(() => {
    return historico.filter(h => {
      // Basic text matches
      const matchData = h.data.toLowerCase().includes(filters.data.toLowerCase());
      const matchArtigo = h.codigoArtigo.toLowerCase().includes(filters.artigo.toLowerCase());
      const matchDesignacao = h.descricao.toLowerCase().includes(filters.designacao.toLowerCase());
      const matchDestino = h.destino.toLowerCase().includes(filters.destino.toLowerCase());
      const matchObs = h.observacoes.toLowerCase().includes(filters.obs.toLowerCase());
      const matchEstado = filters.estado === "" || h.estadoMovimentacao === filters.estado;

      // Quantity Logic with Operators
      let matchQtd = true;
      if (filters.qtd.trim() !== "") {
        const query = filters.qtd.trim();
        const itemQtd = parseInt(h.quantidade, 10);
        
        if (!isNaN(itemQtd)) {
          if (query.startsWith(">=")) matchQtd = itemQtd >= parseInt(query.substring(2));
          else if (query.startsWith("<=")) matchQtd = itemQtd <= parseInt(query.substring(2));
          else if (query.startsWith(">")) matchQtd = itemQtd > parseInt(query.substring(1));
          else if (query.startsWith("<")) matchQtd = itemQtd < parseInt(query.substring(1));
          else if (query.startsWith("=")) matchQtd = itemQtd === parseInt(query.substring(1));
          else matchQtd = h.quantidade.includes(query); // Fallback to string match
        } else {
          matchQtd = h.quantidade.includes(query);
        }
      }

      return matchData && matchArtigo && matchDesignacao && matchDestino && matchObs && matchEstado && matchQtd;
    });
  }, [historico, filters]);

  const handleSave = (newRows: NCRow[]) => {
    const now = new Date().toLocaleString("pt-PT", { dateStyle: "short", timeStyle: "short" });
    const items: HistoricoItem[] = newRows.map(r => ({
      ...r,
      data: now,
      estadoMovimentacao: "pendente",
      id: crypto.randomUUID()
    }));
    setHistorico(h => [...items, ...h]);
    setSubmitted(true);
    setView("LIST");
    setTimeout(() => setSubmitted(false), 3000);
  };

  const toggleEstado = (id: string) => {
    setHistorico(prev => prev.map(h => 
      h.id === id 
        ? { ...h, estadoMovimentacao: h.estadoMovimentacao === "pendente" ? "movimentado" : "pendente" } 
        : h
    ));
  };

  if (view === "ADD") {
    return (
      <div className="p-4 md:p-8 h-screen max-h-screen">
        <RegistrationView onCancel={() => setView("LIST")} onSave={handleSave} />
      </div>
    );
  }

  if (view === "IFRAME_MOBILIDADE" || view === "IFRAME_CHAO_FABRICA") {
    const currentItem = filteredHistory[currentIndex];
    
    return (
      <div className="flex" style={{ height: "calc(100vh - 64px)" }}>
        {/* Sidebar */}
        <div className="w-16 md:w-20 bg-base-100 border-r border-base-200 flex flex-col items-center py-4 flex-shrink-0 z-50 shadow-sm relative">
          <button 
            className="btn btn-ghost btn-circle w-12 h-12 flex items-center justify-center text-base-content/50 hover:text-primary hover:bg-primary/10 transition-colors"
            onClick={() => setView("LIST")}
            title="Voltar ao Ecrã Normal"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {/* Top Bar (Single Row Navigation) */}
          {currentItem ? (
            <div className="bg-base-100 border-b border-base-200 shadow-sm p-2 flex items-center justify-between z-10 shrink-0 h-20">
              <div className="flex items-center gap-1 md:gap-4 flex-1 min-w-0">
                <button 
                  className="btn btn-ghost btn-circle btn-sm"
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {/* Item Details */}
                <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 items-center px-2">
                  <div className="hidden md:block">
                    <div className="text-[9px] uppercase font-black opacity-40">Data / Hora</div>
                    <div className="text-xs font-mono font-bold truncate">{currentItem.data}</div>
                  </div>
                  <div className="col-span-1 border-r border-base-200 pr-2 md:border-none md:pr-0">
                    <div className="text-[9px] uppercase font-black opacity-40">Artigo</div>
                    <div className="text-xs font-black text-primary truncate" title={currentItem.codigoArtigo}>{currentItem.codigoArtigo}</div>
                  </div>
                  <div className="col-span-1 hidden md:block">
                    <div className="text-[9px] uppercase font-black opacity-40">Designação</div>
                    <div className="text-xs font-bold opacity-80 truncate" title={currentItem.descricao}>{currentItem.descricao}</div>
                  </div>
                  <div className="col-span-1">
                    <div className="text-[9px] uppercase font-black opacity-40">Quantidade</div>
                    <div className="text-xs font-black truncate">{currentItem.quantidade} UN</div>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <div className="text-[9px] uppercase font-black opacity-40">Destino</div>
                    <div className="text-xs font-bold truncate" title={`${currentItem.destino} (${currentItem.codigoDestino})`}>
                      {currentItem.destino} <span className="opacity-40 font-mono hidden xl:inline">({currentItem.codigoDestino})</span>
                    </div>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="pr-2 md:pr-4 flex flex-col items-center justify-center border-l border-base-200 pl-4 h-full w-28 md:w-36 shrink-0">
                  <span className="text-[9px] uppercase font-black opacity-40 mb-1">Estado</span>
                  <button 
                    className={`badge ${currentItem.estadoMovimentacao === "pendente" ? "badge-warning" : "badge-success"} font-black text-[10px] h-6 w-full cursor-pointer hover:opacity-80 transition-all uppercase border-0`}
                    onClick={() => toggleEstado(currentItem.id)}
                    title="Clique para alterar o estado"
                  >
                    {currentItem.estadoMovimentacao}
                  </button>
                </div>

                <button 
                  className="btn btn-ghost btn-circle btn-sm"
                  onClick={() => setCurrentIndex(prev => Math.min(filteredHistory.length - 1, prev + 1))}
                  disabled={currentIndex === filteredHistory.length - 1}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-base-100 border-b border-base-200 p-4 shrink-0 flex items-center justify-center text-sm font-bold opacity-50 h-20">
              Nenhum registo disponível ou filtros demasiado restritivos.
            </div>
          )}

          {/* Iframe Area */}
          <div className="flex-1 bg-white relative">
            <iframe 
              src={view === "IFRAME_MOBILIDADE" ? "https://pt.wikipedia.org/wiki/Portal:Tecnologia" : "https://pt.wikipedia.org/wiki/Portal:Engenharia"} 
              className="absolute inset-0 w-full h-full border-0"
              title="External System View"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-10 max-w-[1500px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div className="flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3">
             <LayoutGrid className="h-7 w-7 text-primary-content" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">Registo Produto Não Conforme</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-black uppercase text-base-content/40 tracking-widest">Controlo de Qualidade</span>
              <div className="h-1 w-1 rounded-full bg-base-content/20"></div>
              <span className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1.5">
                <Clock className="h-3 w-3"/> HISTÓRICO GLOBAL
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
          <button 
            className="btn btn-outline border-base-300 btn-md whitespace-nowrap rounded-xl gap-2 hover:bg-base-200 hover:border-base-300 hover:text-base-content"
            onClick={() => { setView("IFRAME_MOBILIDADE"); setCurrentIndex(0); }}
          >
            <MonitorSmartphone className="h-4 w-4"/>
            <span className="font-bold text-xs">Abrir Mobilidade</span>
          </button>
          <button 
            className="btn btn-outline border-base-300 btn-md whitespace-nowrap rounded-xl gap-2 hover:bg-base-200 hover:border-base-300 hover:text-base-content"
            onClick={() => { setView("IFRAME_CHAO_FABRICA"); setCurrentIndex(0); }}
          >
            <Factory className="h-4 w-4"/>
            <span className="font-bold text-xs">Abrir Chão de Fábrica</span>
          </button>
          <button 
            className="btn btn-primary btn-md rounded-xl shadow-lg shadow-primary/20 gap-2 px-6 group transition-transform active:scale-95 whitespace-nowrap"
            onClick={() => setView("ADD")}
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90"/>
            <span className="font-black uppercase tracking-widest text-xs">Registar NC</span>
          </button>
        </div>
      </div>

      {submitted && (
        <div className="alert alert-success shadow-sm rounded-2xl border-0 py-4 font-black text-xs uppercase tracking-widest animate-in slide-in-from-top-4">
          <CheckCircle className="h-5 w-5"/> Registos enviados com sucesso e adicionados ao histórico!
        </div>
      )}

      {/* History Card */}
      <div className="bg-base-100 rounded-[2.5rem] border border-base-200 shadow-xl overflow-hidden">
        <div className="px-8 py-6 border-b border-base-200 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest opacity-40 flex items-center gap-3">
               <List className="h-4 w-4"/>
               Visão Geral de Não-Conformidades
            </h2>
            <div className="flex items-center gap-4">
               <button 
                 className={`btn btn-sm rounded-lg flex items-center gap-2 ${showFilters ? 'btn-primary' : 'btn-ghost'}`}
                 onClick={() => setShowFilters(!showFilters)}
               >
                 <Filter className="h-3 w-3" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Filtros Avançados</span>
               </button>
               <div className="items-center gap-2 border-l border-base-200 pl-4 hidden md:flex">
                 <span className="text-[10px] font-black uppercase opacity-20 tracking-tighter">Filtros Activos:</span>
                 <div className={`h-2 w-2 rounded-full shadow-sm ${Object.values(filters).some(v => v !== "") ? 'bg-primary' : 'bg-base-300'}`}></div>
               </div>
            </div>
        </div>
        
        {/* Mobile View: Cards (Hidden on Large Screens) */}
        <div className="lg:hidden divide-y divide-base-200">
          {filteredHistory.length === 0 ? (
            <div className="py-20 text-center opacity-20 flex flex-col items-center gap-2">
              <Search className="h-10 w-10"/>
              <span className="text-[10px] font-black uppercase tracking-widest">Nenhum resultado</span>
            </div>
          ) : filteredHistory.map(h => (
            <div key={h.id} className="p-5 space-y-4 bg-base-100 hover:bg-primary/5 transition-colors">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-[10px] font-black opacity-30 uppercase tracking-widest font-mono">{h.data}</div>
                  <div className="font-mono text-base font-black text-primary">{h.codigoArtigo}</div>
                </div>
                <span className={`badge ${h.estadoMovimentacao === 'pendente' ? 'badge-warning' : 'badge-success'} badge-outline font-black text-[9px] h-5 tracking-tighter uppercase px-3 cursor-pointer`} onClick={() => toggleEstado(h.id)}>
                  {h.estadoMovimentacao}
                </span>
              </div>
              
              <div className="text-xs font-bold opacity-80 uppercase leading-relaxed">{h.descricao}</div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-base-200/30 p-3 rounded-xl">
                  <div className="text-[8px] font-black uppercase opacity-40 mb-1">Quantidade</div>
                  <div className="text-sm font-black">{h.quantidade} UN</div>
                </div>
                <div className="bg-base-200/30 p-3 rounded-xl">
                  <div className="text-[8px] font-black uppercase opacity-40 mb-1">Destino</div>
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0"></div>
                    <span className="text-[10px] font-black uppercase truncate">{h.destino}</span>
                    <span className="text-[8px] opacity-30 font-mono">({h.codigoDestino})</span>
                  </div>
                </div>
              </div>

              {h.observacoes && (
                <div className="text-[11px] italic font-medium opacity-50 bg-base-200/20 p-3 rounded-xl border border-base-200/50">
                  "{h.observacoes}"
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop View: Table (Visible on Large Screens) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="table table-zebra w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-base-200/30">
                <th className="p-4 border-b border-base-200"><span className="text-[9px] font-black uppercase tracking-widest opacity-40">Data</span></th>
                <th className="p-4 border-b border-base-200"><span className="text-[9px] font-black uppercase tracking-widest opacity-40">Artigo</span></th>
                <th className="p-4 border-b border-base-200"><span className="text-[9px] font-black uppercase tracking-widest opacity-40">Designação</span></th>
                <th className="p-4 border-b border-base-200"><span className="text-[9px] font-black uppercase tracking-widest opacity-40">Quantidade</span></th>
                <th className="p-4 border-b border-base-200"><span className="text-[9px] font-black uppercase tracking-widest opacity-40">Destino</span></th>
                <th className="p-4 border-b border-base-200"><span className="text-[9px] font-black uppercase tracking-widest opacity-40">Observações</span></th>
                <th className="p-4 border-b border-base-200 text-center w-36"><span className="text-[9px] font-black uppercase tracking-widest opacity-40 block w-full">Estado</span></th>
              </tr>
              {showFilters && (
                <tr className="bg-base-200/30">
                  <th className="p-4 border-b border-base-200">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-40">data</span>
                      <div className="relative">
                        <input type="text" className="input input-bordered h-8 w-full min-w-[100px] text-[10px] font-bold rounded-lg px-2 bg-base-100/50 focus:bg-base-100" placeholder="Filtrar..." value={filters.data} onChange={e => setFilters(f => ({ ...f, data: e.target.value }))} />
                      </div>
                    </div>
                  </th>
                  <th className="p-4 border-b border-base-200">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-40">artigo</span>
                      <div className="relative">
                        <input type="text" className="input input-bordered h-8 w-full min-w-[100px] text-[10px] font-bold rounded-lg px-2 bg-base-100/50 focus:bg-base-100" placeholder="Filtrar..." value={filters.artigo} onChange={e => setFilters(f => ({ ...f, artigo: e.target.value }))} />
                      </div>
                    </div>
                  </th>
                  <th className="p-4 border-b border-base-200">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-40">designacao</span>
                      <div className="relative">
                        <input type="text" className="input input-bordered h-8 w-full min-w-[100px] text-[10px] font-bold rounded-lg px-2 bg-base-100/50 focus:bg-base-100" placeholder="Filtrar..." value={filters.designacao} onChange={e => setFilters(f => ({ ...f, designacao: e.target.value }))} />
                      </div>
                    </div>
                  </th>
                  <th className="p-4 border-b border-base-200">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-black uppercase tracking-widest opacity-40">qtd</span>
                         <span className="text-[8px] opacity-30 font-bold" title="Use >, <, >=, <=, ou =">op.</span>
                      </div>
                      <div className="relative">
                        <input type="text" className="input input-bordered h-8 w-full min-w-[100px] text-[10px] font-bold rounded-lg px-2 bg-base-100/50 focus:bg-base-100" placeholder="Ex: >10" value={filters.qtd} onChange={e => setFilters(f => ({ ...f, qtd: e.target.value }))} />
                      </div>
                    </div>
                  </th>
                  <th className="p-4 border-b border-base-200">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-40">destino</span>
                      <div className="relative">
                        <select className="select select-bordered select-sm h-8 w-full text-[10px] font-bold rounded-lg px-2 bg-base-100/50 focus:bg-base-100" value={filters.destino} onChange={e => setFilters(f => ({ ...f, destino: e.target.value }))} >
                           <option value="">Todos</option>
                           {DESTINOS.map(d => <option key={d.label} value={d.label}>{d.label}</option>)}
                        </select>
                      </div>
                    </div>
                  </th>
                  <th className="p-4 border-b border-base-200">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-40">obs</span>
                      <div className="relative">
                        <input type="text" className="input input-bordered h-8 w-full min-w-[100px] text-[10px] font-bold rounded-lg px-2 bg-base-100/50 focus:bg-base-100" placeholder="Procurar texto..." value={filters.obs} onChange={e => setFilters(f => ({ ...f, obs: e.target.value }))} />
                      </div>
                    </div>
                  </th>
                  <th className="p-4 border-b border-base-200 text-center w-36">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Estado</span>
                      <div className="relative">
                        <select className="select select-bordered select-sm h-8 w-full text-[10px] font-bold rounded-lg px-2 bg-base-100/50 focus:bg-base-100 text-center" value={filters.estado} onChange={e => setFilters(f => ({ ...f, estado: e.target.value }))} >
                           <option value="">Todas</option>
                           <option value="pendente">Pendente</option>
                           <option value="movimentado">Movimentado</option>
                        </select>
                      </div>
                    </div>
                  </th>
                </tr>
              )}
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr><td colSpan={7} className="py-24 text-center"><div className="flex flex-col items-center gap-2 opacity-20"><Search className="h-10 w-10"/><span className="text-[10px] font-black uppercase tracking-widest">Nenhum resultado</span></div></td></tr>
              ) : filteredHistory.map(h => (
                <tr key={h.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="p-4 font-mono text-[11px] opacity-40 font-bold">{h.data}</td>
                  <td className="p-4 font-mono text-sm font-black text-primary">{h.codigoArtigo}</td>
                  <td className="p-4 text-xs font-bold opacity-80 uppercase max-w-xs truncate">{h.descricao}</td>
                  <td className="p-4 text-center text-sm font-black">{h.quantidade}</td>
                  <td className="p-4 text-xs font-black uppercase">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-base-content/20"></div>
                      {h.destino}
                      <span className="text-[9px] opacity-20 font-mono tracking-tighter">({h.codigoDestino})</span>
                    </div>
                  </td>
                  <td className="p-4 text-[11px] italic font-medium opacity-50 truncate max-w-[120px]">{h.observacoes || "—"}</td>
                  <td className="p-4 text-right w-36">
                    <span 
                      className={`badge ${h.estadoMovimentacao === 'pendente' ? 'badge-warning' : 'badge-success'} badge-outline font-black text-[9px] h-5 w-24 tracking-tighter uppercase px-0 shadow-sm cursor-pointer hover:bg-base-200 text-center flex justify-center`}
                      onClick={() => toggleEstado(h.id)}
                    >
                      {h.estadoMovimentacao}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}