import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from 'primeng/card';
import { PrimeTemplate } from 'primeng/api';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

interface QualidadeKpi {
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
}

interface QualidadeIndicator {
  name: string;
  currentValue: number;
  targetValue: number;
  unit: string;
}

@Component({
  selector: 'app-qualidade',
  standalone: true,
  imports: [CommonModule, Card, PrimeTemplate],
  templateUrl: 'qualidade.component.html',
  styleUrl: 'qualidade.component.css'
})
export class QualidadeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  chart!: Chart;

  constructor(private ngZone: NgZone) {}

  kpis: QualidadeKpi[] = [
    { name: 'Gestantes com 1ª consulta odontológica', currentValue: 54, targetValue: 60, unit: '%' },
    { name: 'Puerpério até 10 dias', currentValue: 63, targetValue: 70, unit: '%' },
    { name: 'Crianças 12 meses c/ vacina em dia', currentValue: 91, targetValue: 95, unit: '%' }
  ];

  indicators: QualidadeIndicator[] = [
    { name: 'Gestantes com 1ª consulta odontológica', currentValue: 54, targetValue: 60, unit: '%' },
    { name: 'Consulta puerperal até 10 dias', currentValue: 63, targetValue: 70, unit: '%' },
    { name: 'Crianças 12 meses com vacinação em dia', currentValue: 91, targetValue: 95, unit: '%' },
    { name: 'Crianças 4 meses com vacinação em dia', currentValue: 90, targetValue: 95, unit: '%' },
    { name: 'Atendimento odontológico até 5 anos', currentValue: 58, targetValue: 60, unit: '%' },
    { name: 'Cobertura de estratificação de risco cardiovascular', currentValue: 66, targetValue: 70, unit: '%' },
    { name: 'Idosos c/ vacinação influenza', currentValue: 87, targetValue: 90, unit: '%' },
    { name: 'Cobertura de planejamento familiar', currentValue: 55, targetValue: 60, unit: '%' },
    { name: 'Consulta de acompanhamento de puericultura', currentValue: 74, targetValue: 80, unit: '%' },
    { name: 'Acompanhamento de pessoas com DM2', currentValue: 65, targetValue: 70, unit: '%' },
    { name: 'Acompanhamento de pessoas com HAS', currentValue: 68, targetValue: 70, unit: '%' },
    { name: 'Cobertura de visitas domiciliares (ACS)', currentValue: 72, targetValue: 80, unit: '%' },
    { name: 'Cobertura de atendimentos multiprofissionais', currentValue: 57, targetValue: 60, unit: '%' },
    { name: 'Saúde Bucal: escovação supervisionada', currentValue: 64, targetValue: 70, unit: '%' },
    { name: 'Consulta de saúde mental na APS', currentValue: 46, targetValue: 50, unit: '%' }
  ];

  chartData = {
    labels: ['2024Q1', '2024Q2', '2024Q3', '2024Q4', '2025Q1'],
    datasets: [
      { label: 'Gestantes 1ª consulta odontológica', data: [48, 50, 52, 54, 54], borderColor: '#7e22ce' },
      { label: 'Puerpério até 10 dias', data: [58, 60, 62, 63, 63], borderColor: '#9333ea' },
      { label: 'Vacinação 12m em dia', data: [87, 88, 90, 91, 91], borderColor: '#a855f7' }
    ]
  } as const;

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  ngOnDestroy(): void {
    if (this.chart) this.chart.destroy();
  }

  private initializeChart() {
    const ctx = this.chartCanvas?.nativeElement?.getContext('2d');
    if (!ctx) return;

    this.ngZone.runOutsideAngular(() => {
      const config: ChartConfiguration = {
        type: 'line',
        data: this.chartData as any,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 0 },
          resizeDelay: 150,
          scales: { y: { beginAtZero: true, max: 100 } }
        }
      };
      this.chart = new Chart(ctx, config);
    });
  }

  getStatus(v: { currentValue: number; targetValue: number }): 'success' | 'warning' | 'danger' {
    if (v.currentValue >= v.targetValue) return 'success';
    if (v.currentValue >= v.targetValue * 0.9) return 'warning';
    return 'danger';
  }

  // Export / Publish hooks
  getExportData() {
    const headers = ['Tipo', 'Nome', 'Meta', 'Atual', 'Unidade', 'Status'];
    const kpiRows = this.kpis.map(k => ['KPI', k.name, k.targetValue, k.currentValue, k.unit, this.getStatus(k)] as (string|number)[]);
    const indRows = this.indicators.map(i => ['Indicador', i.name, i.targetValue, i.currentValue, i.unit, this.getStatus(i)] as (string|number)[]);
    return {
      headers,
      rows: [...kpiRows, ...indRows],
      filename: 'qualidade-aps'
    };
  }

  getViewState() {
    // Não há filtros ainda; retornando estrutura básica/extensível
    return {
      page: 'qualidade',
      note: 'sem filtros definidos'
    };
  }
}
