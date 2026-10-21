/**
 * Structure de la pagination renvoyee par Spring Data (org.springframework.data.domain.Page).
 */
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
