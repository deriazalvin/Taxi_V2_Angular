import { Component, effect, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Ride, RideStatus, RIDE_STATUSES, RIDE_STATUS_LABELS } from '../../../core/models/ride';
import { Paginator } from '../../../core/shared/paginator/paginator';
import { RideService } from '../ride.service';

/**
 * Liste des courses : tableau, recherche, filtre de statut et pagination.
 */
@Component({
  selector: 'app-ride-list',
  imports: [RouterLink, Paginator, DatePipe],
  templateUrl: './ride-list.html',
  styleUrl: './ride-list.scss',
})
export class RideList {
  private readonly rideService = inject(RideService);

  readonly rides = signal<Ride[]>([]);
  readonly total = signal(0);
  readonly page = signal(0);
  readonly size = signal(10);
  readonly keyword = signal('');
  readonly searchInput = signal('');
  readonly statusFilter = signal<RideStatus | ''>('');

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly statuses = RIDE_STATUSES;
  readonly statusLabels = RIDE_STATUS_LABELS;

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect((onCleanup) => {
      const subscription = this.rideService
        .list({
          page: this.page(),
          size: this.size(),
          keyword: this.keyword() || undefined,
          status: this.statusFilter() || undefined,
        })
        .subscribe({
          next: (result) => {
            this.rides.set(result.content);
            this.total.set(result.totalElements);
            this.loading.set(false);
          },
          error: () => {
            this.rides.set([]);
            this.total.set(0);
            this.loading.set(false);
            this.error.set('Impossible de charger la liste des courses.');
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
    this.statusFilter.set(value as RideStatus | '');
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
