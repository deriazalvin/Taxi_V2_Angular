import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClientRequest } from '../../../core/models/client';
import { ClientService } from '../client.service';

/**
 * Formulaire de creation d'un client.
 */
@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss',
})
export class ClientForm {
  private readonly fb = inject(FormBuilder);
  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    phone: ['', [Validators.required, Validators.maxLength(20)]],
    email: ['', [Validators.email, Validators.maxLength(120)]],
    address: ['', [Validators.maxLength(160)]],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const request: ClientRequest = {
      name: raw.name,
      phone: raw.phone,
      email: raw.email.trim() ? raw.email : null,
      address: raw.address.trim() ? raw.address : null,
    };

    this.loading.set(true);
    this.error.set(null);

    this.clientService.create(request).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigate(['/clients']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(this.extractError(err));
      },
    });
  }

  /**
   * Extrait un message lisible a partir de la reponse d'erreur de l'API.
   */
  private extractError(err: { error?: { message?: string; violations?: { field: string; message: string }[] } }): string {
    const violations = err.error?.violations;
    if (violations && violations.length > 0) {
      return violations.map((v) => v.message).join(' ');
    }
    return err.error?.message ?? "Une erreur est survenue lors de l'enregistrement.";
  }
}
