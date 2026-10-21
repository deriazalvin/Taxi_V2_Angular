import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../core/models/page';
import { Vehicle, VehicleRequest, VehicleStatus } from '../../core/models/vehicle';

export interface VehicleQuery {
  page?: number;
  size?: number;
  keyword?: string;
  status?: VehicleStatus;
}

/**
 * Service d'acces a l'API REST des vehicules (/api/vehicles).
 */
@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly http = inject(HttpClient);

  /** Liste paginee des vehicules, avec recherche et filtre de statut optionnels. */
  list(query: VehicleQuery = {}): Observable<Page<Vehicle>> {
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

    return this.http.get<Page<Vehicle>>('/api/vehicles', { params });
  }

  /** Vehicules actuellement disponibles. */
  available(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('/api/vehicles/available');
  }

  /** Recupere un vehicule par son identifiant. */
  get(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`/api/vehicles/${id}`);
  }

  /** Cree un vehicule. */
  create(request: VehicleRequest): Observable<Vehicle> {
    return this.http.post<Vehicle>('/api/vehicles', request);
  }

  /** Met a jour un vehicule. */
  update(id: number, request: VehicleRequest): Observable<Vehicle> {
    return this.http.put<Vehicle>(`/api/vehicles/${id}`, request);
  }

  /** Change le statut d'un vehicule (le corps de la requete est le statut brut). */
  updateStatus(id: number, status: VehicleStatus): Observable<Vehicle> {
    return this.http.patch<Vehicle>(`/api/vehicles/${id}/status`, status);
  }

  /** Supprime un vehicule. */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`/api/vehicles/${id}`);
  }
}
