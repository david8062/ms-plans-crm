import { Component, Input, Output, EventEmitter, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark, heroPlusCircle, heroTrash } from '@ng-icons/heroicons/outline';
import { PlansService } from '../../services/plans.service';
import { Plan, PlanRequest, PlanPriceRequest, PlanFeatureRequest, BillingCycle } from '../../models/plan.model';
import { ToastService } from '@shared/components/toast/toast.service';

@Component({
  selector: 'app-plan-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent],
  providers: [provideIcons({ heroXMark, heroPlusCircle, heroTrash })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plan-modal.component.html',
  styleUrl: './plan-modal.component.scss',
})
export class PlanModalComponent implements OnInit {
  @Input() plan: Plan | null = null;
  @Output() saved    = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private readonly plansService = inject(PlansService);
  private readonly toast        = inject(ToastService);
  private readonly destroyRef   = inject(DestroyRef);

  readonly saving = signal(false);
  readonly activeTab = signal<'info' | 'prices' | 'features'>('info');

  // Form fields
  name = ''; description = ''; slug = ''; displayOrder = 0;
  trialDays: number | null = null;
  graceDays: number | null = null;
  maxUsers: number | null = null;
  maxCases: number | null = null;
  maxStorageGb: number | null = null;
  maxAiTokensMonthly: number | null = null;

  // Inline price form
  newPriceCycle: BillingCycle = 'MONTHLY';
  newPriceBase = 0;
  newPriceDiscount = 0;

  // Inline feature form
  newFeatureKey = ''; newFeatureLabel = ''; newFeatureValue = '';

  get title(): string { return this.plan ? 'Editar plan' : 'Nuevo plan'; }

  ngOnInit(): void {
    if (this.plan) {
      this.name         = this.plan.name;
      this.description  = this.plan.description ?? '';
      this.slug         = this.plan.slug;
      this.displayOrder = this.plan.displayOrder;
      this.trialDays    = this.plan.trialDays ?? null;
      this.graceDays    = this.plan.graceDays ?? null;
      this.maxUsers     = this.plan.maxUsers ?? null;
      this.maxCases     = this.plan.maxCases ?? null;
      this.maxStorageGb = this.plan.maxStorageGb ?? null;
      this.maxAiTokensMonthly = this.plan.maxAiTokensMonthly ?? null;
    }
  }

  savePlan(): void {
    if (!this.name || !this.slug) return;
    this.saving.set(true);
    const body: PlanRequest = {
      name: this.name, description: this.description, slug: this.slug, displayOrder: this.displayOrder,
      trialDays: this.trialDays ?? undefined,
      graceDays: this.graceDays ?? undefined,
      maxUsers: this.maxUsers ?? undefined,
      maxCases: this.maxCases ?? undefined,
      maxStorageGb: this.maxStorageGb ?? undefined,
      maxAiTokensMonthly: this.maxAiTokensMonthly ?? undefined,
    };

    const op$ = this.plan
      ? this.plansService.update(this.plan.id, body)
      : this.plansService.create(body);

    op$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.toast.success('Plan guardado'); this.saved.emit(); },
      error: () => this.saving.set(false),
    });
  }

  addPrice(): void {
    if (!this.plan || !this.newPriceBase) return;
    const body: PlanPriceRequest = {
      billingCycle: this.newPriceCycle,
      basePrice: this.newPriceBase,
      discountPercent: this.newPriceDiscount,
    };
    this.plansService.addPrice(this.plan.id, body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: updated => {
          this.plan = updated;
          this.newPriceBase = 0; this.newPriceDiscount = 0;
          this.toast.success('Precio agregado');
        },
      });
  }

  addFeature(): void {
    if (!this.plan || !this.newFeatureKey || !this.newFeatureLabel) return;
    const body: PlanFeatureRequest = {
      featureKey:   this.newFeatureKey,
      featureLabel: this.newFeatureLabel,
      featureValue: this.newFeatureValue || '0',
      featureType:  'NUMERIC',
      label:        this.newFeatureLabel,
    } as any;
    this.plansService.addFeature(this.plan.id, body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: updated => {
          this.plan = updated;
          this.newFeatureKey = ''; this.newFeatureLabel = ''; this.newFeatureValue = '';
          this.toast.success('Feature agregado');
        },
      });
  }

  deleteFeature(featureId: string): void {
    if (!this.plan) return;
    this.plansService.deleteFeature(this.plan.id, featureId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          if (this.plan) {
            this.plan = { ...this.plan, features: this.plan.features.filter(f => f.id !== featureId) };
          }
          this.toast.success('Feature eliminado');
        },
      });
  }
}
