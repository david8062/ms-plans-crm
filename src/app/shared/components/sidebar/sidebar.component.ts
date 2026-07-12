import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroChartBar, heroDocumentText, heroCreditCard, heroArrowTrendingDown,
  heroArrowRightOnRectangle, heroCurrencyDollar, heroPuzzlePiece,
} from '@ng-icons/heroicons/outline';

interface NavItem { label: string; route: string; icon: string; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgIconComponent],
  providers: [provideIcons({ heroChartBar, heroDocumentText, heroCreditCard, heroArrowTrendingDown, heroArrowRightOnRectangle, heroCurrencyDollar, heroPuzzlePiece })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="sidebar">
      <div class="sidebar__brand">
        <span class="sidebar__logo">IusCloud</span>
        <span class="sidebar__badge">CRM</span>
      </div>
      <ul class="sidebar__nav">
        @for (item of navItems; track item.route) {
          <li>
            <a class="sidebar__link"
               [routerLink]="item.route"
               routerLinkActive="sidebar__link--active">
              <ng-icon [name]="item.icon" size="18" />
              {{ item.label }}
            </a>
          </li>
        }
      </ul>
      <button class="sidebar__logout" (click)="logout()">
        <ng-icon name="heroArrowRightOnRectangle" size="16" />
        Cerrar sesión
      </button>
    </nav>
  `,
  styles: [`
    @use 'variables' as *;
    .sidebar {
      width: $sidebar-width; height: 100vh; position: fixed; left: 0; top: 0;
      background: $color-primary; color: #fff;
      display: flex; flex-direction: column;
      padding: $spacing-4 0;

      &__brand {
        display: flex; align-items: center; gap: $spacing-2;
        padding: $spacing-3 $spacing-5 $spacing-6;
      }
      &__logo { font-size: $font-size-lg; font-weight: $font-weight-bold; }
      &__badge {
        font-size: $font-size-xs; font-weight: $font-weight-semibold;
        padding: 2px 6px; border-radius: $radius-sm;
        background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.8);
      }
      &__nav { list-style: none; flex: 1; overflow-y: auto; }
      &__link {
        display: flex; align-items: center; gap: $spacing-3;
        padding: $spacing-3 $spacing-5;
        color: rgba(255,255,255,0.7); font-size: $font-size-sm;
        font-weight: $font-weight-medium; border-radius: 0;
        transition: background $transition-fast, color $transition-fast;

        &:hover { background: rgba(255,255,255,0.08); color: #fff; }
        &--active { background: rgba(255,255,255,0.12); color: #fff; }
      }
      &__logout {
        display: flex; align-items: center; gap: $spacing-2;
        padding: $spacing-3 $spacing-5; margin-top: auto;
        background: none; border: none; color: rgba(255,255,255,0.55);
        font-size: $font-size-sm; cursor: pointer;
        transition: color $transition-fast;
        &:hover { color: rgba(255,255,255,0.9); }
      }
    }
  `],
})
export class SidebarComponent {
  private readonly router = inject(Router);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard',      route: '/dashboard',     icon: 'heroChartBar' },
    { label: 'Planes',         route: '/plans',         icon: 'heroDocumentText' },
    { label: 'Módulos',        route: '/modules',       icon: 'heroPuzzlePiece' },
    { label: 'Suscripciones',  route: '/subscriptions', icon: 'heroCurrencyDollar' },
    { label: 'Pagos',          route: '/payments',      icon: 'heroCreditCard' },
    { label: 'Churn',          route: '/churn',         icon: 'heroArrowTrendingDown' },
  ];

  logout(): void {
    localStorage.removeItem('crm_token');
    this.router.navigate(['/login']);
  }
}
