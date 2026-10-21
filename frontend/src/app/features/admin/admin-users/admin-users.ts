import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppRole, AppUser, APP_ROLES, APP_ROLE_LABELS } from '../../../core/models/admin';
import { AdminService } from '../admin.service';

/**
 * Gestion des comptes utilisateurs : liste, creation, role, activation.
 */
@Component({
  selector: 'app-admin-users',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss',
})
export class AdminUsers {
  private readonly adminService = inject(AdminService);
  private readonly fb = inject(FormBuilder);

  readonly users = signal<AppUser[]>([]);
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly info = signal<string | null>(null);
  readonly showForm = signal(false);

  readonly roles = APP_ROLES;
  readonly roleLabels = APP_ROLE_LABELS;

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(60)]],
    displayName: ['', [Validators.required, Validators.maxLength(120)]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]],
    role: ['ROLE_USER' as AppRole, [Validators.required]],
  });

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.adminService.users().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les utilisateurs.');
        this.loading.set(false);
      },
    });
  }

  /** Affiche ou masque le formulaire de creation. */
  toggleForm(): void {
    this.showForm.set(!this.showForm());
    this.error.set(null);
    this.info.set(null);
  }

  /** Cree un compte utilisateur. */
  onCreate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.busy.set(true);
    this.error.set(null);

    const raw = this.form.getRawValue();

    this.adminService
      .createUser({
        username: raw.username,
        displayName: raw.displayName,
        password: raw.password,
        role: raw.role,
      })
      .subscribe({
        next: () => {
          this.busy.set(false);
          this.form.reset({ username: '', displayName: '', password: '', role: 'ROLE_USER' });
          this.showForm.set(false);
          this.info.set('Compte cree.');
          this.load();
        },
        error: (err) => {
          this.busy.set(false);
          this.error.set(this.extractError(err));
        },
      });
  }

  /** Change le role d'un compte. */
  onRoleChange(user: AppUser, event: Event): void {
    const role = (event.target as HTMLSelectElement).value as AppRole;
    this.busy.set(true);

    this.adminService.updateRole(user.id, role).subscribe({
      next: (updated) => {
        this.busy.set(false);
        this.users.update((list) => list.map((u) => (u.id === updated.id ? updated : u)));
        this.info.set(`Role de ${user.username} mis a jour.`);
      },
      error: () => {
        this.busy.set(false);
        this.error.set('Impossible de changer le role.');
      },
    });
  }

  /** Active ou desactive un compte. */
  onToggleEnabled(user: AppUser): void {
    this.busy.set(true);

    this.adminService.setEnabled(user.id, !user.enabled).subscribe({
      next: (updated) => {
        this.busy.set(false);
        this.users.update((list) => list.map((u) => (u.id === updated.id ? updated : u)));
        this.info.set(`${user.username} ${updated.enabled ? 'active' : 'desactive'}.`);
      },
      error: () => {
        this.busy.set(false);
        this.error.set("Impossible de modifier l'etat du compte.");
      },
    });
  }

  private extractError(err: {
    error?: { message?: string; violations?: { field: string; message: string }[] };
  }): string {
    const violations = err.error?.violations;
    if (violations && violations.length > 0) {
      return violations.map((v) => v.message).join(' ');
    }
    return err.error?.message ?? "Une erreur est survenue.";
  }
}
