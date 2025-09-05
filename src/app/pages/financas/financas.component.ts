import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FinancasService } from '../../services/financas.service';
import { KPIFinancas, DadosRepasse, ComparativoMeta } from '../../models/financas.models';

@Component({
  selector: 'app-financas',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule],
  template: `
    <div class="p-4 max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 lg:p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <i class="pi pi-dollar text-green-600 text-lg"></i>
            </div>
            <h1 class="text-xl sm:text-2xl font-black text-gray-900">Finanças</h1>
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
          <div class="text-3xl font-black text-gray-900">{{ financasService.formatarMoeda(kpi.value) }}</div>
        </div>
      </section>

      <!-- Chart and Table Section -->
      <div class="grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-6 mb-6">
        <!-- Chart Section -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 lg:p-6">
          <div class="flex items-center gap-2 mb-4">
            <i class="pi pi-chart-line text-green-600"></i>
            <h2 class="text-lg font-bold text-gray-900">Histórico de Repasses</h2>
          </div>
          <div class="h-64 flex items-center gap-2 relative">
            <div class="flex flex-col justify-between text-xs text-gray-500 h-48">
              <span>30k</span>
              <span>20k</span>
              <span>10k</span>
              <span>0k</span>
            </div>
            <div class="flex-1 flex flex-col">
              <div class="relative h-48 w-full">
                <!-- Grid lines -->
                <div class="absolute inset-0 flex flex-col justify-between">
                  <div class="h-px bg-gray-200"></div>
                  <div class="h-px bg-gray-200"></div>
                  <div class="h-px bg-gray-200"></div>
                  <div class="h-px bg-gray-200"></div>
                </div>
                
                <!-- Previne Brasil Line -->
                <svg class="absolute inset-0 w-full h-48" viewBox="0 0 300 192">
                  <polyline
                    [attr.points]="getPrevinePoints()"
                    fill="none"
                    stroke="#2563eb"
                    stroke-width="2"
                    class="transition-all duration-300"
                  />
                  <g *ngFor="let point of getPrevinePointsArray(); let i = index">
                    <circle
                      [attr.cx]="point.x"
                      [attr.cy]="point.y"
                      r="4"
                      fill="#2563eb"
                      class="hover:r-6 transition-all cursor-pointer"
                      [title]="repassesData.labels[i] + ': ' + financasService.formatarMoeda(repassesData.previne[i])"
                    />
                  </g>
                </svg>
                
                <!-- Qualidade APS Line -->
                <svg class="absolute inset-0 w-full h-48" viewBox="0 0 300 192">
                  <polyline
                    [attr.points]="getQualidadePoints()"
                    fill="none"
                    stroke="#22c55e"
                    stroke-width="2"
                    class="transition-all duration-300"
                  />
                  <g *ngFor="let point of getQualidadePointsArray(); let i = index">
                    <circle
                      [attr.cx]="point.x"
                      [attr.cy]="point.y"
                      r="4"
                      fill="#22c55e"
                      class="hover:r-6 transition-all cursor-pointer"
                      [title]="repassesData.labels[i] + ': ' + financasService.formatarMoeda(repassesData.qualidade[i])"
                    />
                  </g>
                </svg>
              </div>
              
              <!-- Legend -->
              <div class="flex justify-center gap-6 mt-2 mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span class="text-xs text-gray-600">Previne Brasil</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span class="text-xs text-gray-600">Qualidade APS</span>
                </div>
              </div>
              
              <div class="flex justify-between w-full text-xs text-gray-500">
                <span *ngFor="let label of repassesData.labels" class="flex-1 text-center">{{ label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Comparative Table Section -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 lg:p-6">
        <div class="flex items-center gap-2 mb-4">
          <i class="pi pi-table text-gray-600"></i>
          <h2 class="text-lg font-bold text-gray-900">Comparativo: Meta x Recurso</h2>
        </div>
        
        <div class="overflow-x-auto">
          <p-table 
            [value]="comparativo" 
            [scrollable]="true" 
            scrollHeight="300px"
            [style]="{'min-width': '700px'}"
          >
            <ng-template pTemplate="header">
              <tr>
                <th class="text-left p-3 text-sm font-semibold">Indicador</th>
                <th class="text-left p-3 text-sm font-semibold">Meta</th>
                <th class="text-left p-3 text-sm font-semibold">Atual</th>
                <th class="text-left p-3 text-sm font-semibold">Repasse (R$)</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-item>
              <tr class="border-b border-gray-100 hover:bg-gray-50">
                <td class="p-3 text-sm font-medium">{{ item.indicador }}</td>
                <td class="p-3 text-sm">{{ financasService.formatarPercentual(item.meta) }}</td>
                <td class="p-3 text-sm font-medium">{{ financasService.formatarPercentual(item.atual) }}</td>
                <td class="p-3 text-sm font-bold text-green-600">{{ financasService.formatarMoeda(item.repasse) }}</td>
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

    /* SVG hover effects */
    svg circle:hover {
      r: 6;
      transition: all 0.3s ease;
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
export class FinancasComponent implements OnInit {
  kpis: KPIFinancas[] = [];
  repassesData: DadosRepasse = { labels: [], previne: [], qualidade: [] };
  comparativo: ComparativoMeta[] = [];

  constructor(public financasService: FinancasService) {}

  ngOnInit(): void {
    this.kpis = this.financasService.getKPIs();
    this.repassesData = this.financasService.getRepasses();
    this.comparativo = this.financasService.getComparativo();
  }

  getPrevinePoints(): string {
    return this.repassesData.previne
      .map((value, index) => {
        const x = (index * 300) / (this.repassesData.previne.length - 1);
        const y = 192 - (value / 30000) * 192; // Scale to 30k max
        return `${x},${y}`;
      })
      .join(' ');
  }

  getQualidadePoints(): string {
    return this.repassesData.qualidade
      .map((value, index) => {
        const x = (index * 300) / (this.repassesData.qualidade.length - 1);
        const y = 192 - (value / 30000) * 192; // Scale to 30k max
        return `${x},${y}`;
      })
      .join(' ');
  }

  getPrevinePointsArray(): {x: number, y: number}[] {
    return this.repassesData.previne.map((value, index) => ({
      x: (index * 300) / (this.repassesData.previne.length - 1),
      y: 192 - (value / 30000) * 192
    }));
  }

  getQualidadePointsArray(): {x: number, y: number}[] {
    return this.repassesData.qualidade.map((value, index) => ({
      x: (index * 300) / (this.repassesData.qualidade.length - 1),
      y: 192 - (value / 30000) * 192
    }));
  }

  exportar(): void {
    this.financasService.exportarCSV();
  }

  atualizar(): void {
    this.ngOnInit();
  }
}