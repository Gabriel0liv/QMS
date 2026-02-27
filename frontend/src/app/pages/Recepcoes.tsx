import { useState } from "react";
import { FileText, CheckCircle, XCircle, Package, Calendar, User, AlertTriangle } from "lucide-react";

interface ArtigoRecepcao {
  codigo: string;
  descricao: string;
  quantidade: number;
  unidade: string;
}

interface Recepcao {
  id: string;
  numeroRecepcao: string;
  data: string;
  fornecedor: string;
  artigos: ArtigoRecepcao[];
  status: "pendente" | "aprovado" | "rejeitado";
}

// Representa uma inspeção individual de um artigo de uma receção
interface InspecaoArtigo {
  inspecaoId: string;
  recepcaoId: string;
  numeroRecepcao: string;
  data: string;
  fornecedor: string;
  artigo: ArtigoRecepcao;
  status: "pendente" | "aprovado" | "rejeitado";
}

const mockRecepcoes: Recepcao[] = [
  {
    id: "1",
    numeroRecepcao: "REC-2026-0423",
    data: "2026-02-26",
    fornecedor: "MetalCast Industries",
    artigos: [
      { codigo: "01-77-216", descricao: "CX.7715/16X30 - 92MM CORTADO", quantidade: 300, unidade: "kg" },
      { codigo: "01-37-001-09", descricao: "ESPELHO 3730 MARCADO", quantidade: 200, unidade: "UN" }
    ],
    status: "pendente"
  },
  {
    id: "2",
    numeroRecepcao: "REC-2026-0422",
    data: "2026-02-26",
    fornecedor: "ZincoPro Ltd",
    artigos: [
      { codigo: "03-15-049-11", descricao: "TAMPA 1510 VIBRADO (CONES)", quantidade: 350, unidade: "kg" }
    ],
    status: "pendente"
  },
  {
    id: "3",
    numeroRecepcao: "REC-2026-0421",
    data: "2026-02-25",
    fornecedor: "CopperTech SA",
    artigos: [
      { codigo: "08-AK-003-11", descricao: "PUNHO AAJ100 VIBRADO", quantidade: 200, unidade: "UN" }
    ],
    status: "pendente"
  },
  {
    id: "4",
    numeroRecepcao: "REC-2026-0420",
    data: "2026-02-25",
    fornecedor: "SteelWork International",
    artigos: [
      { codigo: "01-77-234-24", descricao: "ESPELHO 7707 PEQ. PONTAS", quantidade: 750, unidade: "UN" }
    ],
    status: "pendente"
  },
  {
    id: "5",
    numeroRecepcao: "REC-2026-0419",
    data: "2026-02-24",
    fornecedor: "MetalCast Industries",
    artigos: [
      { codigo: "08-28-040-11", descricao: "PUNHO 2801 VIBRADO (CONES)", quantidade: 400, unidade: "kg" }
    ],
    status: "pendente"
  }
];

export function Recepcoes() {
  const [selectedInspecao, setSelectedInspecao] = useState<InspecaoArtigo | null>(null);

  // Flatten the data: one inspection per article
  const inspecoes: InspecaoArtigo[] = mockRecepcoes.flatMap(recepcao => 
    recepcao.artigos.map(artigo => ({
      inspecaoId: `${recepcao.id}-${artigo.codigo}`,
      recepcaoId: recepcao.id,
      numeroRecepcao: recepcao.numeroRecepcao,
      data: recepcao.data,
      fornecedor: recepcao.fornecedor,
      artigo: artigo,
      status: recepcao.status
    }))
  );

  const amostragem = selectedInspecao ? (() => {
    const qty = selectedInspecao.artigo.quantidade;
    const amostra = Math.max(10, Math.ceil(qty * 0.03));
    const caixas = Math.ceil(amostra / 5);
    return { amostra, caixas };
  })() : null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Receções</h1>
        <p className="text-gray-700 mt-1">Inspeção de Matéria-Prima e Componentes</p>
      </div>

      {!selectedInspecao ? (
        /* Lista de Receções Não Inspecionadas */
        <div className="card bg-white shadow-lg border border-gray-200">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-gray-900">Itens Pendentes de Inspeção</h2>
              <span className="inline-flex items-center justify-center min-w-[2rem] h-8 px-2.5 rounded-full bg-red-600 text-white text-sm font-bold shadow-sm">
                {inspecoes.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-blue-50">
                  <tr className="border-b-2 border-blue-200">
                    <th className="text-gray-900 font-bold">Nº Receção</th>
                    <th className="text-gray-900 font-bold">Artigo</th>
                    <th className="text-gray-900 font-bold">Descrição</th>
                    <th className="text-gray-900 font-bold">Data</th>
                    <th className="text-gray-900 font-bold">Fornecedor</th>
                    <th className="text-gray-900 font-bold">Estado</th>
                    <th className="text-gray-900 font-bold">Qtd / Unidade</th>
                    <th className="text-gray-900 font-bold">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {inspecoes.map((inspecao) => (
                    <tr key={inspecao.inspecaoId} className="hover:bg-blue-50 border-b border-gray-200">
                      <td className="font-mono font-semibold text-gray-900">{inspecao.numeroRecepcao}</td>
                      <td className="font-mono text-sm text-gray-900">• {inspecao.artigo.codigo}</td>
                      <td className="text-xs text-gray-700 max-w-xs">{inspecao.artigo.descricao}</td>
                      <td className="text-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {inspecao.data}
                        </div>
                      </td>
                      <td className="text-gray-900">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          {inspecao.fornecedor}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-sm font-bold uppercase ${
                          inspecao.status === "pendente" ? "badge-warning" : 
                          inspecao.status === "aprovado" ? "badge-success" : "badge-error"
                        }`}>
                          {inspecao.status}
                        </span>
                      </td>
                      <td className="text-right text-gray-900">
                        <span className="font-semibold">{inspecao.artigo.quantidade}</span> {inspecao.artigo.unidade}
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm text-white"
                          onClick={() => setSelectedInspecao(inspecao)}
                        >
                          <Package className="w-4 h-4" />
                          Inspecionar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Detalhes da Inspecção e Painel de Acção */
        <>
          {/* Material Info Banner */}
          <div className="alert alert-info bg-blue-50 border-2 border-blue-300 mb-6 shadow-md">
            <FileText className="w-6 h-6 text-blue-700" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">Receção: {selectedInspecao.numeroRecepcao}</h3>
              <div className="text-sm text-gray-700 mt-1">
                <span className="font-semibold">Artigo:</span> {selectedInspecao.artigo.codigo} ({selectedInspecao.artigo.descricao}) |
                <span className="font-semibold"> Qtd:</span> {selectedInspecao.artigo.quantidade} {selectedInspecao.artigo.unidade} |
                <span className="font-semibold"> Fornecedor:</span> {selectedInspecao.fornecedor}
              </div>
            </div>
            <button
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-slate-100 hover:text-gray-900 transition-colors"
              onClick={() => {
                setSelectedInspecao(null);
              }}
            >
              ← Voltar à Lista
            </button>
          </div>

          {/* Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: PDF Viewer Simulation */}
            <div className="lg:col-span-3">
              <div className="card bg-white shadow-lg border border-gray-200 h-full">
                <div className="card-body">
                  <h2 className="card-title flex items-center gap-2 mb-4 text-gray-900">
                    <FileText className="w-5 h-5" />
                    Visualizador de Documentos Técnicos
                  </h2>

                  {/* Simulated PDF Viewer */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50" style={{ minHeight: "600px" }}>
                    <div className="text-center p-8">
                      <FileText className="w-24 h-24 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        Desenho Técnico / Especificação
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Visualização de documentos SolidWorks / FileServer
                      </p>
                      <div className="space-y-2 text-left max-w-md mx-auto">
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-700">Documento:</span>
                          <span className="font-mono text-sm text-gray-900">DRW-6082-REV03.pdf</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-700">Norma:</span>
                          <span className="font-semibold text-gray-900">EN AW-6082 T6</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-700">Tolerância:</span>
                          <span className="font-semibold text-gray-900">±0.1mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Acabamento:</span>
                          <span className="font-semibold text-gray-900">Ra 3.2 μm</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Inspection Action Panel */}
            <div className="lg:col-span-2">
              <div className="card bg-white shadow-lg border border-gray-200">
                <div className="card-body">
                  <h2 className="card-title text-xl mb-4 text-gray-900">Painel de Inspeção</h2>

                  {/* Sampling Information */}
                  {amostragem && (
                    <div className="space-y-4 mb-6">
                      <div className="stats stats-vertical shadow-lg bg-blue-50 border-2 border-blue-300 w-full">
                        <div className="stat">
                          <div className="stat-title text-gray-900 font-semibold">Amostragem Calculada</div>
                          <div className="stat-value text-primary">{amostragem.amostra} peças</div>
                          <div className="stat-desc text-gray-700">Segundo norma ISO 2859-1</div>
                        </div>
                      </div>

                      <div className="stats stats-vertical shadow-lg bg-amber-50 border-2 border-amber-300 w-full">
                        <div className="stat">
                          <div className="stat-title text-gray-900 font-semibold">Caixas a Abrir</div>
                          <div className="stat-value text-warning">{amostragem.caixas} caixas</div>
                          <div className="stat-desc text-gray-700">Total estimado de caixas</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* X3 Action Panel Notice */}
                  <div className="space-y-6">
                    <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="bg-amber-500 p-2 rounded-lg text-white">
                          <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-amber-900 uppercase tracking-tight">Continuar operação no X3</h3>
                          <p className="text-sm text-amber-800 leading-relaxed">
                            Para concluir esta inspeção, proceda com o registo de <strong>Aprovação</strong> ou <strong>Rejeição</strong> diretamente no <strong>Sage X3</strong>.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shrink-0"></div>
                      A plataforma Sage AI está sincronizada para monitorização, mas a decisão final é externa.
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="divider"></div>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="font-semibold text-gray-900">Instruções:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Verifique as dimensões críticas</li>
                      <li>Confirme acabamento superficial</li>
                      <li>Valide certificação de material</li>
                      <li>Inspecione embalagem e identificação</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
