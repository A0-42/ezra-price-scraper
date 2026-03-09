# PRD: Ezra Price Scraper System

**Date:** 2026-03-09
**Status:** Draft
**Project:** Ezra Price Scraper

---

## Overview

Système de surveillance automatique des prix d'hôtel pour Ezra (business personnel). Le système scrape les prix de plusieurs sites d'hôtel (Agoda, Booking, C-Trip, Expedia) toutes les heures, stocke les données dans une BDD, et permet l'analyse intelligente via PicoClaw. Le système inclut aussi un mécanisme de clock-in/out manuel pour suivre les heures de travail d'Ezra.

## Goals

- Surveiller les prix d'hôtel sur 4 sites majeurs (Agoda, Booking, C-Trip, Expedia) toutes les heures
- Stocker toutes les données de prix dans une BDD persistante
- Analyser les prix avec PicoClaw pour détecter tendances et optimisations
- Permettre à Ezra de clock-in/out manuellement quand elle travaille
- Envoyer des notifications Telegram à la demande uniquement en cas d'erreur
- Permettre le copier-coller facile des données (tableau web + format Excel)
- MVP simple et rapide à déployer (Docker container)

## Quality Gates

Ces commandes doivent passer pour chaque user story :
- `bun typecheck` - Type checking
- `bun lint` - Linting

**Note:** Tests automatisés avec méthode TDD requis pour MVP.

## User Stories

### US-001: Clock-in/out manuel pour Ezra
**Description:** As Ezra, I want to clock-in and clock-out when I start/finish working so that system knows when I'm at work.

**Acceptance Criteria:**
- [ ] Interface simple avec boutons "Clock In" et "Clock Out"
- [ ] Heure de clock-in/out stockée dans la BDD
- [ ] État actuel affiché (Working / Not Working)
- [ ] Empêche double clock-in ou clock-out sans clock-in préalable
- [ ] Historique des sessions de travail disponible

### US-002: Scraper multi-sites (Agoda, Booking, C-Trip, Expedia)
**Description:** As a system, I need to scrape prices from 4 hotel booking sites (Agoda, Booking, C-Trip, Expedia) every hour so that price data is always up-to-date.

**Acceptance Criteria:**
- [ ] Playwright script pour chaque site (4 scrapers)
- [ ] Anti-bot protection minimal pour éviter les blocages
- [ ] Scraping exécuté toutes les heures (cron job)
- [ ] Données scrapées : hôtel, date, prix, source
- [ ] Gestion des erreurs de scraping (retry, log)
- [ ] Timeout configurable pour éviter les blocages

### US-003: BDD SQLite pour stockage des prix
**Description:** As a system, I need a SQLite database to store all price data so that data persists across restarts and can be queried.

**Acceptance Criteria:**
- [ ] BDD SQLite créée automatiquement si elle n'existe pas
- [ ] Tables : hotels, prices, sessions_work, logs
- [ ] Index sur (hotel_id, date, source) pour performances
- [ ] Backup automatique de la BDD quotidien
- [ ] Mécanisme de cleanup des données anciennes (optionnel)

### US-004: Analyse LLM avec PicoClaw
**Description:** As a system, I want to use PicoClaw to analyze price data so that Ezra gets intelligent insights and trends.

**Acceptance Criteria:**
- [ ] Script qui lit les données de la BDD
- [ ] Appel à PicoClaw avec prompt d'analyse
- [ ] Résultats d'analyse stockés dans BDD (table analyses)
- [ ] Analyses : tendances de prix, meilleures offres, anomalies
- [ ] Déclenchement automatique après chaque scraping toutes les heures

### US-005: Notifications Telegram (erreurs uniquement, à la demande)
**Description:** As Ezra, I want to receive Telegram notifications only when errors occur or on demand so that I'm not overwhelmed with messages.

**Acceptance Criteria:**
- [ ] Configuration Telegram (bot token, chat ID) dans fichier config
- [ ] Notification envoyée quand scraper échoue (retry failed)
- [ ] Notification envoyée quand analyse PicoClaw échoue
- [ ] Notification envoyée quand clock-in/out échoue
- [ ] Pas de notifications normales (prix, scraping success)
- [ ] Commande de test pour vérifier la connexion Telegram

### US-006: Interface simple pour copier-coller les données
**Description:** As Ezra, I want to see and copy-paste price data easily so that I can use it in Excel/Google Sheets manually.

**Acceptance Criteria:**
- [ ] Page web avec tableau des prix récents
- [ ] Filtres simples : date range, hôtel, source
- [ ] Bouton "Copy to Clipboard" ou sélection facile
- [ ] Données formatées en tableau (colonnes : date, hôtel, prix, source)
- [ ] Sessions de travail affichées (clock-in/out)
- [ ] Pas de login nécessaire ou mot de passe simple
- [ ] Données copiables en un clic (format compatible Excel)

### US-007: Page web simple pour statut
**Description:** As Ezra, I want a simple web page to check system status so that I can see if everything is working without looking at logs.

**Acceptance Criteria:**
- [ ] Page statique simple (SvelteKit ou HTML)
- [ ] Statuts affichés : Dernier scraping réussi, État clock-in/out, Nombre de prix stockés
- [ ] Heure de dernière activité
- [ ] Pas de login nécessaire (page publique ou mot de passe simple)
- [ ] Déployé avec le Docker container

### US-008: Orchestration et déploiement Docker
**Description:** As a developer (Ludo), I want to deploy entire system as a Docker container so that it can run anywhere easily.

**Acceptance Criteria:**
- [ ] Dockerfile avec Bun runtime
- [ ] docker-compose.yml pour orchestration facile
- [ ] Variables d'environnement : DB_PATH, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, PICOCLAW_API_KEY
- [ ] Volume pour persistance BDD
- [ ] Documentation déploiement (README.md)
- [ ] Healthcheck endpoint pour vérifier que le container tourne

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
