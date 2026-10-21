import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Driver, DriverStatus, DRIVER_STATUSES, DRIVER_STATUS_LABELS } from '../../../core/models/driver';
import { Paginator } from '../../../core/shared/paginator/paginator';
import { DriverService } from '../driver.service';

/**
 * Liste des chauffeurs : tableau, recherche, filtre de statut et pagination.
 */
@Component({
  selector: 'app-driver-list',
  imports: [RouterLink, Paginator],
  templateUrl: './driver-list.html',
  styleUrl: './driver-list.scss',
})
export class DriverList {
  private readonly driverService = inject(DriverService);

  readonly drivers = signal<Driver[]>([]);
  readonly total = signal(0);
  readonly page = signal(0);
  readonly size = signal(10);
  readonly keyword = signal('');
  readonly searchInput = signal('');
  readonly statusFilter = signal<DriverStatus | ''>('');

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly statuses = DRIVER_STATUSES;
  readonly statusLabels = DRIVER_STATUS_LABELS;

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect((onCleanup) => {
      const subscription = this.driverService
        .list({
          page: this.page(),
          size: this.size(),
          keyword: this.keyword() || undefined,
          status: this.statusFilter() || undefined,
        })
        .subscribe({
          next: (result) => {
            this.drivers.set(result.content);
            this.total.set(result.totalElements);
            this.loading.set(false);
          },
          error: () => {
            this.drivers.set([]);
            this.total.set(0);
            this.loading.set(false);
            this.error.set('Impossible de charger la liste des chauffeurs.');
          },
        });

      onCleanup(() => subscription.unsubscribe());
    });
  }

  onSearchInput(value: string): void {
    this.searchInput.set(value);

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      this.keyword.set(value);
      this.page.set(0);
    }, 300);
  }

  clearSearch(): void {
    this.searchInput.set('');
    this.keyword.set('');
    this.page.set(0);
  }

  onStatusFilterChange(value: string): void {
    this.statusFilter.set(value as DriverStatus | '');
    this.page.set(0);
  }

  onPageChange(page: number): void {
    this.page.set(page);
  }

  onSizeChange(size: number): void {
    this.size.set(size);
    this.page.set(0);
  }

  /** Change le statut d'un chauffeur depuis la liste. */
  onStatusChange(driver: Driver, event: Event): void {
    const status = (event.target as HTMLSelectElement).value as DriverStatus;
    this.driverService.updateStatus(driver.id, status).subscribe({
      next: (updated) => {
        this.drivers.update((list) => list.map((d) => (d.id === updated.id ? updated : d)));
      },
      error: () => this.error.set('Impossible de changer le statut du chauffeur.'),
    });
  }

  /** Supprime un chauffeur apres confirmation. */
  onDelete(driver: Driver): void {
    const confirmed = confirm(
      `Supprimer definitivement le chauffeur "${driver.firstName} ${driver.lastName}" ?\nCette action est irreversible.`,
    );
    if (!confirmed) {
      return;
    }

    this.driverService.delete(driver.id).subscribe({
      next: () => {
        if (this.drivers().length === 1 && this.page() > 0) {
          this.page.set(this.page() - 1);
        } else {
          this.reload();
        }
      },
      error: () => this.error.set('Impossible de supprimer le chauffeur.'),
    });
  }

  private reload(): void {
    this.driverService
      .list({
        page: this.page(),
        size: this.size(),
        keyword: this.keyword() || undefined,
        status: this.statusFilter() || undefined,
      })
      .subscribe({
        next: (result) => {
          this.drivers.set(result.content);
          this.total.set(result.totalElements);
        },
        error: () => this.error.set('Impossible de charger la liste des chauffeurs.'),
      });
  }
}
