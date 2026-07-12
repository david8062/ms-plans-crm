import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlusCircle, heroArrowTrendingDown } from '@ng-icons/heroicons/outline';
import { ChurnService } from '../../services/churn.service';
import { Churn, ChurnSummary } from '../../models/churn.model';
import { ChurnModalComponent } from '../../components/churn-modal/churn-modal.component';

@Component({
  selector: 'app-churn-list',
  standalone: true,
  imports: [CommonModule, NgIconComponent, ChurnModalComponent],
  providers: [provideIcons({ heroPlusCircle, heroArrowTrendingDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './churn-list.component.html',
  styleUrl: './churn-list.component.scss',
})
export class ChurnListComponent implements OnInit {
  private readonly svc       = inject(ChurnService);
  private readonly destroyRef = inject(DestroyRef);

  readonly items    = signal<Churn[]>([]);
  readonly summary  = signal<ChurnSummary | null>(null);
  readonly loading  = signal(true);
  readonly showModal = signal(false);
  readonly editTarget = signal<Churn | null>(null);

  page = 0; size = 20;
  totalPages = 0; totalElements = 0;

  ngOnInit(): void { this.load(); this.loadSummary(); }

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

  loadSummary(): void {
    this.svc.getSummary().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(s => this.summary.set(s));
  }

  openCreate(): void { this.editTarget.set(null); this.showModal.set(true); }
  openEdit(c: Churn): void { this.editTarget.set(c); this.showModal.set(true); }

  onSaved(): void {
    this.showModal.set(false);
    this.page = 0;
    this.load();
    this.loadSummary();
  }

  prevPage(): void { if (this.page > 0) { this.page--; this.load(); } }
  nextPage(): void { if (this.page < this.totalPages - 1) { this.page++; this.load(); } }

  reasonLabel(r: string): string {
    const map: Record<string, string> = {
      PRICE_TOO_HIGH: 'Precio alto', MISSING_FEATURES: 'Funciones faltantes',
      SWITCHED_TO_COMPETITOR: 'Competidor', NOT_USING_PRODUCT: 'No lo usa',
      TECHNICAL_ISSUES: 'Problemas técnicos', BUSINESS_CLOSED: 'Negocio cerrado', OTHER: 'Otro',
    };
    return map[r] ?? r;
  }
}
