# Taxi_V2_Angular — Gestion de flotte de taxis (V2)

Application web de gestion d'une flotte de taxis : clients, chauffeurs, véhicules,
courses, affectation automatique des chauffeurs, statistiques de chiffre d'affaires
et configuration du score de rémunération.

> **Version 2** — le backend Spring Boot est fonctionnel. Un **front-end Angular**
> est en cours d'ajout et viendra remplacer progressivement l'interface Thymeleaf.

## Stack technique

### Backend (actuel)

- Java 21
- Spring Boot 3.4.0
- Spring Web, Spring Data JPA, Spring Security, Spring Validation
- Thymeleaf + Bootstrap (interface web existante)
- API REST sous `/api/**` (HTTP Basic, CSRF désactivé pour l'API)
- H2 sur fichier par défaut / MariaDB en local

### Frontend (à venir)

- Angular (dossier `frontend/`), branché sur l'API REST `/api/**`
- L'API REST existante est déjà prévue pour ça (authentification HTTP Basic,
  `csrf.disable()` sur `/api/**`)

## Fonctionnalités

- **Authentification** avec rôles `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_OPERATOR`, `ROLE_USER`
- **Clients** : CRUD, recherche
- **Chauffeurs** : CRUD, statut (disponible / en pause / indisponible / suspendu), commission
- **Véhicules** : CRUD, immatriculation, statut, valeur
- **Courses** : création, affectation automatique du chauffeur le plus proche,
  scores de priorité (charge / ancienneté / véhicule), cycle de vie complet
  (créée → assignée → en cours → terminée)
- **Statistiques** : chiffre d'affaires par jour, répartition des courses, activité
- **Administration** : gestion des comptes utilisateurs, configuration du scoring

## Démarrage rapide

```bash
git clone https://github.com/deriazalvin/Taxi_V2_Angular.git
cd Taxi_V2_Angular
mvn spring-boot:run
```

L'application démarre sur <http://localhost:8085>.

> Par défaut, l'application utilise une base **H2 sur fichier** (`./data/taxidb`) :
> aucune installation de base de données n'est nécessaire pour essayer le projet.
> Le dossier `data/` est ignoré par git.

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

1. Copie le fichier d'exemple et renseigne tes identifiants :

   ```bash
   cp application-local.properties.example application-local.properties
   ```

2. Remplace `username` et `password` par les tiens, puis relance l'application.

Le fichier est chargé automatiquement grâce à :

```properties
spring.config.import=optional:file:application-local.properties
```

Surcharge possible par variables d'environnement :

| Variable      | Usage                                    | Valeur par défaut             |
|---------------|------------------------------------------|-------------------------------|
| `DB_URL`      | URL JDBC                                | `jdbc:h2:file:./data/taxidb`   |
| `DB_DRIVER`   | Driver JDBC                             | `org.h2.Driver`               |
| `DB_USERNAME` | Utilisateur de la base                  | `sa`                          |
| `DB_PASSWORD` | Mot de passe de la base                  | *(vide)*                       |
| `DEMO_PASSWORD` | Mot de passe des comptes de démo       | `password`                    |

## Tests

```bash
mvn test
```

## Sécurité du dépôt

- `.gitignore` exclut `target/`, `data/`, les fichiers de configuration locale
  (`application-local.properties`), `.env`, les bases locales, les clés et les
  fichiers d'IDE.
- `application.properties` ne contient **aucun mot de passe** : uniquement des
  valeurs par défaut et des variables d'environnement.
- `application-local.properties.example` ne contient que des valeurs de remplacement
  (`CHANGE_MOI`).
- Les accès à la console H2 (`/h2-console`) sont présents pour le développement
  local ; les identifiants réels ne sont pas dans le dépôt.

## Structure du projet

```
Taxi_V2_Angular/
├── pom.xml
├── application-local.properties.example
├── src/main/java/com/example/taxi/
│   ├── config/        # SecurityConfig, DemoDataLoader
│   ├── controller/
│   │   ├── rest/      # API REST (destinée au front Angular)
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
├── src/test/java/     # tests unitaires / intégration
└── frontend/          # front-end Angular (à venir)
```
