# Feuille de route — Front-end Angular (V2)

Plan de développement du front-end Angular du projet `Taxi_V2_Angular`.

## Contexte

Le backend Spring Boot expose déjà une API REST complète sous `/api/**`
(authentification HTTP Basic, CSRF désactivé sur l'API).

| Entité    | Endpoints                                   |
|------------|---------------------------------------------|
| Clients    | `/api/clients`                              |
| Chauffeurs | `/api/drivers`                              |
| Véhicules  | `/api/vehicles`                             |
| Courses    | `/api/rides`                                |
| Statistiques | `/api/statistics/revenue`, `/api/statistics/activity` |
| Admin      | `/api/admin/users`, `/api/admin/score-config` |
| Courant    | `/api/me`                                   |

## Décisions techniques

| Sujet            | Choix                                                     |
|------------------|-----------------------------------------------------------|
| Framework        | Angular 22 (standalone components, signals, `@if`/`@for`)   |
| Auth             | HTTP Basic (l'API existante est réutilisée telle quelle)   |
| Mode développement | Proxy Angular `proxy.conf.json` → `http://localhost:8085` |
| Styles           | SCSS maison (design tokens + mixins)                       |
| Arborescence     | `frontend/` à la racine du dépôt                          |
| Dossier          | `frontend/` à la racine, `src/` pour le code Angular      |

## Étapes

### Phase 0 — Socle

- [ ] Feuille de route (ce document)
- [ ] Endpoint backend `GET /api/me` (utilisateur courant et rôles)

### Phase 1 — Initialisation Angular

- [ ] Initialisation du projet Angular 22 (standalone, scss, routing)
- [ ] Fichiers d'environnement (dev / prod) et proxy de dev
- [ ] Design system SCSS (tokens, mixins, reset)
- [ ] Module core (interceptors, guards, services de base)
- [ ] Modèle de pagination (structure `Page` de Spring)

### Phase 2 — Authentification

- [ ] Service d'authentification (HTTP Basic)
- [ ] Interceptor HTTP Basic et gestion des 401
- [ ] Page de connexion
- [ ] Guard d'authentification et guard de rôle
- [ ] Redirection 401 vers `/login` et persistance de session

### Phase 3 — Layout et navigation

- [ ] Shell (header + sidebar)
- [ ] Layout principal
- [ ] Routes et page d'accueil
- [ ] Page 404
- [ ] Navigation active selon la route

### Phase 4 — Clients

- [ ] Modèle `Client` et service API
- [ ] Page liste des clients
- [ ] Pagination et recherche
- [ ] Formulaire de création
- [ ] Édition et suppression

### Phase 5 — Véhicules

- [ ] Modèle `Vehicle` et service API
- [ ] Page liste des véhicules
- [ ] Formulaire véhicule (création et édition)
- [ ] Actions de statut et suppression

### Phase 6 — Chauffeurs

- [ ] Modèle `Driver` et service API
- [ ] Page liste des chauffeurs
- [ ] Formulaire chauffeur
- [ ] Changements de statut et vue véhicules disponibles

### Phase 7 — Courses

- [ ] Modèle `Ride` et service API
- [ ] Page liste des courses avec filtre par statut
- [ ] Formulaire de création
- [ ] Page détail
- [ ] Affectation de chauffeur (liste des candidats)
- [ ] Actions start / complete / cancel
- [ ] Vue des courses en attente

### Phase 8 — Tableau de bord et statistiques

- [ ] Services statistiques
- [ ] Page tableau de bord
- [ ] Page statistiques avec filtres de dates
- [ ] Graphiques en SCSS

### Phase 9 — Administration

- [ ] Service admin (utilisateurs et configuration du scoring)
- [ ] Page de gestion des utilisateurs
- [ ] Page de configuration du scoring
- [ ] Routes `/admin` restreintes au rôle `ADMIN`

### Phase 10 — Intégration et build

- [ ] Build Angular dans le cycle Maven (`frontend-maven-plugin`)
- [ ] Configuration Angular pour la production
- [ ] Fallback SPA côté Spring Boot
- [ ] Tests unitaires du front
- [ ] Mise à jour du README

## Commandes de développement

```bash
# Backend
mvn spring-boot:run          # http://localhost:8085

# Front
cd frontend
npm install
npm start                    # http://localhost:4200 (proxy vers /api)
```

## Conventions

- Un commit = une fonctionnalité cohérente
- Commits en français, préfixe conventionnel : `feat`, `fix`, `chore`, `docs`, `test`
- Les modifications de code sont préparées puis committées manuellement
