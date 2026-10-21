import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/**
 * Garde d'administration : n'autorise l'acces qu'a un utilisateur
 * possedant le role ROLE_ADMIN.
 */
export const adminGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return true;
  }

  return router.createUrlTree(['/dashboard'], {
    queryParams: { denied: state.url },
  });
};
