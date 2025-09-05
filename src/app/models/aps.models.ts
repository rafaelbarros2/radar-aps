export interface EquipeAPS {
  ubs: string;
  equipe: string;
  indicador: string;
  meta: number;
  atual: number;
  microarea: string;
}

export interface StatusEquipe {
  label: string;
  cls: 'ok' | 'warn' | 'bad';
  severity: 'success' | 'warning' | 'danger';
}

export interface FiltroOpcao {
  label: string;
  value: string;
}