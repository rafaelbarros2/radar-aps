import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';

import { FaltantesService } from '../../services/faltantes.service';
import { LayoutService } from '../../layout/layout.service';
import { Exportable } from '../../shared/exportable';
import { Indicador, Pessoa, AppState, KPIs, EquipeChip } from '../../models/faltantes';

@Component({
  selector: 'app-faltantes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    TagModule,
    ChipModule
  ],
  templateUrl: './faltantes.component.html',
  styleUrl: './faltantes.component.css'
})
export class FaltantesComponent implements OnInit, OnDestroy, Exportable {
  private destroy$ = new Subject<void>();
  
  state: AppState = {
    bloco: 'previne',
    indicador: 'prenatal6',
    equipeSelecionada: '',
    filtros: { 
      periodo: '2025Q3', 
      ubs: '', 
      equipe: '', 
      acs: '', 
      sexo: '', 
      faixa: '', 
      cond: '', 
      ordenar: 'atualizacao_desc', 
      busca: '' 
    }
  };

  blocoOptions = [
    { label: 'Previne Brasil', value: 'previne' },
    { label: 'Qualidade APS', value: 'qualidade' }
  ];

  indicadores: Indicador[] = [];
  periodoOptions: any[] = [];
  ubsOptions: any[] = [];
  equipeOptions: any[] = [];
  acsOptions: any[] = [];
  sexoOptions: any[] = [];
  faixaEtariaOptions: any[] = [];
  condicaoOptions: any[] = [];
  ordenacaoOptions: any[] = [];
  
  kpis: KPIs = { elegiveis: 0, emDia: 0, faltando: 0 };
  equipeChips: EquipeChip[] = [];
  pessoasVisiveis: Pessoa[] = [];
  infoSelecao = '';

  constructor(
    private faltantesService: FaltantesService,
    private layoutService: LayoutService
  ) {}

  ngOnInit() {
    this.layoutService.setBreadcrumb([
      { label: 'Dashboard', routerLink: '/dashboard' },
      { label: 'Faltantes por Indicador' }
    ]);

    this.faltantesService.getState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.state = state;
        this.updateData();
      });

    this.initializeData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeData() {
    this.updateIndicadores();
    this.updateFiltersOptions();
    this.updateData();
  }

  private updateIndicadores() {
    this.indicadores = this.faltantesService.getIndicadoresByBloco(this.state.bloco);
    
    const hasIndicador = this.indicadores.some(i => i.id === this.state.indicador);
    if (!hasIndicador && this.indicadores.length > 0) {
      this.state.indicador = this.indicadores[0].id;
    }
  }

  private updateFiltersOptions() {
    const ubsList = this.faltantesService.getUbsList();
    const equipesList = this.faltantesService.getEquipesList();
    const acsList = this.faltantesService.getAcsList();

    this.periodoOptions = this.faltantesService.getPeriodoOptions();
    this.ubsOptions = [{ label: 'Todas', value: '' }, ...ubsList.map(u => ({ label: u, value: u }))];
    this.equipeOptions = [{ label: 'Todas', value: '' }, ...equipesList.map(e => ({ label: e, value: e }))];
    this.acsOptions = [{ label: 'Todos', value: '' }, ...acsList.map(a => ({ label: a, value: a }))];
    this.sexoOptions = this.faltantesService.getSexoOptions();
    this.faixaEtariaOptions = this.faltantesService.getFaixaEtariaOptions();
    this.condicaoOptions = this.faltantesService.getCondicaoOptions();
    this.ordenacaoOptions = this.faltantesService.getOrdenacaoOptions();
  }

  private updateData() {
    const { elegiveis, faltantes, visiveis } = this.faltantesService.filtrarPessoas(this.state);
    
    this.kpis = {
      elegiveis: elegiveis.length,
      emDia: elegiveis.length - faltantes.length,
      faltando: faltantes.length
    };

    this.updateEquipeChips(faltantes);
    this.pessoasVisiveis = visiveis;
    this.updateInfoSelecao(visiveis.length);
  }

  private updateEquipeChips(faltantes: Pessoa[]) {
    const equipeCounts: { [key: string]: number } = {};
    faltantes.forEach(p => {
      equipeCounts[p.equipe] = (equipeCounts[p.equipe] || 0) + 1;
    });

    this.equipeChips = Object.keys(equipeCounts)
      .sort()
      .map(equipe => ({
        nome: equipe,
        count: equipeCounts[equipe],
        ativo: this.state.equipeSelecionada === equipe
      }));
  }

  private updateInfoSelecao(count: number) {
    const nomeIndicador = this.faltantesService.getNomeIndicador(this.state.bloco, this.state.indicador);
    const labelEquipe = this.state.equipeSelecionada ? ` | equipe: ${this.state.equipeSelecionada}` : '';
    this.infoSelecao = `Exibindo ${count} faltantes para ${nomeIndicador}${labelEquipe}`;
  }

  onBlocoChange() {
    this.updateIndicadores();
    this.faltantesService.updateState({ bloco: this.state.bloco, indicador: this.state.indicador });
  }

  onIndicadorChange() {
    this.faltantesService.updateState({ indicador: this.state.indicador });
  }

  onEquipeChipClick(chip: EquipeChip) {
    const equipeSelecionada = chip.ativo ? '' : chip.nome;
    this.faltantesService.updateState({ equipeSelecionada });
  }

  onLimparEquipeClick() {
    this.faltantesService.updateState({ equipeSelecionada: '' });
  }

  onFiltroChange() {
    this.faltantesService.updateState({ filtros: { ...this.state.filtros } });
  }

  onLimparFiltrosClick() {
    const filtrosLimpos = {
      periodo: '2025Q3',
      ubs: '',
      equipe: '',
      acs: '',
      sexo: '',
      faixa: '',
      cond: '',
      ordenar: 'atualizacao_desc',
      busca: ''
    };
    
    this.state.filtros = { ...filtrosLimpos };
    this.faltantesService.updateState({ filtros: filtrosLimpos });
  }

  getObservacao(pessoa: Pessoa): string {
    return pessoa.obs?.[this.state.indicador] || '-';
  }

  // Implementação da interface Exportable
  getExportData(): { headers: string[]; rows: (string | number)[][]; filename?: string } {
    const headers = ['Nome', 'Sexo', 'Idade', 'UBS', 'Equipe', 'ACS', 'Observação', 'Status', 'Atualização'];
    const rows = this.pessoasVisiveis.map(p => [
      p.nome,
      p.sexo,
      p.idade,
      p.ubs,
      p.equipe,
      p.acs,
      this.getObservacao(p),
      'Faltando',
      p.atualizacao
    ]);
    
    return {
      headers,
      rows,
      filename: `faltantes_${this.state.indicador}`
    };
  }

  getViewState(): any {
    return {
      bloco: this.state.bloco,
      indicador: this.state.indicador,
      equipeSelecionada: this.state.equipeSelecionada,
      filtros: this.state.filtros
    };
  }
}