export interface KPIFinancas {
  id: string;
  label: string;
  value: number;
  unit: string;
}

export interface DadosRepasse {
  labels: string[];
  previne: number[];
  qualidade: number[];
}

export interface ComparativoMeta {
  indicador: string;
  meta: number;
  atual: number;
  repasse: number;
}

export interface DadosFinancas {
  kpis: KPIFinancas[];
  repasses: DadosRepasse;
  comparativo: ComparativoMeta[];
}