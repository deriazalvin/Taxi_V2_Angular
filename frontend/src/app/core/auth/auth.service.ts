import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CurrentUser } from '../models/current-user';

/** Cle de stockage des identifiants de session (sessionStorage). */
const SESSION_STORAGE_KEY = 'taxifleet.session';

/**
 * Service d'authentification HTTP Basic.
 *
 * Les identifiants sont conserves en memoire pour la session en cours et
 * persistes dans sessionStorage afin de survivre a un rechargement de page.
 * La session est fermee a la fermeture de l'onglet du navigateur.
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
    this.persistSession(username, password);
    return user;
  }

  /**
   * Restaure une session persistee dans sessionStorage, si elle est encore valide.
   * Appele au demarrage de l'application.
   */
  async restoreSession(): Promise<void> {
    const stored = this.readPersistedSession();
    if (!stored) {
      return;
    }

    try {
      const user = await firstValueFrom(
        this.http.get<CurrentUser>('/api/me', {
          headers: this.buildBasicHeader(stored.username, stored.password),
        }),
      );
      this.credentials = stored;
      this.userSignal.set(user);
    } catch {
      // Session expiree ou identifiants modifies : on repart de zero.
      this.clearPersistedSession();
    }
  }

  /** Ferme la session courante. */
  logout(): void {
    this.credentials = null;
    this.userSignal.set(null);
    this.clearPersistedSession();
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

  /**
   * Enregistre les identifiants de session dans sessionStorage.
   */
  private persistSession(username: string, password: string): void {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ username, password }));
    } catch {
      // Stockage indisponible (mode prive strict) : la session reste en memoire.
    }
  }

  /**
   * Relit les identifiants de session depuis sessionStorage.
   */
  private readPersistedSession(): { username: string; password: string } | null {
    try {
      const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as { username?: string; password?: string };
      if (!parsed.username || !parsed.password) {
        return null;
      }
      return { username: parsed.username, password: parsed.password };
    } catch {
      return null;
    }
  }

  /**
   * Supprime les identifiants de session de sessionStorage.
   */
  private clearPersistedSession(): void {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Rien a faire.
    }
  }
}
