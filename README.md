# Taxi_V2_Angular — Gestion de flotte de taxis

Application web de gestion d'une flotte de taxis : clients, chauffeurs, véhicules,
courses, affectation automatique des chauffeurs, statistiques de chiffre d'affaires
et configuration du score de rémunération.

Le dépôt contient **deux applications** :

- un **backend Spring Boot** qui expose l'API REST (`/api/**`) et une interface Thymeleaf
  historique ;
- un **front Angular 22** (`frontend/`) qui consomme cette API et remplace progressivement
  l'interface Thymeleaf.

## Stack technique

### Backend

- Java 21
- Spring Boot 3.4.0
- Spring Web, Spring Data JPA, Spring Security, Spring Validation
- Thymeleaf + Bootstrap (interface historique, encore disponible)
- API REST sous `/api/**` (HTTP Basic, CSRF désactivé pour l'API)
- H2 sur fichier par défaut / MariaDB en local

### Frontend

- Angular 22 (standalone components, signals, `@if` / `@for`)
- SCSS maison : design tokens, mixins et classes partagées (`frontend/src/styles/`)
- Vitest pour les tests unitaires
- Proxy de développement vers le backend (`frontend/proxy.conf.json`)

## Fonctionnalités

- **Authentification** avec rôles `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_OPERATOR`, `ROLE_USER`
- **Clients** : CRUD, recherche, pagination
- **Chauffeurs** : CRUD, statut (disponible / en pause / en course / indisponible / suspendu),
  commission, affectation d'un véhicule
- **Véhicules** : CRUD, immatriculation, statut (disponible / en course / maintenance /
  hors service), kilométrage
- **Courses** : création, affectation automatique ou manuelle, liste des candidats avec
  le score de priorité, cycle de vie complet
  (créée → assignée → en cours → terminée / annulée)
- **Tableau de bord et statistiques** : chiffre d'affaires, commissions, activité,
  répartition par chauffeur et par véhicule, graphiques CSS
- **Administration** : gestion des comptes utilisateurs (rôle, activation), configuration
  du scoring d'affectation

## Démarrage rapide

### Backend seul

```bash
mvn spring-boot:run
```

- API REST : <http://localhost:8085/api>
- Interface Thymeleaf : <http://localhost:8085/dashboard>
- Console H2 : <http://localhost:8085/h2-console>

### Front Angular (mode développement)

Dans un second terminal :

```bash
cd frontend
npm install
npm start
```

- Application : <http://localhost:4200/app/>
- Les appels `/api` sont relayés vers `http://localhost:8085` par le proxy

> Le backend doit tourner en parallèle (`mvn spring-boot:run`).

### Build complet (backend + front)

```bash
mvn clean package
java -jar target/taxi-fleet-0.0.1-SNAPSHOT.jar
```

Le build Maven installe Node/npm, construit l'application Angular et copie le résultat
dans le jar, servi par Spring Boot à l'adresse <http://localhost:8085/app/>.

Pour construire **uniquement** le backend (plus rapide) :

```bash
mvn clean package -Dfrontend.skip=true
```

### Comptes de démonstration

| Utilisateur | Rôle                      | Mot de passe |
|-------------|---------------------------|--------------|
| `admin`     | Administrateur            | `password`   |
| `manager`   | Responsable exploitation  | `password`   |
| `operator`  | Opérateur radio           | `password`   |
| `user`      | Consultant                | `password`   |

Ces comptes sont créés automatiquement au premier démarrage (via `DemoDataLoader`).
Le mot de passe peut être personnalisé via la variable d'environnement
`DEMO_PASSWORD` ou via `application-local.properties` (clé `app.demo-data.password`).

## Configuration locale (non publiée)

Les identifiants de base de données ne sont **jamais committés**. Ils se trouvent
dans `application-local.properties`, un fichier ignoré par git.

```bash
cp application-local.properties.example application-local.properties
```

Surcharge possible par variables d'environnement :

| Variable        | Usage                                | Valeur par défaut           |
|-----------------|--------------------------------------|-----------------------------|
| `DB_URL`        | URL JDBC                            | `jdbc:h2:file:./data/taxidb` |
| `DB_DRIVER`     | Driver JDBC                         | `org.h2.Driver`             |
| `DB_USERNAME`   | Utilisateur de la base              | `sa`                        |
| `DB_PASSWORD`   | Mot de passe de la base              | *(vide)*                     |
| `DEMO_PASSWORD` | Mot de passe des comptes de démo     | `password`                  |

## Tests

```bash
# Backend
mvn test

# Front
cd frontend && npm test
```

## Sécurité du dépôt

- `.gitignore` exclut `target/`, `data/`, les fichiers de configuration locale
  (`application-local.properties`), `.env`, les clés, les bases locales et les
  fichiers d'IDE.
- `application.properties` ne contient **aucun mot de passe** : uniquement des
  valeurs par défaut et des variables d'environnement.
- `application-local.properties.example` ne contient que des valeurs de remplacement.
- Les accès à la console H2 (`/h2-console`) sont présents pour le développement
  local ; les identifiants réels ne sont pas dans le dépôt.

## Structure du projet

```
Taxi_V2_Angular/
├── pom.xml                          # build Maven (backend + build Angular)
├── docs/roadmap-angular.md          # feuille de route du front
├── application-local.properties.example
├── src/main/java/com/example/taxi/
│   ├── config/        # SecurityConfig, DemoDataLoader, SpaResourceConfig
│   ├── controller/
│   │   ├── rest/      # API REST (consommée par Angular)
│   │   └── web/       # contrôleurs Thymeleaf
│   ├── dto/           # requête / réponse
│   ├── entity/        # entités JPA
│   ├── exception/     # gestion d'erreurs
│   ├── mapper/        # conversion entité → DTO
│   ├── repository/    # accès données
│   ├── security/      # rôles, CustomUserDetailsService
│   ├── service/       # logique métier
│   └── util/          # utilitaires
├── src/main/resources/
│   ├── application.properties
│   ├── static/        # css, js
│   └── templates/     # vues Thymeleaf
├── src/test/java/     # tests backend
└── frontend/          # application Angular
    ├── proxy.conf.json
    └── src/app/
        ├── core/
        │   ├── auth/           # AuthService (HTTP Basic)
        │   ├── guards/         # authGuard, roleGuard, adminGuard
        │   ├── interceptors/   # authInterceptor
        │   ├── layout/shell/   # shell (header + sidebar)
        │   ├── models/         # modèles et types
        │   └── shared/         # paginator, bar-chart
        └── features/
            ├── auth/login/
            ├── clients/
            ├── drivers/
            ├── vehicles/
            ├── rides/
            ├── statistics/
            ├── dashboard/
            ├── admin/
            └── not-found/
```

## Feuille de route

Le détail des étapes est dans [`docs/roadmap-angular.md`](docs/roadmap-angular.md).
