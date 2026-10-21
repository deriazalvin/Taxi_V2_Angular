package com.example.taxi.dto.response;

/**
 * Représente l'utilisateur actuellement authentifié.
 * Utilisé par le front-end Angular pour connaître le rôle
 * et afficher le bon menu (garde de rôle côté client).
 */
public record CurrentUserResponse(
        Long id,
        String username,
        String displayName,
        String role,
        boolean enabled
) {
    public static CurrentUserResponse from(com.example.taxi.entity.AppUser u) {
        return new CurrentUserResponse(u.getId(), u.getUsername(), u.getDisplayName(),
                u.getRole().name(), u.isEnabled());
    }
}
