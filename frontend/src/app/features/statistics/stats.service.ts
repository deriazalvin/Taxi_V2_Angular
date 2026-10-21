import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityStats, RevenueStats } from '../../core/models/statistics';

export interface StatsRange {
  from?: string;
  to?: string;
}

/**
 * Service d'acces a l'API REST des statistiques (/api/statistics).
 */
@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly http = inject(HttpClient);

  /** Chiffre d'affaires sur la periode demandee. */
  revenue(range: StatsRange = {}): Observable<RevenueStats> {
    return this.http.get<RevenueStats>('/api/statistics/revenue', {
      params: this.buildParams(range),
    });
  }

  /** Activite (courses, annulations, distance) sur la periode demandee. */
  activity(range: StatsRange = {}): Observable<ActivityStats> {
    return this.http.get<ActivityStats>('/api/statistics/activity', {
      params: this.buildParams(range),
    });
  }

  private buildParams(range: StatsRange): HttpParams {
    let params = new HttpParams();

    if (range.from) {
      params = params.set('from', range.from);
    }

    if (range.to) {
      params = params.set('to', range.to);
    }

    return params;
  }
}
