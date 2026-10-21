import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

interface NavItem {
  path: string;
  label: string;
  exact?: boolean;
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Utilisateur connecte (null si la session a expire). */
  readonly user = this.auth.currentUser;

  /** Ouvre/ferme le menu lateral (mobile). */
  readonly menuOpen = signal(false);

  /** Entrees de navigation, filtreees selon le role de l'utilisateur. */
  readonly navItems = computed<NavItem[]>(() => {
    const items: NavItem[] = [
      { path: '/dashboard', label: 'Tableau de bord' },
      { path: '/clients', label: 'Clients' },
      { path: '/drivers', label: 'Chauffeurs' },
      { path: '/vehicles', label: 'Véhicules' },
      { path: '/rides', label: 'Courses' },
      { path: '/statistics', label: 'Statistiques' },
    ];

    if (this.auth.isAdmin()) {
      items.push({ path: '/admin', label: 'Administration' });
    }

    return items;
  });

  /** Ferme la session et revient a la page de connexion. */
  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

  /** Ferme le menu lateral apres un clic sur un lien (mobile). */
  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
