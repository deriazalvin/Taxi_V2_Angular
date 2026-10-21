/**
 * Client tel que renvoye par l'API REST.
 */
export interface Client {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  createdAt: string;
}

/**
 * Donnees attendues pour la creation ou la modification d'un client.
 */
export interface ClientRequest {
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
}
