import { Injectable } from '@angular/core';
import { KPIControle, MetaPMS, EventoSocial, DadosControle } from '../models/controle.models';

@Injectable({
  providedIn: 'root'
})
export class ControleService {
  private dados: DadosControle = {
    kpis: [
      { id: 'pms', label: 'Metas do PMS', value: 72, unit: '%' },
      { id: 'conf', label: 'Conferências realizadas', value: 3, unit: '' },
      { id: 'part', label: 'Participantes', value: 180, unit: '' }
    ],
    metas: [
      { meta: 'Ampliar cobertura de pré-natal', prazo: '2025', status: 'Em andamento' },
      { meta: 'Atingir 95% de vacinação <1 ano', prazo: '2025', status: 'Alcançado' },
      { meta: 'Reduzir abandono de tratamento TB', prazo: '2026', status: 'Atrasado' }
    ],
    eventos: [
      { evento: 'Conselho Municipal de Saúde', data: '15/03/2025', participantes: 25 },
      { evento: 'Conferência de Saúde', data: '20/06/2025', participantes: 120 },
      { evento: 'Audiência Pública', data: '10/08/2025', participantes: 35 }
    ]
  };

  constructor() {}

  getDados(): DadosControle {
    return this.dados;
  }

  getKPIs(): KPIControle[] {
    return this.dados.kpis;
  }

  getMetas(): MetaPMS[] {
    return this.dados.metas;
  }

  getEventos(): EventoSocial[] {
    return this.dados.eventos;
  }

  formatarKPI(kpi: KPIControle): string {
    return `${kpi.value}${kpi.unit}`;
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' {
    switch (status) {
      case 'Alcançado': return 'success';
      case 'Em andamento': return 'warning';
      case 'Atrasado': return 'danger';
      default: return 'warning';
    }
  }

  exportarCSV(): void {
    // Combina metas e eventos em um CSV
    const headers = ['Tipo', 'Descrição', 'Data/Prazo', 'Status/Participantes'];
    const metasRows = this.dados.metas.map(m => [
      'Meta',
      m.meta,
      m.prazo,
      m.status
    ]);
    const eventosRows = this.dados.eventos.map(e => [
      'Evento',
      e.evento,
      e.data,
      e.participantes.toString()
    ]);
    
    const csvContent = [headers, ...metasRows, ...eventosRows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'controle_social.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}