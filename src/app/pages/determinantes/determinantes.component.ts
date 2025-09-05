import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DeterminantesService } from '../../services/determinantes.service';
import { KPIDeterminante, DadosCorrelacao, IndicadorDetalhado } from '../../models/determinantes.models';

@Component({
  selector: 'app-determinantes',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule],
  template: `
    <div class="p-4 max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 lg:p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <i class="pi pi-compass text-indigo-600 text-lg"></i>
            </div>
            <h1 class="text-xl sm:text-2xl font-black text-gray-900">Determinantes</h1>
          </div>
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button 
              (click)="exportar()"
              class="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
            >
              <i class="pi pi-file-excel"></i>
              Exportar
            </button>
            <button 
              (click)="atualizar()"
              class="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors"
            >
              <i class="pi pi-refresh"></i>
              Atualizar
            </button>
          </div>
        </div>
      </div>

      <!-- KPIs Section -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div 
          *ngFor="let kpi of kpis" 
          class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
        >
          <div class="text-sm text-gray-600 font-bold mb-2">{{ kpi.label }}</div>
          <div class="text-3xl font-black text-gray-900">{{ determinantesService.formatarKPI(kpi) }}</div>
        </div>
      </section>

      <!-- Chart and Table Section -->
      <div class="grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-6 mb-6">
        <!-- Chart Section -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 lg:p-6">
          <div class="flex items-center gap-2 mb-4">
            <i class="pi pi-chart-line text-indigo-600"></i>
            <h2 class="text-lg font-bold text-gray-900">Correlação com desempenho APS</h2>
          </div>
          <div class="h-64 flex items-center gap-2 relative">
            <div class="flex flex-col justify-between text-xs text-gray-500 h-48">
              <span>1.0</span>
              <span>0.8</span>
              <span>0.6</span>
              <span>0.4</span>
              <span>0.2</span>
              <span>0.0</span>
            </div>
            <div class="flex-1 flex flex-col">
              <div class="flex items-end justify-center gap-2 h-48 w-full">
                <div 
                  *ngFor="let value of correlacaoData.values; let i = index" 
                  class="bg-indigo-500 rounded-t-sm flex-1 max-w-20 transition-all duration-300 hover:bg-indigo-600"
                  [style.height.%]="value * 100"
                  [title]="correlacaoData.labels[i] + ': ' + (value * 100).toFixed(0) + '%'"
                ></div>
              </div>
              <div class="flex justify-between w-full text-xs text-gray-500 mt-2">
                <span *ngFor="let label of correlacaoData.labels" class="flex-1 text-center">{{ label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Table Section -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 lg:p-6">
        <div class="flex items-center gap-2 mb-4">
          <i class="pi pi-table text-gray-600"></i>
          <h2 class="text-lg font-bold text-gray-900">Indicadores Detalhados</h2>
        </div>
        
        <div class="overflow-x-auto">
          <p-table 
            [value]="tabela" 
            [scrollable]="true" 
            scrollHeight="300px"
            [style]="{'min-width': '600px'}"
          >
            <ng-template pTemplate="header">
              <tr>
                <th class="text-left p-3 text-sm font-semibold">Indicador</th>
                <th class="text-left p-3 text-sm font-semibold">Valor</th>
                <th class="text-left p-3 text-sm font-semibold">Fonte</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-item>
              <tr class="border-b border-gray-100 hover:bg-gray-50">
                <td class="p-3 text-sm font-medium">{{ item.indicador }}</td>
                <td class="p-3 text-sm font-bold text-indigo-600">{{ item.valor }}</td>
                <td class="p-3 text-sm text-gray-600">{{ item.fonte }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Custom PrimeNG table styling */
    ::ng-deep .p-table {
      background: #ffffff !important;
      color: #374151 !important;
    }

    ::ng-deep .p-table .p-table-thead > tr > th {
      background: #f8fafc !important;
      border-bottom: 1px solid #e2e8f0 !important;
      font-weight: 600 !important;
      color: #374151 !important;
      padding: 0.75rem !important;
    }

    ::ng-deep .p-table .p-table-tbody > tr {
      background: #ffffff !important;
      color: #374151 !important;
      transition: background-color 0.2s;
    }

    ::ng-deep .p-table .p-table-tbody > tr > td {
      background: #ffffff !important;
      color: #374151 !important;
      border-bottom: 1px solid #f1f5f9 !important;
      padding: 0.75rem !important;
    }

    ::ng-deep .p-table .p-table-tbody > tr:hover {
      background: #f8fafc !important;
    }

    ::ng-deep .p-table .p-table-tbody > tr:hover > td {
      background: #f8fafc !important;
    }

    /* Custom scrollbar for better UX */
    .overflow-x-auto::-webkit-scrollbar {
      height: 6px;
    }

    .overflow-x-auto::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }

    .overflow-x-auto::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }

    .overflow-x-auto::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* Mobile responsiveness */
    @media (max-width: 640px) {
      ::ng-deep .p-table .p-table-thead > tr > th {
        padding: 0.5rem !important;
        font-size: 0.75rem !important;
      }
      
      ::ng-deep .p-table .p-table-tbody > tr > td {
        padding: 0.5rem !important;
        font-size: 0.75rem !important;
      }
    }
  `]
})
export class DeterminantesComponent implements OnInit {
  kpis: KPIDeterminante[] = [];
  correlacaoData: DadosCorrelacao = { labels: [], values: [] };
  tabela: IndicadorDetalhado[] = [];

  constructor(public determinantesService: DeterminantesService) {}

  ngOnInit(): void {
    this.kpis = this.determinantesService.getKPIs();
    this.correlacaoData = this.determinantesService.getCorrelacao();
    this.tabela = this.determinantesService.getTabela();
  }

  exportar(): void {
    this.determinantesService.exportarCSV();
  }

  atualizar(): void {
    this.ngOnInit();
  }
}