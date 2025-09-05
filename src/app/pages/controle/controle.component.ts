import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ControleService } from '../../services/controle.service';
import { KPIControle, MetaPMS, EventoSocial } from '../../models/controle.models';

@Component({
  selector: 'app-controle',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, TagModule],
  template: `
    <div class="p-4 max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 lg:p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <i class="pi pi-sitemap text-purple-600 text-lg"></i>
            </div>
            <h1 class="text-xl sm:text-2xl font-black text-gray-900">Controle Social</h1>
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
          <div class="text-3xl font-black text-gray-900">{{ controleService.formatarKPI(kpi) }}</div>
        </div>
      </section>

      <!-- Tables Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Metas Table -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 lg:p-6">
          <div class="flex items-center gap-2 mb-4">
            <i class="pi pi-table text-gray-600"></i>
            <h2 class="text-lg font-bold text-gray-900">Acompanhamento de Metas</h2>
          </div>
          
          <div class="overflow-x-auto">
            <p-table 
              [value]="metas" 
              [scrollable]="true" 
              scrollHeight="300px"
              [style]="{'min-width': '500px'}"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th class="text-left p-3 text-sm font-semibold">Meta</th>
                  <th class="text-left p-3 text-sm font-semibold">Prazo</th>
                  <th class="text-left p-3 text-sm font-semibold">Status</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-meta>
                <tr class="border-b border-gray-100 hover:bg-gray-50">
                  <td class="p-3 text-sm font-medium">{{ meta.meta }}</td>
                  <td class="p-3 text-sm text-gray-600">{{ meta.prazo }}</td>
                  <td class="p-3">
                    <p-tag 
                      [value]="meta.status" 
                      [severity]="controleService.getStatusSeverity(meta.status)"
                      styleClass="text-xs font-semibold"
                    ></p-tag>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        </div>

        <!-- Eventos Table -->
        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 lg:p-6">
          <div class="flex items-center gap-2 mb-4">
            <i class="pi pi-users text-gray-600"></i>
            <h2 class="text-lg font-bold text-gray-900">Conselhos e Conferências</h2>
          </div>
          
          <div class="overflow-x-auto">
            <p-table 
              [value]="eventos" 
              [scrollable]="true" 
              scrollHeight="300px"
              [style]="{'min-width': '500px'}"
            >
              <ng-template pTemplate="header">
                <tr>
                  <th class="text-left p-3 text-sm font-semibold">Evento</th>
                  <th class="text-left p-3 text-sm font-semibold">Data</th>
                  <th class="text-left p-3 text-sm font-semibold">Participantes</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-evento>
                <tr class="border-b border-gray-100 hover:bg-gray-50">
                  <td class="p-3 text-sm font-medium">{{ evento.evento }}</td>
                  <td class="p-3 text-sm text-gray-600">{{ evento.data }}</td>
                  <td class="p-3 text-sm font-bold text-purple-600">{{ evento.participantes }}</td>
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

    /* PrimeNG Tags */
    ::ng-deep .p-tag {
      font-weight: 600 !important;
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
      
      ::ng-deep .p-tag {
        font-size: 0.625rem !important;
        padding: 0.25rem 0.5rem !important;
      }
    }
  `]
})
export class ControleComponent implements OnInit {
  kpis: KPIControle[] = [];
  metas: MetaPMS[] = [];
  eventos: EventoSocial[] = [];

  constructor(public controleService: ControleService) {}

  ngOnInit(): void {
    this.kpis = this.controleService.getKPIs();
    this.metas = this.controleService.getMetas();
    this.eventos = this.controleService.getEventos();
  }

  exportar(): void {
    this.controleService.exportarCSV();
  }

  atualizar(): void {
    this.ngOnInit();
  }
}