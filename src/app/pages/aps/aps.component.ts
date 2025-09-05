import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs';
import { ApsService } from '../../services/aps.service';
import { EquipeAPS, FiltroOpcao } from '../../models/aps.models';

@Component({
  selector: 'app-aps',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    TableModule,
    TagModule,
    ButtonModule,
    InputTextModule
  ],
  template: `
    <div class="p-4 max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 lg:p-6 mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <i class="pi pi-users text-blue-600 text-lg"></i>
            </div>
            <h1 class="text-xl sm:text-2xl font-black text-gray-900">APS / Equipes</h1>
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

      <!-- Filters Section -->
      <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 lg:p-6 mb-6">
        <div class="flex items-center gap-2 mb-4">
          <i class="pi pi-filter text-gray-600"></i>
          <h2 class="text-lg font-bold text-gray-900">Filtros</h2>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">UBS</label>
            <p-dropdown 
              [options]="opcoesUBS" 
              [(ngModel)]="ubsSelecionada"
              optionLabel="label" 
              optionValue="value"
              (onChange)="onUbsChange()"
              placeholder="Todas"
              styleClass="w-full"
              [style]="{'width': '100%'}"
            ></p-dropdown>
          </div>
          
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">Equipe</label>
            <p-dropdown 
              [options]="opcoesEquipes" 
              [(ngModel)]="equipeSelecionada"
              optionLabel="label" 
              optionValue="value"
              (onChange)="onEquipeChange()"
              placeholder="Todas"
              styleClass="w-full"
              [style]="{'width': '100%'}"
            ></p-dropdown>
          </div>
          
          <div class="flex flex-col gap-2">
            <label class="text-sm font-bold text-gray-600">Microárea</label>
            <p-dropdown 
              [options]="opcoesMicroareas" 
              [(ngModel)]="microareaSelecionada"
              optionLabel="label" 
              optionValue="value"
              (onChange)="onMicroareaChange()"
              placeholder="Todas"
              styleClass="w-full"
              [style]="{'width': '100%'}"
            ></p-dropdown>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 lg:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div class="flex items-center gap-2">
            <i class="pi pi-table text-gray-600"></i>
            <h2 class="text-lg font-bold text-gray-900">Lista de Equipes</h2>
          </div>
          <div class="p-input-icon-left w-full sm:w-auto">
            <i class="pi pi-search"></i>
            <input 
              pInputText 
              type="text" 
              [(ngModel)]="busca"
              (ngModelChange)="onBuscaChange()"
              placeholder="Buscar UBS / Equipe / Indicador..."
              class="w-full sm:w-72"
            />
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <p-table 
            [value]="(equipesFiltradas$ | async) || []" 
            [scrollable]="true" 
            scrollHeight="400px"
            [style]="{'min-width': '800px'}"
          >
            <ng-template pTemplate="header">
              <tr>
                <th class="text-left p-3 text-sm font-semibold">UBS</th>
                <th class="text-left p-3 text-sm font-semibold">Equipe</th>
                <th class="text-left p-3 text-sm font-semibold">Indicador</th>
                <th class="text-left p-3 text-sm font-semibold">Meta</th>
                <th class="text-left p-3 text-sm font-semibold">Atual</th>
                <th class="text-left p-3 text-sm font-semibold">Status</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-equipe>
              <tr class="border-b border-gray-100 hover:bg-gray-50">
                <td class="p-3 text-sm font-medium">{{ equipe.ubs }}</td>
                <td class="p-3 text-sm">{{ equipe.equipe }}</td>
                <td class="p-3 text-sm">{{ equipe.indicador }}</td>
                <td class="p-3 text-sm">{{ apsService.formatarPercentual(equipe.meta) }}</td>
                <td class="p-3 text-sm font-medium">{{ apsService.formatarPercentual(equipe.atual) }}</td>
                <td class="p-3">
                  <p-tag 
                    [value]="apsService.getStatusEquipe(equipe.meta, equipe.atual).label" 
                    [severity]="apsService.getStatusEquipe(equipe.meta, equipe.atual).severity"
                    styleClass="text-xs font-semibold"
                  ></p-tag>
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="6" class="text-center p-8 text-gray-500">
                  <div class="flex flex-col items-center gap-2">
                    <i class="pi pi-info-circle text-2xl"></i>
                    <span>Nenhuma equipe encontrada com os filtros aplicados</span>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>
  `,
  styleUrl: './aps.component.css'
})
export class ApsComponent implements OnInit {
  equipesFiltradas$: Observable<EquipeAPS[]>;
  
  opcoesUBS: FiltroOpcao[] = [];
  opcoesEquipes: FiltroOpcao[] = [];
  opcoesMicroareas: FiltroOpcao[] = [];
  
  ubsSelecionada = '';
  equipeSelecionada = '';
  microareaSelecionada = '';
  busca = '';

  constructor(public apsService: ApsService) {
    this.equipesFiltradas$ = this.apsService.equipesFiltradas$;
  }

  ngOnInit(): void {
    this.opcoesUBS = this.apsService.getOpcoesUBS();
    this.opcoesEquipes = this.apsService.getOpcoesEquipes();
    this.opcoesMicroareas = this.apsService.getOpcoesMicroareas();
  }

  onUbsChange(): void {
    this.apsService.setUbsSelecionada(this.ubsSelecionada);
  }

  onEquipeChange(): void {
    this.apsService.setEquipeSelecionada(this.equipeSelecionada);
  }

  onMicroareaChange(): void {
    this.apsService.setMicroareaSelecionada(this.microareaSelecionada);
  }

  onBuscaChange(): void {
    this.apsService.setBusca(this.busca);
  }

  exportar(): void {
    this.equipesFiltradas$.subscribe(equipes => {
      if (equipes) {
        this.apsService.exportarCSV(equipes);
      }
    });
  }

  atualizar(): void {
    this.ubsSelecionada = '';
    this.equipeSelecionada = '';
    this.microareaSelecionada = '';
    this.busca = '';
    
    this.apsService.setUbsSelecionada('');
    this.apsService.setEquipeSelecionada('');
    this.apsService.setMicroareaSelecionada('');
    this.apsService.setBusca('');
  }
}