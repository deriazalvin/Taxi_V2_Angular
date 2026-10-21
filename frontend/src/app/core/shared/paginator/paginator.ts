import { Component, computed, input, output } from '@angular/core';

/**
 * Paginateur reutilisable : page courante, taille de page, nombre total d'elements.
 */
@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss',
})
export class Paginator {
  /** Page affichée (index base 0). */
  readonly page = input.required<number>();

  /** Nombre total d'éléments. */
  readonly total = input.required<number>();

  /** Taille de la page. */
  readonly size = input.required<number>();

  /** Émis lorsque l'utilisateur change de page. */
  readonly pageChange = output<number>();

  /** Émis lorsque l'utilisateur change la taille de la page. */
  readonly sizeChange = output<number>();

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.size())));

  readonly from = computed(() => (this.total() === 0 ? 0 : this.page() * this.size() + 1));

  readonly to = computed(() => Math.min((this.page() + 1) * this.size(), this.total()));

  readonly canPrevious = computed(() => this.page() > 0);

  readonly canNext = computed(() => this.page() + 1 < this.totalPages());

  readonly pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i));

  previous(): void {
    if (this.canPrevious()) {
      this.pageChange.emit(this.page() - 1);
    }
  }

  next(): void {
    if (this.canNext()) {
      this.pageChange.emit(this.page() + 1);
    }
  }

  goTo(page: number): void {
    if (page >= 0 && page < this.totalPages() && page !== this.page()) {
      this.pageChange.emit(page);
    }
  }

  onSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.sizeChange.emit(value);
  }
}
