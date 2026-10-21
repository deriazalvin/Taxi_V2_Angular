import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, ClientRequest } from '../../core/models/client';
import { Page } from '../../core/models/page';

export interface ClientQuery {
  page?: number;
  size?: number;
  keyword?: string;
}

/**
 * Service d'acces a l'API REST des clients (/api/clients).
 */
@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly http = inject(HttpClient);

  /** Liste paginee des clients, avec recherche optionnelle. */
  list(query: ClientQuery = {}): Observable<Page<Client>> {
    let params = new HttpParams()
      .set('page', query.page ?? 0)
      .set('size', query.size ?? 10);

    const keyword = query.keyword?.trim();
    if (keyword) {
      params = params.set('keyword', keyword);
    }

    return this.http.get<Page<Client>>('/api/clients', { params });
  }

  /** Recupere un client par son identifiant. */
  get(id: number): Observable<Client> {
    return this.http.get<Client>(`/api/clients/${id}`);
  }

  /** Cree un client. */
  create(request: ClientRequest): Observable<Client> {
    return this.http.post<Client>('/api/clients', request);
  }

  /** Met a jour un client. */
  update(id: number, request: ClientRequest): Observable<Client> {
    return this.http.put<Client>(`/api/clients/${id}`, request);
  }

  /** Supprime un client. */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/clients/${id}`);
  }
}
