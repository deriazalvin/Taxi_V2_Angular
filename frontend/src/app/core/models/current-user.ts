/**
 * Utilisateur actuellement authentifie, tel que renvoye par GET /api/me.
 */
export interface CurrentUser {
  id: number;
  username: string;
  displayName: string | null;
  role: string;
  enabled: boolean;
}

/**
 * Roles geres par le backend (AppRole).
 */
export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  MANAGER: 'ROLE_MANAGER',
  OPERATOR: 'ROLE_OPERATOR',
  USER: 'ROLE_USER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
