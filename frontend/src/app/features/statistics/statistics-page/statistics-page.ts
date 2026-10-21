import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivityStats, RevenueStats } from '../../../core/models/statistics';
import { StatsService } from '../statistics/stats.service';

/**
 * Page statistiques : filtres de periode, indicateurs et repartitions.
 */
@Component({
  selector: 'app-statistics-page',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './statistics-page.html',
  styleUrl: './statistics-page.scss',
})
export class StatisticsPage {
  private readonly fb = inject(FormBuilder);
  private readonly statsService = inject(StatsService);

  readonly revenue = signal<RevenueStats | null>(null);
  readonly activity = signal<ActivityStats | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);


  readonly form = this.fb.nonNullable.group({
    from: [this.defaultFrom()],
    to: [this.defaultTo()],
  });

  constructor() {
    this.load();
  }

  /** Premier jour de la periode par defaut : il y a 30 jours. */
  private defaultFrom(): string {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return this.toIsoDate(date);
  }

  /** Dernier jour de la periode par defaut : aujourd'hui. */
  private defaultTo(): string {
    return this.toIsoDate(new Date());
  }

  private toIsoDate(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  /** Recharge les statistiques pour la periode saisie. */
  onSubmit(): void {
    this.load();
  }

  private load(): void {
    const { from, to } = this.form.getRawValue();
    const range = { from: from || undefined, to: to || undefined };

    this.loading.set(true);
    this.error.set(null);

    this.statsService.revenue(range).subscribe({
      next: (revenue) => {
        this.revenue.set(revenue);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les statistiques.');
        this.loading.set(false);
      },
    });

    this.statsService.activity(range).subscribe({
      next: (activity) => this.activity.set(activity),
      error: () => this.error.set('Impossible de charger les statistiques.'),
    });
  }
}
