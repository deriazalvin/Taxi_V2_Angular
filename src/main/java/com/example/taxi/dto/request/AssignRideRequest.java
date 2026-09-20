package com.example.taxi.dto.request;

/**
 * Attribution d'une course : vide = attribution automatique au meilleur chauffeur,
 * sinon chauffeur (et éventuellement véhicule) imposés.
 */
public record AssignRideRequest(
        Long driverId,
        Long vehicleId
) {
}