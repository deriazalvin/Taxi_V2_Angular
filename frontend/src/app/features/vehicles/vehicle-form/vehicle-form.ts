import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VehicleRequest, VehicleStatus, VEHICLE_STATUSES, VEHICLE_STATUS_LABELS } from '../../../core/models/vehicle';
import { VehicleService } from '../vehicle.service';

/**
 * Formulaire de creation et de modification d'un vehicule.
 */
@Component({
  selector: 'app-vehicle-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './vehicle-form.html',
  styleUrl: './vehicle-form.scss',
})
export class VehicleForm {
  private readonly fb = inject(FormBuilder);
  private readonly vehicleService = inject(VehicleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /** Identifiant du vehicule modifie (null en creation). */
  readonly vehicleId = input<number | null>(null);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly statuses = VEHICLE_STATUSES;
  readonly statusLabels = VEHICLE_STATUS_LABELS;

  readonly form = this.fb.nonNullable.group({
    plateNumber: ['', [Validators.required, Validators.maxLength(20)]],
    brand: ['', [Validators.required, Validators.maxLength(60)]],
    model: ['', [Validators.required, Validators.maxLength(60)]],
    modelYear: [null as number | null, [Validators.required, Validators.min(1950), Validators.max(2100)]],
    capacity: [null as number | null, [Validators.required, Validators.min(1), Validators.max(20)]],
    mileage: [null as number | null, [Validators.required, Validators.min(0)]],
    status: ['DISPONIBLE' as VehicleStatus, [Validators.required]],
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.load(id);
    }
  }

  readonly isEdit = () => this.vehicleId() !== null;

  private load(id: string): void {
    this.loading.set(true);
    this.vehicleService.get(Number(id)).subscribe({
      next: (vehicle) => {
        this.form.setValue({
          plateNumber: vehicle.plateNumber,
          brand: vehicle.brand,
          model: vehicle.model,
          modelYear: vehicle.modelYear,
          capacity: vehicle.capacity,
          mileage: vehicle.mileage,
          status: vehicle.status,
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Vehicule introuvable.');
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
    const request: VehicleRequest = {
      plateNumber: raw.plateNumber,
      brand: raw.brand,
      model: raw.model,
      modelYear: raw.modelYear as number,
      capacity: raw.capacity as number,
      mileage: raw.mileage as number,
      status: raw.status,
    };

    this.loading.set(true);
    this.error.set(null);

    const id = this.vehicleId();
    const request$ = id
      ? this.vehicleService.update(id, request)
      : this.vehicleService.create(request);

    request$.subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigate(['/vehicles']);
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
