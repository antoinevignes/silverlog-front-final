# Silverlog - Frontend

Application frontend de Silverlog, un réseau social dédié au cinéma permettant aux utilisateurs de découvrir, noter et partager leurs films préférés.

## Prérequis

- Node.js 22.x
- npm

## Installation

```bash
# Cloner le repository (si ce n'est pas déjà fait)
git clone <repo-url>

# Se déplacer dans le dossier frontend
cd silverlog-front-final

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer le fichier .env avec vos configurations
```

## Scripts Disponibles

```bash
# Démarrer le serveur de développement (port 3000)
npm run dev

# Build de production
npm run build

# Prévisualiser le build de production
npm run preview

# Lancer les tests
npm test

# Linter
npm run lint

# Formater le code
npm run format

# Formater + corriger le linting
npm run check
```

## Architecture du Projet

```
src/
├── components/
│   ├── ui/              # Composants UI réutilisables (Button, Card, Input, etc.)
│   ├── layout/          # Composants de layout (Header, Footer, Nav)
│   ├── seo/             # Composants SEO
│   └── error-boundary/  # Gestion des erreurs
├── features/            # Organisation par fonctionnalité
│   ├── admin/           # Interface d'administration
│   ├── list/            # Gestion des listes de films
│   ├── movie/           # Pages et composants films
│   ├── notification/    # Système de notifications
│   ├── review/          # Critiques de films
│   └── user/            # Profils utilisateurs, activité, watchlist
├── routes/              # Routes TanStack Router (file-based)
│   ├── _authenticated/  # Routes protégées (nécessitent authentification)
│   ├── auth/            # Routes d'authentification
│   └── __root.tsx       # Layout racine
├── queries/             # Hooks et configurations TanStack Query
├── styles/              # Fichiers SCSS globaux
├── utils/               # Utilitaires (API client, query keys, helpers)
├── auth.tsx             # Contexte d'authentification
└── main.tsx             # Point d'entrée de l'application
```

## Fonctionnalités Principales

- **Authentification** : Inscription, connexion, gestion de session JWT
- **Films** : Recherche, détails, notation, watchlist
- **Réseau Social** : Profils, follow/unfollow, feed d'activité, notifications temps réel
- **Listes** : Création, partage, découverte de listes personnalisées
- **Diary** : Journal de visionnage avec dates et statistiques
- **Admin** : Modération, gestion des utilisateurs, crew picks

## Conventions de Code

- **TypeScript** : Mode strict activé
- **Naming** :
  - Fichiers : kebab-case.ts
  - Composants : PascalCase.tsx
  - Fonctions : camelCase
- **Imports** : Ordre strict (React → Libs → @/* → Relatifs)
- **Styles** : SCSS pour les styles globaux, classes utilitaires pour les composants

## Ressources

- [Documentation TanStack Router](https://tanstack.com/router)
- [Documentation TanStack Query](https://tanstack.com/query)
- [Documentation Vite](https://vitejs.dev/)
- [Documentation React](https://react.dev/)
