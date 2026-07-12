import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroCheckCircle, heroXCircle, heroExclamationTriangle, heroInformationCircle, heroXMark,
} from '@ng-icons/heroicons/outline';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ heroCheckCircle, heroXCircle, heroExclamationTriangle, heroInformationCircle, heroXMark })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-container">
      @for (t of toastService.toasts(); track t.id) {
        <div class="toast toast--{{ t.type }}">
          <ng-icon [name]="iconFor(t.type)" size="18" />
          <span>{{ t.message }}</span>
          <button class="toast__close" (click)="toastService.dismiss(t.id)">
            <ng-icon name="heroXMark" size="16" />
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @use 'variables' as *;
    .toast-container {
      position: fixed; bottom: $spacing-6; right: $spacing-6;
      display: flex; flex-direction: column; gap: $spacing-2;
      z-index: $z-toast; pointer-events: none;
    }
    .toast {
      display: flex; align-items: center; gap: $spacing-3;
      padding: $spacing-3 $spacing-4;
      border-radius: $radius-lg; background: $color-card;
      box-shadow: $shadow-md; border: 1px solid $color-border;
      font-size: $font-size-sm; pointer-events: all;
      min-width: 280px; max-width: 380px;

      &--success { border-left: 4px solid $color-success; ng-icon { color: $color-success; } }
      &--error   { border-left: 4px solid $color-destructive; ng-icon { color: $color-destructive; } }
      &--warning { border-left: 4px solid $color-warning; ng-icon { color: $color-warning; } }
      &--info    { border-left: 4px solid $color-info; ng-icon { color: $color-info; } }

      span { flex: 1; }
    }
    .toast__close {
      background: none; border: none; padding: 0; line-height: 0;
      color: $color-muted-fg; cursor: pointer;
      &:hover { color: $color-foreground; }
    }
  `],
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  iconFor(type: string): string {
    const map: Record<string, string> = {
      success: 'heroCheckCircle',
      error:   'heroXCircle',
      warning: 'heroExclamationTriangle',
      info:    'heroInformationCircle',
    };
    return map[type] ?? 'heroInformationCircle';
  }
}
