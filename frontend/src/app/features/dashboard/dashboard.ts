import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivityStats, RevenueStats } from '../../core/models/statistics';
import { BarChart, BarChartItem } from '../../core/shared/bar-chart/bar-chart';
import { StatsService } from '../statistics/stats.service';

/**
 * Tableau de bord : indicateurs cles de l'activite recente.
 */
@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, RouterLink, BarChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly statsService = inject(StatsService);

  readonly revenue = signal<RevenueStats | null>(null);
  readonly activity = signal<ActivityStats | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  /** Chiffre d'affaires quotidien, prete pour le graphique. */
  readonly revenueByDay = computed<BarChartItem[]>(() =>
    (this.revenue()?.byDay ?? []).map((day) => ({
      label: day.date,
      value: day.revenue,
      hint: day.rideCount + ' course(s)',
    })),
  );

  /** Nombre de courses par jour, prete pour le graphique. */
  readonly ridesByDay = computed<BarChartItem[]>(() =>
    (this.activity()?.byDay ?? []).map((day) => ({
      label: day.date,
      value: day.rideCount,
      hint: day.cancelledCount + ' annulation(s)',
    })),
  );

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
