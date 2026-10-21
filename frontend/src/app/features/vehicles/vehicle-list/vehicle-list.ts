import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Paginator } from '../../../core/shared/paginator/paginator';
import { Vehicle } from '../../../core/models/vehicle';
import { VehicleService } from '../vehicle.service';

/**
 * Liste des vehicules : tableau, recherche et pagination.
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

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect((onCleanup) => {
      const subscription = this.vehicleService
        .list({ page: this.page(), size: this.size(), keyword: this.keyword() || undefined })
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

  onPageChange(page: number): void {
    this.page.set(page);
  }

  onSizeChange(size: number): void {
    this.size.set(size);
    this.page.set(0);
  }
}
