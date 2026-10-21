import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DriverRequest, DriverStatus, DRIVER_STATUSES, DRIVER_STATUS_LABELS } from '../../../core/models/driver';
import { Vehicle } from '../../../core/models/vehicle';
import { VehicleService } from '../../vehicles/vehicle.service';
import { DriverService } from '../driver.service';

/**
 * Formulaire de creation et de modification d'un chauffeur.
 */
@Component({
  selector: 'app-driver-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './driver-form.html',
  styleUrl: './driver-form.scss',
})
export class DriverForm {
  private readonly fb = inject(FormBuilder);
  private readonly driverService = inject(DriverService);
  private readonly vehicleService = inject(VehicleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /** Identifiant du chauffeur modifie (null en creation). */
  readonly driverId = input<number | null>(null);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  /** Vehicules actuellement disponibles, pour le selecteur d'affectation. */
  readonly availableVehicles = signal<Vehicle[]>([]);

  readonly statuses = DRIVER_STATUSES;
  readonly statusLabels = DRIVER_STATUS_LABELS;

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(60)]],
    lastName: ['', [Validators.required, Validators.maxLength(60)]],
    phone: ['', [Validators.required, Validators.maxLength(20)]],
    licenseNumber: ['', [Validators.required, Validators.maxLength(30)]],
    licenseExpiryDate: ['', [Validators.required]],
    hireDate: ['', [Validators.required]],
    status: ['DISPONIBLE' as DriverStatus, [Validators.required]],
    vehicleId: [null as number | null],
    commissionRate: [10, [Validators.required, Validators.min(0), Validators.max(100)]],
  });

  constructor() {
    this.loadAvailableVehicles();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.load(id);
    }
  }

  readonly isEdit = () => this.driverId() !== null;

  private loadAvailableVehicles(): void {
    this.vehicleService.available().subscribe({
      next: (vehicles) => this.availableVehicles.set(vehicles),
      error: () => this.error.set('Impossible de charger les vehicules disponibles.'),
    });
  }

  private load(id: string): void {
    this.loading.set(true);
    this.driverService.get(Number(id)).subscribe({
      next: (driver) => {
        this.form.setValue({
          firstName: driver.firstName,
          lastName: driver.lastName,
          phone: driver.phone,
          licenseNumber: driver.licenseNumber,
          licenseExpiryDate: driver.licenseExpiryDate,
          hireDate: driver.hireDate,
          status: driver.status,
          vehicleId: driver.vehicleId,
          commissionRate: driver.commissionRate,
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Chauffeur introuvable.');
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
    const request: DriverRequest = {
      firstName: raw.firstName,
      lastName: raw.lastName,
      phone: raw.phone,
      licenseNumber: raw.licenseNumber,
      licenseExpiryDate: raw.licenseExpiryDate,
      hireDate: raw.hireDate,
      status: raw.status,
      vehicleId: raw.vehicleId ? Number(raw.vehicleId) : null,
      commissionRate: raw.commissionRate,
    };

    this.loading.set(true);
    this.error.set(null);

    const id = this.driverId();
    const request$ = id
      ? this.driverService.update(id, request)
      : this.driverService.create(request);

    request$.subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigate(['/drivers']);
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
