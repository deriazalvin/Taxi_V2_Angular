import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Paginator } from '../../../core/shared/paginator/paginator';
import { Vehicle, VehicleStatus, VEHICLE_STATUSES, VEHICLE_STATUS_LABELS } from '../../../core/models/vehicle';
import { VehicleService } from '../vehicle.service';

/**
 * Liste des vehicules : tableau, recherche, filtre de statut et pagination.
 */
@Component({
  selector: 'app-vehicle-list',
  imports: [RouterLink, Paginator],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.scss',
})
export class VehicleList {
  private readonly vehicleService = inject(VehicleService);

  readonly vehicles = signal<Vehicle[]>([]);
  readonly total = signal(0);
  readonly page = signal(0);
  readonly size = signal(10);
  readonly keyword = signal('');
  readonly searchInput = signal('');
  readonly statusFilter = signal<VehicleStatus | ''>('');

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly statuses = VEHICLE_STATUSES;
  readonly statusLabels = VEHICLE_STATUS_LABELS;

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect((onCleanup) => {
      const subscription = this.vehicleService
        .list({
          page: this.page(),
          size: this.size(),
          keyword: this.keyword() || undefined,
          status: this.statusFilter() || undefined,
        })
        .subscribe({
          next: (result) => {
            this.vehicles.set(result.content);
            this.total.set(result.totalElements);
            this.loading.set(false);
          },
          error: () => {
            this.vehicles.set([]);
            this.total.set(0);
            this.loading.set(false);
            this.error.set('Impossible de charger la liste des vehicules.');
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

  onStatusChange(value: string): void {
    this.statusFilter.set(value as VehicleStatus | '');
    this.page.set(0);
  }

  onPageChange(page: number): void {
    this.page.set(page);
  }

  onSizeChange(size: number): void {
    this.size.set(size);
    this.page.set(0);
  }

  /** Change le statut d'un vehicule depuis la liste. */
  onStatusChangeFor(vehicle: Vehicle, event: Event): void {
    const status = (event.target as HTMLSelectElement).value as VehicleStatus;
    this.vehicleService.updateStatus(vehicle.id, status).subscribe({
      next: (updated) => {
        this.vehicles.update((list) => list.map((v) => (v.id === updated.id ? updated : v)));
      },
      error: () => this.error.set('Impossible de changer le statut du vehicule.'),
    });
  }

  /** Supprime un vehicule apres confirmation. */
  onDelete(vehicle: Vehicle): void {
    const confirmed = confirm(
      `Supprimer definitivement le vehicule "${vehicle.plateNumber}" ?\nCette action est irreversible.`,
    );
    if (!confirmed) {
      return;
    }

    this.vehicleService.delete(vehicle.id).subscribe({
      next: () => {
        if (this.vehicles().length === 1 && this.page() > 0) {
          this.page.set(this.page() - 1);
        } else {
          this.reload();
        }
      },
      error: () => this.error.set('Impossible de supprimer le vehicule.'),
    });
  }

  private reload(): void {
    this.vehicleService
      .list({
        page: this.page(),
        size: this.size(),
        keyword: this.keyword() || undefined,
        status: this.statusFilter() || undefined,
      })
      .subscribe({
        next: (result) => {
          this.vehicles.set(result.content);
          this.total.set(result.totalElements);
        },
        error: () => this.error.set('Impossible de charger la liste des vehicules.'),
      });
  }
}
