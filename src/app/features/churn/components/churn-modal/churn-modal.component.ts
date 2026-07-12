import { Component, Input, Output, EventEmitter, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { ChurnService } from '../../services/churn.service';
import { Churn, ChurnRequest, ChurnReason } from '../../models/churn.model';
import { ToastService } from '@shared/components/toast/toast.service';

@Component({
  selector: 'app-churn-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [provideIcons({ heroXMark })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-backdrop" (click)="cancelled.emit()"></div>
    <div class="modal-dialog">
      <div class="modal-dialog__header">
        <h2>{{ churn ? 'Editar churn' : 'Registrar churn' }}</h2>
        <button (click)="cancelled.emit()"><ng-icon name="heroXMark" size="20" /></button>
      </div>
      <div class="modal-dialog__body">
        <div class="form-group">
          <label>Tenant ID *</label>
          <input type="text" [(ngModel)]="tenantId" placeholder="UUID" />
        </div>
        <div class="form-group">
          <label>Nombre del tenant</label>
          <input type="text" [(ngModel)]="tenantName" placeholder="Ej: Estudio Jurídico..." />
        </div>
        <div class="form-group">
          <label>Plan</label>
          <input type="text" [(ngModel)]="planName" placeholder="Ej: Profesional" />
        </div>
        <div class="form-group">
          <label>Razón *</label>
          <select [(ngModel)]="churnReason">
            <option value="PRICE_TOO_HIGH">Precio muy alto</option>
            <option value="MISSING_FEATURES">Funciones faltantes</option>
            <option value="SWITCHED_TO_COMPETITOR">Cambio a competidor</option>
            <option value="NOT_USING_PRODUCT">No usa el producto</option>
            <option value="TECHNICAL_ISSUES">Problemas técnicos</option>
            <option value="BUSINESS_CLOSED">Negocio cerrado</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>
        <div class="form-group">
          <label>Fecha de churn *</label>
          <input type="date" [(ngModel)]="churnedAt" />
        </div>
        <div class="form-group">
          <label>MRR perdido (COP)</label>
          <input type="number" [(ngModel)]="mrrLost" min="0" placeholder="0" />
        </div>
        <div class="form-group">
          <label>Notas del cliente</label>
          <textarea [(ngModel)]="churnNotes" placeholder="Qué dijo el cliente..."></textarea>
        </div>
        <div class="form-group">
          <label>Notas internas</label>
          <textarea [(ngModel)]="internalNotes" placeholder="Notas internas..."></textarea>
        </div>
      </div>
      <div class="modal-dialog__footer">
        <button class="btn btn-ghost" (click)="cancelled.emit()">Cancelar</button>
        <button class="btn btn-primary" (click)="save()" [disabled]="saving() || !tenantId || !churnedAt">
          {{ saving() ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    @use 'variables' as *;
    .modal-backdrop { position:fixed;inset:0;background:rgb(0 0 0/.4);z-index:$z-modal-backdrop; }
    .modal-dialog {
      position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
      background:$color-card;border-radius:$radius-xl;width:480px;z-index:$z-modal;
      box-shadow:0 24px 48px rgb(0 0 0/.16); max-height:90vh; display:flex; flex-direction:column;
      &__header { display:flex;align-items:center;justify-content:space-between;padding:$spacing-5 $spacing-6;border-bottom:1px solid $color-border;flex-shrink:0;
        h2 { font-size:$font-size-lg;font-weight:$font-weight-semibold; }
        button { background:none;border:none;color:$color-muted-fg;cursor:pointer;line-height:0; }
      }
      &__body { padding:$spacing-5 $spacing-6;display:flex;flex-direction:column;gap:$spacing-4;overflow-y:auto; }
      &__footer { display:flex;justify-content:flex-end;gap:$spacing-3;padding:$spacing-4 $spacing-6;border-top:1px solid $color-border;flex-shrink:0; }
    }
  `],
})
export class ChurnModalComponent implements OnInit {
  @Input() churn: Churn | null = null;
  @Output() saved    = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly svc       = inject(ChurnService);
  private readonly toast     = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly saving = signal(false);

  tenantId = ''; tenantName = ''; planName = '';
  churnReason: ChurnReason = 'OTHER'; churnedAt = '';
  mrrLost = 0; churnNotes = ''; internalNotes = '';

  ngOnInit(): void {
    if (this.churn) {
      this.tenantId     = this.churn.tenantId;
      this.tenantName   = this.churn.tenantName ?? '';
      this.planName     = this.churn.planName ?? '';
      this.churnReason  = this.churn.churnReason;
      this.churnedAt    = this.churn.churnedAt?.split('T')[0] ?? '';
      this.mrrLost      = this.churn.mrrLost ?? 0;
      this.churnNotes   = this.churn.churnNotes ?? '';
      this.internalNotes = this.churn.internalNotes ?? '';
    }
  }

  save(): void {
    this.saving.set(true);
    const body: ChurnRequest = {
      tenantId: this.tenantId, tenantName: this.tenantName || undefined,
      planName: this.planName || undefined, churnReason: this.churnReason,
      churnedAt: new Date(this.churnedAt).toISOString(),
      mrrLost: this.mrrLost || undefined, currency: 'COP',
      churnNotes: this.churnNotes || undefined,
      internalNotes: this.internalNotes || undefined,
    };
    const op$ = this.churn
      ? this.svc.update(this.churn.id, body)
      : this.svc.register(body);

    op$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.toast.success('Churn guardado'); this.saved.emit(); },
      error: () => this.saving.set(false),
    });
  }
}
