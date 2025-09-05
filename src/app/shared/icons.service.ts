import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconsService {
  constructor(private sanitizer: DomSanitizer) {}

  private icons = {
    dashboard: `<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="10" width="7" height="11"/><rect x="3" y="14" width="7" height="7"/>`,
    aps: `<path d="M3 12h18"/><path d="M7 8h10"/><path d="M5 16h14"/>`,
    materno: `<circle cx="12" cy="8" r="3"/><path d="M5 22a7 7 0 0 1 14 0"/>`,
    financas: `<path d="M3 21h18"/><rect x="4" y="10" width="4" height="7"/><rect x="10" y="6" width="4" height="11"/><rect x="16" y="3" width="4" height="14"/>`,
    determinantes: `<path d="M3 12l7-9 4 6 7-3-7 15z"/>`,
    controle: `<path d="M9 3h6v4H9z"/><path d="M4 7h16v14H4z"/>`,
    menu: `<path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/>`,
    'chevron-right': `<polyline points="9 18 15 12 9 6"/>`,
    home: `<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
    bars: `<path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/>`
  };

  getIcon(name: string): SafeHtml {
    const iconContent = this.icons[name as keyof typeof this.icons] || '';
    return this.sanitizer.bypassSecurityTrustHtml(iconContent);
  }

  getAllIcons() {
    return this.icons;
  }
}