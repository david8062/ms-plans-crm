import { Component, Input, Output, EventEmitter, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark, heroPlusCircle, heroTrash } from '@ng-icons/heroicons/outline';
import { ModulesService } from '../../../modules/services/modules.service';
import { Module, SubscriptionModule, AddModuleRequest, BillingCycle } from '../../../modules/models/module.model';
import { ToastService } from '@shared/components/toast/toast.service';
import { ModalService } from '@shared/components/modal/modal.service';
import { Subscription } from '../../models/subscription.model';

@Component({
  selector: 'app-subscription-modules-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [provideIcons({ heroXMark, heroPlusCircle, heroTrash })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-backdrop" (click)="cancelled.emit()"></div>
    <div class="modal-panel">
      <div class="modal-panel__header">
        <div>
          <h2>Módulos de la suscripción</h2>
          <p class="sub-label">{{ sub.planName }} · {{ sub.tenantId }}</p>
        </div>
        <button (click)="cancelled.emit()"><ng-icon name="heroXMark" size="20" /></button>
      </div>

      <div class="modal-panel__body">
        <!-- Módulos activos -->
        <div class="section-label">Módulos activos</div>
        @if (activeModules().length === 0) {
          <p class="empty-msg">Ningún módulo activo. Agrega uno abajo.</p>
        }
        @for (sm of activeModules(); track sm.id) {
          <div class="module-row">
            <div class="module-row__info">
              <span class="module-row__name">{{ sm.moduleName }}</span>
              <span class="module-row__price">
                {{ sm.price | number:'1.0-0' }} {{ sm.currency }}
                / {{ sm.billingCycle === 'MONTHLY' ? 'mes' : 'año' }}
              </span>
            </div>
            <button class="action-btn danger" (click)="remove(sm)">
              <ng-icon name="heroTrash" size="13" /> Quitar
            </button>
          </div>
        }

        <!-- Agregar módulo -->
        <div class="section-label mt">Agregar módulo</div>
        @if (availableToAdd().length === 0) {
          <p class="empty-msg">Todos los módulos disponibles ya están activos.</p>
        } @else {
          <div class="add-form">
            <select [(ngModel)]="selectedSlug">
              <option value="">Seleccionar módulo...</option>
              @for (m of availableToAdd(); track m.slug) {
                <option [value]="m.slug">
                  {{ m.name }} · {{ m.priceMonthly | number:'1.0-0' }}/mes
                </option>
              }
            </select>
            <select [(ngModel)]="selectedCycle">
              <option value="MONTHLY">Mensual</option>
              <option value="ANNUAL">Anual</option>
            </select>
            <button class="btn btn-primary btn-sm" (click)="add()" [disabled]="!selectedSlug || adding()">
              <ng-icon name="heroPlusCircle" size="14" />
              {{ adding() ? '...' : 'Agregar' }}
            </button>
          </div>
        }

        <!-- Resumen de costo adicional -->
        @if (activeModules().length > 0) {
          <div class="cost-summary">
            <span>Costo adicional mensual</span>
            <strong>{{ totalMonthlyCost() | number:'1.0-0' }} COP/mes</strong>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @use 'variables' as *;
    .modal-backdrop { position:fixed;inset:0;background:rgb(0 0 0/.4);z-index:$z-modal-backdrop; }
    .modal-panel {
      position: fixed; top: 0; right: 0; height: 100vh; width: 500px;
      background: $color-card; z-index: $z-modal;
      display: flex; flex-direction: column;
      box-shadow: -4px 0 24px rgb(0 0 0/.12);

      &__header {
        display: flex; align-items: flex-start; justify-content: space-between;
        padding: $spacing-5 $spacing-6; border-bottom: 1px solid $color-border;
        h2 { font-size: $font-size-lg; font-weight: $font-weight-semibold; }
        button { background: none; border: none; color: $color-muted-fg; cursor: pointer; line-height: 0; flex-shrink: 0; }
      }
      &__body {
        flex: 1; overflow-y: auto; padding: $spacing-5 $spacing-6;
        display: flex; flex-direction: column; gap: $spacing-4;
      }
    }
    .sub-label { font-size: $font-size-xs; color: $color-muted-fg; font-family: monospace; }
    .section-label {
      font-size: $font-size-xs; font-weight: $font-weight-semibold;
      text-transform: uppercase; letter-spacing: 0.05em; color: $color-muted-fg;
      &.mt { margin-top: $spacing-2; }
    }
    .module-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: $spacing-3 $spacing-4; background: $color-muted; border-radius: $radius-md;
      &__info { display: flex; flex-direction: column; gap: 2px; }
      &__name { font-size: $font-size-sm; font-weight: $font-weight-medium; }
      &__price { font-size: $font-size-xs; color: $color-muted-fg; }
    }
    .add-form {
      display: flex; gap: $spacing-2; align-items: center; flex-wrap: wrap;
      select { flex: 1; min-width: 150px; padding: $spacing-2 $spacing-3;
        border: 1px solid $color-border; border-radius: $radius-md; font-size: $font-size-sm; }
    }
    .empty-msg { font-size: $font-size-sm; color: $color-muted-fg; }
    .cost-summary {
      display: flex; justify-content: space-between; align-items: center;
      padding: $spacing-3 $spacing-4; background: $color-muted; border-radius: $radius-md;
      font-size: $font-size-sm;
      strong { font-weight: $font-weight-semibold; color: $color-primary-fg; background: $color-primary; padding: 2px $spacing-3; border-radius: $radius-md; }
    }
  `],
})
export class SubscriptionModulesModalComponent implements OnInit {
  @Input({ required: true }) sub!: Subscription;
  @Output() saved     = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly svc        = inject(ModulesService);
  private readonly toast      = inject(ToastService);
  private readonly modal      = inject(ModalService);
  private readonly destroyRef = inject(DestroyRef);

  readonly activeModules  = signal<SubscriptionModule[]>([]);
  readonly allModules     = signal<Module[]>([]);
  readonly adding         = signal(false);

  selectedSlug = '';
  selectedCycle: BillingCycle = 'MONTHLY';

  ngOnInit(): void {
    this.loadModules();
    this.loadActive();
  }

  private loadActive(): void {
    this.svc.getSubscriptionModules(this.sub.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.activeModules.set(data.filter(m => m.status === 'ACTIVE')));
  }

  private loadModules(): void {
    this.svc.getAllActive()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.allModules.set(data));
  }

  availableToAdd(): Module[] {
    const activeSlugs = new Set(this.activeModules().map(m => m.moduleSlug));
    return this.allModules().filter(m => !activeSlugs.has(m.slug));
  }

  totalMonthlyCost(): number {
    return this.activeModules().reduce((sum, sm) => {
      const price = sm.billingCycle === 'MONTHLY' ? sm.price : sm.price / 12;
      return sum + price;
    }, 0);
  }

  add(): void {
    if (!this.selectedSlug) return;
    this.adding.set(true);
    const body: AddModuleRequest = { moduleSlug: this.selectedSlug, billingCycle: this.selectedCycle };
    this.svc.addToSubscription(this.sub.id, body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.success('Módulo agregado');
          this.selectedSlug = '';
          this.adding.set(false);
          this.loadActive();
          this.saved.emit();
        },
        error: () => this.adding.set(false),
      });
  }

  remove(sm: SubscriptionModule): void {
    this.modal.confirm('Quitar módulo', `¿Quitar "${sm.moduleName}" de esta suscripción?`).then(ok => {
      if (!ok) return;
      this.svc.removeFromSubscription(this.sub.id, sm.moduleSlug)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toast.success('Módulo removido');
            this.loadActive();
            this.saved.emit();
          },
        });
    });
  }
}
