import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _counter = 0;
  readonly toasts = signal<Toast[]>([]);

  show(type: ToastType, message: string, durationMs = 4000): void {
    const id = ++this._counter;
    this.toasts.update(t => [...t, { id, type, message }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }

  success(message: string): void { this.show('success', message); }
  error(message: string): void   { this.show('error', message); }
  warning(message: string): void { this.show('warning', message); }
  info(message: string): void    { this.show('info', message); }

  dismiss(id: number): void {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }
}
