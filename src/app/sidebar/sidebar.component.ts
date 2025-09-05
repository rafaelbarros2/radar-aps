import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../shared/icon/icon.component';

export interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  badge?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Input() isOpen = false;
  @Output() menuItemClick = new EventEmitter<MenuItem>();


  menuItems: MenuItem[] = [
    {
      label: 'Visão Geral',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'APS / Equipes',
      icon: 'aps',
      route: '/aps'
    },
    {
      label: 'Materno‑Infantil',
      icon: 'materno',
      route: '/materno'
    },
    {
      label: 'Finanças',
      icon: 'financas',
      route: '/financas'
    },
    {
      label: 'Determinantes',
      icon: 'determinantes',
      route: '/determinantes'
    },
    {
      label: 'Controle Social',
      icon: 'controle',
      route: '/controle'
    },
    {
      label: 'Faltantes Indicador',
      icon: 'list',
      route: '/faltantes'
    }
  ];

  indicatorsGroup: MenuItem = {
    label: 'Selecionar bloco',
    icon: 'menu',
    expanded: true,
    children: [
      {
        label: 'Previne Brasil',
        route: '/previne',
        badge: '7'
      },
      {
        label: 'Qualidade APS',
        route: '/qualidade',
        badge: '15'
      }
    ]
  };

  onMenuItemClick(item: MenuItem) {
    this.menuItemClick.emit(item);
  }

  toggleGroup(group: MenuItem) {
    group.expanded = !group.expanded;
  }
}