import { Component, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Ride, RIDE_STATUS_LABELS } from '../../../core/models/ride';
import { RideService } from '../ride.service';

/**
 * Detail d'une course : informations de la course.
 */
@Component({
  selector: 'app-ride-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './ride-detail.html',
  styleUrl: './ride-detail.scss',
})
export class RideDetail {
  private readonly rideService = inject(RideService);

  /** Identifiant de la course affichee. */
  readonly rideId = input.required<number>();

  readonly ride = signal<Ride | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly statusLabels = RIDE_STATUS_LABELS;

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.rideService.get(this.rideId()).subscribe({
      next: (ride) => {
        this.ride.set(ride);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Course introuvable.');
        this.loading.set(false);
      },
    });
  }
}
