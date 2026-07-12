import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ModalComponent } from './shared/components/modal/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ToastComponent, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app-shell" [class.app-shell--no-sidebar]="isLoginPage">
      @if (!isLoginPage) {
        <app-sidebar />
      }
      <main class="app-main">
        <router-outlet />
      </main>
    </div>
    <app-toast />
    <app-modal />
  `,
  styles: [`
    @use 'variables' as *;
    .app-shell {
      display: flex; min-height: 100vh;
      &--no-sidebar .app-main { margin-left: 0; }
    }
    .app-main {
      flex: 1;
      margin-left: $sidebar-width;
      padding: $spacing-8;
      min-height: 100vh;
      background: $color-background;
    }
  `],
})
export class App {
  private readonly router = inject(Router);
  isLoginPage = false;

  constructor() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.isLoginPage = (e.urlAfterRedirects as string).startsWith('/login');
    });
  }
}
