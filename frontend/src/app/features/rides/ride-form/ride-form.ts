import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RideRequest } from '../../../core/models/ride';
import { RideService } from '../ride.service';

/**
 * Formulaire de creation d'une course.
 */
@Component({
  selector: 'app-ride-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './ride-form.html',
  styleUrl: './ride-form.scss',
})
export class RideForm {
  private readonly fb = inject(FormBuilder);
  private readonly rideService = inject(RideService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    clientName: ['', [Validators.required, Validators.maxLength(80)]],
    clientPhone: ['', [Validators.required, Validators.maxLength(20)]],
    pickupLocation: ['', [Validators.required, Validators.maxLength(120)]],
    destination: ['', [Validators.required, Validators.maxLength(120)]],
    distance: [null as number | null, [Validators.required, Validators.min(0.1)]],
    rideDateTime: [this.defaultDateTime(), [Validators.required]],
    fare: [null as number | null, [Validators.required, Validators.min(0.01)]],
  });

  /** Date et heure par defaut : maintenant, a la minute. */
  private defaultDateTime(): string {
    const now = new Date();
    now.setSeconds(0, 0);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const request: RideRequest = {
      clientName: raw.clientName,
      clientPhone: raw.clientPhone,
      pickupLocation: raw.pickupLocation,
      destination: raw.destination,
      distance: raw.distance as number,
      rideDateTime: raw.rideDateTime,
      fare: raw.fare as number,
      clientId: null,
    };

    this.loading.set(true);
    this.error.set(null);

    this.rideService.create(request).subscribe({
      next: (ride) => {
        this.loading.set(false);
        void this.router.navigate(['/rides', ride.id]);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(this.extractError(err));
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
    return err.error?.message ?? "Une erreur est survenue lors de l'enregistrement.";
  }
}
