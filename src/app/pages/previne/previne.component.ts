import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from 'primeng/card';
import { PrimeTemplate } from 'primeng/api';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { PrevineKPI, PrevineIndicator, PrevineChartData } from '../../models/previne-brasil.interface';

Chart.register(...registerables);

@Component({
  selector: 'app-previne',
  standalone: true,
  imports: [CommonModule, Card, PrimeTemplate],
  templateUrl: './previne.component.html',
  styleUrl: './previne.component.css'
})
export class PrevineComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  chart!: Chart;
  
  kpis: PrevineKPI[] = [
    {
      name: 'Pré-natal (≥6 consultas)',
      currentValue: 78,
      targetValue: 85,
      unit: '%'
    },
    {
      name: 'Hipertensos c/ PA aferida',
      currentValue: 61,
      targetValue: 70,
      unit: '%'
    },
    {
      name: 'Vacinação <1 ano',
      currentValue: 97,
      targetValue: 95,
      unit: '%'
    }
  ];

  indicators: PrevineIndicator[] = [
    {
      id: '1',
      name: 'Pré-natal (≥6 consultas)',
      currentValue: 78,
      targetValue: 85,
      unit: '%'
    },
    {
      id: '2',
      name: 'Pré-natal até 12ª semana',
      currentValue: 59,
      targetValue: 60,
      unit: '%'
    },
    {
      id: '3',
      name: 'Exame citopatológico',
      currentValue: 64,
      targetValue: 60,
      unit: '%'
    },
    {
      id: '4',
      name: 'Hipertensos com PA aferida',
      currentValue: 61,
      targetValue: 70,
      unit: '%'
    },
    {
      id: '5',
      name: 'Diabéticos com hemoglobina glicada',
      currentValue: 67,
      targetValue: 70,
      unit: '%'
    },
    {
      id: '6',
      name: 'Cobertura vacinal (<1 ano)',
      currentValue: 97,
      targetValue: 95,
      unit: '%'
    },
    {
      id: '7',
      name: 'Atendimento odontológico programático',
      currentValue: 52,
      targetValue: 50,
      unit: '%'
    }
  ];

  chartData: PrevineChartData = {
    labels: ['2024Q1', '2024Q2', '2024Q3', '2024Q4', '2025Q1'],
    datasets: [
      {
        label: 'Pré-natal (≥6 consultas)',
        data: [70, 74, 76, 78, 78],
        borderColor: '#2563eb'
      },
      {
        label: 'Hipertensos PA aferida',
        data: [55, 58, 60, 61, 61],
        borderColor: '#16a34a'
      },
      {
        label: 'Vacinação <1 ano',
        data: [92, 94, 96, 97, 97],
        borderColor: '#f59e0b'
      }
    ]
  };

  ngOnInit() {
    
  }

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.initializeChart();
  }

  private initializeChart() {
    const ctx = this.chartCanvas?.nativeElement?.getContext('2d');
    if (!ctx) return;

    // Create the chart outside Angular to avoid excessive change detection
    this.ngZone.runOutsideAngular(() => {
      const config: ChartConfiguration = {
        type: 'line',
        data: this.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          // Reduce animation/resize overhead to prevent UI stutter
          animation: { duration: 0 },
          resizeDelay: 150,
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      };

      this.chart = new Chart(ctx, config);
    });
  }

  ngOnDestroy(): void {
    // Clean up Chart.js instance and listeners when navigating away
    if (this.chart) {
      this.chart.destroy();
    }
  }

  getIndicatorStatus(indicator: PrevineIndicator): 'success' | 'warning' | 'danger' {
    if (indicator.currentValue >= indicator.targetValue) {
      return 'success';
    } else if (indicator.currentValue >= indicator.targetValue * 0.9) {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  getKpiStatus(kpi: PrevineKPI): 'success' | 'warning' | 'danger' {
    if (kpi.currentValue >= kpi.targetValue) {
      return 'success';
    } else if (kpi.currentValue >= kpi.targetValue * 0.9) {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  // Export / Publish hooks
  getExportData() {
    const headers = ['Tipo', 'Nome', 'Meta', 'Atual', 'Unidade', 'Status'];
    const kpiRows = this.kpis.map(k => ['KPI', k.name, k.targetValue, k.currentValue, k.unit, this.getKpiStatus(k)] as (string|number)[]);
    const indRows = this.indicators.map(i => ['Indicador', i.name, i.targetValue, i.currentValue, i.unit, this.getIndicatorStatus(i)] as (string|number)[]);
    return {
      headers,
      rows: [...kpiRows, ...indRows],
      filename: 'previne-brasil'
    };
  }

  getViewState() {
    return {
      page: 'previne',
      note: 'sem filtros definidos'
    };
  }
}
