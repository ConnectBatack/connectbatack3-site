# API de gestion financière du village

API REST destinée à la gestion transparente des finances d’un village : rubriques budgétaires, investissements des membres, dépenses, transferts entre projets et statistiques financières.

L’application distingue deux profils :

- **Investisseur** : soumet et consulte ses investissements grâce à un code d’accès personnel.
- **Trésorier** : administre les rubriques, valide ou rejette les investissements, enregistre les dépenses et gère les transferts.

## Fonctionnalités

- Authentification des trésoriers avec JWT.
- Connexion des investisseurs avec un code d’accès unique.
- Gestion des rubriques budgétaires et des projets du village.
- Soumission et suivi des investissements.
- Validation ou rejet des investissements par un trésorier.
- Enregistrement des dépenses et de leurs justificatifs.
- Transferts de fonds entre rubriques.
- Suivi du remboursement des transferts ou prêts.
- Calcul des soldes et statistiques financières.
- Documentation interactive automatique avec OpenAPI/Swagger.
- Migrations versionnées avec Alembic.
- Tests unitaires et d’intégration asynchrones.

## Technologies utilisées

| Domaine | Technologie |
|---|---|
| Langage | Python 3.10+ |
| Framework web | FastAPI |
| Validation des données | Pydantic |
| ORM | SQLAlchemy 2.0 |
| Base de données principale | PostgreSQL |
| Driver PostgreSQL asynchrone | asyncpg |
| Migrations | Alembic |
| Authentification trésorier | JWT |
| Hachage des mots de passe | Passlib avec bcrypt |
| Tests | pytest, pytest-asyncio |
| Base de données de test | SQLite avec aiosqlite |

FastAPI est utilisé pour ses performances, sa prise en charge native de l’asynchrone, sa validation des données et la génération automatique de la documentation de l’API.

## Architecture du projet

L’application suit une architecture modulaire organisée en couches, inspirée du pattern Service/Repository avec une couche CRUD.

```text
.
├── app/
│   ├── main.py
│   ├── security.py
│   ├── dependencies.py
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── rubrics.py
│   │   ├── investments.py
│   │   ├── expenses.py
│   │   ├── transfers.py
│   │   ├── investors.py
│   │   └── stats.py
│   │
│   ├── crud/
│   │   ├── users.py
│   │   ├── rubrics.py
│   │   ├── investments.py
│   │   ├── expenses.py
│   │   ├── transfers.py
│   │   └── stats.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── rubric.py
│   │   ├── investment.py
│   │   ├── expense.py
│   │   └── transfer.py
│   │
│   └── schemas/
│       ├── auth.py
│       ├── user.py
│       ├── rubric.py
│       ├── investment.py
│       ├── expense.py
│       ├── transfer.py
│       └── stats.py
│
├── alembic/
│   ├── versions/
│   └── env.py
│
├── tests/
│   ├── test_auth.py
│   ├── test_rubrics.py
│   ├── test_investments.py
│   ├── test_expenses.py
│   ├── test_transfers.py
│   └── test_stats.py
│
├── alembic.ini
├── requirements.txt
├── .env.example
└── README.md
```

### Responsabilités des principales couches

- `app/main.py` : initialise FastAPI, configure les middlewares et enregistre les routeurs.
- `app/routers/` : expose les endpoints REST et traite les requêtes HTTP.
- `app/crud/` : contient les requêtes SQLAlchemy et la logique d’accès aux données.
- `app/models/` : définit les tables et relations SQLAlchemy.
- `app/schemas/` : définit les objets d’entrée et de sortie avec Pydantic.
- `app/security.py` : gère le hachage des mots de passe, la création et le décodage des JWT.
- `app/dependencies.py` : fournit les dépendances FastAPI, la session de base de données et la vérification des rôles.

## Modèle de données

La base PostgreSQL repose sur cinq entités principales.

### `users`

Stocke les utilisateurs de l’application.

| Champ | Type | Description |
|---|---|---|
| `id` | UUID/String 36 | Identifiant unique, clé primaire |
| `name` | String | Nom de l’utilisateur |
| `role` | Enum | `INVESTOR` ou `TREASURER` |
| `access_code` | String nullable | Code unique utilisé par les investisseurs |
| `password_hash` | String nullable | Mot de passe haché des trésoriers |
| `created_at` | DateTime avec timezone | Date de création |

Un investisseur possède un `access_code`, tandis qu’un trésorier possède un `password_hash`.

### `rubrics`

Représente les projets ou rubriques budgétaires du village.

| Champ | Type | Description |
|---|---|---|
| `id` | UUID/String 36 | Identifiant unique, clé primaire |
| `name` | String | Nom unique de la rubrique |
| `description` | Text | Description du projet |
| `initial_balance` | Numeric(15,2) | Solde initial |
| `created_at` | DateTime | Date de création |

### `investments`

Représente les cotisations ou investissements des membres.

| Champ | Type | Description |
|---|---|---|
| `id` | UUID/String 36 | Identifiant unique |
| `investor_id` | Foreign Key | Référence vers `users.id` |
| `rubric_id` | Foreign Key | Référence vers `rubrics.id` |
| `amount` | Numeric(15,2) | Montant investi |
| `bank_receipt_code` | String | Référence unique du reçu bancaire |
| `status` | Enum | `PENDING`, `VALIDATED` ou `REJECTED` |
| `validation_date` | DateTime nullable | Date de validation |
| `rejection_reason` | Text nullable | Motif du rejet |
| `created_at` | DateTime | Date de création |

### `expenses`

Représente les dépenses effectuées pour une rubrique.

| Champ | Type | Description |
|---|---|---|
| `id` | UUID/String 36 | Identifiant unique |
| `rubric_id` | Foreign Key | Rubrique concernée |
| `treasurer_id` | Foreign Key | Trésorier ayant enregistré la dépense |
| `description` | Text | Description de la dépense |
| `amount` | Numeric(15,2) | Montant dépensé |
| `receipt_number` | String | Numéro du justificatif |
| `date` | DateTime | Date de la dépense |
| `created_at` | DateTime | Date d’enregistrement |

### `transfers`

Représente les transferts ou prêts entre deux rubriques.

| Champ | Type | Description |
|---|---|---|
| `id` | UUID/String 36 | Identifiant unique |
| `source_rubric_id` | Foreign Key | Rubrique source |
| `destination_rubric_id` | Foreign Key | Rubrique bénéficiaire |
| `amount` | Numeric(15,2) | Montant transféré |
| `reason` | Text | Motif du transfert |
| `is_repaid` | Boolean | Indique si le transfert a été remboursé |
| `date` | DateTime | Date du transfert |
| `created_at` | DateTime | Date de création |

### Relations principales

```mermaid
erDiagram
    USERS ||--o{ INVESTMENTS : submits
    USERS ||--o{ EXPENSES : records
    RUBRICS ||--o{ INVESTMENTS : receives
    RUBRICS ||--o{ EXPENSES : contains
    RUBRICS ||--o{ TRANSFERS : source
    RUBRICS ||--o{ TRANSFERS : destination

    USERS {
        string id PK
        string name
        enum role
        string access_code
        string password_hash
        datetime created_at
    }

    RUBRICS {
        string id PK
        string name UK
        text description
        decimal initial_balance
        datetime created_at
    }

    INVESTMENTS {
        string id PK
        string investor_id FK
        string rubric_id FK
        decimal amount
        string bank_receipt_code UK
        enum status
        datetime validation_date
        text rejection_reason
        datetime created_at
    }

    EXPENSES {
        string id PK
        string rubric_id FK
        string treasurer_id FK
        text description
        decimal amount
        string receipt_number
        datetime date
        datetime created_at
    }

    TRANSFERS {
        string id PK
        string source_rubric_id FK
        string destination_rubric_id FK
        decimal amount
        text reason
        boolean is_repaid
        datetime date
        datetime created_at
    }
```

## Endpoints de l’API

Les routes sont regroupées par domaine fonctionnel.

| Routeur | Préfixe | Description |
|---|---|---|
| Authentification | `/auth` | Connexion des trésoriers et investisseurs |
| Rubriques | `/rubrics` | Création, consultation, modification et suppression des rubriques |
| Investissements | `/investments` | Soumission, validation, rejet et suivi des investissements |
| Dépenses | `/expenses` | Enregistrement et consultation des dépenses |
| Transferts | `/transfers` | Gestion des transferts entre rubriques |
| Investisseurs | `/investors` | Gestion des profils et des membres |
| Statistiques | `/stats` | Soldes consolidés et indicateurs financiers |

### Authentification

- Les trésoriers se connectent avec leur identifiant et leur mot de passe.
- L’API retourne un jeton JWT après authentification.
- Le jeton doit être transmis dans l’en-tête HTTP :

```http
Authorization: Bearer <token>
```

- Les investisseurs se connectent avec leur code d’accès personnel.
- Les endpoints sensibles vérifient automatiquement le rôle de l’utilisateur.

## Installation

### Prérequis

- Python 3.10 ou supérieur
- PostgreSQL
- Git
- Environnement virtuel Python recommandé

### Cloner le projet

```bash
git clone https://github.com/<organisation>/<projet>.git
cd <projet>
```

### Créer un environnement virtuel

Sous Linux ou macOS :

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Sous Windows :

```bash
python -m venv .venv
.venv\Scripts\activate
```

### Installer les dépendances

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

## Configuration

Créer un fichier `.env` à la racine du projet à partir de `.env.example` :

```bash
cp .env.example .env
```

Exemple de configuration :

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/village_finance

TEST_DATABASE_URL=sqlite+aiosqlite:///./test.db

JWT_SECRET_KEY=change-this-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

La clé `JWT_SECRET_KEY` doit être remplacée par une valeur longue, aléatoire et conservée hors du contrôle de version.

## Base de données et migrations

Créer la base de données PostgreSQL :

```sql
CREATE DATABASE village_finance;
```

Appliquer les migrations :

```bash
alembic upgrade head
```

Créer une nouvelle migration après modification des modèles :

```bash
alembic revision --autogenerate -m "Description de la migration"
```

Revenir à la migration précédente :

```bash
alembic downgrade -1
```

## Démarrer l’application

Lancer le serveur de développement :

```bash
uvicorn app.main:app --reload
```

L’API sera disponible à l’adresse :

```text
http://localhost:8000
```

Documentation interactive :

```text
http://localhost:8000/docs
```

Documentation alternative au format ReDoc :

```text
http://localhost:8000/redoc
```

## Tests

Les tests utilisent `pytest`, `pytest-asyncio` et une base SQLite dédiée afin de ne pas modifier la base PostgreSQL de développement.

Lancer tous les tests :

```bash
pytest
```

Lancer les tests avec un affichage détaillé :

```bash
pytest -v
```

Lancer un fichier de test spécifique :

```bash
pytest tests/test_investments.py -v
```

## Sécurité

Les principales mesures de sécurité sont les suivantes :

- Les mots de passe des trésoriers ne sont jamais stockés en clair.
- Les mots de passe sont hachés avec bcrypt.
- L’authentification des trésoriers repose sur des JWT.
- Les codes d’accès des investisseurs sont uniques.
- Les autorisations sont contrôlées en fonction du rôle.
- Les montants financiers utilisent un type décimal adapté aux valeurs monétaires.
- Les secrets et chaînes de connexion sont fournis via des variables d’environnement.
- Les opérations sensibles sont associées à l’utilisateur qui les a effectuées.

## Règles métier principales

- Un investissement est initialement créé avec le statut `PENDING`.
- Seul un trésorier peut valider ou rejeter un investissement.
- Un investissement rejeté peut contenir un motif de rejet.
- Une dépense doit être associée à une rubrique et à un trésorier.
- Un transfert doit identifier une rubrique source et une rubrique destination.
- Le champ `is_repaid` permet de suivre le remboursement d’un transfert.
- Le code de reçu bancaire doit être unique.
- Le nom d’une rubrique doit être unique.
- Les investisseurs ne peuvent accéder qu’aux opérations autorisées par leur rôle.

## Exemple de calcul du solde d’une rubrique

Le solde consolidé d’une rubrique peut être calculé à partir de :

```text
Solde final =
    Solde initial
  + Investissements validés reçus
  + Transferts entrants
  - Dépenses effectuées
  - Transferts sortants
```

Les investissements en attente ou rejetés ne doivent pas être inclus dans le solde disponible.

## Développement

Avant de soumettre une modification :

1. Créer une branche dédiée.
2. Ajouter ou mettre à jour les tests concernés.
3. Vérifier le format et la qualité du code.
4. Générer une migration si le schéma évolue.
5. Exécuter l’ensemble de la suite de tests.
6. Mettre à jour la documentation si nécessaire.

Exemple :

```bash
git checkout -b feature/gestion-transferts
pytest
git add .
git commit -m "feat: ajouter la gestion des transferts"
git push origin feature/gestion-transferts
```

## Licence

La licence du projet doit être précisée ici, par exemple :

```text
Ce projet est distribué sous licence MIT.
```

Remplacez cette section par la licence réellement utilisée par le projet.
