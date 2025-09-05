import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MenuItem } from 'primeng/api';

import { SidebarComponent, MenuItem as SidebarMenuItem } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { LayoutService } from './layout/layout.service';
import { Exportable } from './shared/exportable';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, SidebarComponent, TopbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'RadarAPS';
  
  sidebarCollapsed$: Observable<boolean>;
  sidebarOpen$: Observable<boolean>;
  breadcrumbItems$: Observable<MenuItem[]>;
  showBurgerMenu = false;
  private currentExportable: Exportable | null = null;

  constructor(private layoutService: LayoutService, private router: Router) {
    this.sidebarCollapsed$ = this.layoutService.sidebarCollapsed$;
    this.sidebarOpen$ = this.layoutService.sidebarOpen$;
    this.breadcrumbItems$ = this.layoutService.breadcrumbItems$;
  }

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());
    
    // Set initial breadcrumb
    this.layoutService.setBreadcrumb([
      { label: 'Dashboard', routerLink: '/dashboard' },
      { label: 'Visão Geral' }
    ]);
  }

  private checkScreenSize() {
    this.showBurgerMenu = window.innerWidth <= 900;
  }

  onBurgerClick() {
    this.layoutService.toggleSidebar();
  }

  onMenuItemClick(item: SidebarMenuItem) {
    console.log('Menu item clicked:', item);
    
    // Update breadcrumb based on menu item
    if (item.route) {
      this.layoutService.setBreadcrumb([
        { label: 'Dashboard', routerLink: '/dashboard' },
        { label: item.label }
      ]);
    }
    
    // Close sidebar on mobile after menu click
    if (this.layoutService.isMobile) {
      this.layoutService.closeSidebar();
    }
  }

  onExportClick() {
    const exp = this.currentExportable;
    if (!exp) {
      window.alert('Nada para exportar nesta visualização.');
      return;
    }
    const { headers, rows, filename } = exp.getExportData();
    const csv = this.toCsv(headers, rows);
    const file = filename || this.suggestFilename('export');
    this.downloadText(csv, file);
  }

  onPublishClick() {
    const exp = this.currentExportable;
    const state = exp?.getViewState ? exp.getViewState() : {};
    const payload = {
      url: this.router.url,
      state,
      ts: new Date().toISOString()
    };

    try {
      const key = 'publishedViews';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.push(payload);
      localStorage.setItem(key, JSON.stringify(list));
    } catch {}

    const encoded = encodeURIComponent(btoa(JSON.stringify(payload)));
    const shareUrl = `${location.origin}${this.router.url}?state=${encoded}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(
        () => window.alert('Link da visão copiado para a área de transferência.'),
        () => window.alert('Visão publicada localmente. Copie o link manualmente:\n' + shareUrl)
      );
    } else {
      window.alert('Visão publicada localmente. Link:\n' + shareUrl);
    }
  }

  onRouteActivate(component: any) {
    // Captura componente atual se ele expõe getExportData
    if (component && typeof component.getExportData === 'function') {
      this.currentExportable = component as Exportable;
    } else {
      this.currentExportable = null;
    }
  }

  private toCsv(headers: string[], rows: (string | number)[][]): string {
    const escape = (val: string | number) => {
      const s = String(val ?? '');
      if (s.includes('"') || s.includes(',') || s.includes('\n')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };
    const lines = [headers.map(escape).join(',')];
    for (const row of rows) {
      lines.push(row.map(escape).join(','));
    }
    return lines.join('\n');
  }

  private downloadText(text: string, filename: string) {
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.endsWith('.csv') ? filename : filename + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private suggestFilename(prefix: string) {
    const date = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 19);
    return `${prefix}-${date}`;
  }
}
