import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  let auth: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  function run(): unknown {
    return TestBed.runInInjectionContext(() =>
      adminGuard({} as never, { url: '/admin' } as never),
    );
  }

  it('autorise un administrateur', () => {
    auth['userSignal'].set({
      id: 1,
      username: 'admin',
      displayName: 'Administrateur',
      role: 'ROLE_ADMIN',
      enabled: true,
    });

    expect(run()).toBe(true);
  });

  it('refuse un utilisateur non administrateur', () => {
    auth['userSignal'].set({
      id: 3,
      username: 'operator',
      displayName: 'Operateur radio',
      role: 'ROLE_OPERATOR',
      enabled: true,
    });

    const result = run();
    expect(result).not.toBe(true);
    expect(router.serializeUrl(result as never)).toContain('/dashboard');
  });

  it('refuse un utilisateur non connecte', () => {
    const result = run();
    expect(result).not.toBe(true);
    expect(router.serializeUrl(result as never)).toContain('/dashboard');
  });
});
