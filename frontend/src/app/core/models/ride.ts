/**
 * Course telle que renvoyee par l'API REST.
 */
export interface Ride {
  id: number;
  reference: string;
  clientName: string;
  clientPhone: string;
  clientId: number | null;
  pickupLocation: string;
  destination: string;
  distance: number;
  rideDateTime: string;
  fare: number;
  status: RideStatus;
  driverId: number | null;
  driverName: string | null;
  vehicleId: number | null;
  vehiclePlate: string | null;
  assignmentScore: number | null;
  startedAt: string | null;
  completedAt: string | null;
  cancelReason: string | null;
}

/**
 * Donnees attendues pour la creation d'une course.
 */
export interface RideRequest {
  clientName: string;
  clientPhone: string;
  pickupLocation: string;
  destination: string;
  distance: number;
  rideDateTime: string;
  fare: number;
  clientId: number | null;
}

/**
 * Chauffeur candidat a l'affectation d'une course.
 */
export interface Candidate {
  driverId: number;
  driverName: string;
  vehiclePlate: string | null;
  capacity: number | null;
  score: number;
  loadPoints: number;
  seniorityPoints: number;
  vehiclePoints: number;
}

/**
 * Statuts possibles d'une course (RideStatus côté backend).
 */
export const RIDE_STATUSES = ['EN_ATTENTE', 'ASSIGNEE', 'EN_COURS', 'TERMINEE', 'ANNULEE'] as const;

export type RideStatus = (typeof RIDE_STATUSES)[number];

/**
 * Libelles lisibles des statuts de course.
 */
export const RIDE_STATUS_LABELS: Record<RideStatus, string> = {
  EN_ATTENTE: 'En attente',
  ASSIGNEE: 'Assignee',
  EN_COURS: 'En cours',
  TERMINEE: 'Terminee',
  ANNULEE: 'Annulee',
};
