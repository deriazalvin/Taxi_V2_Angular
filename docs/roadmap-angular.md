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

- [x] Feuille de route (ce document)
- [x] Endpoint backend `GET /api/me` (utilisateur courant et rôles)

### Phase 1 — Initialisation Angular

- [x] Initialisation du projet Angular 22 (standalone, scss, routing)
- [x] Fichiers d'environnement (dev / prod) et proxy de dev
- [x] Design system SCSS (tokens, mixins, reset)
- [x] Module core (interceptors, guards, services de base)
- [x] Modèle de pagination (structure `Page` de Spring)

### Phase 2 — Authentification

- [x] Service d'authentification (HTTP Basic)
- [x] Interceptor HTTP Basic et gestion des 401
- [x] Page de connexion
- [x] Guard d'authentification et guard de rôle
- [x] Redirection 401 vers `/login` et persistance de session

### Phase 3 — Layout et navigation

- [x] Shell (header + sidebar)
- [x] Layout principal
- [x] Routes et page d'accueil
- [x] Page 404
- [x] Navigation active selon la route

### Phase 4 — Clients

- [x] Modèle `Client` et service API
- [x] Page liste des clients
- [x] Pagination et recherche
- [x] Formulaire de création
- [x] Édition et suppression

### Phase 5 — Véhicules

- [x] Modèle `Vehicle` et service API
- [x] Page liste des véhicules
- [x] Formulaire véhicule (création et édition)
- [x] Actions de statut et suppression

### Phase 6 — Chauffeurs

- [x] Modèle `Driver` et service API
- [x] Page liste des chauffeurs
- [x] Formulaire chauffeur
- [x] Changements de statut et vue véhicules disponibles

### Phase 7 — Courses

- [x] Modèle `Ride` et service API
- [x] Page liste des courses avec filtre par statut
- [x] Formulaire de création
- [x] Page détail
- [x] Affectation de chauffeur (liste des candidats)
- [x] Actions start / complete / cancel
- [x] Vue des courses en attente

### Phase 8 — Tableau de bord et statistiques

- [x] Services statistiques
- [x] Page tableau de bord
- [x] Page statistiques avec filtres de dates
- [x] Graphiques en SCSS

### Phase 9 — Administration

- [x] Service admin (utilisateurs et configuration du scoring)
- [x] Page de gestion des utilisateurs
- [x] Page de configuration du scoring
- [x] Routes `/admin` restreintes au rôle `ADMIN`

### Phase 10 — Intégration et build

- [x] Configuration Angular pour la production (`baseHref`, budgets)
- [x] Build Angular dans le cycle Maven (`frontend-maven-plugin`)
- [x] Fallback SPA côté Spring Boot (`/app/**` → `index.html`)
- [x] Tests unitaires du front
- [x] Mise à jour du README

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

## État final

Toutes les phases sont terminées. Récapitulatif :

| Phase | Contenu | Commits |
|-------|---------|---------|
| 0 | Socle : roadmap, endpoint `/api/me` | 4 |
| 1 | Initialisation Angular, environments, proxy, design system | 6 |
| 2 | Authentification HTTP Basic, interceptor, guards | 5 |
| 3 | Layout (header + sidebar), routes, 404 | 5 |
| 4 | Clients : modèle, service, liste, pagination, formulaire | 5 |
| 5 | Véhicules : modèle, service, liste, formulaire, statuts | 4 |
| 6 | Chauffeurs : modèle, service, liste, formulaire, statuts | 4 |
| 7 | Courses : liste, formulaire, détail, affectation, cycle de vie | 7 |
| 8 | Tableau de bord, statistiques, graphiques CSS | 4 |
| 9 | Administration : utilisateurs, scoring, garde admin | 4 |
| 10 | Build Maven, fallback SPA, tests, documentation | 5 |

### Adresses

- Interface Thymeleaf (historique) : `http://localhost:8085/dashboard`
- Interface Angular : `http://localhost:8085/app/` (ou `http://localhost:4200/app/` en dev)
- API REST : `http://localhost:8085/api/**`

### Prochaines étapes possibles

- Remplacer la base H2 par MariaDB en local (`application-local.properties`)
- Retirer l'interface Thymeleaf et basculer le `baseHref` Angular sur `/`
- Ajouter un rafraîchissement temps réel des courses en attente
- Ajouter la pagination et la recherche sur les courses en attente
