export interface KPIMaterno {
  id: string;
  label: string;
  value: number;
  unit: string;
}

export interface DadosGrafico {
  labels: string[];
  values: number[];
}

export interface RankingUBS {
  ubs: string;
  indicador: string;
  meta: number;
  atual: number;
}

export interface DadosMaterno {
  kpis: KPIMaterno[];
  prenatalTendencia: DadosGrafico;
  vacinacaoTendencia: DadosGrafico;
  ranking: RankingUBS[];
}