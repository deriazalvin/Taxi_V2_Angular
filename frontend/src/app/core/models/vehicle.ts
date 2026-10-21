/**
 * Vehicule tel que renvoye par l'API REST.
 */
export interface Vehicle {
  id: number;
  plateNumber: string;
  brand: string;
  model: string;
  modelYear: number;
  capacity: number;
  mileage: number;
  status: VehicleStatus;
  activeRideId: number | null;
}

/**
 * Donnees attendues pour la creation ou la modification d'un vehicule.
 */
export interface VehicleRequest {
  plateNumber: string;
  brand: string;
  model: string;
  modelYear: number;
  capacity: number;
  mileage: number;
  status: VehicleStatus;
}

/**
 * Statuts possibles d'un vehicule (VehicleStatus côté backend).
 */
export const VEHICLE_STATUSES = ['DISPONIBLE', 'EN_COURSE', 'MAINTENANCE', 'HORS_SERVICE'] as const;

export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

/**
 * Libelles lisibles des statuts de vehicule.
 */
export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  DISPONIBLE: 'Disponible',
  EN_COURSE: 'En course',
  MAINTENANCE: 'Maintenance',
  HORS_SERVICE: 'Hors service',
};
