/**
 * Statistiques de chiffre d'affaires (/api/statistics/revenue).
 */
export interface RevenueStats {
  from: string;
  to: string;
  totalRides: number;
  totalRevenue: number;
  totalCommission: number;
  totalDriverRevenue: number;
  averageRevenue: number;
  byDriver: RevenueBreakdown[];
  byVehicle: RevenueBreakdown[];
  byDay: RevenueByDay[];
}

/**
 * Repartition du chiffre d'affaires par chauffeur ou par vehicule.
 */
export interface RevenueBreakdown {
  label: string;
  id: number | null;
  revenue: number;
  rideCount: number;
}

/**
 * Chiffre d'affaires quotidien.
 */
export interface RevenueByDay {
  date: string;
  revenue: number;
  driverRevenue: number;
  rideCount: number;
}

/**
 * Statistiques d'activite (/api/statistics/activity).
 */
export interface ActivityStats {
  from: string;
  to: string;
  totalRides: number;
  cancelledRides: number;
  cancellationRate: number;
  averageRevenue: number;
  totalDistanceKm: number;
  mostActiveDriver: string | null;
  mostActiveDriverRides: number;
  mostUsedVehicle: string | null;
  mostUsedVehicleRides: number;
  byDay: ActivityByDay[];
}

/**
 * Activite quotidienne.
 */
export interface ActivityByDay {
  date: string;
  rideCount: number;
  cancelledCount: number;
  revenue: number;
  distanceKm: number;
}
