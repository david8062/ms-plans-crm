import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroPlusCircle, heroPencilSquare, heroTrash } from '@ng-icons/heroicons/outline';
import { ModulesService } from '../../services/modules.service';
import { Module } from '../../models/module.model';
import { ToastService } from '@shared/components/toast/toast.service';
import { ModalService } from '@shared/components/modal/modal.service';
import { ModuleModalComponent } from '../../components/module-modal/module-modal.component';

@Component({
  selector: 'app-modules-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconComponent, ModuleModalComponent],
  providers: [provideIcons({ heroPlusCircle, heroPencilSquare, heroTrash })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page-header">
      <div>
        <h1>Módulos</h1>
        <p>Catálogo de módulos add-on disponibles para los planes</p>
      </div>
      <button class="btn btn-primary" (click)="openCreate()">
        <ng-icon name="heroPlusCircle" size="16" /> Nuevo módulo
      </button>
    </div>

    @if (loading()) {
      <p style="color:#888; padding:2rem 0">Cargando...</p>
    } @else {
      <div class="modules-grid">
        @if (modules().length === 0) {
          <div class="empty-state">
            <p>Sin módulos. Crea el primero.</p>
          </div>
        }
        @for (m of modules(); track m.id) {
          <div class="module-card" [class.module-card--inactive]="!m.isActive">
            <div class="module-card__head">
              <span class="module-card__name">{{ m.name }}</span>
              <span class="module-card__slug">{{ m.slug }}</span>
            </div>
            @if (m.description) {
              <p class="module-card__desc">{{ m.description }}</p>
            }
            <div class="module-card__prices">
              <div class="price-row">
                <span>Mensual</span>
                <strong>{{ m.priceMonthly | number:'1.0-0' }} {{ m.currency }}</strong>
              </div>
              <div class="price-row">
                <span>Anual</span>
                <strong>{{ m.priceAnnual | number:'1.0-0' }} {{ m.currency }}</strong>
              </div>
            </div>
            <div class="module-card__actions">
              <button class="action-btn" (click)="openEdit(m)">
                <ng-icon name="heroPencilSquare" size="14" /> Editar
              </button>
              @if (m.isActive) {
                <button class="action-btn danger" (click)="deactivate(m)">
                  <ng-icon name="heroTrash" size="14" /> Desactivar
                </button>
              }
            </div>
          </div>
        }
      </div>
    }

    @if (showModal()) {
      <app-module-modal
        [module]="editingModule()"
        (saved)="onSaved()"
        (cancelled)="showModal.set(false)" />
    }
  `,
  styles: [`
    @use 'variables' as *;
    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: $spacing-4;
    }
    .module-card {
      background: $color-card; border: 1px solid $color-border;
      border-radius: $radius-lg; padding: $spacing-5;
      display: flex; flex-direction: column; gap: $spacing-3;
      &--inactive { opacity: 0.55; }

      &__head { display: flex; flex-direction: column; gap: 2px; }
      &__name { font-weight: $font-weight-semibold; font-size: $font-size-base; }
      &__slug {
        font-size: $font-size-xs; color: $color-muted-fg;
        font-family: monospace;
      }
      &__desc { font-size: $font-size-sm; color: $color-muted-fg; }
      &__prices {
        background: $color-muted; border-radius: $radius-md;
        padding: $spacing-3; display: flex; flex-direction: column; gap: $spacing-1;
      }
      &__actions { display: flex; gap: $spacing-2; margin-top: auto; }
    }
    .price-row {
      display: flex; justify-content: space-between;
      font-size: $font-size-sm;
      span { color: $color-muted-fg; }
    }
  `],
})
export class ModulesListComponent implements OnInit {
  private readonly svc        = inject(ModulesService);
  private readonly toast      = inject(ToastService);
  private readonly modal      = inject(ModalService);
  private readonly destroyRef = inject(DestroyRef);

  readonly modules      = signal<Module[]>([]);
  readonly loading      = signal(true);
  readonly showModal    = signal(false);
  readonly editingModule = signal<Module | null>(null);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.svc.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: data => { this.modules.set(data); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  openCreate(): void { this.editingModule.set(null); this.showModal.set(true); }
  openEdit(m: Module): void { this.editingModule.set(m); this.showModal.set(true); }
  onSaved(): void { this.showModal.set(false); this.load(); }

  deactivate(m: Module): void {
    this.modal.confirm('Desactivar módulo', `¿Desactivar "${m.name}"? Los tenants que lo tienen seguirán activos hasta que cancelen.`).then(ok => {
      if (!ok) return;
      this.svc.deactivate(m.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => { this.toast.success('Módulo desactivado'); this.load(); },
      });
    });
  }
}
