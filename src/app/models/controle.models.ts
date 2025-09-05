export interface KPIControle {
  id: string;
  label: string;
  value: number;
  unit: string;
}

export interface MetaPMS {
  meta: string;
  prazo: string;
  status: string;
}

export interface EventoSocial {
  evento: string;
  data: string;
  participantes: number;
}

export interface DadosControle {
  kpis: KPIControle[];
  metas: MetaPMS[];
  eventos: EventoSocial[];
}