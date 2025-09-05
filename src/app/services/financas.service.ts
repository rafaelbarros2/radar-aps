import { Injectable } from '@angular/core';
import { KPIFinancas, DadosRepasse, ComparativoMeta, DadosFinancas } from '../models/financas.models';

@Injectable({
  providedIn: 'root'
})
export class FinancasService {
  private dados: DadosFinancas = {
    kpis: [],
    repasses: {
      labels: ['2024Q1', '2024Q2', '2024Q3', '2024Q4', '2025Q1', '2025Q2'],
      previne: [20000, 22000, 21000, 23000, 24000, 25000],
      qualidade: [10000, 12000, 11000, 13000, 13500, 14000]
    },
    comparativo: [
      { indicador: 'Pré-natal', meta: 85, atual: 78, repasse: 5000 },
      { indicador: 'Vacinação <1 ano', meta: 95, atual: 97, repasse: 7000 },
      { indicador: 'Hipertensos c/ PA aferida', meta: 70, atual: 61, repasse: 4000 }
    ]
  };

  constructor() {
    this.calcularKPIs();
  }

  private calcularKPIs(): void {
    const ultimoPrevine = this.dados.repasses.previne.at(-1) || 0;
    const ultimaQualidade = this.dados.repasses.qualidade.at(-1) || 0;
    const total = ultimoPrevine + ultimaQualidade;

    this.dados.kpis = [
      { id: 'previne', label: 'Repasse Previne Brasil', value: ultimoPrevine, unit: 'R$' },
      { id: 'qualidade', label: 'Repasse Qualidade APS', value: ultimaQualidade, unit: 'R$' },
      { id: 'total', label: 'Total Recebido', value: total, unit: 'R$' }
    ];
  }

  getDados(): DadosFinancas {
    return this.dados;
  }

  getKPIs(): KPIFinancas[] {
    return this.dados.kpis;
  }

  getRepasses(): DadosRepasse {
    return this.dados.repasses;
  }

  getComparativo(): ComparativoMeta[] {
    return this.dados.comparativo;
  }

  formatarMoeda(valor: number): string {
    return `R$ ${valor.toLocaleString('pt-BR')}`;
  }

  formatarPercentual(valor: number): string {
    return `${valor}%`;
  }

  exportarCSV(): void {
    const headers = ['Indicador', 'Meta', 'Atual', 'Repasse'];
    const rows = this.dados.comparativo.map(c => [
      c.indicador,
      this.formatarPercentual(c.meta),
      this.formatarPercentual(c.atual),
      this.formatarMoeda(c.repasse)
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'financas_comparativo.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}