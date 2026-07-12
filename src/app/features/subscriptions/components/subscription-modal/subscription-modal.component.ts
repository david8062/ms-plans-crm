import { Component, Output, EventEmitter, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { SubscriptionsService } from '../../services/subscriptions.service';
import { SubscriptionRequest, BillingCycle } from '../../models/subscription.model';
import { PlansService } from '../../../plans/services/plans.service';
import { Plan } from '../../../plans/models/plan.model';
import { ToastService } from '@shared/components/toast/toast.service';

@Component({
  selector: 'app-subscription-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [provideIcons({ heroXMark })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-backdrop" (click)="cancelled.emit()"></div>
    <div class="modal-dialog">
      <div class="modal-dialog__header">
        <h2>Nueva suscripción</h2>
        <button (click)="cancelled.emit()"><ng-icon name="heroXMark" size="20" /></button>
      </div>
      <div class="modal-dialog__body">
        <div class="form-group">
          <label>Tenant ID *</label>
          <input type="text" [(ngModel)]="tenantId" placeholder="UUID del tenant" />
        </div>
        <div class="form-group">
          <label>Plan *</label>
          <select [(ngModel)]="planId">
            <option value="">Seleccionar plan...</option>
            @for (p of plans(); track p.id) {
              <option [value]="p.id">{{ p.name }}</option>
            }
          </select>
        </div>
        <div class="form-group">
          <label>Ciclo de facturación *</label>
          <select [(ngModel)]="billingCycle">
            <option value="MONTHLY">Mensual</option>
            <option value="ANNUAL">Anual</option>
          </select>
        </div>
        <div class="form-group">
          <label>Notas</label>
          <textarea [(ngModel)]="notes" placeholder="Notas internas..."></textarea>
        </div>
        @if (selectedPlanHasTrial()) {
          <label class="trial-check">
            <input type="checkbox" [(ngModel)]="startAsTrial" />
            Iniciar como período de prueba
            <span class="trial-days">({{ selectedPlanTrialDays() }} días gratis)</span>
          </label>
        }
      </div>
      <div class="modal-dialog__footer">
        <button class="btn btn-ghost" (click)="cancelled.emit()">Cancelar</button>
        <button class="btn btn-primary" (click)="save()"
                [disabled]="saving() || !tenantId || !planId">
          {{ saving() ? 'Creando...' : 'Crear suscripción' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    @use 'variables' as *;
    .modal-backdrop { position:fixed;inset:0;background:rgb(0 0 0/.4);z-index:$z-modal-backdrop; }
    .modal-dialog {
      position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
      background:$color-card;border-radius:$radius-xl;width:460px;z-index:$z-modal;
      box-shadow:0 24px 48px rgb(0 0 0/.16);
      &__header { display:flex;align-items:center;justify-content:space-between;padding:$spacing-5 $spacing-6;border-bottom:1px solid $color-border;
        h2 { font-size:$font-size-lg;font-weight:$font-weight-semibold; }
        button { background:none;border:none;color:$color-muted-fg;cursor:pointer;line-height:0; }
      }
      &__body { padding:$spacing-5 $spacing-6;display:flex;flex-direction:column;gap:$spacing-4; }
      &__footer { display:flex;justify-content:flex-end;gap:$spacing-3;padding:$spacing-4 $spacing-6;border-top:1px solid $color-border; }
    }
    .trial-check {
      display: flex; align-items: center; gap: $spacing-2;
      font-size: $font-size-sm; cursor: pointer;
      input { width: auto; cursor: pointer; }
    }
    .trial-days { color: hsl(32, 95%, 35%); font-weight: $font-weight-semibold; }
  `],
})
export class SubscriptionModalComponent implements OnInit {
  @Output() saved    = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly svc        = inject(SubscriptionsService);
  private readonly plansService = inject(PlansService);
  private readonly toast      = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly saving  = signal(false);
  readonly plans   = signal<Plan[]>([]);

  tenantId = ''; planId = ''; billingCycle: BillingCycle = 'MONTHLY'; notes = '';
  startAsTrial = false;

  selectedPlanHasTrial(): boolean {
    const p = this.plans().find(x => x.id === this.planId);
    return !!(p?.trialDays && p.trialDays > 0);
  }

  selectedPlanTrialDays(): number {
    return this.plans().find(x => x.id === this.planId)?.trialDays ?? 0;
  }

  ngOnInit(): void {
    this.plansService.getAll().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(p => this.plans.set(p));
  }

  save(): void {
    if (!this.tenantId || !this.planId) return;
    this.saving.set(true);
    const body: SubscriptionRequest = {
      tenantId: this.tenantId, planId: this.planId,
      billingCycle: this.billingCycle, notes: this.notes,
      startAsTrial: this.startAsTrial,
    };
    this.svc.create(body).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.toast.success('Suscripción creada'); this.saved.emit(); },
      error: () => this.saving.set(false),
    });
  }
}
