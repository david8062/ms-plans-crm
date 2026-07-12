import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroPlusCircle, heroCheckCircle, heroPauseCircle, heroXCircle, heroChartBar, heroArrowPath, heroPuzzlePiece, heroClock,
} from '@ng-icons/heroicons/outline';
import { SubscriptionsService } from '../../services/subscriptions.service';
import { Subscription } from '../../models/subscription.model';
import { ToastService } from '@shared/components/toast/toast.service';
import { ModalService } from '@shared/components/modal/modal.service';
import { SubscriptionModalComponent } from '../../components/subscription-modal/subscription-modal.component';
import { SubscriptionModulesModalComponent } from '../../components/subscription-modules-modal/subscription-modules-modal.component';

@Component({
  selector: 'app-subscriptions-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent, SubscriptionModalComponent, SubscriptionModulesModalComponent],
  providers: [provideIcons({ heroPlusCircle, heroCheckCircle, heroPauseCircle, heroXCircle, heroChartBar, heroArrowPath, heroPuzzlePiece, heroClock })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './subscriptions-list.component.html',
  styleUrl: './subscriptions-list.component.scss',
})
export class SubscriptionsListComponent implements OnInit {
  private readonly svc       = inject(SubscriptionsService);
  private readonly toast     = inject(ToastService);
  private readonly modal     = inject(ModalService);
  private readonly destroyRef = inject(DestroyRef);

  readonly items    = signal<Subscription[]>([]);
  readonly loading  = signal(true);
  readonly showModal = signal(false);
  readonly processingExpiration = signal(false);
  readonly showModulesModal = signal(false);
  readonly selectedSub = signal<Subscription | null>(null);
  page = 0; size = 20;
  totalElements = 0; totalPages = 0;

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
  openModules(sub: Subscription): void { this.selectedSub.set(sub); this.showModulesModal.set(true); }
  onModulesSaved(): void { this.load(); }

  activate(sub: Subscription): void {
    this.modal.confirm('Activar suscripción', `¿Activar suscripción del tenant ${sub.tenantId}?`).then(ok => {
      if (!ok) return;
      this.svc.activate(sub.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => { this.toast.success('Suscripción activada'); this.load(); },
      });
    });
  }

  suspend(sub: Subscription): void {
    this.modal.confirm('Suspender suscripción', `¿Suspender la suscripción del tenant ${sub.tenantId}?`).then(ok => {
      if (!ok) return;
      this.svc.suspend(sub.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => { this.toast.success('Suscripción suspendida'); this.load(); },
      });
    });
  }

  cancel(sub: Subscription): void {
    this.modal.confirm('Cancelar suscripción', `¿Cancelar definitivamente la suscripción de ${sub.planName}?`).then(ok => {
      if (!ok) return;
      this.svc.cancel(sub.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => { this.toast.success('Suscripción cancelada'); this.load(); },
      });
    });
  }

  convertTrial(sub: Subscription): void {
    this.modal.confirm('Convertir a activa', `¿Convertir la prueba de ${sub.planName} a suscripción activa?`).then(ok => {
      if (!ok) return;
      this.svc.convertTrial(sub.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => { this.toast.success('Suscripción activada'); this.load(); },
      });
    });
  }

  runExpiration(): void {
    this.modal.confirm('Procesar vencimientos',
      'Se vencerán trials/periodos cumplidos (→ Vencida) y se suspenderán las que agotaron su gracia. ¿Continuar?').then(ok => {
      if (!ok) return;
      this.processingExpiration.set(true);
      this.svc.runExpiration().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: n => {
          this.toast.success(n > 0 ? `${n} suscripción(es) actualizada(s)` : 'Sin cambios pendientes');
          this.processingExpiration.set(false);
          this.load();
        },
        error: () => this.processingExpiration.set(false),
      });
    });
  }

  /** Puede reactivarse (volver a ACTIVE) desde estos estados. */
  canActivate(status: string): boolean {
    return status === 'PENDING' || status === 'PAST_DUE' || status === 'SUSPENDED';
  }

  prevPage(): void { if (this.page > 0) { this.page--; this.load(); } }
  nextPage(): void { if (this.page < this.totalPages - 1) { this.page++; this.load(); } }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      ACTIVE: 'badge-active', PENDING: 'badge-pending', TRIAL: 'badge-trial',
      SUSPENDED: 'badge-suspended', CANCELLED: 'badge-cancelled', PAST_DUE: 'badge-past-due',
    };
    return map[status] ?? '';
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      ACTIVE: 'Activa', PENDING: 'Pendiente', TRIAL: 'Prueba',
      SUSPENDED: 'Suspendida', CANCELLED: 'Cancelada', PAST_DUE: 'Vencida',
    };
    return map[status] ?? status;
  }
}
