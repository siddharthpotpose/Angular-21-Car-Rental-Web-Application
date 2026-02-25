import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

   router = inject(Router)
   toaster = inject(ToastrService)

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

  userName = sessionStorage.getItem('email')

  logout(){
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('pswd');
    this.router.navigateByUrl('/login');
    this.toaster.success('logout successfully');

  }

}
