import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private sidebarCollapsed = new BehaviorSubject<boolean>(false);
  private sidebarOpen = new BehaviorSubject<boolean>(false);
  private breadcrumbItems = new BehaviorSubject<MenuItem[]>([]);

  sidebarCollapsed$ = this.sidebarCollapsed.asObservable();
  sidebarOpen$ = this.sidebarOpen.asObservable();
  breadcrumbItems$ = this.breadcrumbItems.asObservable();

  toggleSidebar() {
    // Em mobile, controla open/close
    if (window.innerWidth <= 900) {
      this.sidebarOpen.next(!this.sidebarOpen.value);
    } else {
      // Em desktop, controla collapsed/expanded
      this.sidebarCollapsed.next(!this.sidebarCollapsed.value);
    }
  }

  collapseSidebar() {
    this.sidebarCollapsed.next(true);
  }

  expandSidebar() {
    this.sidebarCollapsed.next(false);
  }

  closeSidebar() {
    this.sidebarOpen.next(false);
  }

  openSidebar() {
    this.sidebarOpen.next(true);
  }

  setSidebarCollapsed(collapsed: boolean) {
    this.sidebarCollapsed.next(collapsed);
  }

  setBreadcrumb(items: MenuItem[]) {
    this.breadcrumbItems.next(items);
  }

  addBreadcrumb(item: MenuItem) {
    const current = this.breadcrumbItems.value;
    this.breadcrumbItems.next([...current, item]);
  }

  clearBreadcrumb() {
    this.breadcrumbItems.next([]);
  }

  get isSidebarCollapsed(): boolean {
    return this.sidebarCollapsed.value;
  }

  get isSidebarOpen(): boolean {
    return this.sidebarOpen.value;
  }

  get isMobile(): boolean {
    return window.innerWidth <= 900;
  }
}