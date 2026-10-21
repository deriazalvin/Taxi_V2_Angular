import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivityStats, RevenueStats } from '../../core/models/statistics';
import { StatsService } from '../statistics/stats.service';

/**
 * Tableau de bord : indicateurs cles de l'activite recente.
 */
@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly statsService = inject(StatsService);

  readonly revenue = signal<RevenueStats | null>(null);
  readonly activity = signal<ActivityStats | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);


  constructor() {
    this.load();
  }

  private load(): void {
    this.statsService.revenue().subscribe({
      next: (revenue) => {
        this.revenue.set(revenue);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les statistiques.');
        this.loading.set(false);
      },
    });

    this.statsService.activity().subscribe({
      next: (activity) => this.activity.set(activity),
      error: () => this.error.set('Impossible de charger les statistiques.'),
    });
  }
}
