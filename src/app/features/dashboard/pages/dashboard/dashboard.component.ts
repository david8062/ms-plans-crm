import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroCurrencyDollar, heroArrowTrendingUp, heroUserGroup,
  heroArrowTrendingDown, heroClock,
} from '@ng-icons/heroicons/outline';
import { AnalyticsService } from '../../services/analytics.service';
import { RevenueMetrics } from '../../models/revenue-metrics.model';

interface StatCard {
  label: string;
  valueKey: keyof RevenueMetrics;
  icon: string;
  format: 'currency' | 'percent' | 'number';
  color: string;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgIconComponent, CurrencyPipe],
  providers: [provideIcons({ heroCurrencyDollar, heroArrowTrendingUp, heroUserGroup, heroArrowTrendingDown, heroClock })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>Resumen de revenue y métricas clave</p>
      </div>
    </div>

    @if (loading()) {
      <p class="loading-text">Cargando métricas...</p>
    } @else if (metrics()) {
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-card__icon" style="background: #dbeafe;">
            <ng-icon name="heroCurrencyDollar" size="22" style="color:#2563eb" />
          </div>
          <div class="metric-card__body">
            <span class="metric-card__label">MRR</span>
            <span class="metric-card__value">{{ metrics()!.mrr | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
            <span class="metric-card__desc">Ingresos mensuales recurrentes</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-card__icon" style="background: #d1fae5;">
            <ng-icon name="heroArrowTrendingUp" size="22" style="color:#059669" />
          </div>
          <div class="metric-card__body">
            <span class="metric-card__label">ARR</span>
            <span class="metric-card__value">{{ metrics()!.arr | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
            <span class="metric-card__desc">Ingresos anuales proyectados</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-card__icon" style="background: #ede9fe;">
            <ng-icon name="heroUserGroup" size="22" style="color:#7c3aed" />
          </div>
          <div class="metric-card__body">
            <span class="metric-card__label">LTV Promedio</span>
            <span class="metric-card__value">{{ metrics()!.avgLtv | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
            <span class="metric-card__desc">Valor de vida promedio por cliente</span>
          </div>
        </div>

        <div class="metric-card" [class.metric-card--danger]="metrics()!.churnRate > 5">
          <div class="metric-card__icon" style="background: #fee2e2;">
            <ng-icon name="heroArrowTrendingDown" size="22" style="color:#dc2626" />
          </div>
          <div class="metric-card__body">
            <span class="metric-card__label">Churn rate</span>
            <span class="metric-card__value">{{ metrics()!.churnRate }}%</span>
            <span class="metric-card__desc">Cancelaciones en los últimos 30 días</span>
          </div>
        </div>
      </div>

      <div class="counts-row">
        <div class="count-chip count-chip--active">
          <strong>{{ metrics()!.totalActive }}</strong> activas
        </div>
        <div class="count-chip count-chip--trial">
          <ng-icon name="heroClock" size="14" />
          <strong>{{ metrics()!.totalTrial }}</strong> en prueba
        </div>
        <div class="count-chip count-chip--cancelled">
          <strong>{{ metrics()!.totalCancelled }}</strong> canceladas
        </div>
      </div>
    }
  `,
  styles: [`
    @use 'variables' as *;

    .loading-text { color: $color-muted-fg; padding: $spacing-8 0; }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: $spacing-4;
      margin-bottom: $spacing-6;
    }

    .metric-card {
      background: $color-card;
      border: 1px solid $color-border;
      border-radius: $radius-lg;
      padding: $spacing-5;
      display: flex;
      gap: $spacing-4;
      align-items: flex-start;

      &--danger { border-color: hsl(0, 84%, 80%); }

      &__icon {
        width: 44px; height: 44px; border-radius: $radius-md;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }

      &__body {
        display: flex; flex-direction: column; gap: 2px;
      }

      &__label {
        font-size: $font-size-xs; font-weight: $font-weight-semibold;
        text-transform: uppercase; letter-spacing: 0.05em; color: $color-muted-fg;
      }

      &__value {
        font-size: 1.5rem; font-weight: $font-weight-bold; line-height: 1.2;
        color: $color-foreground;
      }

      &__desc {
        font-size: $font-size-xs; color: $color-muted-fg; margin-top: 2px;
      }
    }

    .counts-row {
      display: flex; gap: $spacing-3; flex-wrap: wrap;
    }

    .count-chip {
      display: inline-flex; align-items: center; gap: $spacing-1;
      padding: $spacing-2 $spacing-4;
      border-radius: $radius-xl;
      font-size: $font-size-sm;

      strong { font-weight: $font-weight-semibold; }

      &--active   { background: $status-active-bg;    color: $status-active-text; }
      &--trial    { background: hsl(43, 100%, 93%);   color: hsl(32, 95%, 35%); }
      &--cancelled { background: $status-cancelled-bg; color: $status-cancelled-text; }
    }
  `],
})
export class DashboardComponent implements OnInit {
  private readonly analyticsSvc = inject(AnalyticsService);
  private readonly destroyRef   = inject(DestroyRef);

  readonly loading = signal(true);
  readonly metrics = signal<RevenueMetrics | null>(null);

  ngOnInit(): void {
    this.analyticsSvc.getRevenue()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => { this.metrics.set(data); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
  }
}
