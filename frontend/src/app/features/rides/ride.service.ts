import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../../core/models/page';
import { Candidate, Ride, RideRequest, RideStatus } from '../../core/models/ride';

export interface RideQuery {
  page?: number;
  size?: number;
  keyword?: string;
  status?: RideStatus;
}

/**
 * Service d'acces a l'API REST des courses (/api/rides).
 */
@Injectable({ providedIn: 'root' })
export class RideService {
  private readonly http = inject(HttpClient);

  /** Liste paginee des courses, avec recherche et filtre de statut optionnels. */
  list(query: RideQuery = {}): Observable<Page<Ride>> {
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

    return this.http.get<Page<Ride>>('/api/rides', { params });
  }

  /** Courses en attente d'affectation. */
  waiting(): Observable<Ride[]> {
    return this.http.get<Ride[]>('/api/rides/waiting');
  }

  /** Recupere une course par son identifiant. */
  get(id: number): Observable<Ride> {
    return this.http.get<Ride>(`/api/rides/${id}`);
  }

  /** Chauffeurs candidats pour l'affectation d'une course. */
  candidates(id: number): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`/api/rides/${id}/candidates`);
  }

  /** Cree une course. */
  create(request: RideRequest): Observable<Ride> {
    return this.http.post<Ride>('/api/rides', request);
  }

  /**
   * Affecte une course.
   * Sans corps : affectation automatique au meilleur chauffeur.
   * Avec un corps : chauffeur (et vehicule) imposes.
   */
  assign(id: number, driverId?: number, vehicleId?: number): Observable<Ride> {
    if (driverId === undefined) {
      return this.http.post<Ride>(`/api/rides/${id}/assign`, null);
    }
    return this.http.post<Ride>(`/api/rides/${id}/assign`, { driverId, vehicleId });
  }

  /** Demarre la course. */
  start(id: number): Observable<Ride> {
    return this.http.post<Ride>(`/api/rides/${id}/start`, null);
  }

  /** Termine la course. */
  complete(id: number): Observable<Ride> {
    return this.http.post<Ride>(`/api/rides/${id}/complete`, null);
  }

  /** Annule la course. */
  cancel(id: number, reason?: string): Observable<Ride> {
    return this.http.post<Ride>(`/api/rides/${id}/cancel`, { reason });
  }
}
