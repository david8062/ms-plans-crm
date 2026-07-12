import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroPlusCircle, heroPencilSquare, heroTrash, heroCheckCircle,
  heroXCircle, heroDocumentText,
} from '@ng-icons/heroicons/outline';
import { PlansService } from '../../services/plans.service';
import { Plan } from '../../models/plan.model';
import { ToastService } from '@shared/components/toast/toast.service';
import { ModalService } from '@shared/components/modal/modal.service';
import { PlanModalComponent } from '../../components/plan-modal/plan-modal.component';

@Component({
  selector: 'app-plans-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent, PlanModalComponent],
  providers: [provideIcons({ heroPlusCircle, heroPencilSquare, heroTrash, heroCheckCircle, heroXCircle, heroDocumentText })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plans-list.component.html',
  styleUrl: './plans-list.component.scss',
})
export class PlansListComponent implements OnInit {
  private readonly plansService = inject(PlansService);
  private readonly toast        = inject(ToastService);
  private readonly modal        = inject(ModalService);
  private readonly destroyRef   = inject(DestroyRef);

  readonly plans    = signal<Plan[]>([]);
  readonly loading  = signal(true);
  readonly showModal = signal(false);
  readonly editingPlan = signal<Plan | null>(null);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.plansService.getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => { this.plans.set(data); this.loading.set(false); },
        error: () => this.loading.set(false),
      });
  }

  openCreate(): void { this.editingPlan.set(null); this.showModal.set(true); }
  openEdit(plan: Plan): void { this.editingPlan.set(plan); this.showModal.set(true); }
  closeModal(): void { this.showModal.set(false); }

  onSaved(): void { this.closeModal(); this.load(); }

  deactivate(plan: Plan): void {
    this.modal.confirm('Desactivar plan', `¿Desactivar "${plan.name}"? Los precios y features se eliminan.`).then(ok => {
      if (!ok) return;
      this.plansService.deactivate(plan.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => { this.toast.success('Plan desactivado'); this.load(); },
      });
    });
  }
}
