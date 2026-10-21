import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Shell } from './shell';

describe('Shell', () => {
  let auth: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [provideRouter([])],
    }).compileComponents();

    auth = TestBed.inject(AuthService);
  });

  function logInAs(role: string): void {
    auth['userSignal'].set({
      id: 1,
      username: 'test',
      displayName: 'Test',
      role,
      enabled: true,
    });
  }

  it('exposes the standard navigation entries', () => {
    logInAs('ROLE_USER');
    const shell = TestBed.runInInjectionContext(() => new Shell());

    const labels = shell.navItems().map((item) => item.label);
    expect(labels).toContain('Tableau de bord');
    expect(labels).toContain('Clients');
    expect(labels).toContain('Courses');
  });

  it('hides the administration entry for non administrators', () => {
    logInAs('ROLE_OPERATOR');
    const shell = TestBed.runInInjectionContext(() => new Shell());

    expect(shell.navItems().map((item) => item.label)).not.toContain('Administration');
  });

  it('shows the administration entry for administrators', () => {
    logInAs('ROLE_ADMIN');
    const shell = TestBed.runInInjectionContext(() => new Shell());

    expect(shell.navItems().map((item) => item.label)).toContain('Administration');
  });
});
