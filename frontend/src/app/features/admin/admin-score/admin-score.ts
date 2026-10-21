import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScoreConfig } from '../../../core/models/admin';
import { AdminService } from '../admin.service';

/**
 * Configuration du scoring utilise pour affecter les chauffeurs.
 */
@Component({
  selector: 'app-admin-score',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-score.html',
  styleUrl: './admin-score.scss',
})
export class AdminScore {
  private readonly adminService = inject(AdminService);
  private readonly fb = inject(FormBuilder);

  readonly config = signal<ScoreConfig | null>(null);
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly info = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    loadWeight: [2, [Validators.required, Validators.min(0.1), Validators.max(10)]],
    seniorityWeight: [0.5, [Validators.required, Validators.min(0), Validators.max(10)]],
    vehicleWeight: [0.5, [Validators.required, Validators.min(0), Validators.max(10)]],
  });

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.adminService.scoreConfig().subscribe({
      next: (config) => {
        this.config.set(config);
        this.form.setValue({
          loadWeight: config.loadWeight,
          seniorityWeight: config.seniorityWeight,
          vehicleWeight: config.vehicleWeight,
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger la configuration du scoring.');
        this.loading.set(false);
      },
    });
  }

  /** Enregistre la nouvelle configuration. */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.busy.set(true);
    this.error.set(null);

    const raw = this.form.getRawValue();

    this.adminService
      .updateScoreConfig({
        loadWeight: raw.loadWeight,
        seniorityWeight: raw.seniorityWeight,
        vehicleWeight: raw.vehicleWeight,
      })
      .subscribe({
        next: (config) => {
          this.busy.set(false);
          this.config.set(config);
          this.info.set('Configuration enregistree.');
        },
        error: (err) => {
          this.busy.set(false);
          this.error.set(
            err.error?.message ?? "Une erreur est survenue lors de l'enregistrement.",
          );
        },
      });
  }
}
