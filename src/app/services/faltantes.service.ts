import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Indicador, Pessoa, AppState, FiltrosState } from '../models/faltantes';

@Injectable({
  providedIn: 'root'
})
export class FaltantesService {
  private readonly INDICADORES = {
    previne: [
      { id: 'prenatal6', nome: 'Pré-natal (≥6 consultas)' },
      { id: 'prenatal12', nome: 'Pré-natal até 12ª semana' },
      { id: 'citopatologico', nome: 'Exame citopatológico' },
      { id: 'paHipertenso', nome: 'Hipertensos com PA aferida' },
      { id: 'hba1c', nome: 'Diabéticos com hemoglobina glicada' },
      { id: 'vacinaMenor1', nome: 'Cobertura vacinal (< 1 ano)' },
      { id: 'odonto', nome: 'Atendimento odontológico programático' },
    ],
    qualidade: [
      { id: 'odontoGestante', nome: 'Gestantes com 1ª consulta odontológica' },
      { id: 'puerperio10', nome: 'Consulta puerperal até 10 dias' },
      { id: 'vac12mDia', nome: 'Crianças 12 meses com vacina em dia' },
      { id: 'vac4mDia', nome: 'Crianças 4 meses com vacina em dia' },
      { id: 'rvCcv', nome: 'Estratificação de risco cardiovascular' },
      { id: 'influenzaIdoso', nome: 'Idosos com vacinação influenza' },
      { id: 'pf', nome: 'Cobertura de planejamento familiar' },
      { id: 'puericultura', nome: 'Consulta de puericultura' },
      { id: 'dm2', nome: 'Acompanhamento de DM2' },
      { id: 'has', nome: 'Acompanhamento de HAS' },
      { id: 'vdAcs', nome: 'Visitas domiciliares (ACS)' },
      { id: 'multi', nome: 'Atendimentos multiprofissionais' },
      { id: 'escovacao', nome: 'Escovação supervisionada' },
      { id: 'sm', nome: 'Consulta de saúde mental na APS' },
      { id: 'odonto5', nome: 'Atend. odontológico até 5 anos' },
    ],
  };

  private pessoas: Pessoa[] = [];
  private state$ = new BehaviorSubject<AppState>({
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
  });

  constructor() {
    this.seedMockData();
  }

  getState() {
    return this.state$.asObservable();
  }

  updateState(updates: Partial<AppState>) {
    const current = this.state$.value;
    this.state$.next({ ...current, ...updates });
  }

  getIndicadoresByBloco(bloco: 'previne' | 'qualidade'): Indicador[] {
    return this.INDICADORES[bloco];
  }

  getAllPessoas(): Pessoa[] {
    return this.pessoas;
  }

  getUbsList(): string[] {
    return [...new Set(this.pessoas.map(p => p.ubs))].sort();
  }

  getEquipesList(): string[] {
    return [...new Set(this.pessoas.map(p => p.equipe))].sort();
  }

  getAcsList(): string[] {
    return [...new Set(this.pessoas.map(p => p.acs))].sort();
  }

  getSexoOptions() {
    return [
      { label: 'Todos', value: '' },
      { label: 'Feminino', value: 'F' },
      { label: 'Masculino', value: 'M' }
    ];
  }

  getFaixaEtariaOptions() {
    return [
      { label: 'Todas', value: '' },
      { label: '0–4', value: '0-4' },
      { label: '5–9', value: '5-9' },
      { label: '10–19', value: '10-19' },
      { label: '20–39', value: '20-39' },
      { label: '40–59', value: '40-59' },
      { label: '60+', value: '60+' }
    ];
  }

  getCondicaoOptions() {
    return [
      { label: 'Todas', value: '' },
      { label: 'Gestante', value: 'gestante' },
      { label: 'HAS', value: 'has' },
      { label: 'DM2', value: 'dm2' },
      { label: 'Idoso (60+)', value: 'idoso' },
      { label: 'Criança < 1 ano', value: 'crianca_menor1' },
      { label: 'Criança ~12 meses', value: 'crianca_12m' }
    ];
  }

  getPeriodoOptions() {
    return [
      { label: '2025 • 1º tri', value: '2025Q1' },
      { label: '2025 • 2º tri', value: '2025Q2' },
      { label: '2025 • 3º tri', value: '2025Q3' },
      { label: '2025 • 4º tri', value: '2025Q4' }
    ];
  }

  getOrdenacaoOptions() {
    return [
      { label: 'Atualização (recente primeiro)', value: 'atualizacao_desc' },
      { label: 'Atualização (antigo primeiro)', value: 'atualizacao_asc' },
      { label: 'Nome (A→Z)', value: 'nome' },
      { label: 'Equipe', value: 'equipe' },
      { label: 'UBS', value: 'ubs' }
    ];
  }

  getNomeIndicador(bloco: 'previne' | 'qualidade', indicadorId: string): string {
    const indicador = this.INDICADORES[bloco].find(i => i.id === indicadorId);
    return indicador?.nome || indicadorId;
  }

  filtrarPessoas(state: AppState) {
    const { indicador, equipeSelecionada, filtros } = state;
    
    const elegiveis = this.pessoas.filter(p => p.elegiveis?.includes(indicador));
    const faltantes = elegiveis.filter(p => p.missing?.[indicador]);
    
    let visiveis = faltantes
      .filter(p => !filtros.ubs || p.ubs === filtros.ubs)
      .filter(p => !filtros.equipe || p.equipe === filtros.equipe)
      .filter(p => !filtros.acs || p.acs === filtros.acs)
      .filter(p => !equipeSelecionada || p.equipe === equipeSelecionada)
      .filter(p => !filtros.sexo || p.sexo === filtros.sexo)
      .filter(p => this.inFaixaEtaria(p.idade, filtros.faixa))
      .filter(p => !filtros.cond || (p.tags || []).includes(filtros.cond))
      .filter(p => this.inPeriodo(p.atualizacao, filtros.periodo))
      .filter(p => {
        const query = filtros.busca.trim().toLowerCase();
        if (!query) return true;
        return (p.nome + ' ' + p.cns).toLowerCase().includes(query);
      });

    // Ordenação
    visiveis = this.ordenarPessoas(visiveis, filtros.ordenar);

    return { elegiveis, faltantes, visiveis };
  }

  private inFaixaEtaria(idade: number, faixa: string): boolean {
    if (!faixa) return true;
    
    if (faixa === '60+') {
      return idade >= 60;
    }
    
    const [min, max] = faixa.split('-').map(Number);
    return idade >= min && idade <= max;
  }

  private inPeriodo(dataISO: string, periodo: string): boolean {
    if (!periodo) return true;
    
    const mes = Number(dataISO.split('-')[1]);
    const periodoMap: { [key: string]: [number, number] } = {
      '2025Q1': [1, 3],
      '2025Q2': [4, 6], 
      '2025Q3': [7, 9],
      '2025Q4': [10, 12]
    };
    
    const [mesInicial, mesFinal] = periodoMap[periodo] || [1, 12];
    return mes >= mesInicial && mes <= mesFinal;
  }

  private ordenarPessoas(pessoas: Pessoa[], ordenacao: string): Pessoa[] {
    return pessoas.sort((a, b) => {
      switch (ordenacao) {
        case 'nome':
          return a.nome.localeCompare(b.nome);
        case 'equipe':
          return a.equipe.localeCompare(b.equipe) || a.nome.localeCompare(b.nome);
        case 'ubs':
          return a.ubs.localeCompare(b.ubs) || a.nome.localeCompare(b.nome);
        case 'atualizacao_asc':
          return a.atualizacao.localeCompare(b.atualizacao);
        default: // atualizacao_desc
          return b.atualizacao.localeCompare(a.atualizacao);
      }
    });
  }

  private seedMockData(): void {
    const allIds = [...this.INDICADORES.previne, ...this.INDICADORES.qualidade].map(i => i.id);
    
    const OBS_TEMPLATES: { [key: string]: string } = {
      prenatal6: 'Faltam consultas (meta 6)',
      prenatal12: 'Início após 12ª semana',
      citopatologico: 'Sem PAP no período',
      paHipertenso: 'PA sem registro no quadrimestre',
      hba1c: 'HbA1c > 6 meses',
      vacinaMenor1: 'Esquema vacinal incompleto',
      odonto: 'Sem atendimento programático',
      odontoGestante: 'Sem 1ª consulta odontológica',
      puerperio10: 'Sem consulta até 10 dias',
      vac12mDia: 'Atraso vacina 12 meses',
      vac4mDia: 'Atraso vacina 4 meses',
      rvCcv: 'Sem estratificação de risco CV',
      influenzaIdoso: 'Vacina influenza pendente',
      pf: 'Sem registro de planejamento familiar',
      puericultura: 'Sem consulta de puericultura',
      dm2: 'Sem acompanhamento DM2',
      has: 'Sem consulta HAS',
      vdAcs: 'Sem visita domiciliar',
      multi: 'Sem atendimento multiprofissional',
      escovacao: 'Sem escovação supervisionada',
      sm: 'Sem consulta de saúde mental',
      odonto5: 'Sem atendimento odontológico 0-5 anos'
    };

    const ubsList = ['UBS Centro', 'UBS Rural', 'UBS Nova'];
    const equipes = ['eSF-01', 'eSF-02', 'eAP-01'];
    const acsList = ['Maria', 'João', 'Rita', 'Pedro'];

    const randInt = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
    const pick = <T>(arr: T[]): T => arr[randInt(0, arr.length - 1)];
    const pickDate = () => {
      // Gera datas no 3º trimestre (jul-set)
      const mes = randInt(7, 9).toString().padStart(2, '0');
      const dia = randInt(1, 28).toString().padStart(2, '0');
      return `2025-${mes}-${dia}`;
    };
    const emptyMissing = () => allIds.reduce((acc, id) => { acc[id] = false; return acc; }, {} as { [key: string]: boolean });

    // Base de dados manual com novos campos
    const base: Pessoa[] = [
      {
        nome: 'Ana Souza', sexo: 'F', idade: 28, ubs: 'UBS Centro', equipe: 'eSF-01', acs: 'Maria', cns: '111',
        missing: { ...emptyMissing(), prenatal6: true, citopatologico: true, odontoGestante: true },
        obs: { prenatal6: '3/6 consultas', citopatologico: 'PAP >3 anos', odontoGestante: 'Sem 1ª consulta' },
        elegiveis: ['prenatal6', 'citopatologico', 'odontoGestante'], tags: ['gestante'], atualizacao: '2025-08-20'
      },
      {
        nome: 'Bruno Lima', sexo: 'M', idade: 34, ubs: 'UBS Centro', equipe: 'eSF-01', acs: 'João', cns: '112',
        missing: { ...emptyMissing(), prenatal12: true },
        obs: { prenatal12: 'Início pré-natal após 12ª sem.' }, elegiveis: ['prenatal12'], tags: ['has'], atualizacao: '2025-08-18'
      },
      {
        nome: 'Carla Nunes', sexo: 'F', idade: 41, ubs: 'UBS Nova', equipe: 'eSF-02', acs: 'Rita', cns: '113',
        missing: { ...emptyMissing(), citopatologico: true },
        obs: { citopatologico: 'Sem exame no período' }, elegiveis: ['citopatologico'], tags: ['dm2'], atualizacao: '2025-08-05'
      },
      {
        nome: 'Daniel Rocha', sexo: 'M', idade: 63, ubs: 'UBS Rural', equipe: 'eAP-01', acs: 'Pedro', cns: '114',
        missing: { ...emptyMissing(), paHipertenso: true, rvCcv: true, has: true },
        obs: { paHipertenso: 'PA sem registro', rvCcv: 'Sem estratificação recente', has: 'Sem consulta de HAS' },
        elegiveis: ['paHipertenso', 'rvCcv', 'has'], tags: ['idoso', 'has'], atualizacao: '2025-08-28'
      },
      {
        nome: 'Eva Martins', sexo: 'F', idade: 57, ubs: 'UBS Nova', equipe: 'eSF-02', acs: 'Rita', cns: '115',
        missing: { ...emptyMissing(), hba1c: true, dm2: true },
        obs: { hba1c: 'HbA1c > 6 meses', dm2: 'Sem acompanhamento DM2' },
        elegiveis: ['hba1c', 'dm2'], tags: ['dm2'], atualizacao: '2025-08-10'
      },
      {
        nome: 'Felipe Araújo', sexo: 'M', idade: 1, ubs: 'UBS Centro', equipe: 'eSF-01', acs: 'João', cns: '116',
        missing: { ...emptyMissing(), vacinaMenor1: true },
        obs: { vacinaMenor1: 'Esquema incompleto' }, elegiveis: ['vacinaMenor1'], tags: ['crianca_menor1'], atualizacao: '2025-08-12'
      },
      {
        nome: 'Gabriela Prado', sexo: 'F', idade: 4, ubs: 'UBS Rural', equipe: 'eAP-01', acs: 'Pedro', cns: '117',
        missing: { ...emptyMissing(), odonto: true, odonto5: true },
        obs: { odonto: 'Sem atendimento programático', odonto5: 'Sem atendimento 0-5 anos' },
        elegiveis: ['odonto', 'odonto5'], tags: [], atualizacao: '2025-08-30'
      },
      {
        nome: 'Hugo Teixeira', sexo: 'M', idade: 46, ubs: 'UBS Centro', equipe: 'eSF-01', acs: 'Maria', cns: '118',
        missing: { ...emptyMissing(), paHipertenso: true, hba1c: true, has: true },
        obs: { paHipertenso: 'Sem PA', hba1c: 'HbA1c > 6m', has: 'Sem consulta HAS' },
        elegiveis: ['paHipertenso', 'hba1c', 'has'], tags: ['has', 'dm2'], atualizacao: '2025-08-22'
      },
      {
        nome: 'Iara Figueiredo', sexo: 'F', idade: 23, ubs: 'UBS Nova', equipe: 'eSF-02', acs: 'Rita', cns: '119',
        missing: { ...emptyMissing(), prenatal6: true, prenatal12: true, puericultura: true },
        obs: { prenatal6: '2/6 consultas', prenatal12: 'Início tardio', puericultura: 'Sem consulta puericultura' },
        elegiveis: ['prenatal6', 'prenatal12', 'puericultura'], tags: ['gestante'], atualizacao: '2025-08-14'
      },
      {
        nome: 'João Pedro', sexo: 'M', idade: 1, ubs: 'UBS Rural', equipe: 'eAP-01', acs: 'Pedro', cns: '120',
        missing: { ...emptyMissing(), vac12mDia: true },
        obs: { vac12mDia: 'Atraso vacina 12m' }, elegiveis: ['vac12mDia'], tags: ['crianca_12m'], atualizacao: '2025-08-08'
      }
    ];

    this.pessoas = [...base];

    // Geração adicional de dados com novos campos
    const nomesA = ['Lucas', 'Mariana', 'Paulo', 'Camila', 'Rafael', 'Bianca', 'Diego', 'Larissa', 'Mateus', 'Priscila', 'Otávio', 'Nathalia', 'Thiago', 'Letícia', 'Gustavo', 'Aline', 'Caio', 'Isabela', 'Henrique', 'Caroline'];
    const sobrenomes = ['Almeida', 'Barros', 'Cunha', 'Dantas', 'Esteves', 'Ferreira', 'Gomes', 'Silva', 'Teixeira', 'Medeiros', 'Nogueira', 'Oliveira', 'Pereira', 'Queiroz', 'Ramos'];

    for (let i = 0; i < 90; i++) {
      const nome = `${pick(nomesA)} ${pick(sobrenomes)}`;
      const sexo = Math.random() < 0.52 ? 'F' : 'M';
      const idade = randInt(0, 90);
      const ubs = pick(ubsList);
      const equipe = (ubs === 'UBS Rural') ? 'eAP-01' : pick(['eSF-01', 'eSF-02']);
      const acs = pick(acsList);
      const id1 = pick(allIds);
      const id2 = Math.random() < 0.25 ? pick(allIds) : null;

      const missing = emptyMissing();
      missing[id1] = true;
      if (id2 && id2 !== id1) missing[id2] = true;

      const elegiveis = id2 && id2 !== id1 ? [id1, id2] : [id1];
      const obs: { [key: string]: string } = {};
      obs[id1] = OBS_TEMPLATES[id1] || 'Pendente';
      if (id2 && id2 !== id1) obs[id2] = OBS_TEMPLATES[id2] || 'Pendente';

      // Geração de tags baseada na idade e características
      const tags: string[] = [];
      if (idade >= 60) tags.push('idoso');
      if (sexo === 'F' && idade >= 15 && idade <= 49 && Math.random() < 0.12) tags.push('gestante');
      if (idade >= 30 && Math.random() < 0.30) tags.push('has');
      if (idade >= 30 && Math.random() < 0.20) tags.push('dm2');
      if (idade < 1) tags.push('crianca_menor1');
      if (idade >= 1 && idade <= 2) tags.push('crianca_12m');

      this.pessoas.push({
        nome, sexo, idade, ubs, equipe, acs, cns: String(9000 + i), missing, obs, elegiveis, tags, atualizacao: pickDate()
      });
    }
  }
}