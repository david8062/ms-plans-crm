import { Component, Input, Output, EventEmitter, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark } from '@ng-icons/heroicons/outline';
import { ModulesService } from '../../services/modules.service';
import { Module, ModuleRequest } from '../../models/module.model';
import { ToastService } from '@shared/components/toast/toast.service';

@Component({
  selector: 'app-module-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [provideIcons({ heroXMark })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-backdrop" (click)="cancelled.emit()"></div>
    <div class="modal-dialog">
      <div class="modal-dialog__header">
        <h2>{{ module ? 'Editar módulo' : 'Nuevo módulo' }}</h2>
        <button (click)="cancelled.emit()"><ng-icon name="heroXMark" size="20" /></button>
      </div>
      <div class="modal-dialog__body">
        <div class="form-group">
          <label>Nombre *</label>
          <input type="text" [(ngModel)]="name" placeholder="Ej: Facturación Electrónica" />
        </div>
        <div class="form-group">
          <label>Slug * <span class="hint">(identificador único, sin espacios)</span></label>
          <input type="text" [(ngModel)]="slug" placeholder="Ej: facturacion_electronica" [disabled]="!!module" />
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <textarea [(ngModel)]="description" placeholder="¿Qué incluye este módulo?"></textarea>
        </div>
        <div class="prices-row">
          <div class="form-group">
            <label>Precio mensual (COP)</label>
            <input type="number" [(ngModel)]="priceMonthly" min="0" />
          </div>
          <div class="form-group">
            <label>Precio anual (COP)</label>
            <input type="number" [(ngModel)]="priceAnnual" min="0" />
          </div>
        </div>
      </div>
      <div class="modal-dialog__footer">
        <button class="btn btn-ghost" (click)="cancelled.emit()">Cancelar</button>
        <button class="btn btn-primary" (click)="save()" [disabled]="saving() || !name || !slug">
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
      box-shadow:0 24px 48px rgb(0 0 0/.16);
      &__header { display:flex;align-items:center;justify-content:space-between;padding:$spacing-5 $spacing-6;border-bottom:1px solid $color-border;
        h2 { font-size:$font-size-lg;font-weight:$font-weight-semibold; }
        button { background:none;border:none;color:$color-muted-fg;cursor:pointer;line-height:0; }
      }
      &__body { padding:$spacing-5 $spacing-6;display:flex;flex-direction:column;gap:$spacing-4; }
      &__footer { display:flex;justify-content:flex-end;gap:$spacing-3;padding:$spacing-4 $spacing-6;border-top:1px solid $color-border; }
    }
    .prices-row { display: grid; grid-template-columns: 1fr 1fr; gap: $spacing-3; }
    .hint { font-size: $font-size-xs; color: $color-muted-fg; font-weight: $font-weight-normal; }
  `],
})
export class ModuleModalComponent implements OnInit {
  @Input() module: Module | null = null;
  @Output() saved     = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly svc        = inject(ModulesService);
  private readonly toast      = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly saving = signal(false);

  name = ''; slug = ''; description = '';
  priceMonthly = 0; priceAnnual = 0;

  ngOnInit(): void {
    if (this.module) {
      this.name         = this.module.name;
      this.slug         = this.module.slug;
      this.description  = this.module.description ?? '';
      this.priceMonthly = this.module.priceMonthly;
      this.priceAnnual  = this.module.priceAnnual;
    }
  }

  save(): void {
    if (!this.name || !this.slug) return;
    this.saving.set(true);
    const body: ModuleRequest = {
      name: this.name, slug: this.slug, description: this.description,
      priceMonthly: this.priceMonthly, priceAnnual: this.priceAnnual,
    };
    const op$ = this.module
      ? this.svc.update(this.module.id, body)
      : this.svc.create(body);

    op$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.toast.success('Módulo guardado'); this.saved.emit(); },
      error: () => this.saving.set(false),
    });
  }
}
