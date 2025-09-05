export interface Indicador {
  id: string;
  nome: string;
}

export interface Pessoa {
  nome: string;
  sexo: 'F' | 'M';
  idade: number;
  ubs: string;
  equipe: string;
  acs: string;
  cns: string;
  missing: { [indicadorId: string]: boolean };
  obs: { [indicadorId: string]: string };
  elegiveis: string[];
  tags: string[];
  atualizacao: string;
}

export interface FiltrosState {
  periodo: string;
  ubs: string;
  equipe: string;
  acs: string;
  sexo: string;
  faixa: string;
  cond: string;
  ordenar: string;
  busca: string;
}

export interface AppState {
  bloco: 'previne' | 'qualidade';
  indicador: string;
  equipeSelecionada: string;
  filtros: FiltrosState;
}

export interface KPIs {
  elegiveis: number;
  emDia: number;
  faltando: number;
}

export interface EquipeChip {
  nome: string;
  count: number;
  ativo: boolean;
}