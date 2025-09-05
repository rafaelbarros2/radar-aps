import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, combineLatest } from 'rxjs';

// PrimeNG
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

// Models & Services
import { DashboardService } from '../../services/dashboard.service';
import { Indicador, EquipeResumo } from '../../models/dashboard.models';

// Components
import { KpiCardComponent } from '../../components/kpi-card/kpi-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    DropdownModule, 
    TableModule, 
    TagModule, 
    InputTextModule,
    ButtonModule,
    KpiCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Filtros
  periodoSelecionado = '';
  municipioSelecionado = '';
  blocoSelecionado: 'previne' | 'qualidade' = 'previne';
  filtroEquipe = '';

  // Dados
  indicadores: Indicador[] = [];
  equipesPendentes: EquipeResumo[] = [];

  // Opções para dropdowns
  get filtrosPeriodo() { return this.dashboardService.filtrosPeriodo; }
  get filtrosMunicipio() { return this.dashboardService.filtrosMunicipio; }
  get filtrosBlocos() { return this.dashboardService.filtrosBlocos; }

  constructor(public dashboardService: DashboardService) {}

  ngOnInit() {
    // Subscribe to filter changes
    combineLatest([
      this.dashboardService.periodoSelecionado$,
      this.dashboardService.municipioSelecionado$,
      this.dashboardService.blocoSelecionado$
    ]).pipe(takeUntil(this.destroy$))
    .subscribe(([periodo, municipio, bloco]) => {
      this.periodoSelecionado = periodo;
      this.municipioSelecionado = municipio;
      this.blocoSelecionado = bloco;
      this.atualizarDados();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPeriodoChange() {
    this.dashboardService.setPeriodo(this.periodoSelecionado);
  }

  onMunicipioChange() {
    this.dashboardService.setMunicipio(this.municipioSelecionado);
  }

  onBlocoChange() {
    this.dashboardService.setBloco(this.blocoSelecionado);
  }

  onFiltroEquipeChange() {
    this.equipesPendentes = this.dashboardService.getEquipesPendentes(this.filtroEquipe);
  }

  private atualizarDados() {
    this.indicadores = this.dashboardService.getIndicadores();
    this.equipesPendentes = this.dashboardService.getEquipesPendentes(this.filtroEquipe);
  }

  getStatusIndicador(indicador: Indicador) {
    return this.dashboardService.getStatusIndicador(indicador.value, indicador.meta);
  }

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'ok': return 'success';
      case 'warn': return 'warning';
      case 'bad': return 'danger';
      default: return 'info';
    }
  }

  getBlocoBadgeText(): string {
    return this.blocoSelecionado === 'previne' ? 'Previne Brasil • 7' : 'Qualidade APS • 15';
  }

  onExportCSV() {
    const csv = this.dashboardService.exportarCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resumo_${this.blocoSelecionado}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}