import { Injectable } from '@angular/core';
import { KPIMaterno, DadosGrafico, RankingUBS, DadosMaterno } from '../models/materno.models';

@Injectable({
  providedIn: 'root'
})
export class MaternoService {
  private dados: DadosMaterno = {
    kpis: [
      { id: 'prenatal', label: 'Pré‑natal (≥6 consultas)', value: 85, unit: '%' },
      { id: 'exames', label: 'Gestantes com exames (sífilis+HIV)', value: 88, unit: '%' },
      { id: 'vacinas', label: 'Cobertura vacinal < 1 ano', value: 97, unit: '%' }
    ],
    prenatalTendencia: {
      labels: ['2024Q1', '2024Q2', '2024Q3', '2024Q4', '2025Q1', '2025Q2'],
      values: [72, 75, 80, 78, 82, 85]
    },
    vacinacaoTendencia: {
      labels: ['2024Q1', '2024Q2', '2024Q3', '2024Q4', '2025Q1', '2025Q2'],
      values: [88, 90, 92, 93, 95, 97]
    },
    ranking: [
      { ubs: 'UBS Centro', indicador: 'Pré‑natal', meta: 85, atual: 78 },
      { ubs: 'UBS Rural', indicador: 'Vacinação <1 ano', meta: 95, atual: 92 },
      { ubs: 'UBS Nova', indicador: 'Pré‑natal', meta: 85, atual: 81 }
    ]
  };

  constructor() {}

  getDados(): DadosMaterno {
    return this.dados;
  }

  getKPIs(): KPIMaterno[] {
    return this.dados.kpis;
  }

  getPrenatalTendencia(): DadosGrafico {
    return this.dados.prenatalTendencia;
  }

  getVacinacaoTendencia(): DadosGrafico {
    return this.dados.vacinacaoTendencia;
  }

  getRanking(): RankingUBS[] {
    return this.dados.ranking;
  }

  formatarPercentual(valor: number): string {
    return `${valor}%`;
  }

  exportarCSV(): void {
    const headers = ['UBS', 'Indicador', 'Meta', 'Atual'];
    const rows = this.dados.ranking.map(r => [
      r.ubs,
      r.indicador,
      this.formatarPercentual(r.meta),
      this.formatarPercentual(r.atual)
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'materno_infantil.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}