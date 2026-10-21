import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CurrentUser } from '../models/current-user';

/**
 * Service d'authentification HTTP Basic.
 *
 * Les identifiants sont conserves en memoire pour la session en cours.
 * La persistance (sessionStorage) est ajoutee dans une etape ulterieure.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly userSignal = signal<CurrentUser | null>(null);
  private credentials: { username: string; password: string } | null = null;

  /** Utilisateur authentifie, ou null si la session n'est pas ouverte. */
  readonly currentUser = this.userSignal.asReadonly();

  /** Vrai tant qu'un utilisateur est charge. */
  readonly isAuthenticated = computed(() => this.userSignal() !== null);

  /** Role de l'utilisateur authentifie (ex: ROLE_ADMIN), ou null. */
  readonly role = computed(() => this.userSignal()?.role ?? null);

  /** Vrai si l'utilisateur authentifie est administrateur. */
  readonly isAdmin = computed(() => this.role() === 'ROLE_ADMIN');

  /**
   * Authentifie l'utilisateur via l'API et memorise les identifiants.
   * @throws si les identifiants sont invalides (401 renvoye par l'API).
   */
  async login(username: string, password: string): Promise<CurrentUser> {
    const user = await firstValueFrom(
      this.http.get<CurrentUser>('/api/me', {
        headers: this.buildBasicHeader(username, password),
      }),
    );

    this.credentials = { username, password };
    this.userSignal.set(user);
    return user;
  }

  /** Ferme la session courante. */
  logout(): void {
    this.credentials = null;
    this.userSignal.set(null);
  }

  /**
   * Construit l'en-tete HTTP Basic a partir d'un couple identifiant / mot de passe.
   */
  buildBasicHeader(username: string, password: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Basic ' + this.encodeBase64(`${username}:${password}`),
    });
  }

  /**
   * En-tete d'autorisation a joindre aux requetes, ou null si non connecte.
   */
  authorizationHeader(): string | null {
    if (!this.credentials) {
      return null;
    }
    return 'Basic ' + this.encodeBase64(`${this.credentials.username}:${this.credentials.password}`);
  }

  /**
   * Vrai si l'utilisateur authentifie possede au moins un des roles donnes.
   */
  hasAnyRole(...roles: string[]): boolean {
    const role = this.role();
    return role !== null && roles.includes(role);
  }

  /**
   * Encode une chaine en base64 (UTF-8).
   */
  private encodeBase64(value: string): string {
    return btoa(
      encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_match, hex) =>
        String.fromCharCode(parseInt(hex, 16)),
      ),
    );
  }
}
