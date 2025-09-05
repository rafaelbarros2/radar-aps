import { Injectable } from '@angular/core';
import { KPIDeterminante, DadosCorrelacao, IndicadorDetalhado, DadosDeterminantes } from '../models/determinantes.models';

@Injectable({
  providedIn: 'root'
})
export class DeterminantesService {
  private dados: DadosDeterminantes = {
    kpis: [
      { id: 'pop', label: 'População', value: 65000, unit: 'hab' },
      { id: 'idhm', label: 'IDHM', value: 0.71, unit: '' },
      { id: 'saneamento', label: 'Cobertura de Saneamento', value: 62, unit: '%' }
    ],
    correlacao: {
      labels: ['Pré-natal', 'Vacinação', 'Hipertensão', 'Diabetes'],
      values: [0.7, 0.8, 0.6, 0.65]
    },
    tabela: [
      { indicador: 'População', valor: '65.000 hab.', fonte: 'IBGE 2022' },
      { indicador: 'IDHM', valor: '0,71', fonte: 'PNUD' },
      { indicador: 'Cobertura de saneamento', valor: '62%', fonte: 'SNIS' },
      { indicador: 'Taxa de alfabetização', valor: '91%', fonte: 'IBGE' },
      { indicador: 'PIB per capita', valor: 'R$ 18.200', fonte: 'IBGE' }
    ]
  };

  constructor() {}

  getDados(): DadosDeterminantes {
    return this.dados;
  }

  getKPIs(): KPIDeterminante[] {
    return this.dados.kpis;
  }

  getCorrelacao(): DadosCorrelacao {
    return this.dados.correlacao;
  }

  getTabela(): IndicadorDetalhado[] {
    return this.dados.tabela;
  }

  formatarKPI(kpi: KPIDeterminante): string {
    if (kpi.id === 'pop') {
      return (kpi.value as number).toLocaleString('pt-BR');
    }
    if (kpi.id === 'idhm') {
      return kpi.value.toString();
    }
    return `${kpi.value}${kpi.unit}`;
  }

  exportarCSV(): void {
    const headers = ['Indicador', 'Valor', 'Fonte'];
    const rows = this.dados.tabela.map(t => [
      t.indicador,
      t.valor,
      t.fonte
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'determinantes_sociais.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}