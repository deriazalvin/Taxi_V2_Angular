/**
 * Utilisateur applicatif (administrateur).
 */
export interface AppUser {
  id: number;
  username: string;
  displayName: string;
  role: AppRole;
  enabled: boolean;
}

/**
 * Roles applicatifs (AppRole côté backend).
 */
export const APP_ROLES = ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_OPERATOR', 'ROLE_USER'] as const;

export type AppRole = (typeof APP_ROLES)[number];

/**
 * Libelles lisibles des roles applicatifs.
 */
export const APP_ROLE_LABELS: Record<AppRole, string> = {
  ROLE_ADMIN: 'Administrateur',
  ROLE_MANAGER: 'Responsable exploitation',
  ROLE_OPERATOR: 'Operateur radio',
  ROLE_USER: 'Consultant',
};

/**
 * Donnees attendues pour la creation d'un utilisateur.
 */
export interface UserRequest {
  username: string;
  password: string;
  displayName: string;
  role: AppRole;
}

/**
 * Configuration du scoring d'affectation des chauffeurs.
 */
export interface ScoreConfig {
  id: number;
  loadWeight: number;
  seniorityWeight: number;
  vehicleWeight: number;
}

/**
 * Donnees attendues pour la mise a jour du scoring.
 */
export interface ScoreConfigRequest {
  loadWeight: number;
  seniorityWeight: number;
  vehicleWeight: number;
}
