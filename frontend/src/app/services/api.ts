const API_BASE_URL = 'http://localhost:5001/api';

export interface ApiArtigo {
  artigoCodigo: string;
  descricao: string;
  categoria?: string;
  unidade?: string;
}

export interface ApiDefeito {
  id: number;
  codigo: string;
  descricao: string;
}

export interface ApiNCRow {
  id?: string;
  data?: string;
  codigoArtigo: string;
  descricao: string;
  quantidade: string;
  defeito: string;
  destino: string;
  codigoDestino?: string;
  estadoMovimentacao?: string;
  observacoes?: string;
  utilizadorCodigo?: string;
  maquinaCodigo?: string;
}

export interface ApiUser {
  utilizadorCodigo: string;
  nome: string;
  email: string;
  cargo: string;
  nivel: string;
}

export interface ApiFornecedor {
  fornecedorCodigo: string;
  nome: string;
}

export interface ApiRececaoInspecao {
  id: number;
  sagePedidoId: string;
  linha: number;
  dataRececao: string;
  qtdTotalRecebida: number;
  estado: string;
  decisaoFinal?: string;
  custoUnitarioMomento: number;
  fatura?: string;
  unidade: string;
  quantidade: number;
  fornecedorCodigo: string;
  fornecedor?: ApiFornecedor;
  artigoCodigo: string;
  artigo?: ApiArtigo;
  utilizadorCodigo: string;
}

export interface RececoesInspecaoResponse {
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  items: ApiRececaoInspecao[];
}

export const api = {
  // Artigos
  async searchArtigos(term: string): Promise<ApiArtigo[]> {
    if (!term || term.length < 2) return [];
    try {
      const response = await fetch(`${API_BASE_URL}/Artigos?search=${encodeURIComponent(term)}&pageSize=10`);
      if (!response.ok) throw new Error('Erro ao pesquisar artigos');
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  async searchMaquinas(term: string): Promise<{ maquinaCodigo: string; descricao: string }[]> {
    if (!term || term.length < 1) return [];
    try {
      const response = await fetch(`${API_BASE_URL}/Maquinas?search=${encodeURIComponent(term)}`);
      if (!response.ok) throw new Error('Erro ao pesquisar máquinas');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  async getMaquinas(): Promise<{ maquinaCodigo: string; descricao: string }[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/Maquinas`);
      if (!response.ok) throw new Error('Erro ao carregar máquinas');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  // Defeitos
  async searchDefeitos(term: string): Promise<ApiDefeito[]> {
    if (!term || term.length < 1) return [];
    try {
      const response = await fetch(`${API_BASE_URL}/CatalogosDefeito?search=${encodeURIComponent(term)}`);
      if (!response.ok) throw new Error('Erro ao pesquisar defeitos');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  async getDefeitos(): Promise<ApiDefeito[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/CatalogosDefeito`);
      if (!response.ok) throw new Error('Erro ao carregar defeitos');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  // Não Conformidades
  async saveNC(rows: ApiNCRow[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/NaoConforme`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rows)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Erro ao guardar registos');
    }
  },

  async getHistorico(): Promise<ApiNCRow[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/NaoConforme`);
      if (!response.ok) throw new Error('Erro ao carregar histórico');
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  // Autenticação
  async login(username: string, password: string): Promise<ApiUser> {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ utilizadorCodigo: username, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Falha na autenticação');
    }
    
    const data = await response.json();
    return data.user;
  },

  // Receções / Inspeções
  async getRececoesInspecao(page: number = 1, pageSize: number = 50, status?: string): Promise<RececoesInspecaoResponse> {
    try {
      let url = `${API_BASE_URL}/RececoesInspecao?page=${page}&pageSize=${pageSize}`;
      if (status) {
        url += `&status=${encodeURIComponent(status)}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Erro ao carregar receções/inspeções');
      return await response.json();
    } catch (error) {
      console.error(error);
      return { totalItems: 0, page, pageSize, totalPages: 0, items: [] };
    }
  }
};
