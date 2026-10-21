import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

/**
 * Interceptor HTTP global :
 *  - joint l'en-tete Authorization: Basic a toutes les requetes vers l'API ;
 *  - ferme la session et redirige vers /login lorsque l'API renvoie une 401.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const authorization = auth.authorizationHeader();

  const request = authorization
    ? req.clone({ setHeaders: { Authorization: authorization } })
    : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        const returnUrl = router.url;
        auth.logout();
        void router.navigate(['/login'], {
          queryParams: returnUrl && returnUrl !== '/login' ? { returnUrl } : {},
        });
      }
      return throwError(() => error);
    }),
  );
};
