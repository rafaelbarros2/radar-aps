export interface KPIDeterminante {
  id: string;
  label: string;
  value: number | string;
  unit: string;
}

export interface DadosCorrelacao {
  labels: string[];
  values: number[];
}

export interface IndicadorDetalhado {
  indicador: string;
  valor: string;
  fonte: string;
}

export interface DadosDeterminantes {
  kpis: KPIDeterminante[];
  correlacao: DadosCorrelacao;
  tabela: IndicadorDetalhado[];
}