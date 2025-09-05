import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { 
  DadosDashboard, 
  Indicador, 
  StatusIndicador, 
  EquipeResumo,
  FiltrosPeriodo,
  FiltrosMunicipio,
  FiltrosBloco
} from '../models/dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private periodoSelecionado = new BehaviorSubject<string>('2025 • 3º quadrimestre');
  private municipioSelecionado = new BehaviorSubject<string>('Benevides (PA)');
  private blocoSelecionado = new BehaviorSubject<'previne' | 'qualidade'>('previne');

  periodoSelecionado$ = this.periodoSelecionado.asObservable();
  municipioSelecionado$ = this.municipioSelecionado.asObservable();
  blocoSelecionado$ = this.blocoSelecionado.asObservable();

  private readonly dados: DadosDashboard = {
    previne: [
      { id: 'prenatal_seis', label: 'Gestantes com ≥6 consultas e 1ª ≤12ª sem.', value: 92, meta: 85, unit: '%' },
      { id: 'gestantes_testes', label: 'Gestantes testadas (sífilis + HIV)', value: 88, meta: 85, unit: '%' },
      { id: 'odonto_gestantes', label: 'Atendimento odontológico (gestantes)', value: 76, meta: 80, unit: '%' },
      { id: 'citopatologico', label: 'Citopatológico 25–64 anos', value: 72, meta: 75, unit: '%' },
      { id: 'vacinacao_1ano', label: 'Vacinação <1 ano (penta + VIP)', value: 95, meta: 95, unit: '%' },
      { id: 'hipertensos_pa', label: 'Hipertensos com PA aferida (semestre)', value: 68, meta: 70, unit: '%' },
      { id: 'diabeticos_hba1c', label: 'Diabéticos com HbA1c solicitada (semestre)', value: 61, meta: 70, unit: '%' },
    ],
    qualidade: [
      { id: 'emulti_interprof', label: 'Ações interprofissionais (eMulti)', value: 63, meta: null, unit: '%' },
      { id: 'emulti_media', label: 'Média de atendimentos por pessoa (eMulti)', value: 2.1, meta: null, unit: '' },
      { id: 'mais_acesso_aps', label: 'Mais acesso à APS', value: 78, meta: null, unit: '%' },
      { id: 'diabetes', label: 'Cuidado da pessoa com diabetes', value: 66, meta: null, unit: '%' },
      { id: 'hipertensao', label: 'Cuidado da pessoa com hipertensão', value: 69, meta: null, unit: '%' },
      { id: 'gestante_puerperio', label: 'Cuidado da gestante e do puerpério', value: 74, meta: null, unit: '%' },
      { id: 'mulher_cancer', label: 'Cuidado da mulher na prevenção do câncer', value: 58, meta: null, unit: '%' },
      { id: 'idosa', label: 'Cuidado da pessoa idosa', value: 71, meta: null, unit: '%' },
      { id: 'desenv_infantil', label: 'Cuidado no desenvolvimento infantil', value: 64, meta: null, unit: '%' },
      { id: 'escovacao_escolar', label: 'Escovação dentária supervisionada (escolar)', value: 55, meta: null, unit: '%' },
      { id: 'odonto_primeira', label: 'Primeira consulta odontológica programada', value: 60, meta: null, unit: '%' },
      { id: 'odonto_concluido', label: 'Tratamento odontológico concluído', value: 52, meta: null, unit: '%' },
      { id: 'odonto_traumatico', label: 'Tratamento restaurador atraumático', value: 46, meta: null, unit: '%' },
      { id: 'odonto_preventivo', label: 'Procedimentos odontológicos preventivos', value: 57, meta: null, unit: '%' },
      { id: 'exodontia_taxa', label: 'Taxa de exodontias realizadas', value: 9, meta: null, unit: '%' },
    ]
  };

  readonly filtrosPeriodo: FiltrosPeriodo[] = [
    { value: '2025 • 3º quadrimestre', label: '2025 • 3º quadrimestre' },
    { value: '2025 • 2º quadrimestre', label: '2025 • 2º quadrimestre' },
    { value: '2025 • 1º quadrimestre', label: '2025 • 1º quadrimestre' },
    { value: '2024 • 4º quadrimestre', label: '2024 • 4º quadrimestre' }
  ];

  readonly filtrosMunicipio: FiltrosMunicipio[] = [
    { value: 'Benevides (PA)', label: 'Benevides (PA)' },
    { value: 'Ananindeua (PA)', label: 'Ananindeua (PA)' },
    { value: 'Belém (PA)', label: 'Belém (PA)' }
  ];

  readonly filtrosBlocos: FiltrosBloco[] = [
    { value: 'previne', label: 'Previne Brasil', count: 7 },
    { value: 'qualidade', label: 'Qualidade APS', count: 15 }
  ];

  getIndicadores(bloco?: 'previne' | 'qualidade'): Indicador[] {
    const blocoAtual = bloco || this.blocoSelecionado.value;
    return this.dados[blocoAtual];
  }

  getStatusIndicador(value: number, meta: number | null): StatusIndicador {
    if (meta === null) return { cls: 'neutral', label: '—' };
    if (value >= meta) return { cls: 'ok', label: 'OK' };
    if (value >= meta * 0.9) return { cls: 'warn', label: 'Atenção' };
    return { cls: 'bad', label: 'Crítico' };
  }

  formatarValor(value: number, unit: string): string {
    return unit === '%' ? `${value}%` : `${value}`;
  }

  formatarMeta(meta: number | null, unit: string): string {
    if (meta === null) return 'definir';
    return unit === '%' ? `≥ ${meta}%` : `≥ ${meta}`;
  }

  getEquipesPendentes(filtro: string = ''): EquipeResumo[] {
    const indicadores = this.getIndicadores();
    const equipes = ['UBS Centro — eSF‑03', 'UBS Maria — eSB‑02', 'UBS Rural — eAP‑01', 'UBS Nova — eSF‑01', 'UBS Jardim — eAP‑02'];
    
    return indicadores
      .map((ind, idx) => ({
        equipe: equipes[idx % equipes.length],
        indicador: ind,
        status: this.getStatusIndicador(ind.value, ind.meta)
      }))
      .filter(item => {
        if (!filtro) return true;
        const filtroLower = filtro.toLowerCase();
        return item.equipe.toLowerCase().includes(filtroLower) || 
               item.indicador.label.toLowerCase().includes(filtroLower);
      })
      .sort((a, b) => {
        const scoreA = a.indicador.meta === null ? a.indicador.value : (a.indicador.value - a.indicador.meta);
        const scoreB = b.indicador.meta === null ? b.indicador.value : (b.indicador.value - b.indicador.meta);
        return scoreA - scoreB;
      })
      .slice(0, 5);
  }

  setPeriodo(periodo: string) {
    this.periodoSelecionado.next(periodo);
  }

  setMunicipio(municipio: string) {
    this.municipioSelecionado.next(municipio);
  }

  setBloco(bloco: 'previne' | 'qualidade') {
    this.blocoSelecionado.next(bloco);
  }

  exportarCSV(): string {
    const indicadores = this.getIndicadores();
    const rows = [['Indicador', 'Meta', 'Atual', 'Status']].concat(
      indicadores.map(ind => {
        const status = this.getStatusIndicador(ind.value, ind.meta);
        const metaStr = this.formatarMeta(ind.meta, ind.unit);
        return [ind.label, metaStr, this.formatarValor(ind.value, ind.unit), status.label];
      })
    );
    return rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  }
}