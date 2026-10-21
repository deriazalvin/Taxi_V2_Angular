package com.example.taxi.controller.rest;

import com.example.taxi.dto.response.CurrentUserResponse;
import com.example.taxi.repository.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * Retourne l'utilisateur actuellement authentifie.
 * Permet au front-end Angular de connaitre le role de l'utilisateur
 * et d'afficher le menu adapte.
 */
@RestController
@RequestMapping("/api/me")
public class MeRestController {

    private final AppUserRepository userRepository;

    public MeRestController(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public CurrentUserResponse me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifie");
        }
        return userRepository.findByUsername(authentication.getName())
                .map(CurrentUserResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                        "Utilisateur introuvable : " + authentication.getName()));
    }
}
