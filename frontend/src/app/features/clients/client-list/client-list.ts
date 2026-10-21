import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Client } from '../../../core/models/client';
import { ClientService } from '../client.service';

/**
 * Liste des clients.
 */
@Component({
  selector: 'app-client-list',
  imports: [RouterLink],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})
export class ClientList {
  private readonly clientService = inject(ClientService);

  /** Clients de la page courante. */
  readonly clients = signal<Client[]>([]);

  /** Nombre total de clients. */
  readonly total = signal(0);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    effect((onCleanup) => {
      const subscription = this.clientService.list({ page: 0, size: 10 }).subscribe({
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
}
