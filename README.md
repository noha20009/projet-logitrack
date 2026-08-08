# LogiTrack

Application de **gestion logistique** composée d'une API REST sécurisée (Spring Boot + Spring Security + JWT) et d'un frontend moderne (React 19 + Vite). Elle permet de gérer les **clients**, les **produits**, les **commandes** et les **utilisateurs** avec un contrôle d'accès par rôles (`ADMIN`, `MANAGER`, `AGENT`).

## Table des matières
- [Fonctionnalités](#fonctionnalités)
- [Matrice des permissions](#matrice-des-permissions)
- [Technologies](#technologies)
- [Architecture du projet](#architecture-du-projet)
- [Endpoints de l'API](#endpoints-de-lapi)
- [Installation et démarrage](#installation-et-démarrage)
- [Comptes de démonstration](#comptes-de-démonstration)
- [Démarrage avec Docker](#démarrage-avec-docker)

## Fonctionnalités

**Authentification (back + front)**
- Inscription (`POST /api/auth/register`), connexion (`POST /api/auth/login`), déconnexion.
- Après connexion : renvoi du JWT, de l'utilisateur et de son rôle ; session conservée dans le `localStorage`.
- Interceptors Axios : ajout automatique du `Bearer` token, gestion des erreurs `401` (déconnexion + redirection `/login`), `403` (`/access-denied`), `404`, `500`.
- Route Guard (`ProtectedRoute`) et Role Guard (`RoleGuard`).

**Tableau de bord** (adapté au rôle)
- Nombre de clients, produits, commandes, commandes en attente / expédiées / livrées, stock faible, produit le plus commandé, commandes récentes.

**Gestion des clients / produits / commandes**
- Liste paginée et triée, consultation, création, modification, suppression (selon rôle).
- Produits : recherche par catégorie, par prix, stock faible.
- Commandes : création pour un client, ajout de produits, changement de statut, filtres par statut, commandes d'un client.
- Pagination + tri (nom, prix, stock, date, statut) et recherche.
- Tous les formulaires sont validés avec **React Hook Form + Yup**.

## Matrice des permissions

| Action                                                   | ADMIN | MANAGER | AGENT |
|----------------------------------------------------------|---|---|---|
| Gestion des utilisateurs                                 | ✅ | ❌ | ❌ |
| Création / modification clients, produits, commandes     | ✅ | ✅ | ❌ |
| Suppression (clients, produits, commandes, utilisateurs) | ✅ | ❌ | ❌ |
| Consultation clients, produits, commandes                | ✅ | ✅ | ✅ |
| Modification du statut d'une commande                    | ✅ | ✅ | ✅ |
| Statistiques                                             | ✅ | ✅ | ❌ |
| Produits en stock faible                                 | ✅ | ✅ | ❌ |

## Technologies

**Backend** : Java 17, Spring Boot 3.2.1, Spring Security, JWT (jjwt 0.11.5), Spring Data JPA, MapStruct, MySQL, Swagger (springdoc-openapi), Lombok.

**Frontend** : React 19, Vite, React Router DOM, Axios, React Hook Form, Yup, CSS3 (responsive, sans dépendance UI), React Icons, Oxlint.

## Architecture du projet

```
projet-logitrack/
├── src/main/java/org/example/projetlogitrack/
│   ├── controller/    # Auth, Client, Produit, Commande, User, Stats
│   ├── dto/           # DTO request/response
│   ├── exception/     # Gestion globale des erreurs
│   ├── mapper/        # MapStruct (Entité <-> DTO)
│   ├── model/         # User, Client, Produit, Commande, CommandeLigne + enums
│   ├── repository/    # JpaRepository + requêtes dérivées/@Query
│   ├── security/      # SecurityConfig, JwtUtil, JwtAuthFilter, UserDetailsService
│   └── service/       # Logique métier
└── frontend/
    ├── src/
    │   ├── api/       # Axios centralisé + appels API
    │   ├── components/ # Pagination, SearchBar, StatusFilter, ConfirmDialog, Loader...
    │   ├── context/   # AuthContext
    │   ├── guards/    # ProtectedRoute, RoleGuard
    │   ├── layouts/   # MainLayout, Navbar, Sidebar
    │   ├── pages/     # Login, Register, Dashboard, Clients, Products, Orders, Users...
    │   └── utils/     # constantes, schémas de validation Yup, formatage
    └── nginx.conf     # Reverse proxy (frontend → API)
```

## Endpoints de l'API

| Méthode    | Endpoint                                         | Rôles                 | Description |
|------------|--------------------------------------------------|-----------------------|---|
| POST       | `/api/auth/register`                             | Public                | Inscription |
| POST       | `/api/auth/login`                                | Public                | Connexion (JWT) |
| POST       | `/api/auth/logout`                               | Authentifié           | Déconnexion |
| GET        | `/api/clients?page=&size=&sort=`                 | ADMIN, MANAGER, AGENT | Liste paginée |
| GET        | `/api/clients/search?nom=`                       | ADMIN, MANAGER, AGENT | Recherche par nom |
| GET        | `/api/clients/{id}`                              | ADMIN, MANAGER, AGENT | Détail |
| POST/PUT   | `/api/clients` `/api/clients/{id}`               | ADMIN, MANAGER        | Créer / modifier |
| DELETE     | `/api/clients/{id}`                              | ADMIN                 | Supprimer |
| GET        | `/api/products?page=&size=&sort=`                | ADMIN, MANAGER, AGENT | Liste paginée |
| GET        | `/api/products/category/{cat}`                   | ADMIN, MANAGER, AGENT | Par catégorie |
| GET        | `/api/products/price/{price}`                    | ADMIN, MANAGER, AGENT | Prix ≤ valeur |
| GET        | `/api/products/low-stock`                        | ADMIN, MANAGER        | Stock faible (< 5) |
| POST/PUT   | `/api/products` `/api/products/{id}`             | ADMIN, MANAGER        | Créer / modifier |
| DELETE     | `/api/products/{id}`                             | ADMIN                 | Supprimer |
| GET        | `/api/orders?statut=&page=&size=&sort=`          | ADMIN, MANAGER, AGENT | Liste paginée + filtre |
| GET        | `/api/orders/client/{clientId}`                  | ADMIN, MANAGER, AGENT | Commandes d'un client |
| GET        | `/api/orders/{id}`                               | ADMIN, MANAGER, AGENT | Détail |
| POST       | `/api/orders?clientId=`                          | ADMIN, MANAGER        | Créer une commande |
| POST       | `/api/orders/{id}/products?produitId=&quantite=` | ADMIN, MANAGER        | Ajouter un produit |
| PUT        | `/api/orders/{id}/status?status=`                | ADMIN, MANAGER, AGENT | Changer le statut |
| DELETE     | `/api/orders/{id}`                               | ADMIN                 | Supprimer |
| GET        | `/api/users` et `/api/users/{id}`                | ADMIN                 | Liste / détail utilisateurs |
| POST       | `/api/users`                                     | ADMIN                 | Créer un utilisateur |
| PUT        | `/api/users/{id}/role?role=`                     | ADMIN                 | Changer le rôle |
| DELETE     | `/api/users/{id}`                                | ADMIN                 | Supprimer un utilisateur |
| GET        | `/api/stats`                                     | ADMIN, MANAGER        | Statistiques du tableau de bord |

Docs Swagger : `http://localhost:8080/swagger-ui.html` (bouton **Authorize** avec `Bearer <token>`).

## Installation et démarrage

Prérequis : **Java 17**, **Maven**, **Node.js ≥ 18**, **MySQL**.

### 1. Base de données
```sql
CREATE DATABASE projetlogitrack;
```

### 2. Backend
```bash
# Adapter les identifiants dans src/main/resources/application.properties
mvn spring-boot:run
```
L'API démarre sur `http://localhost:8080`.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
L'application est disponible sur `http://localhost:5173` (proxy `/api` vers le backend). Pour une API distante, modifier `VITE_API_URL` dans `frontend/.env`.

## Comptes de démonstration

| Rôle    | Comment le créer |
|---------|---|
| ADMIN   | via `/api/users` (ou en base) |
| MANAGER | via `/api/users` (créé par un ADMIN) |
| AGENT   | via la page Inscription |

> ⚠️ Aucun mot de passe n'est fourni : les comptes sont créés via la page **Inscription** ou la gestion des utilisateurs (ADMIN).

## Démarrage avec Docker

```bash
docker compose up --build
```
- Frontend : `http://localhost:5173`
- API : `http://localhost:8080`
- MySQL : port `3306`
