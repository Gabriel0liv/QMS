import { useState } from "react";
import { FileText, CheckCircle, XCircle, Package, Calendar, User } from "lucide-react";

interface Recepcao {
  id: string;
  numeroRecepcao: string;
  data: string;
  fornecedor: string;
  material: string;
  lote: string;
  quantidade: number;
  unidade: string;
  status: "pendente" | "aprovado" | "rejeitado";
}

const mockRecepcoes: Recepcao[] = [
  {
    id: "1",
    numeroRecepcao: "REC-2026-0423",
    data: "2026-02-26",
    fornecedor: "MetalCast Industries",
    material: "Alumínio EN AW-6082 T6",
    lote: "MC-20260223-A",
    quantidade: 500,
    unidade: "kg",
    status: "pendente"
  },
  {
    id: "2",
    numeroRecepcao: "REC-2026-0422",
    data: "2026-02-26",
    fornecedor: "ZincoPro Ltd",
    material: "Zinco Zamak-5",
    lote: "ZP-20260225-B",
    quantidade: 350,
    unidade: "kg",
    status: "pendente"
  },
  {
    id: "3",
    numeroRecepcao: "REC-2026-0421",
    data: "2026-02-25",
    fornecedor: "CopperTech SA",
    material: "Cobre Eletrolítico C11000",
    lote: "CT-20260224-C",
    quantidade: 200,
    unidade: "kg",
    status: "pendente"
  },
  {
    id: "4",
    numeroRecepcao: "REC-2026-0420",
    data: "2026-02-25",
    fornecedor: "SteelWork International",
    material: "Aço Inoxidável 316L",
    lote: "SW-20260224-D",
    quantidade: 750,
    unidade: "kg",
    status: "pendente"
  },
  {
    id: "5",
    numeroRecepcao: "REC-2026-0419",
    data: "2026-02-24",
    fornecedor: "MetalCast Industries",
    material: "Alumínio EN AW-5083",
    lote: "MC-20260222-E",
    quantidade: 400,
    unidade: "kg",
    status: "pendente"
  }
];

export function Recepcoes() {
  const [selectedRecepcao, setSelectedRecepcao] = useState<Recepcao | null>(null);
  const [quantidadeAfetada, setQuantidadeAfetada] = useState("");
  const [defeitoSelecionado, setDefeitoSelecionado] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const defeitosDisponiveis = [
    "Dimensional fora de especificação",
    "Acabamento superficial inadequado",
    "Material incorreto",
    "Certificação em falta",
    "Danos de transporte",
    "Embalagem inadequada",
    "Identificação incorreta",
  ];

  // Cálculos de amostragem (mockados baseados na quantidade)
  const calcularAmostragem = (quantidade: number) => {
    // Simulação simples: 3% da quantidade, mínimo 10 peças
    const amostra = Math.max(10, Math.ceil(quantidade * 0.03));
    const caixas = Math.ceil(amostra / 5); // Aproximadamente 5 peças por caixa
    return { amostra, caixas };
  };

  const handleAprovar = () => {
    if (!selectedRecepcao) return;
    alert(`Material APROVADO e disponibilizado para produção\nReceção: ${selectedRecepcao.numeroRecepcao}`);
    setSelectedRecepcao(null);
    setShowRejectForm(false);
  };

  const handleRejeitar = () => {
    if (!selectedRecepcao || !quantidadeAfetada || !defeitoSelecionado) {
      alert("Por favor, preencha a quantidade afetada e o tipo de defeito");
      return;
    }
    alert(`Material REJEITADO:\nReceção: ${selectedRecepcao.numeroRecepcao}\nQuantidade Afetada: ${quantidadeAfetada}\nDefeito: ${defeitoSelecionado}\n\nEstado: EM QUARENTENA`);
    setQuantidadeAfetada("");
    setDefeitoSelecionado("");
    setShowRejectForm(false);
    setSelectedRecepcao(null);
  };

  const amostragem = selectedRecepcao ? calcularAmostragem(selectedRecepcao.quantidade) : null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Receções</h1>
        <p className="text-gray-700 mt-1">Inspeção de Matéria-Prima e Componentes</p>
      </div>

      {!selectedRecepcao ? (
        /* Lista de Receções Não Inspecionadas */
        <div className="card bg-white shadow-lg border border-gray-200">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-bold text-gray-900">Receções Pendentes de Inspeção</h2>
              <span className="inline-flex items-center justify-center min-w-[2rem] h-8 px-2.5 rounded-full bg-red-600 text-white text-sm font-bold shadow-sm">
                {mockRecepcoes.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-blue-50">
                  <tr className="border-b-2 border-blue-200">
                    <th className="text-gray-900 font-bold">Nº Receção</th>
                    <th className="text-gray-900 font-bold">Data</th>
                    <th className="text-gray-900 font-bold">Fornecedor</th>
                    <th className="text-gray-900 font-bold">Material</th>
                    <th className="text-gray-900 font-bold">Lote</th>
                    <th className="text-gray-900 font-bold">Quantidade</th>
                    <th className="text-gray-900 font-bold">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecepcoes.map((recepcao) => (
                    <tr key={recepcao.id} className="hover:bg-blue-50 border-b border-gray-200">
                      <td className="font-mono font-semibold text-gray-900">{recepcao.numeroRecepcao}</td>
                      <td className="text-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {recepcao.data}
                        </div>
                      </td>
                      <td className="text-gray-900">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          {recepcao.fornecedor}
                        </div>
                      </td>
                      <td className="font-medium text-gray-900">{recepcao.material}</td>
                      <td className="font-mono text-sm text-gray-900">{recepcao.lote}</td>
                      <td className="text-right text-gray-900">
                        <span className="font-semibold">{recepcao.quantidade}</span> {recepcao.unidade}
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm text-white"
                          onClick={() => setSelectedRecepcao(recepcao)}
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
        /* Detalhes da Receção e Painel de Inspeção */
        <>
          {/* Material Info Banner */}
          <div className="alert alert-info bg-blue-50 border-2 border-blue-300 mb-6 shadow-md">
            <FileText className="w-6 h-6 text-blue-700" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">Receção: {selectedRecepcao.numeroRecepcao}</h3>
              <div className="text-sm text-gray-700 mt-1">
                <span className="font-semibold">Material:</span> {selectedRecepcao.material} |
                <span className="font-semibold"> Fornecedor:</span> {selectedRecepcao.fornecedor} |
                <span className="font-semibold"> Lote:</span> {selectedRecepcao.lote}
              </div>
            </div>
            <button
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-slate-100 hover:text-gray-900 transition-colors"
              onClick={() => {
                setSelectedRecepcao(null);
                setShowRejectForm(false);
                setQuantidadeAfetada("");
                setDefeitoSelecionado("");
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

                  {/* Action Buttons */}
                  <div className="space-y-3 mb-6">
                    <button
                      className="btn btn-success btn-lg w-full text-white"
                      onClick={handleAprovar}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Aprovar
                    </button>
                    <button
                      className="btn btn-error btn-lg w-full text-white"
                      onClick={() => setShowRejectForm(!showRejectForm)}
                    >
                      <XCircle className="w-5 h-5" />
                      Rejeitar / Quarentena
                    </button>
                  </div>

                  {/* Reject Form (conditional) */}
                  {showRejectForm && (
                    <div className="bg-red-50 p-4 rounded-lg space-y-4 border-2 border-error">
                      <h3 className="font-bold text-error text-base">Justificação de Rejeição</h3>

                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold text-gray-900">Quantidade Afetada</span>
                        </label>
                        <input
                          type="number"
                          placeholder="Ex: 250"
                          className="input input-bordered w-full bg-white text-gray-900 border-2 border-gray-300"
                          value={quantidadeAfetada}
                          onChange={(e) => setQuantidadeAfetada(e.target.value)}
                          min="1"
                          max={selectedRecepcao.quantidade}
                        />
                      </div>

                      <div className="form-control w-full">
                        <label className="label">
                          <span className="label-text font-semibold text-gray-900">Catálogo de Defeitos</span>
                        </label>
                        <select
                          className="select select-bordered w-full bg-white text-gray-900 border-2 border-gray-300"
                          value={defeitoSelecionado}
                          onChange={(e) => setDefeitoSelecionado(e.target.value)}
                        >
                          <option value="" disabled>Selecione o defeito</option>
                          {defeitosDisponiveis.map((defeito) => (
                            <option key={defeito} value={defeito}>{defeito}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="btn btn-ghost btn-sm flex-1 text-gray-900 border-2 border-gray-300"
                          onClick={() => {
                            setShowRejectForm(false);
                            setQuantidadeAfetada("");
                            setDefeitoSelecionado("");
                          }}
                        >
                          Cancelar
                        </button>
                        <button
                          className="btn btn-error btn-sm flex-1 text-white"
                          onClick={handleRejeitar}
                        >
                          Confirmar Rejeição
                        </button>
                      </div>
                    </div>
                  )}

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
