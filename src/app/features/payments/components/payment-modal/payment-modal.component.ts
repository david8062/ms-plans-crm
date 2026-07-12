import { Component, Output, EventEmitter, inject, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { PaymentsService } from '../../services/payments.service';
import { PaymentRequest, PaymentGateway } from '../../models/payment.model';
import { ToastService } from '@shared/components/toast/toast.service';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [provideIcons({ heroXMark })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-backdrop" (click)="cancelled.emit()"></div>
    <div class="modal-dialog">
      <div class="modal-dialog__header">
        <h2>Registrar pago</h2>
        <button (click)="cancelled.emit()"><ng-icon name="heroXMark" size="20" /></button>
      </div>
      <div class="modal-dialog__body">
        <div class="form-group">
          <label>Tenant ID *</label>
          <input type="text" [(ngModel)]="tenantId" placeholder="UUID" />
        </div>
        <div class="form-group">
          <label>Suscripción ID *</label>
          <input type="text" [(ngModel)]="subscriptionId" placeholder="UUID" />
        </div>
        <div class="form-group">
          <label>Monto *</label>
          <input type="number" [(ngModel)]="amount" min="0" placeholder="0" />
        </div>
        <div class="form-group">
          <label>Moneda</label>
          <input type="text" [(ngModel)]="currency" placeholder="COP" />
        </div>
        <div class="form-group">
          <label>Gateway *</label>
          <select [(ngModel)]="gateway">
            <option value="MANUAL">MANUAL</option>
            <option value="STRIPE">STRIPE</option>
            <option value="MERCADO_PAGO">MERCADO_PAGO</option>
            <option value="ONE_PAY">ONE_PAY</option>
          </select>
        </div>
        <div class="form-group">
          <label>ID transacción gateway</label>
          <input type="text" [(ngModel)]="gatewayTransactionId" placeholder="Opcional" />
        </div>
        <div class="form-group">
          <label>Notas</label>
          <textarea [(ngModel)]="notes"></textarea>
        </div>
      </div>
      <div class="modal-dialog__footer">
        <button class="btn btn-ghost" (click)="cancelled.emit()">Cancelar</button>
        <button class="btn btn-primary" (click)="save()" [disabled]="saving() || !tenantId || !subscriptionId || !amount">
          {{ saving() ? 'Guardando...' : 'Registrar' }}
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
      box-shadow:0 24px 48px rgb(0 0 0/.16); max-height:90vh; overflow-y:auto;
      &__header { display:flex;align-items:center;justify-content:space-between;padding:$spacing-5 $spacing-6;border-bottom:1px solid $color-border;
        h2 { font-size:$font-size-lg;font-weight:$font-weight-semibold; }
        button { background:none;border:none;color:$color-muted-fg;cursor:pointer;line-height:0; }
      }
      &__body { padding:$spacing-5 $spacing-6;display:flex;flex-direction:column;gap:$spacing-4; }
      &__footer { display:flex;justify-content:flex-end;gap:$spacing-3;padding:$spacing-4 $spacing-6;border-top:1px solid $color-border; }
    }
  `],
})
export class PaymentModalComponent {
  @Output() saved    = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly svc       = inject(PaymentsService);
  private readonly toast     = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly saving = signal(false);

  tenantId = ''; subscriptionId = ''; amount = 0; currency = 'COP';
  gateway: PaymentGateway = 'MANUAL'; gatewayTransactionId = ''; notes = '';

  save(): void {
    this.saving.set(true);
    const body: PaymentRequest = {
      tenantId: this.tenantId, subscriptionId: this.subscriptionId,
      amount: this.amount, currency: this.currency, gateway: this.gateway,
      gatewayTransactionId: this.gatewayTransactionId || undefined,
      notes: this.notes || undefined,
    };
    this.svc.record(body).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.toast.success('Pago registrado'); this.saved.emit(); },
      error: () => this.saving.set(false),
    });
  }
}
