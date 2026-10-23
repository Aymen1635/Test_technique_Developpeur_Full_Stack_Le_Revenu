# Test Technique Full Stack — Communauté Le Revenu

Ce dépôt contient la solution complète au test technique de développeur Full Stack pour **Le Revenu**.  
Il implémente une plateforme communautaire d'entraide et d'échange financier, articulée autour d'un frontend moderne sous **Next.js 15** et d'un backend headless sous **Strapi v5**.

---

## 1. Prérequis

- **Node.js** : version 18, 20 ou 22
- **npm** : version >= 9
- *(Optionnel)* **Docker & Docker Compose** si vous souhaitez exécuter le projet avec PostgreSQL 16 conteneurisé.

---

## 2. Configuration des Variables d'Environnement

Le projet utilise des fichiers `.env` distincts pour séparer la configuration du backend (Strapi) et du frontend (Next.js). Des modèles sans secrets (`.env.example`) sont fournis.

### Étape 1 : Créer les fichiers d'environnement

À la racine du projet, exécutez les commandes suivantes :

**Sur Linux / macOS / Git Bash :**
```bash
# Configuration du backend Strapi
cp apps/api/.env.example apps/api/.env

# Configuration du frontend Next.js
cp apps/web/.env.example apps/web/.env.local
```

**Sur Windows (PowerShell) :**
```powershell
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env.local
```


## 3. Installation et Démarrage

### Option A : Lancement local direct (Recommandé pour la revue)

1. **Installer les dépendances du monorepo** :
   ```bash
   npm install
   ```

2. **Démarrer le backend Strapi v5** (dans un premier terminal) :
   ```bash
   npm run dev:api
   ```
   > Strapi démarre sur **http://localhost:1337**.  
   > Au premier démarrage, les schémas JSON et les autorisations d'accès aux API publiques et authentifiées sont configurés automatiquement.

  **En cas d'erreur de connexion à la base de données** (par exemple `password authentication failed for user "postgres"`), vérifiez les variables `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME` et `DATABASE_PASSWORD` dans `apps/api/.env`. Elles doivent correspondre à votre serveur PostgreSQL local. Les valeurs par défaut de `apps/api/.env.example` utilisent le mot de passe `postgres`, tandis que le PostgreSQL lancé par Docker Compose utilise `postgrespassword`. Si vous utilisez ce dernier avec un backend démarré localement, mettez `DATABASE_PASSWORD=postgrespassword` dans `apps/api/.env`. Vous pouvez aussi définir `DATABASE_CLIENT=sqlite` pour démarrer avec SQLite sans PostgreSQL.

3. **Démarrer le frontend Next.js 15** (dans un second terminal) :
   ```bash
   npm run dev:web
   ```
   > L'application Web est accessible sur **http://localhost:3000**.

---

### Option B : Lancement conteneurisé avec Docker (PostgreSQL 16)

Si vous préférez exécuter la stack complète avec PostgreSQL 16 dans Docker comme mentionné dans le sujet :

1. Copiez le fichier `.env` racine :
   ```bash
   cp .env.example .env
   ```
2. Démarrez les conteneurs :
   ```bash
   docker-compose up --build
   ```

- Frontend Next.js : `http://localhost:3000`
- API Strapi v5 : `http://localhost:1337`
- PostgreSQL 16 : `localhost:5432`

> **Auto-Seed automatique** : Dès le premier démarrage, Strapi détecte que la base PostgreSQL est vierge et injecte automatiquement l'ensemble des 11 catégories, 20 utilisateurs et 25 discussions de démonstration.  
> Si vous souhaitez réinitialiser les données au sein de Docker :
> ```bash
> docker compose exec api npm run seed
> ```

---

## 4. Données de Démonstration (Seed)

La base contient déjà des données. Si vous souhaitez réinitialiser ou recharger un jeu de données complet et cohérent avec l'univers du *Revenu* :

```bash
npm run seed
```

Le script de seed est **idempotent** (aucun doublon en cas de ré-exécution) et initialise :
- **11 rubriques financières** conformes au magazine (Bourse & actions, Assurance-vie, Immobilier & SCPI, Fiscalité, Retraite, etc.).
- **20 comptes utilisateurs** aux profils réalistes (journalistes de la rédaction, conseillers en gestion de patrimoine, abonnés actifs, retraités).
- **25 discussions réalistes** avec questions résolues, réponses certifiées de la rédaction, sondages interactifs et votes utiles.

---

## 5. Comptes de Test & Sélecteur Démo

Pour simplifier l'évaluation sans forcer le relecteur à se déconnecter et se reconnecter manuellement, une **barre de démo** est ancrée en haut de chaque page de l'application :

- **Bascule Visiteur / Membre** : Permet de tester les restrictions en lecture seule et les incitations à la connexion.
- **Sélecteur de Persona** : Liste déroulante alimentée dynamiquement par tous les utilisateurs de la base Strapi. Changer d'utilisateur connecte immédiatement ce profil via son jeton JWT.
- **Mot de passe universel** : Tous les comptes créés partagent le mot de passe `Password123!`.

Comptes types :
- `Camille_B` : Membre abonné actif (pose des questions, vote)
- `Vincent_ETF` : Contributeur expérimenté (réponses, vote aux sondages)
- `LaRedaction` : Compte officiel de la rédaction Le Revenu (modération, réponses certifiées)
- `PapyBoursier` : Vétéran de la communauté avec un total élevé de points

---

## 6. Choix d'Architecture & Démarche Technique

Conformément aux attentes du test technique, l'architecture a été conçue pour allier performance, respect de la charte graphique et sécurité des échanges :

### A. Frontend Next.js 15 (App Router)
- **Modèle de rendu hybride** :
  - **Server Components (RSC)** pour les pages de consultation (`app/page.tsx`, `app/spaces/[slug]/page.tsx`, `app/discussions/[slug]/page.tsx`). Cela garantit un rendu HTML côté serveur ultra-rapide, un référencement naturel (SEO) optimal et évite d'alourdir le bundle JavaScript client.
  - **Client Components (`'use client'`)** réservés aux zones nécessitant une interaction réactive : modal de création de discussion (`CreateDiscussionModal`), vote « Utile », participation aux sondages et sélecteur de persona.
- **Design System & Fidélité à la maquette** :
  - Respect strict des codes graphiques du *Revenu* : rouge `#EB0F0F`, bandeau supérieur noir `#1C1C1E`, fond `#F5F5F7`.
  - Typographies institutionnelles : **Playfair Display** pour les titres éditoriaux et **Inter** pour le corps de texte.
  - Bascule de densité d'affichage (vue détaillée en cartes vs vue compacte en liste).
  - Pagination côté serveur sur le flux d'accueil et les profils utilisateurs.

### B. Backend Strapi v5 & Règles Métier
- **Content Types structurés** :
  - `Category` : Espaces thématiques avec slug, couleur et icône.
  - `Discussion` : Sujets de discussion typés (`question`, `discussion`, `poll`), avec compteurs de vues, likes, statut résolu et options de sondage JSON.
  - `Reply` : Réponses rattachées aux discussions et aux auteurs.
  - Extension `User` : Enrichissement du modèle utilisateur (`points`, `role_title`, `bio`, `is_subscriber`, `avatar_color`).
- **Contrôleurs personnalisés et sécurité (Zero-Trust)** :
  - **Anti-usurpation d'auteur** : Dans les contrôleurs custom de publication (`discussion.create` et `reply.create`), l'auteur est **systématiquement extrait du token JWT vérifié** (`ctx.state.user.id`). Toute valeur transmise dans le corps de la requête est ignorée pour empêcher un utilisateur de publier au nom d'un autre.
  - **Validation serveur stricte** : Rejet des titres de moins de 10 caractères (`400 Bad Request`), vérification de l'existence de la catégorie et interdiction de publier sans authentification (`401 Unauthorized`).
  - **Sécurisation de la meilleure réponse** : Seul l'auteur de la question ou la rédaction peut désigner une réponse comme solution via `PUT /api/discussions/:id/solution`.
- **Gamification & Points de réputation** :
  - Attribués directement côté serveur lors des actions : +5 points pour la création d'un sujet, +3 points pour une réponse, +1 point de participation pour un vote « Utile » ou un vote à un sondage, et +20 points pour la meilleure réponse.
- **Gestion des sondages multi-utilisateurs** :
  - Endpoint dédié `POST /api/discussions/:id/poll-vote` qui incrémente les votes côté serveur.
  - Côté client, l'état de vote est scopé par utilisateur (`lr_poll_${username}_${discussionId}`), ce qui permet à différents membres de voter sur un même sondage sans bloquer les autres comptes.

### C. Base de données & Persistance
- **PostgreSQL 16 prioritaire** : Les scripts de démarrage vérifient la connexion à PostgreSQL avant de lancer Strapi.
- **Fallback SQLite automatisé** : Si PostgreSQL est indisponible (par exemple, serveur arrêté ou inaccessible), Strapi démarre avec SQLite. Une erreur d'identifiants ou de configuration PostgreSQL reste explicite et ne déclenche pas de bascule silencieuse.
- **Sélection explicite** : `DATABASE_CLIENT=postgres` privilégie PostgreSQL avec fallback en cas d'indisponibilité ; `DATABASE_CLIENT=sqlite` force SQLite. Les deux bases ont des données distinctes : les données SQLite ne sont pas automatiquement transférées vers PostgreSQL, et inversement.

---

## 7. Tests Automatisés

Le projet intègre deux suites de tests automatisés complémentaires :

### Tests End-to-End avec Playwright
```bash
npm run test:e2e
```
Exécute 7 scénarios réels dans le navigateur :
1. Affichage de la page d'accueil, du flux et de la barre de recherche.
2. Fonctionnement du bouton retour vers l'accueil.
3. Bascule de profil (Visiteur ↔ Membre connecté).
4. Consultation d'une discussion et vote « Utile » (+1 pt votant, +5 pts auteur).
5. Consultation d'un profil utilisateur avec points dynamiques et discussions paginées.
6. Filtrage par catégorie thématique et bascule de vue compacte.
7. **Création d'un sondage et vote multi-utilisateurs** (validation qu'un premier utilisateur puis un second peuvent voter sur le même sondage et que les totaux se synchronisent).

### Tests de Sécurité et Règles Métier avec Vitest
```bash
npm run test
```
Vérifie les règles serveur dans `apps/api/tests/discussion-security.test.ts` :
- Rejet d'une requête sans token (`401 Unauthorized`).
- Validation des contraintes de champs (titre court, catégorie absente).
- **Vérification anti-usurpation d'auteur**.
- Protection de l'attribution de la meilleure réponse contre les tiers non autorisés.
