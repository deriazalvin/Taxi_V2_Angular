/**
 * Chauffeur tel que renvoye par l'API REST.
 */
export interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  licenseValid: boolean;
  status: DriverStatus;
  hireDate: string;
  commissionRate: number;
  vehicleId: number | null;
  vehiclePlate: string | null;
  activeRideId: number | null;
  ridesToday: number;
}

/**
 * Donnees attendues pour la creation ou la modification d'un chauffeur.
 */
export interface DriverRequest {
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  hireDate: string;
  status: DriverStatus;
  vehicleId: number | null;
  commissionRate: number;
}

/**
 * Statuts possibles d'un chauffeur (DriverStatus côté backend).
 */
export const DRIVER_STATUSES = [
  'DISPONIBLE',
  'EN_COURSE',
  'EN_PAUSE',
  'INDISPONIBLE',
  'SUSPENDU',
] as const;

export type DriverStatus = (typeof DRIVER_STATUSES)[number];

/**
 * Libelles lisibles des statuts de chauffeur.
 */
export const DRIVER_STATUS_LABELS: Record<DriverStatus, string> = {
  DISPONIBLE: 'Disponible',
  EN_COURSE: 'En course',
  EN_PAUSE: 'En pause',
  INDISPONIBLE: 'Indisponible',
  SUSPENDU: 'Suspendu',
};
