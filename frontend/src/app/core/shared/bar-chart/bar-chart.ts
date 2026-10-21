import { Component, computed, input } from '@angular/core';

export interface BarChartItem {
  label: string;
  value: number;
  hint?: string;
}

/**
 * Graphique en barres horizontal, dessine uniquement en CSS (pas de bibliotheque).
 */
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.scss',
})
export class BarChart {
  /** Donnees a representer. */
  readonly items = input.required<BarChartItem[]>();

  /** Suffixe affiche apres la valeur (ex: " EUR", " courses"). */
  readonly unit = input<string>('');

  /** Valeur maximale, utilisee pour normaliser la largeur des barres. */
  readonly max = computed(() =>
    Math.max(1, ...this.items().map((item) => Math.abs(item.value))),
  );

  /** Largeur de la barre, en pourcentage de la valeur maximale. */
  width(item: BarChartItem): number {
    return (Math.abs(item.value) / this.max()) * 100;
  }
}
