import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { EquipeAPS, StatusEquipe, FiltroOpcao } from '../models/aps.models';

@Injectable({
  providedIn: 'root'
})
export class ApsService {
  private dados: EquipeAPS[] = [
    {ubs:'UBS Centro', equipe:'eSF‑01', indicador:'Pré-natal (≥6 consultas)', meta:85, atual:78, microarea:'01'},
    {ubs:'UBS Rural', equipe:'eAP‑01', indicador:'Hipertensos com PA aferida', meta:70, atual:61, microarea:'02'},
    {ubs:'UBS Nova', equipe:'eSF‑02', indicador:'Cobertura vacinal < 1 ano', meta:95, atual:97, microarea:'03'},
    {ubs:'UBS Centro', equipe:'eSB‑02', indicador:'Primeira consulta odontológica', meta:60, atual:55, microarea:'01'}
  ];

  private ubsSelecionadaSubject = new BehaviorSubject<string>('');
  private equipeSelecionadaSubject = new BehaviorSubject<string>('');
  private microareaSelecionadaSubject = new BehaviorSubject<string>('');
  private buscaSubject = new BehaviorSubject<string>('');

  ubsSelecionada$ = this.ubsSelecionadaSubject.asObservable();
  equipeSelecionada$ = this.equipeSelecionadaSubject.asObservable();
  microareaSelecionada$ = this.microareaSelecionadaSubject.asObservable();
  busca$ = this.buscaSubject.asObservable();

  equipesFiltradas$ = combineLatest([
    this.ubsSelecionada$,
    this.equipeSelecionada$,
    this.microareaSelecionada$,
    this.busca$
  ]).pipe(
    map(([ubs, equipe, microarea, busca]) => this.filtrarEquipes(ubs, equipe, microarea, busca))
  );

  constructor() {}

  setUbsSelecionada(ubs: string): void {
    this.ubsSelecionadaSubject.next(ubs);
  }

  setEquipeSelecionada(equipe: string): void {
    this.equipeSelecionadaSubject.next(equipe);
  }

  setMicroareaSelecionada(microarea: string): void {
    this.microareaSelecionadaSubject.next(microarea);
  }

  setBusca(busca: string): void {
    this.buscaSubject.next(busca);
  }

  getOpcoesUBS(): FiltroOpcao[] {
    const ubs = [...new Set(this.dados.map(d => d.ubs))];
    return [
      { label: 'Todas', value: '' },
      ...ubs.map(u => ({ label: u, value: u }))
    ];
  }

  getOpcoesEquipes(): FiltroOpcao[] {
    const equipes = [...new Set(this.dados.map(d => d.equipe))];
    return [
      { label: 'Todas', value: '' },
      ...equipes.map(e => ({ label: e, value: e }))
    ];
  }

  getOpcoesMicroareas(): FiltroOpcao[] {
    const microareas = [...new Set(this.dados.map(d => d.microarea))];
    return [
      { label: 'Todas', value: '' },
      ...microareas.map(m => ({ label: m, value: m }))
    ];
  }

  private filtrarEquipes(ubs: string, equipe: string, microarea: string, busca: string): EquipeAPS[] {
    return this.dados
      .filter(d => !ubs || d.ubs === ubs)
      .filter(d => !equipe || d.equipe === equipe)
      .filter(d => !microarea || d.microarea === microarea)
      .filter(d => !busca || 
        (d.ubs + ' ' + d.equipe + ' ' + d.indicador).toLowerCase().includes(busca.toLowerCase())
      );
  }

  getStatusEquipe(meta: number, atual: number): StatusEquipe {
    if (atual >= meta) {
      return { label: 'OK', cls: 'ok', severity: 'success' };
    }
    if (atual >= meta * 0.9) {
      return { label: 'Atenção', cls: 'warn', severity: 'warning' };
    }
    return { label: 'Crítico', cls: 'bad', severity: 'danger' };
  }

  formatarPercentual(valor: number): string {
    return `${valor}%`;
  }

  exportarCSV(equipes: EquipeAPS[]): void {
    const headers = ['UBS', 'Equipe', 'Indicador', 'Meta', 'Atual', 'Status'];
    const rows = equipes.map(e => [
      e.ubs,
      e.equipe,
      e.indicador,
      this.formatarPercentual(e.meta),
      this.formatarPercentual(e.atual),
      this.getStatusEquipe(e.meta, e.atual).label
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'equipes_aps.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}