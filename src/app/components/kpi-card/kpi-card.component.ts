import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Indicador, StatusIndicador } from '../../models/dashboard.models';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="w-full lg:w-60 bg-white border border-gray-200 rounded-2xl shadow-sm p-6 lg:p-8 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 h-48 flex flex-col justify-between">
      <div class="text-sm text-gray-600 font-bold leading-tight mb-4">{{ indicador.label }}</div>
      <div class="text-3xl font-black text-gray-900 mb-3">{{ formatarValor() }}</div>
      <div class="flex items-center gap-2 text-sm font-semibold" [ngClass]="getTextColorClass()">
        <span class="w-2.5 h-2.5 rounded-full dot" [ngClass]="status.cls"></span> 
        Meta {{ formatarMeta() }}
      </div>
    </article>
  `,
  styleUrls: ['./kpi-card.component.css']
})
export class KpiCardComponent {
  @Input() indicador!: Indicador;
  @Input() status!: StatusIndicador;

  formatarValor(): string {
    return this.indicador.unit === '%' ? `${this.indicador.value}%` : `${this.indicador.value}`;
  }

  formatarMeta(): string {
    if (this.indicador.meta === null) return 'definir';
    return this.indicador.unit === '%' ? `≥ ${this.indicador.meta}%` : `≥ ${this.indicador.meta}`;
  }

  getTextColorClass(): string {
    switch (this.status.cls) {
      case 'ok': return 'text-green-600';
      case 'warn': return 'text-yellow-600'; 
      case 'bad': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }
}