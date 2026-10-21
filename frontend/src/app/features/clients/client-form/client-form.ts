import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientRequest } from '../../../core/models/client';
import { ClientService } from '../client.service';

/**
 * Formulaire de creation et de modification d'un client.
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /** Identifiant du client modifie (null en creation). */
  readonly clientId = input<number | null>(null);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly saved = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(80)]],
    phone: ['', [Validators.required, Validators.maxLength(20)]],
    email: ['', [Validators.email, Validators.maxLength(120)]],
    address: ['', [Validators.maxLength(160)]],
  });

  constructor() {
    // Chargement du client en mode modification.
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.load(id);
    }
  }

  readonly isEdit = () => this.clientId() !== null;

  private load(id: string): void {
    this.loading.set(true);
    this.clientService.get(Number(id)).subscribe({
      next: (client) => {
        this.form.setValue({
          name: client.name,
          phone: client.phone,
          email: client.email ?? '',
          address: client.address ?? '',
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Client introuvable.');
        this.loading.set(false);
      },
    });
  }

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

    const id = this.clientId();
    const request$ = id ? this.clientService.update(id, request) : this.clientService.create(request);

    request$.subscribe({
      next: () => {
        this.loading.set(false);
        this.saved.set(true);
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
