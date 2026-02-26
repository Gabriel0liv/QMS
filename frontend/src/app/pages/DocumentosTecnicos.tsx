import { useState } from "react";
import { FileText, Download, Eye, Search, BarChart2 } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  Aprovado: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300",
  Pendente: "bg-amber-100  text-amber-700  ring-1 ring-amber-300",
  Revogado: "bg-red-100    text-red-700    ring-1 ring-red-300",
};

const TIPO_STYLES: Record<string, string> = {
  Desenho: "bg-blue-100   text-blue-700",
  Especificação: "bg-sky-100    text-sky-700",
  Procedimento: "bg-violet-100 text-violet-700",
  Certificação: "bg-orange-100 text-orange-700",
  Formulário: "bg-gray-100   text-gray-700",
};

interface Documento {
  id: number;
  codigo: string;
  titulo: string;
  tipo: string;
  revisao: string;
  data: string;
  status: string;
}

const DOCUMENTOS: Documento[] = [
  {
    id: 1,
    codigo: "DRW-6082-REV03",
    titulo: "Desenho Técnico - Alumínio 6082 T6",
    tipo: "Desenho",
    revisao: "Rev. 03",
    data: "2026-01-15",
    status: "Aprovado",
  },
  {
    id: 2,
    codigo: "SPEC-MAT-001",
    titulo: "Especificação de Material - Ligas de Alumínio",
    tipo: "Especificação",
    revisao: "Rev. 02",
    data: "2026-02-10",
    status: "Aprovado",
  },
  {
    id: 3,
    codigo: "PROC-INS-042",
    titulo: "Procedimento de Inspeção - Receção",
    tipo: "Procedimento",
    revisao: "Rev. 01",
    data: "2025-11-20",
    status: "Aprovado",
  },
  {
    id: 4,
    codigo: "CERT-ISO-2859",
    titulo: "Certificação ISO 2859-1 - Amostragem",
    tipo: "Certificação",
    revisao: "Rev. 01",
    data: "2025-09-05",
    status: "Aprovado",
  },
  {
    id: 5,
    codigo: "FORM-094E",
    titulo: "Formulário 094/E - Não-Conformidades",
    tipo: "Formulário",
    revisao: "Rev. 04",
    data: "2026-01-30",
    status: "Aprovado",
  },
];

const STATS = [
  { label: "Total", value: 127, color: "text-blue-600" },
  { label: "Desenhos", value: 45, color: "text-sky-600" },
  { label: "Especificações", value: 38, color: "text-violet-600" },
  { label: "Procedimentos", value: 44, color: "text-orange-600" },
];

export function DocumentosTecnicos() {
  const [search, setSearch] = useState("");

  const filtered = DOCUMENTOS.filter(
    (d) =>
      d.codigo.toLowerCase().includes(search.toLowerCase()) ||
      d.titulo.toLowerCase().includes(search.toLowerCase()) ||
      d.tipo.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = (codigo: string) => alert(`Visualizar documento: ${codigo}`);
  const handleDownload = (codigo: string) => alert(`Download: ${codigo}`);

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
              Documentos Técnicos
            </h1>
            <p className="text-sm text-gray-500">
              Biblioteca de Especificações, Desenhos e Procedimentos
            </p>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl bg-white border border-gray-100 shadow-sm px-4 py-3">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div className="mb-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar por código, título ou tipo…"
            className="input input-bordered w-full bg-white pl-10 text-gray-900 border-gray-300 focus:border-blue-500 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop / tablet table */}
      <div className="hidden sm:block rounded-2xl bg-white border border-gray-100 shadow-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">
            Documentos disponíveis
            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
              {filtered.length}
            </span>
          </h2>
          <BarChart2 className="h-4 w-4 text-gray-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                {["Código", "Título", "Tipo", "Revisão", "Data", "Status", "Ações"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-800">
                    {doc.codigo}
                  </td>
                  <td className="px-4 py-3 text-gray-800 max-w-xs truncate" title={doc.titulo}>
                    {doc.titulo}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TIPO_STYLES[doc.tipo] ?? "bg-gray-100 text-gray-600"}`}>
                      {doc.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{doc.revisao}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{doc.data}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[doc.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        onClick={() => handleView(doc.codigo)}
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        onClick={() => handleDownload(doc.codigo)}
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400">
                    Nenhum documento encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile list (card per document) */}
      <div className="sm:hidden space-y-3">
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">Nenhum documento encontrado.</p>
        )}
        {filtered.map((doc) => (
          <div key={doc.id} className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-mono text-xs font-semibold text-gray-500">{doc.codigo}</p>
                <p className="mt-0.5 text-sm font-medium text-gray-900 leading-tight">{doc.titulo}</p>
              </div>
              <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[doc.status] ?? "bg-gray-100 text-gray-600"}`}>
                {doc.status}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TIPO_STYLES[doc.tipo] ?? "bg-gray-100 text-gray-600"}`}>
                {doc.tipo}
              </span>
              <span className="text-xs text-gray-400">{doc.revisao}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400">{doc.data}</span>
            </div>
            <div className="mt-3 flex gap-2 border-t border-gray-50 pt-3">
              <button
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-1.5 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                onClick={() => handleView(doc.codigo)}
              >
                <Eye className="h-3.5 w-3.5" /> Ver
              </button>
              <button
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 py-1.5 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                onClick={() => handleDownload(doc.codigo)}
              >
                <Download className="h-3.5 w-3.5" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}