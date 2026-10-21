import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('starts unauthenticated', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(service.role()).toBeNull();
    expect(service.authorizationHeader()).toBeNull();
  });

  it('loads the current user on login', async () => {
    const promise = service.login('admin', 'password');

    const request = httpMock.expectOne('/api/me');
    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('Authorization')).toBe(
      'Basic ' + btoa('admin:password'),
    );

    request.flush({
      id: 1,
      username: 'admin',
      displayName: 'Administrateur',
      role: 'ROLE_ADMIN',
      enabled: true,
    });

    await promise;

    expect(service.isAuthenticated()).toBe(true);
    expect(service.role()).toBe('ROLE_ADMIN');
    expect(service.isAdmin()).toBe(true);
  });

  it('keeps no credentials when login fails', async () => {
    const promise = service.login('admin', 'mauvais');

    httpMock
      .expectOne('/api/me')
      .flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    await expect(promise).rejects.toBeTruthy();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.authorizationHeader()).toBeNull();
  });

  it('clears the session on logout', async () => {
    const promise = service.login('operator', 'password');
    httpMock.expectOne('/api/me').flush({
      id: 3,
      username: 'operator',
      displayName: 'Operateur radio',
      role: 'ROLE_OPERATOR',
      enabled: true,
    });
    await promise;

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.authorizationHeader()).toBeNull();
  });

  it('checks roles', () => {
    service['userSignal'].set({
      id: 3,
      username: 'operator',
      displayName: 'Operateur radio',
      role: 'ROLE_OPERATOR',
      enabled: true,
    });

    expect(service.hasAnyRole('ROLE_ADMIN', 'ROLE_OPERATOR')).toBe(true);
    expect(service.hasAnyRole('ROLE_ADMIN')).toBe(false);
  });
});
