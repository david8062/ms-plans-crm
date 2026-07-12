import { Injectable, signal } from '@angular/core';

export interface ModalConfig {
  title: string;
  message?: string;
  type: 'confirm' | 'info';
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  readonly config = signal<ModalConfig | null>(null);

  confirm(title: string, message: string): Promise<boolean> {
    return new Promise(resolve => {
      this.config.set({
        title, message, type: 'confirm',
        onConfirm: () => { this.close(); resolve(true); },
        onCancel:  () => { this.close(); resolve(false); },
      });
    });
  }

  close(): void { this.config.set(null); }
}
