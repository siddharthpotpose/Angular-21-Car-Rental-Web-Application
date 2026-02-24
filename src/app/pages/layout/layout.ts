import { Component, HostListener } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLinkWithHref],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  isSidebarCollapsed = false;
  isMobileSidebarOpen = false;
  readonly mobileBreakpoint = 991;

  toggleSidebar(): void {
    if (this.isMobileView()) {
      this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
      return;
    }

    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen = false;
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isMobileView()) {
      this.isMobileSidebarOpen = false;
    }
  }

  private isMobileView(): boolean {
    return typeof window !== 'undefined' && window.innerWidth <= this.mobileBreakpoint;
  }
}
