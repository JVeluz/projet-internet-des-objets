# 📡 Projet IoT : Système de Monitoring [Nom de votre projet]

**Auteur(s) :** [Vos Noms]
**Date :** Janvier 2025
**Cours :** Internet des Objets

---

## 📝 Description du projet

Ce projet simule une architecture IoT complète sans matériel physique.
Il met en œuvre un **[Décrire le scénario, ex: Casque de sécurité connecté pour ouvriers]** qui remonte des données de santé et d'environnement en temps réel.

### Architecture technique
Le projet est structuré en **Monorepo** (un seul dossier regroupant tous les composants) :

1.  **Simulateur (`/object`)** : Script **Node.js/TypeScript** simulant les capteurs (MQTT). Génère des données réalistes (courbes sinusoïdales, pics d'alerte).
2.  **Logique (`/node_red`)** : Serveur **Node-RED** embarqué. Traite les données, gère les règles métier et les alertes.
3.  **Interface (`/dashboard`)** : Application Web (**Vite/Vue/React**) affichant les données en temps réel pour l'opérateur.

---

## 🚀 Installation et Lancement

Le projet a été conçu pour être **"clé en main"**. Il installe automatiquement toutes ses dépendances (Node-RED inclus) au premier lancement.

### Prérequis
* **Node.js** (v16 ou supérieur) installé sur la machine.
* C'est tout !

### 1. Démarrage (Recommandé)

Lancez simplement le script correspondant à votre système d'exploitation à la racine du dossier :

* **Windows** : Double-cliquez sur `start_windows.bat`
* **Mac / Linux** : Exécutez `./start_unix.sh` dans un terminal.

> **Note :** Le premier lancement peut prendre 1 à 2 minutes pour l'installation des modules (`node_modules`).

### 2. Accès aux interfaces

Une fois le script lancé, une console unifiée s'ouvre. Après quelques secondes, votre navigateur devrait s'ouvrir automatiquement. Sinon, voici les liens :

* 📊 **Dashboard de supervision :** [http://localhost:5173](http://localhost:5173)
* ⚙️ **Node-RED (Flux & Backend) :** [http://localhost:1880](http://localhost:1880)
