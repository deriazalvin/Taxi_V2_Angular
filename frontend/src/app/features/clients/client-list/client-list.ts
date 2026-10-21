import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Client } from '../../../core/models/client';
import { Paginator } from '../../../core/shared/paginator/paginator';
import { ClientService } from '../client.service';

/**
 * Liste des clients : tableau, recherche et pagination.
 */
@Component({
  selector: 'app-client-list',
  imports: [RouterLink, Paginator],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})
export class ClientList {
  private readonly clientService = inject(ClientService);

  /** Clients de la page courante. */
  readonly clients = signal<Client[]>([]);

  /** Nombre total de clients correspondant a la recherche. */
  readonly total = signal(0);

  /** Page courante (index base 0). */
  readonly page = signal(0);

  /** Taille de la page. */
  readonly size = signal(10);

  /** Recherche en cours. */
  readonly keyword = signal('');

  /** Recherche saisie dans le champ (non encore appliquee). */
  readonly searchInput = signal('');

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect((onCleanup) => {
      const subscription = this.clientService
        .list({ page: this.page(), size: this.size(), keyword: this.keyword() || undefined })
        .subscribe({
          next: (result) => {
            this.clients.set(result.content);
            this.total.set(result.totalElements);
            this.loading.set(false);
          },
          error: () => {
            this.clients.set([]);
            this.total.set(0);
            this.loading.set(false);
            this.error.set('Impossible de charger la liste des clients.');
          },
        });

      onCleanup(() => subscription.unsubscribe());
    });
  }

  /** Applique la recherche saisie (avec un léger délai). */
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

  /** Vide la recherche. */
  clearSearch(): void {
    this.searchInput.set('');
    this.keyword.set('');
    this.page.set(0);
  }

  /** Change de page. */
  onPageChange(page: number): void {
    this.page.set(page);
  }

  /** Change la taille de la page. */
  onSizeChange(size: number): void {
    this.size.set(size);
    this.page.set(0);
  }
}
