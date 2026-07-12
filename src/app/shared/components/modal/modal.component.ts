import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroExclamationTriangle } from '@ng-icons/heroicons/outline';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ heroExclamationTriangle })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (modal.config(); as cfg) {
      <div class="backdrop" (click)="cfg.onCancel?.()"></div>
      <div class="dialog">
        <div class="dialog__icon">
          <ng-icon name="heroExclamationTriangle" size="28" />
        </div>
        <h3 class="dialog__title">{{ cfg.title }}</h3>
        @if (cfg.message) { <p class="dialog__msg">{{ cfg.message }}</p> }
        <div class="dialog__actions">
          <button class="btn btn-secondary" (click)="cfg.onCancel?.()">Cancelar</button>
          <button class="btn btn-danger" (click)="cfg.onConfirm?.()">Confirmar</button>
        </div>
      </div>
    }
  `,
  styles: [`
    @use 'variables' as *;
    .backdrop {
      position: fixed; inset: 0; background: rgb(0 0 0 / 0.4);
      z-index: $z-modal-backdrop;
    }
    .dialog {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%);
      background: $color-card; border-radius: $radius-xl;
      padding: $spacing-8; width: 380px;
      z-index: $z-modal; text-align: center;
      box-shadow: 0 24px 48px rgb(0 0 0 / 0.18);

      &__icon { color: $color-destructive; margin-bottom: $spacing-4; }
      &__title { font-size: $font-size-lg; font-weight: $font-weight-semibold; margin-bottom: $spacing-2; }
      &__msg { font-size: $font-size-sm; color: $color-muted-fg; margin-bottom: $spacing-6; }
      &__actions { display: flex; gap: $spacing-3; justify-content: center; }
    }
  `],
})
export class ModalComponent {
  readonly modal = inject(ModalService);
}
