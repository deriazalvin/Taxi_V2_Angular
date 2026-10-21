import { Component, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Candidate, Ride, RIDE_STATUS_LABELS } from '../../../core/models/ride';
import { RideService } from '../ride.service';

/**
 * Detail d'une course : informations, affectation et cycle de vie.
 */
@Component({
  selector: 'app-ride-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './ride-detail.html',
  styleUrl: './ride-detail.scss',
})
export class RideDetail {
  private readonly rideService = inject(RideService);

  /** Identifiant de la course affichee. */
  readonly rideId = input.required<number>();

  readonly ride = signal<Ride | null>(null);
  readonly candidates = signal<Candidate[]>([]);
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly info = signal<string | null>(null);

  readonly statusLabels = RIDE_STATUS_LABELS;

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.rideService.get(this.rideId()).subscribe({
      next: (ride) => {
        this.ride.set(ride);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Course introuvable.');
        this.loading.set(false);
      },
    });
  }

  /** Charge la liste des chauffeurs candidats. */
  loadCandidates(): void {
    this.rideService.candidates(this.rideId()).subscribe({
      next: (candidates) => this.candidates.set(candidates),
      error: () => this.error.set('Impossible de charger les chauffeurs candidats.'),
    });
  }

  /** Affecte la course au chauffeur propose. */
  assignTo(driverId: number, vehicleId: number | null): void {
    this.busy.set(true);
    this.error.set(null);

    this.rideService.assign(this.rideId(), driverId, vehicleId ?? undefined).subscribe({
      next: (ride) => {
        this.ride.set(ride);
        this.busy.set(false);
        this.info.set('Chauffeur affecte.');
        this.candidates.set([]);
      },
      error: () => {
        this.busy.set(false);
        this.error.set("Impossible d'affecter la course.");
      },
    });
  }

  /** Affecte automatiquement la course au meilleur chauffeur. */
  assignAutomatically(): void {
    this.busy.set(true);
    this.error.set(null);

    this.rideService.assign(this.rideId()).subscribe({
      next: (ride) => {
        this.ride.set(ride);
        this.busy.set(false);
        this.info.set('Affectation automatique effectuee.');
        this.candidates.set([]);
      },
      error: () => {
        this.busy.set(false);
        this.error.set("Impossible d'affecter la course.");
      },
    });
  }

  /** Demarre la course. */
  start(): void {
    this.action((ride) => this.rideService.start(ride.id), 'Course demarree.');
  }

  /** Termine la course. */
  complete(): void {
    this.action((ride) => this.rideService.complete(ride.id), 'Course terminee.');
  }

  /** Annule la course. */
  cancel(): void {
    const reason = prompt("Motif de l'annulation (facultatif) :") ?? undefined;

    this.busy.set(true);
    this.error.set(null);

    this.rideService.cancel(this.rideId(), reason).subscribe({
      next: (ride) => {
        this.ride.set(ride);
        this.busy.set(false);
        this.info.set('Course annulee.');
      },
      error: () => {
        this.busy.set(false);
        this.error.set("Impossible d'annuler la course.");
      },
    });
  }

  private action(
    call: (ride: Ride) => ReturnType<RideService['start']>,
    successMessage: string,
  ): void {
    const ride = this.ride();
    if (!ride) {
      return;
    }

    this.busy.set(true);
    this.error.set(null);

    call(ride).subscribe({
      next: (updated) => {
        this.ride.set(updated);
        this.busy.set(false);
        this.info.set(successMessage);
      },
      error: () => {
        this.busy.set(false);
        this.error.set("L'operation n'a pas pu aboutir.");
      },
    });
  }
}
