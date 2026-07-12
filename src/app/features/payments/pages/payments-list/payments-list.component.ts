import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlusCircle, heroCreditCard } from '@ng-icons/heroicons/outline';
import { PaymentsService } from '../../services/payments.service';
import { Payment } from '../../models/payment.model';
import { ToastService } from '@shared/components/toast/toast.service';
import { ModalService } from '@shared/components/modal/modal.service';
import { PaymentModalComponent } from '../../components/payment-modal/payment-modal.component';

@Component({
  selector: 'app-payments-list',
  standalone: true,
  imports: [CommonModule, NgIconComponent, PaymentModalComponent],
  providers: [provideIcons({ heroPlusCircle, heroCreditCard })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './payments-list.component.html',
  styleUrl: './payments-list.component.scss',
})
export class PaymentsListComponent implements OnInit {
  private readonly svc       = inject(PaymentsService);
  private readonly toast     = inject(ToastService);
  private readonly modal     = inject(ModalService);
  private readonly destroyRef = inject(DestroyRef);

  readonly items    = signal<Payment[]>([]);
  readonly loading  = signal(true);
  readonly showModal = signal(false);
  page = 0; size = 20;
  totalPages = 0; totalElements = 0;

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.svc.getAll(this.page, this.size).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: r => {
        this.items.set(r.content);
        this.totalElements = r.totalElements;
        this.totalPages = r.totalPages;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSaved(): void { this.showModal.set(false); this.page = 0; this.load(); }

  markFailed(p: Payment): void {
    this.modal.confirm('Marcar como fallido', `¿Marcar pago de ${p.amount} ${p.currency} como fallido?`).then(ok => {
      if (!ok) return;
      this.svc.markFailed(p.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => { this.toast.success('Pago marcado como fallido'); this.load(); },
      });
    });
  }

  refund(p: Payment): void {
    this.modal.confirm('Reembolsar pago', `¿Reembolsar ${p.amount} ${p.currency}?`).then(ok => {
      if (!ok) return;
      this.svc.refund(p.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => { this.toast.success('Pago reembolsado'); this.load(); },
      });
    });
  }

  prevPage(): void { if (this.page > 0) { this.page--; this.load(); } }
  nextPage(): void { if (this.page < this.totalPages - 1) { this.page++; this.load(); } }

  statusClass(s: string): string {
    return { PAID: 'badge-active', PENDING: 'badge-pending', FAILED: 'badge-cancelled', REFUNDED: 'badge-suspended' }[s] ?? '';
  }
  statusLabel(s: string): string {
    return { PAID: 'Pagado', PENDING: 'Pendiente', FAILED: 'Fallido', REFUNDED: 'Reembolsado' }[s] ?? s;
  }
}
