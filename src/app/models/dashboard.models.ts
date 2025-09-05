export interface Indicador {
  id: string;
  label: string;
  value: number;
  meta: number | null;
  unit: string;
}

export interface StatusIndicador {
  cls: 'ok' | 'warn' | 'bad' | 'neutral';
  label: string;
}

export interface EquipeResumo {
  equipe: string;
  indicador: Indicador;
  status: StatusIndicador;
}

export interface DadosDashboard {
  previne: Indicador[];
  qualidade: Indicador[];
}

export interface FiltrosPeriodo {
  value: string;
  label: string;
}

export interface FiltrosMunicipio {
  value: string;
  label: string;
}

export interface FiltrosBloco {
  value: 'previne' | 'qualidade';
  label: string;
  count: number;
}