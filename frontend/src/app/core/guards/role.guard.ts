import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/**
 * Garde de role : n'autorise l'acces que si l'utilisateur possede
 * au moins un des roles declares dans les donnees de la route
 * (`data: { roles: ['ROLE_ADMIN'] }`).
 */
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const roles = (route.data?.['roles'] ?? []) as string[];

  if (roles.length === 0) {
    return true;
  }

  if (auth.hasAnyRole(...roles)) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
