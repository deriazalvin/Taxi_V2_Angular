import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppRole, AppUser, ScoreConfig, ScoreConfigRequest, UserRequest } from '../../core/models/admin';

/**
 * Service d'acces a l'API REST d'administration (/api/admin).
 */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  /** Liste des comptes utilisateurs. */
  users(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>('/api/admin/users');
  }

  /** Cree un compte utilisateur. */
  createUser(request: UserRequest): Observable<AppUser> {
    return this.http.post<AppUser>('/api/admin/users', request);
  }

  /** Change le role d'un compte (le corps de la requete est le role brut). */
  updateRole(id: number, role: AppRole): Observable<AppUser> {
    return this.http.patch<AppUser>(`/api/admin/users/${id}/role`, role);
  }

  /** Active ou desactive un compte. */
  setEnabled(id: number, enabled: boolean): Observable<AppUser> {
    return this.http.patch<AppUser>(`/api/admin/users/${id}/enabled`, { enabled });
  }

  /** Configuration actuelle du scoring. */
  scoreConfig(): Observable<ScoreConfig> {
    return this.http.get<ScoreConfig>('/api/admin/score-config');
  }

  /** Met a jour la configuration du scoring. */
  updateScoreConfig(request: ScoreConfigRequest): Observable<ScoreConfig> {
    return this.http.put<ScoreConfig>('/api/admin/score-config', request);
  }
}
