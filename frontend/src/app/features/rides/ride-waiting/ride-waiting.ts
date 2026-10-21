import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Ride } from '../../../core/models/ride';
import { RideService } from '../ride.service';

/**
 * Courses en attente d'affectation.
 */
@Component({
  selector: 'app-ride-waiting',
  imports: [RouterLink, DatePipe],
  templateUrl: './ride-waiting.html',
  styleUrl: './ride-waiting.scss',
})
export class RideWaiting {
  private readonly rideService = inject(RideService);

  readonly rides = signal<Ride[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.load();
  }

  private load(): void {
    this.rideService.waiting().subscribe({
      next: (rides) => {
        this.rides.set(rides);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les courses en attente.');
        this.loading.set(false);
      },
    });
  }
}
