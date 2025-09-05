import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MaternoService } from '../../services/materno.service';
import { KPIMaterno, RankingUBS, DadosGrafico } from '../../models/materno.models';

@Component({
  selector: 'app-materno',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule],
  template: `
    <div class="p-4 max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 lg:p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <i class="pi pi-heart text-pink-600 text-lg"></i>
            </div>
            <h1 class="text-xl sm:text-2xl font-black text-gray-900">Materno‑Infantil</h1>
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
          <div class="text-3xl font-black text-gray-900">{{ maternoService.formatarPercentual(kpi.value) }}</div>
        </div>
      </section>

      <!-- Charts Section -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 lg:p-6">
          <div class="flex items-center gap-2 mb-4">
            <i class="pi pi-chart-line text-blue-600"></i>
            <h2 class="text-lg font-bold text-gray-900">Tendência Pré‑natal</h2>
          </div>
          <div class="h-64 flex items-center gap-2 relative">
            <div class="flex flex-col justify-between text-xs text-gray-500 h-48">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
            <div class="flex-1 flex flex-col">
              <div class="flex items-end justify-center gap-1 h-48 w-full">
                <div 
                  *ngFor="let value of prenatalData.values; let i = index" 
                  class="bg-blue-500 rounded-t-sm flex-1 max-w-12 transition-all duration-300 hover:bg-blue-600"
                  [style.height.%]="value"
                  [title]="prenatalData.labels[i] + ': ' + value + '%'"
                ></div>
              </div>
              <div class="flex justify-between w-full text-xs text-gray-500 mt-2">
                <span *ngFor="let label of prenatalData.labels" class="flex-1 text-center">{{ label }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 lg:p-6">
          <div class="flex items-center gap-2 mb-4">
            <i class="pi pi-chart-bar text-green-600"></i>
            <h2 class="text-lg font-bold text-gray-900">Vacinação < 1 ano</h2>
          </div>
          <div class="h-64 flex items-center gap-2 relative">
            <div class="flex flex-col justify-between text-xs text-gray-500 h-48">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>
            <div class="flex-1 flex flex-col">
              <div class="flex items-end justify-center gap-1 h-48 w-full">
                <div 
                  *ngFor="let value of vacinacaoData.values; let i = index" 
                  class="bg-green-500 rounded-t-sm flex-1 max-w-12 transition-all duration-300 hover:bg-green-600"
                  [style.height.%]="value"
                  [title]="vacinacaoData.labels[i] + ': ' + value + '%'"
                ></div>
              </div>
              <div class="flex justify-between w-full text-xs text-gray-500 mt-2">
                <span *ngFor="let label of vacinacaoData.labels" class="flex-1 text-center">{{ label }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Ranking Table Section -->
      <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 lg:p-6">
        <div class="flex items-center gap-2 mb-4">
          <i class="pi pi-table text-gray-600"></i>
          <h2 class="text-lg font-bold text-gray-900">Ranking UBS</h2>
        </div>
        
        <div class="overflow-x-auto">
          <p-table 
            [value]="ranking" 
            [scrollable]="true" 
            scrollHeight="300px"
            [style]="{'min-width': '600px'}"
          >
            <ng-template pTemplate="header">
              <tr>
                <th class="text-left p-3 text-sm font-semibold">UBS</th>
                <th class="text-left p-3 text-sm font-semibold">Indicador</th>
                <th class="text-left p-3 text-sm font-semibold">Meta</th>
                <th class="text-left p-3 text-sm font-semibold">Atual</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-item>
              <tr class="border-b border-gray-100 hover:bg-gray-50">
                <td class="p-3 text-sm font-medium">{{ item.ubs }}</td>
                <td class="p-3 text-sm">{{ item.indicador }}</td>
                <td class="p-3 text-sm">{{ maternoService.formatarPercentual(item.meta) }}</td>
                <td class="p-3 text-sm font-medium">{{ maternoService.formatarPercentual(item.atual) }}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>
  `,
  styleUrl: './materno.component.css'
})
export class MaternoComponent implements OnInit {
  kpis: KPIMaterno[] = [];
  ranking: RankingUBS[] = [];
  prenatalData: DadosGrafico = { labels: [], values: [] };
  vacinacaoData: DadosGrafico = { labels: [], values: [] };

  constructor(public maternoService: MaternoService) {}

  ngOnInit(): void {
    this.kpis = this.maternoService.getKPIs();
    this.ranking = this.maternoService.getRanking();
    this.prenatalData = this.maternoService.getPrenatalTendencia();
    this.vacinacaoData = this.maternoService.getVacinacaoTendencia();
  }

  exportar(): void {
    this.maternoService.exportarCSV();
  }

  atualizar(): void {
    // Reload data
    this.ngOnInit();
  }
}