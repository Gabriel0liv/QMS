import { useState, useRef, useEffect, useMemo } from "react";
import { Plus, Trash2, Pencil, Send, X, Clock, CheckCircle, AlertTriangle, Search, List, LayoutGrid, Filter, ArrowLeft, ChevronRight, ChevronLeft, MonitorSmartphone, Factory, Undo2 } from "lucide-react";
import { useSearchParams } from "react-router";

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
  estadoMovimentacao: "pendente" | "movimentado" | "concluído";
}

interface DraftState {
  codigoArtigo: string;
  descricao: string;
  quantidade: string;
  destino: string;
  codigoDestino: string;
  observacoes: string;
}

const HISTORICO_INICIAL: HistoricoItem[] = [
  { id: "h1", data: "26/02/2026 10:42", codigoArtigo: "08-AK-003-11",  descricao: "PUNHO AAJ100 VIBRADO",            quantidade: "12", destino: "Derreter", codigoDestino: "CR001", observacoes: "Porosidade", estadoMovimentacao: "pendente" },
  { id: "h2", data: "26/02/2026 10:42", codigoArtigo: "03-15-412-11",  descricao: "CORPO (INT.) 1520 VIBRADO",        quantidade: "5",  destino: "Derreter", codigoDestino: "CR001", observacoes: "", estadoMovimentacao: "pendente" },
  { id: "h3", data: "26/02/2026 10:42", codigoArtigo: "03-15-413-11",  descricao: "TAMPA 1520 VIBRADO (CONES)",      quantidade: "5",  destino: "Derreter", codigoDestino: "CR001", observacoes: "", estadoMovimentacao: "movimentado" },
  { id: "h4", data: "25/02/2026 14:15", codigoArtigo: "08-15-001-44",  descricao: "PUNHO 1500 CINZA 9006",           quantidade: "8",  destino: "Decapar",  codigoDestino: "CQT01", observacoes: "Dimensional", estadoMovimentacao: "movimentado" },
  { id: "h5", data: "24/02/2026 08:30", codigoArtigo: "02-10-001-23",  descricao: "ABA CURVA DOB. 1000 PRETO",      quantidade: "45", destino: "Sucatar",  codigoDestino: "CS001", observacoes: "", estadoMovimentacao: "concluído" },
  { id: "h6", data: "24/02/2026 08:30", codigoArtigo: "08-VE-001-76",  descricao: "PUNHO VELA PRETO 9005-SAV",      quantidade: "3",  destino: "Decapar",  codigoDestino: "CQT01", observacoes: "Rebarbas", estadoMovimentacao: "concluído" },
];

const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

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
                  e.preventDefault();
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

function RegistrationView({ onSave, onBack }: { onSave: (items: NCRow[]) => void; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<"form" | "list">("form");
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const [rows, setRows] = useState<NCRow[]>(() => {
    const saved = localStorage.getItem("nc_draft_rows");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [draft, setDraft] = useState<DraftState>(() => {
    const saved = localStorage.getItem("nc_draft_fields");
    return saved ? JSON.parse(saved) : { codigoArtigo: "", descricao: "", quantidade: "", destino: "", codigoDestino: "", observacoes: "" };
  });

  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("nc_draft_rows", JSON.stringify(rows));
  }, [rows]);

  useEffect(() => {
    localStorage.setItem("nc_draft_fields", JSON.stringify(draft));
  }, [draft]);

  const handleAdd = () => {
    if (!draft.codigoArtigo || !draft.quantidade || !draft.destino) {
      setError("Preencha os campos obrigatórios (*)");
      return;
    }
    if (editId) {
      setRows((r: NCRow[]) => r.map(x => x.id === editId ? { ...draft, id: editId } : x));
    } else {
      setRows((r: NCRow[]) => [...r, { ...draft, id: generateId() }]);
    }
    setDraft({ codigoArtigo: "", descricao: "", quantidade: "", destino: "", codigoDestino: "", observacoes: "" });
    setEditId(null);
    setError("");
    if (window.innerWidth < 768) setActiveTab("list");
  };

  const clearPersistence = () => {
    localStorage.removeItem("nc_draft_rows");
    localStorage.removeItem("nc_draft_fields");
  };

  const handleCancel = () => {
    if (rows.length > 0 || draft.codigoArtigo) {
      setShowCancelModal(true);
    } else {
       onBack();
    }
  };

  const handleConfirmCancel = () => {
    setRows([]);
    setDraft({ codigoArtigo: "", descricao: "", quantidade: "", destino: "", codigoDestino: "", observacoes: "" });
    clearPersistence();
    setShowCancelModal(false);
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-base-100 rounded-3xl overflow-hidden shadow-xl border border-base-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="px-6 py-5 border-b border-base-200 flex items-center justify-between bg-base-100/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary"><Factory className="h-5 w-5"/></div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight">Novo Registo NC</h2>
            <div className="flex items-center gap-2 text-[10px] font-black opacity-40 uppercase tracking-widest">
              <span>Chão de Fábrica</span>
              <ChevronRight className="h-2 w-2"/>
              <span>Registo Manual</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="btn btn-ghost btn-sm gap-2 font-black uppercase text-[10px] rounded-lg tracking-widest opacity-60 hover:opacity-100" onClick={onBack}>
             <ArrowLeft className="h-3.5 w-3.5"/> Voltar
           </button>
           <div className="hidden md:flex items-center gap-2 bg-base-200/50 px-3 py-1.5 rounded-full ml-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-[10px] font-black uppercase opacity-60">Poupado Automático</span>
           </div>
        </div>
      </div>

      <div className="md:hidden flex p-1 bg-base-200 mx-4 mt-4 rounded-xl">
        <button className={`flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all ${activeTab === "form" ? "bg-base-100 shadow-sm text-primary" : "opacity-40"}`} onClick={() => setActiveTab("form")}>Formulário</button>
        <button className={`flex-1 py-2 text-xs font-black uppercase rounded-lg transition-all ${activeTab === "list" ? "bg-base-100 shadow-sm text-primary" : "opacity-40"}`} onClick={() => setActiveTab("list")}>Lista ({rows.length})</button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
        <div className="max-w-6xl mx-auto space-y-8">
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
                <ArtigoInput value={draft.codigoArtigo} onChange={(c, d) => setDraft((v: DraftState) => ({ ...v, codigoArtigo: c, descricao: d }))} />
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
                  <input type="number" min="0" className="input input-bordered h-10 w-full font-black text-sm" value={draft.quantidade} onChange={e => setDraft((v: DraftState) => ({ ...v, quantidade: e.target.value }))} placeholder="0" />
                </div>
                <div>
                  <label className="label py-0 mb-1 text-[10px] font-black uppercase opacity-60">Destino *</label>
                  <select className="select select-bordered h-10 min-h-0 w-full font-black text-[11px] uppercase p-0 px-2" value={draft.destino} onChange={e => {
                    const d = DESTINOS.find(x => x.label === e.target.value);
                    setDraft((v: DraftState) => ({ ...v, destino: e.target.value, codigoDestino: d?.codigo || "" }));
                  }}>
                    <option value="" disabled>ESCOLHER...</option>
                    {DESTINOS.map(d => <option key={d.codigo} value={d.label}>{d.label.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="label py-0 mb-1 text-[10px] font-black uppercase opacity-60">Obs.</label>
                  <input className="input input-bordered h-10 w-full text-xs" value={draft.observacoes} onChange={e => setDraft((v: DraftState) => ({ ...v, observacoes: e.target.value }))} placeholder="..." />
                </div>
                <button className="btn btn-secondary h-10 min-h-0 px-6 rounded-xl shadow-lg shadow-secondary/20" onClick={handleAdd}>
                  <Plus className="h-4 w-4"/>
                  <span className="font-black text-xs">{editId ? "GRAVAR" : "ADD"}</span>
                </button>
              </div>
            </div>
            {error && <div className="p-3 bg-error/10 text-error text-[10px] font-black rounded-lg uppercase flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5"/>{error}</div>}
          </div>

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
                            <button className="btn btn-ghost btn-xs btn-circle hover:text-error" onClick={() => setRows((prev: NCRow[]) => prev.filter(x => x.id !== r.id))}><Trash2 className="h-3 w-3"/></button>
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

      <div className="px-8 py-5 border-t border-base-200 bg-base-100/80 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="hidden md:flex items-center gap-3">
           <div className={`h-2.5 w-2.5 rounded-full ${rows.length > 0 ? "bg-success" : "bg-base-200"}`}></div>
           <span className="text-[11px] font-black opacity-40 uppercase tracking-widest">{rows.length} registos preparados</span>
        </div>
        <div className="flex w-full md:w-auto gap-4">
          <button 
            className="btn btn-ghost h-12 min-h-0 px-6 rounded-xl gap-2 font-black text-xs uppercase tracking-widest text-error hover:bg-error/10 flex-1 md:flex-initial"
            onClick={handleCancel}
          >
            <Trash2 className="h-4 w-4"/>
            Cancelar
          </button>
          <button 
            className="btn btn-primary h-12 min-h-0 px-10 rounded-xl gap-3 shadow-xl shadow-primary/20 flex-1 md:flex-initial"
            disabled={rows.length === 0}
            onClick={() => {
              onSave(rows);
              setRows([]);
              clearPersistence();
            }}
          >
            <Send className="h-4 w-4"/>
            <span className="font-black text-xs uppercase tracking-widest">Enviar Registos ({rows.length})</span>
          </button>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-base-300/60">
          <div className="bg-base-100 rounded-[3rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] border border-base-200 w-full max-w-lg overflow-hidden">
            <div className="p-10 text-center space-y-6">
              <div className="h-24 w-24 bg-error/10 text-error rounded-[2rem] flex items-center justify-center mx-auto shadow-inner mb-2">
                <AlertTriangle className="h-12 w-12"/>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black uppercase tracking-tight">Cancelar Rascunho?</h3>
                <p className="text-sm font-bold opacity-60 px-4 leading-relaxed">
                  Tem a certeza que deseja cancelar?
                  <br/>
                  <span className="text-error mt-2 block">Todos os registos manuais inseridos neste rascunho serão apagados.</span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-4 bg-base-200/50 border-t border-base-200">
              <button 
                className="btn btn-ghost h-20 text-sm font-black uppercase tracking-widest rounded-3xl hover:bg-base-300 active:scale-95" 
                onClick={() => setShowCancelModal(false)}
              >
                Manter
              </button>
              <button 
                className="btn btn-error h-20 text-sm font-black uppercase tracking-widest rounded-3xl shadow-xl shadow-error/20 active:scale-95" 
                onClick={handleConfirmCancel}
              >
                Apagar Registos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function RegistoNC() {
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

  const [historico, setHistorico] = useState<HistoricoItem[]>(HISTORICO_INICIAL);
  const [submitted, setSubmitted] = useState(false);
  const [filters, setFilters] = useState({ data: "", dataOperator: "=", artigo: "", designacao: "", qtd: "", qtdOperator: "=", destino: "", obs: "", estado: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingRecord, setEditingRecord] = useState<HistoricoItem | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [viewParam]);

  const filteredHistory = useMemo(() => {
    return historico.filter(h => {
      let matchData = true;
      if (filters.data) {
         const itemParts = h.data.split(" ")[0].split("/");
         if (itemParts.length === 3) {
           const itemDateStr = `${itemParts[2]}-${itemParts[1]}-${itemParts[0]}`;
           if (filters.dataOperator === ">") matchData = itemDateStr > filters.data;
           else if (filters.dataOperator === "<") matchData = itemDateStr < filters.data;
           else matchData = itemDateStr === filters.data;
         }
      }
      const matchArtigo = h.codigoArtigo.toLowerCase().includes(filters.artigo.toLowerCase());
      const matchDesignacao = h.descricao.toLowerCase().includes(filters.designacao.toLowerCase());
      const matchDestino = h.destino.toLowerCase().includes(filters.destino.toLowerCase());
      const matchObs = h.observacoes.toLowerCase().includes(filters.obs.toLowerCase());
      const matchEstado = filters.estado === "" || h.estadoMovimentacao === filters.estado;

      let matchQtd = true;
      if (filters.qtd.trim() !== "") {
        const filterQtd = parseInt(filters.qtd.trim(), 10);
        const itemQtd = parseInt(h.quantidade, 10);
        if (!isNaN(itemQtd) && !isNaN(filterQtd)) {
          switch (filters.qtdOperator) {
            case ">": matchQtd = itemQtd > filterQtd; break;
            case "<": matchQtd = itemQtd < filterQtd; break;
            case ">=": matchQtd = itemQtd >= filterQtd; break;
            case "<=": matchQtd = itemQtd <= filterQtd; break;
            default: matchQtd = itemQtd === filterQtd; break;
          }
        } else if (!isNaN(filterQtd)) matchQtd = false;
        else matchQtd = h.quantidade.includes(filters.qtd.trim());
      }
      return matchData && matchArtigo && matchDesignacao && matchDestino && matchObs && matchEstado && matchQtd;
    });
  }, [historico, filters]);

  const handleSave = (newRows: NCRow[]) => {
    const now = new Date().toLocaleString("pt-PT", { dateStyle: "short", timeStyle: "short" });
    const items: HistoricoItem[] = newRows.map(r => ({ ...r, data: now, estadoMovimentacao: "pendente", id: generateId() }));
    setHistorico(h => [...items, ...h]);
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
              <div className="text-[9px] uppercase font-black opacity-40">Destino</div>
              <div className="text-xs font-bold truncate">{currentItem.destino}</div>
            </div>
          </div>
          <div className="pr-2 border-l border-base-200 pl-4 h-full flex flex-col items-center justify-center w-28 md:w-36">
            <span className="text-[9px] uppercase font-black opacity-40 mb-1">Estado</span>
            <button className={`badge ${currentItem.estadoMovimentacao === "pendente" ? "badge-warning" : "badge-success"} font-black text-[10px] h-6 w-full uppercase border-0 cursor-pointer`} onClick={() => toggleEstado(currentItem.id)}>
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
                <button className={`btn h-10 min-h-0 px-4 rounded-xl ${showFilters ? 'btn-primary shadow-lg shadow-primary/20' : 'btn-ghost'}`} onClick={() => setShowFilters(!showFilters)}>
                  <Filter className="h-4 w-4" />
                  <span className="text-xs font-black uppercase tracking-widest leading-none mt-0.5">Filtros</span>
                </button>
                <button className="btn btn-primary h-10 min-h-0 rounded-xl gap-2 px-6 shadow-xl shadow-primary/20" onClick={() => setView("ADD")}>
                  <Plus className="h-4 w-4"/>
                  <span className="font-black uppercase tracking-widest text-xs leading-none mt-0.5">Registar NC</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-base-200/30">
                    <th className="p-4"><span className="text-[9px] font-black uppercase opacity-40">Data</span></th>
                    <th className="p-4"><span className="text-[9px] font-black uppercase opacity-40">Artigo</span></th>
                    <th className="p-4"><span className="text-[9px] font-black uppercase opacity-40">Designação</span></th>
                    <th className="p-4 text-center"><span className="text-[9px] font-black uppercase opacity-40">Qtd</span></th>
                    <th className="p-4"><span className="text-[9px] font-black uppercase opacity-40">Destino</span></th>
                    <th className="p-4 text-center w-36"><span className="text-[9px] font-black uppercase opacity-40 block w-full">Estado</span></th>
                    <th className="p-4 w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map(h => (
                    <tr key={h.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="p-4 font-mono text-[11px] opacity-40">{h.data}</td>
                      <td className="p-4 font-mono text-sm font-black text-primary">{h.codigoArtigo}</td>
                      <td className="p-4 text-xs font-bold opacity-80 uppercase truncate max-w-xs">{h.descricao}</td>
                      <td className="p-4 text-center text-sm font-black">{h.quantidade}</td>
                      <td className="p-4 text-xs font-black uppercase">{h.destino}</td>
                      <td className="p-4 text-right w-36"><button className={`badge ${h.estadoMovimentacao === 'pendente' ? 'badge-warning' : h.estadoMovimentacao === 'movimentado' ? 'badge-info' : 'badge-success'} badge-outline font-black text-[9px] h-5 w-24 uppercase cursor-pointer text-center flex justify-center`} onClick={() => toggleEstado(h.id)}>{h.estadoMovimentacao}</button></td>
                      <td className="p-4 pr-6 text-right w-24"><div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button className="btn btn-ghost btn-xs btn-circle hover:text-primary" onClick={() => setEditingRecord({...h})}><Pencil className="h-3.5 w-3.5"/></button><button className="btn btn-ghost btn-xs btn-circle hover:text-error" onClick={() => handleDeleteRecord(h.id)}><Trash2 className="h-3.5 w-3.5"/></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ── ADD VIEW ── */}
      <div className={`flex-1 overflow-y-auto p-4 md:p-8 ${currentView === "ADD" ? "block" : "hidden"}`}>
        <RegistrationView onSave={handleSave} onBack={() => setView("LIST")} />
      </div>

      {/* ── IFRAME MOBILIDADE ── */}
      <div className={`flex-1 flex flex-col ${currentView === "IFRAME_MOBILIDADE" ? "flex" : "hidden"}`}>
         <IframeHeader />
         <div className="flex-1 bg-white relative">
            <iframe src="https://github.com/" className="absolute inset-0 w-full h-full border-0" title="Mobilidade" />
         </div>
      </div>

      {/* ── IFRAME CHAO FABRICA ── */}
      <div className={`flex-1 flex flex-col ${currentView === "IFRAME_CHAO_FAB_VIEW" ? "flex" : "hidden"}`}>
         <IframeHeader />
         <div className="flex-1 bg-white relative">
            <iframe src="https://pt.wikipedia.org/wiki/Portal:Engenharia" className="absolute inset-0 w-full h-full border-0" title="Chao de Fabrica" />
         </div>
      </div>

      {/* ── EDIT OVERLAY ── */}
      {editingRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-base-300/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-base-100 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
             <h3 className="font-black uppercase text-sm">Editar Registo de NC</h3>
             <div className="space-y-4 pt-2">
                <ArtigoInput value={editingRecord.codigoArtigo} onChange={(c, d) => setEditingRecord((v: HistoricoItem | null) => v ? ({...v, codigoArtigo: c, descricao: d}) : null)} />
                <input type="number" min="0" className="input input-bordered w-full font-black" value={editingRecord.quantidade} onChange={e => setEditingRecord((v: HistoricoItem | null) => v ? ({...v, quantidade: e.target.value}) : null)} />
                <select className="select select-bordered w-full" value={editingRecord.destino} onChange={e => setEditingRecord((v: HistoricoItem | null) => v ? ({...v, destino: e.target.value}) : null)} >
                  {DESTINOS.map(d => <option key={d.codigo} value={d.label}>{d.label.toUpperCase()}</option>)}
                </select>
                <div className="flex gap-3 pt-4"><button className="btn btn-ghost flex-1 font-black" onClick={() => setEditingRecord(null)}>CANCELAR</button><button className="btn btn-primary flex-1 font-black" onClick={handleSaveEdit}>GRAVAR</button></div>
             </div>
          </div>
        </div>
      )}
      {/* ── FILTER MODAL ── */}
      {showFilters && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-base-300/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-base-100 rounded-3xl w-full max-w-lg shadow-[0_32px_128px_-32px_rgba(0,0,0,0.4)] border border-base-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-base-200 flex items-center justify-between">
              <h3 className="font-black uppercase flex items-center gap-2 tracking-tight"><Filter className="h-5 w-5"/> Filtros de Pesquisa</h3>
              <button className="btn btn-ghost btn-circle btn-sm hover:bg-base-200" onClick={() => setShowFilters(false)}><X className="h-4 w-4"/></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
               <div>
                  <label className="label py-0 mb-1.5 text-[10px] font-black uppercase opacity-60 tracking-widest">Data Registo <span className="text-primary">*</span></label>
                  <div className="flex gap-2">
                    <select className="select select-bordered text-sm font-black w-32 bg-base-100" value={filters.dataOperator} onChange={e => setFilters({...filters, dataOperator: e.target.value})}>
                      <option value="=">NO DIA (=)</option>
                      <option value=">">APÓS (&gt;)</option>
                      <option value="<">ANTES (&lt;)</option>
                    </select>
                    <input type="date" className="input input-bordered flex-1 text-sm font-bold uppercase" value={filters.data} onChange={e => setFilters({...filters, data: e.target.value})} />
                  </div>
               </div>
               
               <div>
                  <label className="label py-0 mb-1.5 text-[10px] font-black uppercase opacity-60 tracking-widest">Artigo</label>
                  <ArtigoInput value={filters.artigo} onChange={(c, d) => setFilters({...filters, artigo: c, designacao: d || filters.designacao})} />
               </div>

               <div>
                  <label className="label py-0 mb-1.5 text-[10px] font-black uppercase opacity-60 tracking-widest">Designação Livre</label>
                  <input type="text" className="input input-bordered w-full uppercase text-sm" value={filters.designacao} onChange={e => setFilters({...filters, designacao: e.target.value})} placeholder="Parte do texto..." />
               </div>

               <div>
                  <label className="label py-0 mb-1.5 text-[10px] font-black uppercase opacity-60 tracking-widest">Quantidade</label>
                  <div className="flex gap-2">
                    <select className="select select-bordered text-sm font-black w-32 bg-base-100" value={filters.qtdOperator} onChange={e => setFilters({...filters, qtdOperator: e.target.value})}>
                      <option value="=">IGUAL (=)</option>
                      <option value=">">MAIOR (&gt;)</option>
                      <option value="<">MENOR (&lt;)</option>
                    </select>
                    <input type="number" min="0" className="input input-bordered flex-1 text-sm font-bold" value={filters.qtd} onChange={e => setFilters({...filters, qtd: e.target.value})} placeholder="Qtd..." />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label py-0 mb-1.5 text-[10px] font-black uppercase opacity-60 tracking-widest">Destino</label>
                    <select className="select select-bordered w-full uppercase text-sm font-bold bg-base-100" value={filters.destino} onChange={e => setFilters({...filters, destino: e.target.value})}>
                      <option value="">TODOS OS DESTINOS</option>
                      {DESTINOS.map(d => <option key={d.codigo} value={d.label}>{d.label.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label py-0 mb-1.5 text-[10px] font-black uppercase opacity-60 tracking-widest">Estado</label>
                    <select className="select select-bordered w-full uppercase text-sm font-bold bg-base-100" value={filters.estado} onChange={e => setFilters({...filters, estado: e.target.value})}>
                      <option value="">TODOS OS ESTADOS</option>
                      <option value="pendente">PENDENTE</option>
                      <option value="movimentado">MOVIMENTADO</option>
                      <option value="concluído">CONCLUÍDO</option>
                    </select>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-base-200 flex gap-4">
              <button className="btn btn-ghost flex-1 font-black uppercase tracking-[0.2em] text-[10px]" onClick={() => setFilters({ data: "", dataOperator: "=", artigo: "", designacao: "", qtd: "", qtdOperator: "=", destino: "", obs: "", estado: "" })}>
                Limpar
              </button>
              <button className="btn btn-primary flex-1 font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-primary/20" onClick={() => setShowFilters(false)}>
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}