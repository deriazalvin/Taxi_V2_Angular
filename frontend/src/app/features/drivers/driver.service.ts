import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../core/models/page';
import { Driver, DriverRequest, DriverStatus } from '../../core/models/driver';

export interface DriverQuery {
  page?: number;
  size?: number;
  keyword?: string;
  status?: DriverStatus;
}

/**
 * Service d'acces a l'API REST des chauffeurs (/api/drivers).
 */
@Injectable({ providedIn: 'root' })
export class DriverService {
  private readonly http = inject(HttpClient);

  /** Liste paginee des chauffeurs, avec recherche et filtre de statut optionnels. */
  list(query: DriverQuery = {}): Observable<Page<Driver>> {
    let params = new HttpParams()
      .set('page', query.page ?? 0)
      .set('size', query.size ?? 10);

    const keyword = query.keyword?.trim();
    if (keyword) {
      params = params.set('keyword', keyword);
    }

    if (query.status) {
      params = params.set('status', query.status);
    }

    return this.http.get<Page<Driver>>('/api/drivers', { params });
  }

  /** Recupere un chauffeur par son identifiant. */
  get(id: number): Observable<Driver> {
    return this.http.get<Driver>(`/api/drivers/${id}`);
  }

  /** Cree un chauffeur. */
  create(request: DriverRequest): Observable<Driver> {
    return this.http.post<Driver>('/api/drivers', request);
  }

  /** Met a jour un chauffeur. */
  update(id: number, request: DriverRequest): Observable<Driver> {
    return this.http.put<Driver>(`/api/drivers/${id}`, request);
  }

  /** Change le statut d'un chauffeur (le corps de la requete est le statut brut). */
  updateStatus(id: number, status: DriverStatus): Observable<Driver> {
    return this.http.patch<Driver>(`/api/drivers/${id}/status`, status);
  }

  /** Supprime un chauffeur. */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/drivers/${id}`);
  }
}
