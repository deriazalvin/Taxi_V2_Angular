import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /** Message d'erreur affiche (identifiants invalides, etc.). */
  readonly error = signal<string | null>(null);

  /** Vrai pendant l'envoi du formulaire. */
  readonly loading = signal(false);

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { username, password } = this.form.getRawValue();

    try {
      await this.auth.login(username, password);
      const returnUrl = this.router.routerState.snapshot.root.queryParams['returnUrl'];
      await this.router.navigateByUrl(returnUrl || '/dashboard');
    } catch {
      this.error.set('Identifiants invalides. Veuillez reessayer.');
    } finally {
      this.loading.set(false);
    }
  }
}
