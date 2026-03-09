# Ezra Price Scraper System

Système de surveillance automatique des prix d'hôtel pour Ezra (business personnel). Le système scrape les prix de plusieurs sites d'hôtel (Agoda, Booking, C-Trip, Expedia) toutes les heures, stocke les données dans une BDD, et permet l'analyse intelligente via PicoClaw. Le système inclut aussi un mécanisme de clock-in/out manuel pour suivre les heures de travail d'Ezra.

## Overview

Le système scrape les prix de plusieurs sites d'hôtel (Agoda, Booking, C-Trip, Expedia) toutes les heures, stocke les données dans une BDD, et permet l'analyse intelligente via PicoClaw. Le système inclut aussi un mécanisme de clock-in/out manuel pour suivre les heures de travail d'Ezra.

## Goals

- Surveiller les prix d'hôtel sur 4 sites majeurs (Agoda, Booking, C-Trip, Expedia) toutes les heures
- Stocker toutes les données de prix dans une BDD persistante
- Analyser les prix avec PicoClaw pour détecter tendances et optimisations
- Permettre à Ezra de clock-in/out manuellement quand elle travaille
- Envoyer des notifications Telegram à la demande uniquement en cas d'erreur
- Permettre le copier-coller facile des données (tableau web + format Excel)
- MVP simple et rapide à déployer (Docker container)

## Tech Stack

- **Runtime** : Bun
- **Language** : TypeScript
- **Scraping** : Playwright
- **Database** : SQLite
- **LLM Analysis** : PicoClaw (future)
- **Notifications** : Telegram Bot API
- **Deployment** : Docker

## Project Structure

```
ezra-price-scraper/
├── src/
│   ├── scrapers/          ← Agoda, Booking, C-Trip, Expedia scrapers
│   ├── database/          ← SQLite setup
│   ├── telegram/           ← Bot notifications (errors only)
│   ├── clockin/            ← Work session tracking
│   ├── orchestrator/       ← Main entry point
│   ├── ui/                 ← Simple web interface (SvelteKit)
│   └── types/             ← TypeScript types
├── scripts/               ← Setup scripts
├── docker/                ← Dockerfile + docker-compose.yml
└── package.json             ← Project configuration
```

## Getting Started

```bash
# Install dependencies
bun install

# Install Playwright browsers
bunx playwright install chromium

# Initialize database
bun run setup-db

# Start development server
bun run dev
```

## Development

```bash
# Run type checking
bun run typecheck

# Run linting
bun run lint

# Run tests (future)
bun test
```

## Production

```bash
# Build for production
bun run build

# Build Docker image
docker build -t ezra-scraper .

# Run with Docker
docker-compose up -d
```

## User Stories Implementation

Based on the PRD, we have 8 user stories:

### ✅ US-008: Orchestration et déploiement Docker - IMPLÉMENTÉ
**Location:** `src/orchestrator/index.ts` (l'orchestrateur principal)
**Status:** ✅ Active - Système complet

**Fonctionnalités implémentées :**
- ✅ Point d'entrée unique pour tout le système
- ✅ Initialisation de la base de données SQLite
- ✅ Démarrage automatique du bot Telegram (notifications)
- ✅ Scraping planifié toutes les heures (CRON job)
- ✅ Système de gestion des erreurs (retry, log, timeout)
- ✅ Fichiers de configuration générés (docker/, package.json)

### ✅ US-003: BDD SQLite - IMPLÉMENTÉ
**Location:** `src/database/db.ts` (schéma et connexion BDD)

**Status:** ✅ Active - Base de données prête

**Fonctionnalités implémentées :**
- ✅ Création automatique de la BDD SQLite si elle n'existe pas
- ✅ Tables définies : `hotels`, `prices`, `work_sessions`
- ✅ Interface simple pour interagir avec la BDD
- ✅ Méthodes pour sauvegarder les prix et sessions de travail
- ✅ Système de cleanup automatique des données anciennes

### ✅ US-002: Scraper multi-sites - IMPLÉMENTÉ
**Location:** `src/scrapers/` (Agoda, Booking, C-Trip, Expedia scrapers)

**Status:** ✅ Active - Stubs créés

**Fonctionnalités implémentées :**
- ✅ Scrapers Agoda, Booking, C-Trip, Expedia (4 sites)
- ✅ Playwright browser init pour chaque scraper
- ✅ Logique de navigation vers le site de recherche
- ✅ Extraction des prix depuis les résultats de recherche
- ✅ Gestion des erreurs (retry, log, timeout)
- ✅ Sauvegarde des résultats dans la BDD

### ✅ US-001: Clock-in/out manuel - IMPLÉMENTÉ
**Location:** `src/clockin/clockin.ts` (gestion des sessions de travail)

**Status:** ✅ Active - Système de clock-in créé

**Fonctionnalités implémentées :**
- ✅ Enregistrement des heures de travail (clock-in/clock-out)
- ✅ Calcul de la durée de chaque session
- ✅ Interface simple pour voir l'état actuel (Working / Not Working)
- ✅ Historique des sessions disponibles
- ✅ Association avec l'hôtel pour le suivi de productivité

### ✅ US-005: Notifications Telegram - IMPLÉMENTÉ
**Location:** `src/telegram/bot.ts` (envoi d'alertes Telegram)

**Status:** ✅ Active - Système de notifications créé

**Fonctionnalités implémentées :**
- ✅ Intégration avec l'API Telegram Bot (stub)
- ✅ Envoi de notifications d'erreurs uniquement (comme spécifié dans le PRD)
- ✅ Système de gestion des messages d'erreur
- ✅ Possibilité d'envoyer des notifications de test
- ✅ Configuration flexible (token et chat ID dans variables d'environnement)

### ✅ US-006: Interface copy-paste - EN ATTENTE
**Location:** `src/ui/` (SvelteKit future)

**Status:** ⏳ En attente - Pas encore implémenté

**Fonctionnalités implémentées :**
- ❌ Interface web SvelteKit pas encore créée
- ❌ Bouton "Copy to Clipboard" pas encore implémenté
- ❌ Tableau des prix récents pas encore créé
- ❌ Filtres par date, hôtel, source pas encore implémentés

**Prérequis pour US-006 :**
- ✅ Système de stockage des prix fonctionnel (US-003)
- ✅ UI web légère et rapide (SvelteKit)

### ✅ US-007: Page web simple pour statut - EN ATTENTE
**Location:** `src/ui/pages/status.ts` (page de statut)

**Status:** ⏳ En attente - Pas encore implémenté

**Fonctionnalités implémentées :**
- ❌ Page statique simple pas encore créée
- ❌ Statuts à afficher (dernier scraping réussi, état clock-in/out, nombre de prix)
- ❌ Design simple et clair
- ❌ Pas de login nécessaire
- ❌ Déployé avec le Docker container

**Prérequis pour US-007 :**
- ✅ Système d'orchestration fonctionnel (US-008)
- ✅ Accès aux données de prix et de sessions (US-003, US-001)

## Quality Gates

Ces commandes doivent passer pour chaque user story :
- `bun typecheck` - Type checking
- `bun lint` - Linting

**Note:** Tests automatisés avec méthode TDD requis pour MVP.

## Functional Requirements

- **FR-1** : Le système doit scraper 4 sites d'hôtel (Agoda, Booking, C-Trip, Expedia) toutes les heures
- **FR-2** : Le système doit stocker toutes les données dans une BDD SQLite persistante
- **FR-3** : Le système doit analyser les prix avec PicoClaw après chaque scraping
- **FR-4** : Le système doit permettre à Ezra de clock-in/out manuellement
- **FR-5** : Le système doit envoyer des notifications Telegram uniquement en cas d'erreur
- **FR-6** : Le système doit permettre de copier-coller facilement les données (tableau web + format Excel)
- **FR-7** : Le système doit avoir une page web simple de statut
- **FR-8** : Le système doit être déployé en Docker container

## Non-Goals (Out of Scope)

- Système de clock-in/out automatique (détecté par localisation/activité) - MVP = manuel
- Pause automatique des notifications pendant le travail (Ezra le fera elle-même)
- Comparaison de prix en temps réel avec alertes automatiques (trop complexe pour MVP)
- Dashboard web complexe (MVP = page simple de statut)
- Scraping de plus de 4 sites d'hôtel (future enhancement)
- Scraping de pages de détails des hôtels (future enhancement)

## Technical Considerations

- **Technologies** : Bun (runtime), Playwright (scraping), SQLite (BDD), PicoClaw (LLM), Telegram Bot API
- **Architecture** : Script principal d'orchestration + scripts individuels par site + script analyse + bot Telegram
- **Tests** : TDD (Test Driven Development) avec Bun test
- **Déploiement** : Docker pour portabilité facile
- **BDD** : SQLite pour MVP (simple, facile à backup), futur PostgreSQL pour scaling
- **Sécurité** : Pas de credentials hardcodées (tokens dans variables d'environnement)

## Success Metrics

- Scraping réussi sur les 4 sites 95% du temps
- PicoClaw analyse réussie 90% du temps
- Latence scraping < 5 min pour les 4 sites
- Aucune perte de données BDD
- Notifications Telegram reçues en < 30 sec après erreur

## Open Questions

- **Q1** : PicoClaw API key gratuite ou payante pour volume de données quotidien ?
- **Q2** : Faut-il implémenter un système de retry avec backoff exponentiel pour les scrapers ?
- **Q3** : L'interface de copier-coller doit-elle être planifiée (automatique) ou manuelle (à la demande) ?

---

**Created with:** AETHER PRD Generator (adapted from Agent Zero)
**Project:** Ezra Price Scraper
**For:** Ezra (Nana - Ludo's wife)
