import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, ButtonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  @Input() breadcrumbItems: MenuItem[] = [];
  @Input() showBurgerMenu = false;
  @Output() burgerClick = new EventEmitter<void>();
  @Output() exportClick = new EventEmitter<void>();
  @Output() publishClick = new EventEmitter<void>();

  home: MenuItem = {
    icon: 'pi pi-home',
    routerLink: '/'
  };

  onBurgerClick() {
    this.burgerClick.emit();
  }

  onExportClick() {
    this.exportClick.emit();
  }

  onPublishClick() {
    this.publishClick.emit();
  }
}